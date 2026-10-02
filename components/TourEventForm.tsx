"use client";

import Link from "next/link";
import { useRef, useState } from "react";

import SubmitButton from "@/components/SubmitButton";
import { uploadImageFile } from "@/lib/image-upload-client";
import { MAX_IMAGE_LABEL } from "@/lib/image-limits";

/** Mirrors MAX_TOUR_CITIES in lib/blog.ts. */
const MAX_CITIES = 16;

/**
 * The values a tour form starts from. Matches `TourEvent` in lib/blog.ts, which
 * is server-only, so the shape is restated here for the client component.
 */
export type TourEventDefaults = {
  id: string;
  kicker: string;
  title: string;
  dateText: string;
  description: string;
  image: string;
  fileId: string;
  filePath: string;
  startingPoint: string;
  cities: string[];
  endingText: string;
  redirectTo: string;
  ctaLabel: string;
  featured: boolean;
};

/**
 * Adds or edits one tour event. The image uses the same upload path as the blog
 * and gallery : paste a link or upload a file, and the ImageKit id travels with
 * the form so the file can be removed later by id when the event is deleted.
 */
export default function TourEventForm({
  action,
  defaults,
}: {
  action: (formData: FormData) => Promise<void>;
  defaults?: TourEventDefaults | null;
}) {
  const editing = Boolean(defaults);
  const [image, setImage] = useState(defaults?.image ?? "");
  const [fileId, setFileId] = useState(defaults?.fileId ?? "");
  const [filePath, setFilePath] = useState(defaults?.filePath ?? "");
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
    setImage(result.image.url);
    setFileId(result.image.fileId);
    setFilePath(result.image.filePath);
  };

  const cityCount = (defaults?.cities ?? []).length;

  return (
    <form action={action} className="blog-gallery-form tour-form">
      {defaults && <input type="hidden" name="id" value={defaults.id} />}

      <div className="tour-field-row">
        <label>
          Kicker <span className="blog-media-optional">(optional)</span>
          <input
            name="tourKicker"
            defaultValue={defaults?.kicker}
            placeholder="BEYOND THE MUSIC"
          />
        </label>
        <label>
          Date / window <span className="blog-media-optional">(optional)</span>
          <input
            name="tourDate"
            defaultValue={defaults?.dateText}
            placeholder="DEC 2026 — MAR 2027"
          />
        </label>
      </div>

      <label>
        Title
        <input
          name="tourTitle"
          required
          defaultValue={defaults?.title}
          placeholder="Beyond the Music"
        />
      </label>

      <label>
        Description
        <textarea
          name="tourDescription"
          required
          rows={3}
          defaultValue={defaults?.description}
          placeholder="A line or two on what this leg of the tour is about."
        />
      </label>

      <div className="blog-media-field">
        <label htmlFor="tour-image">Image</label>
        <div className="blog-media-row">
          <input
            id="tour-image"
            name="tourImage"
            type="url"
            value={image}
            onChange={(event) => {
              setImage(event.target.value);
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
            {uploading ? "UPLOADING…" : image && fileId ? "REPLACE" : "UPLOAD IMAGE"}
          </button>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif,image/avif"
          hidden
          onChange={handleFileChange}
        />
        <input type="hidden" name="tourFileId" value={fileId} />
        <input type="hidden" name="tourFilePath" value={filePath} />
        <p className="blog-media-hint">
          Paste a link or upload a file : {MAX_IMAGE_LABEL} max, JPG, PNG, WebP, GIF or
          AVIF.
        </p>
      </div>

      <label>
        Starting point
        <input
          name="tourStartingPoint"
          required
          defaultValue={defaults?.startingPoint}
          placeholder="Mumbai — ISKCON Juhu"
        />
      </label>

      <label>
        Cities
        <textarea
          name="tourCities"
          rows={Math.min(Math.max(cityCount, 5), MAX_CITIES)}
          defaultValue={(defaults?.cities ?? []).join("\n")}
          placeholder={"Hyderabad\nPune\nIndore\nBhopal"}
        />
        <span className="blog-field-hint">
          One city per line, in the order the journey visits them. Up to {MAX_CITIES}.
        </span>
      </label>

      <div className="tour-field-row">
        <label>
          Ending note <span className="blog-media-optional">(optional)</span>
          <input
            name="tourEndingText"
            defaultValue={defaults?.endingText}
            placeholder="More cities to be announced."
          />
        </label>
        <label>
          Button label <span className="blog-media-optional">(optional)</span>
          <input
            name="tourCtaLabel"
            defaultValue={defaults?.ctaLabel}
            placeholder="EXPLORE THE TOUR"
          />
        </label>
      </div>

      <label>
        Redirect link <span className="blog-media-optional">(optional)</span>
        <input
          name="tourRedirectTo"
          inputMode="url"
          defaultValue={defaults?.redirectTo}
          placeholder="https://... or /shows"
        />
        <span className="blog-field-hint">
          Where the button goes : a full https link or a path on this site. Leave empty
          for no button.
        </span>
      </label>

      <label className="tour-check">
        <input
          type="checkbox"
          name="tourFeatured"
          defaultChecked={defaults?.featured}
        />
        <span>
          Feature this event
          <span className="tour-check-hint">
            Featured events sort first and open the landing page switcher.
          </span>
        </span>
      </label>

      {error && <p className="admin-message admin-error">{error}</p>}

      {image && (
        <figure className="blog-gallery-preview" aria-live="polite">
          {/* eslint-disable-next-line @next/next/no-img-element -- the preview can point at any host the author pastes */}
          <img src={image} alt="Tour image preview" loading="lazy" />
          <figcaption>
            <span className="blog-gallery-preview-label">Tour image</span>
            <span className="blog-gallery-preview-host">
              {fileId ? "Uploaded to ImageKit" : image}
            </span>
          </figcaption>
        </figure>
      )}

      <div className="blog-gallery-actions">
        <p className="blog-gallery-actions-note">
          {editing
            ? "Save to update this event on the landing page."
            : "New events join the landing page switcher."}
        </p>
        <div className="tour-form-actions">
          <SubmitButton className="blog-submit-button" pendingLabel="SAVING…">
            {editing ? "SAVE TOUR EVENT" : "ADD TOUR EVENT"}
          </SubmitButton>
          {editing && (
            <Link href="/dashboard?tab=tour" className="blog-cancel-link">
              CANCEL EDIT
            </Link>
          )}
        </div>
      </div>
    </form>
  );
}
