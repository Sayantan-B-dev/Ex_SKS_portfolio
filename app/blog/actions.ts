"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { authenticate, clearSession, isAuthenticated } from "@/lib/blog-auth";
import {
  createBlogPost,
  createGalleryImage,
  createTourEvent,
  deleteBlogPost,
  deleteTourEvent,
  getReferencedImageUrls,
  parsePublishedDate,
  removeGalleryImage,
  updateBlogPost,
  updateTourEvent,
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

/** True for a site-relative path or an absolute http(s) link. */
function isLink(value: string) {
  return /^(https?:\/\/|\/)/i.test(value.trim());
}

/**
 * Reads the studio's tour fields. Cities arrive one per line from a textarea, so
 * they are split here : `cleanCities` in lib/blog.ts trims, de-dupes, and caps
 * the route.
 */
function readTourInput(formData: FormData) {
  return {
    kicker: String(formData.get("tourKicker") ?? "").trim(),
    title: String(formData.get("tourTitle") ?? "").trim(),
    dateText: String(formData.get("tourDate") ?? "").trim(),
    description: String(formData.get("tourDescription") ?? "").trim(),
    image: String(formData.get("tourImage") ?? "").trim(),
    fileId: String(formData.get("tourFileId") ?? "").trim(),
    filePath: String(formData.get("tourFilePath") ?? "").trim(),
    startingPoint: String(formData.get("tourStartingPoint") ?? "").trim(),
    cities: String(formData.get("tourCities") ?? "").split(/\r?\n/),
    endingText: String(formData.get("tourEndingText") ?? "").trim(),
    redirectTo: String(formData.get("tourRedirectTo") ?? "").trim(),
    ctaLabel: String(formData.get("tourCtaLabel") ?? "").trim(),
    featured: formData.get("tourFeatured") === "on",
  };
}

/** Adds one tour event. The landing page picks it up on its next revalidation. */
export async function addTourEventAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const input = readTourInput(formData);
  if (!input.title || !input.description || !input.startingPoint) {
    redirect("/blog/admin?error=tourRequired#tour");
  }
  if (!input.image) redirect("/blog/admin?error=tourImage#tour");
  if (input.redirectTo && !isLink(input.redirectTo)) {
    redirect("/blog/admin?error=tourUrl#tour");
  }
  await createTourEvent(input);
  revalidatePath("/");
  revalidatePath("/blog/admin");
  redirect("/blog/admin?tourAdded=1#tour");
}

export async function updateTourEventAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const id = String(formData.get("id") ?? "");
  const input = readTourInput(formData);
  if (!id || !input.title || !input.description || !input.startingPoint) {
    redirect("/blog/admin?error=tourRequired#tour");
  }
  if (!input.image) redirect("/blog/admin?error=tourImage#tour");
  if (input.redirectTo && !isLink(input.redirectTo)) {
    redirect("/blog/admin?error=tourUrl#tour");
  }
  await updateTourEvent({ ...input, id });
  revalidatePath("/");
  revalidatePath("/blog/admin");
  redirect("/blog/admin?tourUpdated=1#tour");
}

/**
 * Removes a tour event, then the one ImageKit file it was added with. Same
 * guardrails as a story or gallery photo: the file must sit in
 * `/sks-portfolio/blogs`, it is deleted by the id recorded when we uploaded it,
 * and it survives if another story, photo, or tour still points at the URL.
 */
export async function removeTourEventAction(formData: FormData) {
  if (!(await isAuthenticated())) redirect("/blog/admin?error=session");
  const id = String(formData.get("id") ?? "");
  if (!id) redirect("/blog/admin?error=missing");

  const removed = await deleteTourEvent(id);
  let removedImages = 0;
  let keptImages = 0;
  let imagesFailed = false;
  let purgeFailed = false;

  if (removed && removed.image) {
    const stillUsed = await getReferencedImageUrls([removed.image]);
    keptImages = stillUsed.size;
    if (keptImages === 0) {
      try {
        const cleanup = await deleteBlogImages([
          { url: removed.image, fileId: removed.fileId || undefined },
        ]);
        removedImages = cleanup.deleted;
        purgeFailed = cleanup.purgeFailed > 0;
      } catch {
        imagesFailed = true;
      }
    }
  }

  revalidatePath("/");
  revalidatePath("/blog/admin");
  const params = new URLSearchParams({
    tourRemoved: "1",
    images: String(removedImages),
  });
  if (keptImages > 0) params.set("kept", String(keptImages));
  if (imagesFailed) params.set("tourImagesFailed", "1");
  if (purgeFailed) params.set("tourPurgeFailed", "1");
  redirect(`/blog/admin?${params.toString()}#tour`);
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
