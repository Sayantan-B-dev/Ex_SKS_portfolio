"use client";

import { useRef, useState } from "react";

import SubmitButton from "@/components/SubmitButton";
import { uploadImageFile } from "@/lib/image-upload-client";
import { MAX_IMAGE_LABEL } from "@/lib/image-limits";

const CATEGORIES = ["Concerts", "Crowd", "Portraits", "Awards"];

/**
 * Adds one photo to the gallery page : upload a new file to ImageKit, or paste a
 * link to an existing one. The ImageKit id travels with the form so the photo's
 * file can be removed later without relying on ImageKit's search index.
 */
export default function GalleryAddForm({
  action,
}: {
  action: (formData: FormData) => Promise<void>;
}) {
  const [url, setUrl] = useState("");
  const [fileId, setFileId] = useState("");
  const [filePath, setFilePath] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    // Reset so picking the same file again after an error still fires.
    event.target.value = "";
    if (!file) return;

    setUploading(true);
    setError(null);
    const result = await uploadImageFile(file);
    setUploading(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }
    setUrl(result.image.url);
    setFileId(result.image.fileId);
    setFilePath(result.image.filePath);
  };

  const previewHost = (() => {
    try {
      return new URL(url).host;
    } catch {
      return url;
    }
  })();

  return (
    <form action={action} className="blog-gallery-form">
      <div className="blog-gallery-grid">
        <div className="blog-media-field">
          <label htmlFor="gallery-url">Photo</label>
          <div className="blog-media-row">
            <input
              id="gallery-url"
              name="galleryUrl"
              type="url"
              value={url}
              onChange={(event) => {
                setUrl(event.target.value);
                // A hand-edited link is no longer the file we uploaded.
                setFileId("");
                setFilePath("");
              }}
              placeholder="https://... or upload a file"
            />
            <button
              type="button"
              className="blog-media-upload"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
            >
              {uploading ? "UPLOADING…" : url && fileId ? "REPLACE" : "UPLOAD IMAGE"}
            </button>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
            hidden
            onChange={handleFileChange}
          />
          <input type="hidden" name="galleryFileId" value={fileId} />
          <input type="hidden" name="galleryFilePath" value={filePath} />
          <p className="blog-media-hint">
            Paste a link or upload a file : {MAX_IMAGE_LABEL} max, JPG, PNG, WebP, GIF or
            AVIF.
          </p>
        </div>

        <div className="blog-gallery-split">
          <label>
            Caption
            <input
              name="galleryTitle"
              required
              placeholder="Live Stage Command in Yellow Jacket"
            />
          </label>

          <label>
            Category
            <select name="galleryCategory" defaultValue="Concerts">
              {CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
        </div>
      </div>

      {error && <p className="admin-message admin-error">{error}</p>}

      {url && (
        <figure className="blog-gallery-preview" aria-live="polite">
          {/* eslint-disable-next-line @next/next/no-img-element -- the preview can point at any host the author pastes */}
          <img src={url} alt="Gallery preview" loading="lazy" />
          <figcaption>
            <span className="blog-gallery-preview-label">Ready to add</span>
            <span className="blog-gallery-preview-host">{previewHost}</span>
          </figcaption>
        </figure>
      )}

      <div className="blog-gallery-actions">
        <p className="blog-gallery-actions-note">
          New photos show on the gallery page after the built-in shots.
        </p>
        <SubmitButton className="blog-submit-button" pendingLabel="ADDING…">
          ADD TO GALLERY
        </SubmitButton>
      </div>
    </form>
  );
}
