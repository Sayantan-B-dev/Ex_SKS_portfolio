"use client";

import { useRef, useState } from "react";

import { uploadImageFile } from "@/lib/image-upload-client";
import { MAX_IMAGE_LABEL } from "@/lib/image-limits";

/** Mirrors MAX_POST_IMAGES in lib/blog.ts. */
const MAX_IMAGES = 12;

/** Which field an upload started from. */
type UploadTarget = "cover" | number;

function isLink(value: string) {
  return /^https?:\/\//i.test(value.trim());
}

/**
 * Cover image plus extra shots. Both a pasted URL and an ImageKit upload are
 * offered, the cover needs one of the two, and every value shows a small
 * preview so the author can see what the story will carry before publishing.
 * Uploads are create-only : nothing in ImageKit is ever replaced or deleted.
 */
export default function BlogMediaFields({
  defaultCover,
  defaultImages,
  defaultImageFiles,
}: {
  defaultCover: string;
  defaultImages: string[];
  defaultImageFiles: { url: string; fileId: string; filePath: string }[];
}) {
  const [cover, setCover] = useState(defaultCover);
  const [images, setImages] = useState<string[]>(
    defaultImages.length > 0 ? defaultImages : [""]
  );
  // ImageKit ids for everything uploaded from this form. Submitted with the
  // story so deleting it can remove its images by id, without relying on
  // ImageKit's search index, which lags right after an upload.
  const [uploads, setUploads] = useState(
    () => new Map(defaultImageFiles.map((file) => [file.url, file]))
  );
  const [busy, setBusy] = useState<UploadTarget | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const targetRef = useRef<UploadTarget>("cover");

  const pickFile = (target: UploadTarget) => {
    targetRef.current = target;
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file again after an error still fires.
    event.target.value = "";
    if (!file) return;

    const target = targetRef.current;
    setBusy(target);
    setError(null);

    const result = await uploadImageFile(file);

    setBusy(null);
    if (!result.ok) {
      setError(result.error);
      return;
    }
    const uploaded = result.image;
    setUploads((current) => new Map(current).set(uploaded.url, uploaded));
    if (target === "cover") {
      setCover(uploaded.url);
      return;
    }
    setImages((current) => {
      const next = [...current];
      next[target] = uploaded.url;
      return next;
    });
  };

  const updateImage = (index: number, value: string) => {
    setImages((current) => current.map((src, i) => (i === index ? value : src)));
  };

  const addImage = () => {
    if (images.length >= MAX_IMAGES) return;
    setImages((current) => [...current, ""]);
  };

  const removeImage = (index: number) => {
    setImages((current) => current.filter((_, i) => i !== index));
  };

  const extraImages = images.map((src) => src.trim()).filter(isLink);
  const atLimit = images.length >= MAX_IMAGES;

  return (
    <>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
        hidden
        onChange={handleFileChange}
      />

      {/* Ids for the files uploaded here : the server keeps only the ones the
          story actually uses, and deletes by id when the story goes. */}
      <input
        type="hidden"
        name="imageFiles"
        value={JSON.stringify([...uploads.values()])}
      />

      <div className="blog-media-field">
        <label htmlFor="blog-cover-image">Cover image</label>
        <div className="blog-media-row">
          <input
            id="blog-cover-image"
            name="coverImage"
            type="url"
            value={cover}
            onChange={(event) => setCover(event.target.value)}
            placeholder="https://... or upload a file"
          />
          <button
            type="button"
            className="blog-media-upload"
            onClick={() => pickFile("cover")}
            disabled={busy !== null}
          >
            {busy === "cover" ? "UPLOADING…" : cover ? "REPLACE" : "UPLOAD IMAGE"}
          </button>
        </div>
        <p className="blog-media-hint">
          Paste a link or upload a file : the cover needs one of the two. JPG, PNG, WebP,
          GIF or AVIF, under {MAX_IMAGE_LABEL}.
        </p>
      </div>

      <div className="blog-media-field">
        <label>
          More images <span className="blog-media-optional">(optional)</span>
        </label>
        {images.map((value, index) => (
          <div className="blog-media-row" key={index}>
            <input
              name="images"
              type="url"
              value={value}
              onChange={(event) => updateImage(index, event.target.value)}
              placeholder="https://..."
              aria-label={`Extra image ${index + 1} URL`}
            />
            <button
              type="button"
              className="blog-media-upload"
              onClick={() => pickFile(index)}
              disabled={busy !== null}
            >
              {busy === index ? "UPLOADING…" : "UPLOAD"}
            </button>
            <button
              type="button"
              className="blog-media-remove"
              onClick={() => removeImage(index)}
              aria-label={`Remove extra image ${index + 1}`}
            >
              REMOVE
            </button>
          </div>
        ))}
        <div className="blog-media-actions">
          <button
            type="button"
            className="blog-media-add"
            onClick={addImage}
            disabled={atLimit}
          >
            ADD MORE IMAGE
          </button>
          <button
            type="button"
            className="blog-media-upload"
            onClick={() => pickFile(images.length)}
            disabled={busy !== null || atLimit}
          >
            {busy === images.length ? "UPLOADING…" : "UPLOAD IMAGE"}
          </button>
          <span className="blog-media-count">
            {extraImages.length}/{MAX_IMAGES} images
          </span>
        </div>
      </div>

      {error && <p className="admin-message admin-error">{error}</p>}

      {(isLink(cover) || extraImages.length > 0) && (
        <div className="blog-media-previews" aria-live="polite">
          {isLink(cover) && (
            <figure className="blog-media-preview">
              {/* eslint-disable-next-line @next/next/no-img-element -- previews can point at any host the author pastes */}
              <img src={cover.trim()} alt="Cover preview" loading="lazy" />
              <figcaption>COVER</figcaption>
            </figure>
          )}
          {extraImages.map((src, index) => (
            <figure className="blog-media-preview" key={`${index}-${src}`}>
              {/* eslint-disable-next-line @next/next/no-img-element -- previews can point at any host the author pastes */}
              <img
                src={src}
                alt={`Extra image ${index + 1} preview`}
                loading="lazy"
              />
              <figcaption>{String(index + 1).padStart(2, "0")}</figcaption>
            </figure>
          ))}
        </div>
      )}
    </>
  );
}
