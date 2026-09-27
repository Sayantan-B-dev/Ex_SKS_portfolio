/**
 * Upload limits shared by the studio UI and the server upload path, so a file
 * that is too big is reported in the form instead of failing as a raw 500 when
 * the request body is rejected.
 *
 * Keep this in step with `experimental.serverActions.bodySizeLimit` in
 * `next.config.ts` (3mb). That cap applies to the whole multipart body, which
 * adds ~10-20KB of framing, so the byte cap below sits just under it.
 *
 * Deliberately free of `server-only` : the client preview needs the same numbers.
 */
export const MAX_IMAGE_BYTES = 2_900_000;
export const MAX_IMAGE_LABEL = "3MB";

export const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "image/avif",
];

/** Returns a human-readable reason the file cannot be uploaded, or null. */
export function imageUploadProblem(file: { size: number; type: string }) {
  if (!file.size) return "That file is empty.";
  if (!ALLOWED_IMAGE_TYPES.includes(file.type.toLowerCase())) {
    return "Use a JPG, PNG, WebP, GIF, or AVIF image.";
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return `That image is too large. Images must be under ${MAX_IMAGE_LABEL}.`;
  }
  return null;
}
