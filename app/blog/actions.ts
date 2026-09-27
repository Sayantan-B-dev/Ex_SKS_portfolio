"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authenticate, clearSession, isAuthenticated } from "@/lib/blog-auth";
import {
  createBlogPost,
  createGalleryImage,
  deleteBlogPost,
  getReferencedImageUrls,
  parsePublishedDate,
  removeGalleryImage,
  updateBlogPost,
  type BlogImageFile,
} from "@/lib/blog";
import { deleteBlogImages, uploadBlogImage } from "@/lib/imagekit";
import { imageUploadProblem, MAX_IMAGE_LABEL } from "@/lib/image-limits";

export type ImageUploadResult =
  | {
      ok: true;
      url: string;
      fileId: string;
      filePath: string;
      thumbnailUrl: string | null;
    }
  | { ok: false; error: string };

/**
 * Reads the upload bookkeeping the studio submits alongside a story. The client
 * carries the ImageKit ids of the files it uploaded, because a story's images
 * must be deletable by id : a name lookup can miss a file uploaded moments ago.
 */
function readImageFiles(formData: FormData): BlogImageFile[] {
  const raw = String(formData.get("imageFiles") ?? "");
  if (!raw) return [];
  const isText = (value: unknown): value is string => typeof value === "string";
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.flatMap((entry: unknown) => {
      if (typeof entry !== "object" || entry === null) return [];
      const { url, fileId, filePath } = entry as Record<string, unknown>;
      if (!isText(url) || !isText(fileId) || !isText(filePath)) return [];
      return [{ url, fileId, filePath }];
    });
  } catch {
    return [];
  }
}

/**
 * Called directly from the studio's image fields. Uploads are create-only :
 * the file lands in `/sks-portfolio/blogs` and nothing existing is ever
 * touched or removed.
 */
export async function uploadImageAction(formData: FormData): Promise<ImageUploadResult> {
  if (!(await isAuthenticated())) {
    return { ok: false, error: "Your studio session expired. Sign in again." };
  }
  const file = formData.get("file");
  if (!(file instanceof File) || !file.size) {
    return { ok: false, error: "Choose an image first." };
  }
  const problem = imageUploadProblem(file);
  if (problem) return { ok: false, error: problem };
  try {
    const uploaded = await uploadBlogImage(file);
    return {
      ok: true,
      url: uploaded.url,
      fileId: uploaded.fileId,
      filePath: uploaded.filePath,
      thumbnailUrl: uploaded.thumbnailUrl,
    };
  } catch (error) {
    return {
      ok: false,
      error:
        error instanceof Error
          ? error.message
          : `Upload failed. Try again with a smaller image (under ${MAX_IMAGE_LABEL}).`,
    };
  }
}

/** Adds one photo to the gallery page. Uploaded files keep their ImageKit id. */
export async function addGalleryImageAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const url = String(formData.get("galleryUrl") ?? "").trim();
  const title = String(formData.get("galleryTitle") ?? "").trim();
  const category = String(formData.get("galleryCategory") ?? "").trim();
  const fileId = String(formData.get("galleryFileId") ?? "").trim();
  const filePath = String(formData.get("galleryFilePath") ?? "").trim();

  if (!/^https?:\/\//i.test(url)) redirect("/blog/admin?error=galleryImage");
  if (!title) redirect("/blog/admin?error=galleryTitle");

  await createGalleryImage({ url, title, category, fileId, filePath });
  revalidatePath("/gallery");
  revalidatePath("/blog/admin");
  redirect("/blog/admin?galleryAdded=1#gallery");
}

/**
 * Removes a gallery photo, then the one ImageKit file it was added with. Same
 * guardrails as a story: the file must sit in `/sks-portfolio/blogs`, it is
 * deleted by the id recorded when we uploaded it, and it survives if another
 * story or gallery image still points at the same URL.
 */
export async function removeGalleryImageAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/blog/admin?error=missing");

  const removed = await removeGalleryImage(id);
  let removedImages = 0;
  let keptImages = 0;
  let imagesFailed = false;
  let purgeFailed = false;

  if (removed) {
    const stillUsed = await getReferencedImageUrls([removed.url]);
    keptImages = stillUsed.size;
    if (keptImages === 0) {
      try {
        const cleanup = await deleteBlogImages([
          { url: removed.url, fileId: removed.fileId || undefined },
        ]);
        removedImages = cleanup.deleted;
        purgeFailed = cleanup.purgeFailed > 0;
      } catch {
        imagesFailed = true;
      }
    }
  }

  revalidatePath("/gallery");
  revalidatePath("/blog/admin");
  const params = new URLSearchParams({
    galleryRemoved: "1",
    images: String(removedImages),
  });
  if (keptImages > 0) params.set("kept", String(keptImages));
  if (imagesFailed) params.set("galleryImagesFailed", "1");
  if (purgeFailed) params.set("galleryPurgeFailed", "1");
  redirect(`/blog/admin?${params.toString()}#gallery`);
}

export async function loginAction(formData: FormData) {
  const username = String(formData.get("username") ?? "");
  const password = String(formData.get("password") ?? "");
  if (await authenticate(username, password)) redirect("/blog/admin");
  redirect("/blog/admin?error=login");
}

export async function logoutAction() {
  await clearSession();
  redirect("/blog/admin");
}

export async function publishAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const images = formData.getAll("images").map((value) => String(value));
  const publishedDate = String(formData.get("publishedDate") ?? "").trim();
  const imageFiles = readImageFiles(formData);
  if (!title || !excerpt || !content) redirect("/blog/admin?error=required");
  // A story needs a cover : either a pasted URL or an ImageKit upload.
  if (!coverImage) redirect("/blog/admin?error=cover");
  // Blank is fine (today), but a malformed picker value must not be stored.
  if (publishedDate && !parsePublishedDate(publishedDate)) {
    redirect("/blog/admin?error=date");
  }
  await createBlogPost({
    title,
    excerpt,
    content,
    coverImage,
    images,
    imageFiles,
    publishedAt: publishedDate,
  });
  revalidatePath("/blog");
  revalidatePath("/blog/admin");
  redirect("/blog/admin?published=1");
}

export async function updateAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const excerpt = String(formData.get("excerpt") ?? "").trim();
  const content = String(formData.get("content") ?? "").trim();
  const coverImage = String(formData.get("coverImage") ?? "").trim();
  const images = formData.getAll("images").map((value) => String(value));
  const publishedDate = String(formData.get("publishedDate") ?? "").trim();
  const imageFiles = readImageFiles(formData);
  if (!id || !title || !excerpt || !content) redirect("/blog/admin?error=required");
  if (!coverImage) redirect("/blog/admin?error=cover");
  if (publishedDate && !parsePublishedDate(publishedDate)) {
    redirect("/blog/admin?error=date");
  }
  await updateBlogPost({
    id,
    title,
    excerpt,
    content,
    coverImage,
    images,
    imageFiles,
    publishedAt: publishedDate,
  });
  revalidatePath("/blog");
  revalidatePath(`/blog/admin`);
  redirect("/blog/admin?updated=1");
}

/**
 * Deletes a story, then the ImageKit images that story itself carried. The
 * cleanup is deliberately narrow: only URLs belonging to this story, only files
 * inside `/sks-portfolio/blogs`, never a file another story still references,
 * and never anything the story did not link to itself.
 */
export async function deleteAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/blog/admin?error=missing");

  const removed = await deleteBlogPost(id);

  let removedImages = 0;
  let keptImages = 0;
  let imagesFailed = false;
  let purgeFailed = false;
  const fileIdByUrl = new Map(
    (removed?.imageFiles ?? []).map((file) => [file.url, file.fileId])
  );
  const candidates = [
    ...new Set(
      [removed?.coverImage, ...(removed?.images ?? [])].filter(
        (url): url is string => Boolean(url)
      )
    ),
  ];
  if (candidates.length > 0) {
    // The story is already gone, so anything still pointing at these URLs is
    // another story : those images stay in ImageKit.
    const stillUsed = await getReferencedImageUrls(candidates);
    keptImages = stillUsed.size;
    const removable = candidates.filter((url) => !stillUsed.has(url));
    if (removable.length > 0) {
      try {
        const cleanup = await deleteBlogImages(
          removable.map((url) => ({ url, fileId: fileIdByUrl.get(url) }))
        );
        removedImages = cleanup.deleted;
        purgeFailed = cleanup.purgeFailed > 0;
      } catch {
        imagesFailed = true;
      }
    }
  }

  revalidatePath("/blog");
  revalidatePath("/blog/admin");
  const params = new URLSearchParams({ deleted: "1", images: String(removedImages) });
  if (keptImages > 0) params.set("kept", String(keptImages));
  if (imagesFailed) params.set("imagesFailed", "1");
  if (purgeFailed) params.set("purgeFailed", "1");
  redirect(`/blog/admin?${params.toString()}`);
}
