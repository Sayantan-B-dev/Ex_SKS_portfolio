import "server-only";

import { imageUploadProblem } from "@/lib/image-limits";

/**
 * ImageKit holds every blog image. This module is scoped to exactly one folder,
 * `/sks-portfolio/blogs`, and to two operations:
 *
 * 1. **Create** : upload a new file there, and create the folder if missing.
 * 2. **Delete, only as part of deleting a blog post** : remove the images that
 *    post itself points at. Every candidate path is first resolved against a
 *    listing of that one folder, so a path this project does not recognise is
 *    skipped rather than deleted, and nothing outside the folder is reachable.
 *
 * There is no overwrite, rename, move, or copy here, no folder deletion, and no
 * "delete this asset" path that a studio user can trigger on its own. Media left
 * over for any other reason is cleaned up manually by the account owner. See
 * AGENTS.md, "ImageKit is scoped to one folder and one purpose".
 */

const UPLOAD_ENDPOINT = "https://upload.imagekit.io/api/v1/files/upload";
const API_BASE = "https://api.imagekit.io/v1";

/** The only folder this project is allowed to write into. */
export const IMAGEKIT_ROOT_FOLDER = "/sks-portfolio";
export const IMAGEKIT_BLOG_FOLDER = "/sks-portfolio/blogs";

/** Uploads land directly in the folder above, never in a nested child. */
const IMAGEKIT_BLOG_PREFIX = `${IMAGEKIT_BLOG_FOLDER}/`;


export type ImageKitUpload = {
  url: string;
  fileId: string;
  filePath: string;
  name: string;
  thumbnailUrl: string | null;
};

/**
 * One image a story points at, with the ImageKit id we recorded when we uploaded
 * it. ImageKit's search index lags behind an upload (in both directions), so an
 * id captured at upload time is the only reliable way to delete the file of a
 * story that was published and removed moments later. A pasted link has no id
 * and falls back to a name lookup.
 */
export type BlogImageRef = { url: string; fileId?: string };

/**
 * The environment names both spellings of the key : the live `.env.local`
 * currently defines `IMGEKIT_*` (missing "A"), so accept either rather than
 * silently failing on a typo.
 */
function envValue(...names: string[]) {
  for (const name of names) {
    const value = process.env[name]?.trim();
    if (value) return value;
  }
  return undefined;
}

export function imageKitPrivateKey() {
  return envValue("IMGEKIT_PRIVATE_KEY", "IMAGEKIT_PRIVATE_KEY");
}

export function imageKitPublicKey() {
  return envValue("IMGEKIT_PUBLIC_KEY", "IMAGEKIT_PUBLIC_KEY");
}

export function imageKitUrlEndpoint() {
  return envValue("IMAGEKIT_URL_ENDPOINT")?.replace(/\/+$/, "");
}

export function isImageKitConfigured() {
  return Boolean(imageKitPrivateKey());
}

/** Which ImageKit variables are present : reported by the folder setup script. */
export function describeImageKitConfig() {
  return {
    privateKey: Boolean(imageKitPrivateKey()),
    publicKey: Boolean(imageKitPublicKey()),
    urlEndpoint: imageKitUrlEndpoint() ?? null,
  };
}

function authHeaders(): Record<string, string> {
  const key = imageKitPrivateKey();
  if (!key) {
    throw new Error(
      "ImageKit is not configured. Add IMGEKIT_PRIVATE_KEY to your environment."
    );
  }
  return { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}` };
}

function buildFileName(original: string) {
  const base =
    original
      .replace(/\.[^.]+$/, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, 48) || "blog-image";
  const extension = /\.[a-z0-9]{2,5}$/i.exec(original)?.[0]?.toLowerCase() ?? ".jpg";
  return `${Date.now().toString(36)}-${base}${extension}`;
}

export type FolderResult = { path: string; ok: boolean; status: number };

/**
 * Creates a folder. ImageKit treats this as idempotent enough for our use :
 * an existing folder comes back as a non-2xx "already exists" response, which
 * we report rather than throw on.
 */
export async function createImageKitFolder(
  folderName: string,
  parentFolderPath = "/"
): Promise<FolderResult> {
  const path =
    parentFolderPath === "/" ? `/${folderName}` : `${parentFolderPath}/${folderName}`;
  const response = await fetch(`${API_BASE}/folder`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    // The API requires parentFolderPath even for a root-level folder.
    body: JSON.stringify({ folderName, parentFolderPath }),
  });
  return { path, ok: response.ok, status: response.status };
}

declare global {
  // Cached across dev-server hot reloads so every upload doesn't re-ask.
  var __sksImageKitFolders: Promise<void> | undefined;
}

async function createBlogFolders() {
  await createImageKitFolder("sks-portfolio");
  await createImageKitFolder("blogs", IMAGEKIT_ROOT_FOLDER);
}

/**
 * Best effort: the upload below passes `folder`, and ImageKit creates missing
 * folders on upload anyway, so a failure here must never block a publish.
 */
async function ensureImageKitFolders() {
  globalThis.__sksImageKitFolders ??= createBlogFolders().catch(() => {
    globalThis.__sksImageKitFolders = undefined;
  });
  await globalThis.__sksImageKitFolders;
}

type ImageKitFile = {
  fileId: string;
  name: string;
  filePath: string;
  url: string;
};

/**
 * Maps one of this project's public ImageKit URLs onto its path inside our own
 * folder. Returns null for anything else : another host, another folder, a
 * nested path we never create, or a URL carrying transformations.
 */
export function blogImageFilePath(url: string) {
  const endpoint = imageKitUrlEndpoint();
  const raw = url.trim();
  if (!endpoint || !raw.startsWith(`${endpoint}/`)) return null;
  const withoutEndpoint = raw.slice(endpoint.length);
  const path = decodeURIComponent(withoutEndpoint.split(/[?#]/)[0]);
  if (!path.startsWith(IMAGEKIT_BLOG_PREFIX)) return null;
  const rest = path.slice(IMAGEKIT_BLOG_PREFIX.length);
  return rest && !rest.includes("/") ? path : null;
}

/**
 * Looks one exact path up. A plain folder listing is search-index backed and can
 * lag a few seconds behind an upload, which would silently miss the image of a
 * story that was published and deleted straight away, so each path is looked up
 * by its exact file name instead : scoped to our own folder, then matched on the
 * full `filePath` before anything is deleted.
 */
async function findBlogFile(filePath: string): Promise<ImageKitFile | null> {
  const name = filePath.slice(IMAGEKIT_BLOG_PREFIX.length);
  const response = await fetch(
    `${API_BASE}/files?name=${encodeURIComponent(name)}&path=${encodeURIComponent(
      IMAGEKIT_BLOG_FOLDER
    )}&limit=10`,
    { headers: authHeaders() }
  );
  if (!response.ok) {
    throw new Error(`ImageKit could not look up ${filePath} (${response.status}).`);
  }
  const files = (await response.json()) as ImageKitFile[];
  return files.find((file) => file.filePath === filePath) ?? null;
}

export type DeleteBlogImagesResult = {
  deleted: number;
  alreadyGone: number;
  purged: number;
  purgeFailed: number;
};

async function deleteImageKitFileIds(fileIds: readonly string[]) {
  const response = await fetch(`${API_BASE}/files/batch/deleteByFileIds`, {
    method: "POST",
    headers: { ...authHeaders(), "Content-Type": "application/json" },
    body: JSON.stringify({ fileIds }),
  });
  if (!response.ok) {
    throw new Error(`ImageKit could not delete those files (${response.status}).`);
  }
}

/**
 * Asks ImageKit to drop its CDN copy of just-deleted files, so a cached image
 * stops loading immediately instead of surviving until the cache expires. Purging
 * is asynchronous on ImageKit's side, and a failure here never un-deletes or
 * blocks anything : the files are already gone.
 */
async function purgeBlogImageUrls(urls: readonly string[]) {
  // Belt and braces: only ever purge URLs inside our own folder.
  const targets = [...new Set(urls)].filter((url) => blogImageFilePath(url));
  if (targets.length === 0) return { purged: 0, purgeFailed: 0 };

  const results = await Promise.all(
    targets.map(async (url) => {
      try {
        const response = await fetch(`${API_BASE}/files/purge`, {
          method: "POST",
          headers: { ...authHeaders(), "Content-Type": "application/json" },
          body: JSON.stringify({ url }),
        });
        return response.ok;
      } catch {
        return false;
      }
    })
  );
  const purged = results.filter(Boolean).length;
  return { purged, purgeFailed: results.length - purged };
}

/**
 * Deletes blog images and nothing else. Only URLs that resolve into
 * `/sks-portfolio/blogs` are considered. Each one is deleted by the ImageKit id
 * recorded at upload time, or else looked up by exact name and matched on its
 * full `filePath` before deletion : a path this project cannot account for is
 * left alone. Never call this outside the blog-post deletion flow.
 */
export async function deleteBlogImages(
  refs: readonly BlogImageRef[]
): Promise<DeleteBlogImagesResult> {
  const candidates = new Map<string, BlogImageRef>();
  for (const ref of refs) {
    const url = ref.url?.trim();
    if (!url) continue;
    const path = blogImageFilePath(url);
    // Not our host, not our folder, or a nested path : never touched.
    if (!path) continue;
    candidates.set(path, { url, fileId: ref.fileId?.trim() || undefined });
  }
  if (candidates.size === 0) {
    return { deleted: 0, alreadyGone: 0, purged: 0, purgeFailed: 0 };
  }

  const resolved: { fileId: string; url: string }[] = [];
  for (const [path, ref] of candidates) {
    if (ref.fileId) {
      resolved.push({ fileId: ref.fileId, url: ref.url });
      continue;
    }
    const found = await findBlogFile(path);
    if (found) resolved.push({ fileId: found.fileId, url: ref.url });
  }

  const alreadyGone = candidates.size - resolved.length;
  if (resolved.length === 0) {
    return { deleted: 0, alreadyGone, purged: 0, purgeFailed: 0 };
  }

  await deleteImageKitFileIds(resolved.map((file) => file.fileId));
  // The request succeeded, so these are the files that are going : count what we
  // asked for rather than trusting the response shape (ImageKit may answer with
  // a batch job instead of a list of ids).
  const { purged, purgeFailed } = await purgeBlogImageUrls(resolved.map((file) => file.url));
  return { deleted: resolved.length, alreadyGone, purged, purgeFailed };
}

/** Uploads one image into `/sks-portfolio/blogs` and returns its public URL. */
export async function uploadBlogImage(file: File): Promise<ImageKitUpload> {
  const problem = imageUploadProblem(file);
  if (problem) throw new Error(problem);

  await ensureImageKitFolders();

  const fileName = buildFileName(file.name);
  const body = new FormData();
  body.append("file", file, fileName);
  body.append("fileName", fileName);
  body.append("folder", IMAGEKIT_BLOG_FOLDER);
  body.append("useUniqueFileName", "true");

  const response = await fetch(UPLOAD_ENDPOINT, {
    method: "POST",
    headers: authHeaders(),
    body,
  });

  if (!response.ok) {
    const detail = await response
      .json()
      .then((payload: { message?: string }) => payload?.message)
      .catch(() => null);
    throw new Error(
      detail
        ? `ImageKit upload failed: ${detail}`
        : `ImageKit upload failed (${response.status}).`
    );
  }

  const payload = (await response.json()) as {
    url?: string;
    fileId?: string;
    filePath?: string;
    name?: string;
    thumbnailUrl?: string;
  };
  if (!payload.url) throw new Error("ImageKit did not return a URL for that upload.");
  if (!payload.fileId) throw new Error("ImageKit did not return an id for that upload.");

  return {
    url: payload.url,
    fileId: payload.fileId,
    filePath: payload.filePath ?? `${IMAGEKIT_BLOG_FOLDER}/${fileName}`,
    name: payload.name ?? fileName,
    thumbnailUrl: payload.thumbnailUrl ?? null,
  };
}
