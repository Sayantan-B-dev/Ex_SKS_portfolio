import { uploadImageAction } from "@/app/blog/actions";
import { imageUploadProblem, MAX_IMAGE_LABEL } from "@/lib/image-limits";

export type UploadedImage = { url: string; fileId: string; filePath: string };

/**
 * Validates one file, uploads it to ImageKit, and always resolves to something
 * renderable : the size/type check runs before the request so an oversized image
 * never reaches the server, where the body limit would answer with a bare 500.
 *
 * Shared by the story image fields and the gallery panel. Uploads are create-only.
 */
export async function uploadImageFile(
  file: File
): Promise<{ ok: true; image: UploadedImage } | { ok: false; error: string }> {
  const problem = imageUploadProblem(file);
  if (problem) return { ok: false, error: problem };

  const formData = new FormData();
  formData.append("file", file);
  try {
    const result = await uploadImageAction(formData);
    if (!result.ok) return { ok: false, error: result.error };
    return {
      ok: true,
      image: { url: result.url, fileId: result.fileId, filePath: result.filePath },
    };
  } catch {
    return {
      ok: false,
      error: `Upload failed. Try again with a smaller image (under ${MAX_IMAGE_LABEL}).`,
    };
  }
}
