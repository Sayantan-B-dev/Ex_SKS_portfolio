import "server-only";

import {
  MongoClient,
  ObjectId,
  type Collection,
  type Document,
  type WithId,
} from "mongodb";

export const GALLERY_CATEGORIES = ["Concerts", "Crowd", "Portraits", "Awards"] as const;
export type GalleryCategory = (typeof GALLERY_CATEGORIES)[number];

/**
 * A photo the studio added to the gallery page. Gallery images live in the same
 * shared collection as the stories, tagged with their own `type`, which is what
 * the collection's `type` field was designed for.
 */
export type GalleryImage = {
  id: string;
  url: string;
  /** ImageKit's id for the file, empty for a pasted link. */
  fileId: string;
  filePath: string;
  title: string;
  category: GalleryCategory;
  created_at: string;
};

/**
 * ImageKit bookkeeping for one uploaded image : the id lets the story's images
 * be deleted by id when the story goes, without relying on ImageKit's search
 * index, which lags behind a fresh upload.
 */
export type BlogImageFile = {
  url: string;
  fileId: string;
  filePath: string;
};

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  images: string[];
  image_files: BlogImageFile[];
  published_at: string;
  created_at: string;
};

/**
 * This site shares the Blue Eye Entertainment cluster with another app, so it
 * only ever reads and writes its own `SamratPortfolio` collection and tags each
 * document with a content `type`. The other app's `artists` collection is never
 * touched.
 */
const BLOG_TYPE = "blog_post";
const GALLERY_TYPE = "gallery_image";
const DEFAULT_DB_NAME = "BlueEyeEntertainment";
const DEFAULT_COLLECTION_NAME = "SamratPortfolio";

/** A story can carry a handful of supporting shots : enough, not a dump. */
const MAX_POST_IMAGES = 12;

type GalleryImageDocument = {
  type: typeof GALLERY_TYPE;
  url: string;
  fileId?: string;
  filePath?: string;
  title: string;
  category: string;
  created_at: Date;
  updated_at: Date;
};

type BlogPostDocument = {
  type: typeof BLOG_TYPE;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  images?: string[];
  image_files?: BlogImageFile[];
  published_at: Date;
  created_at: Date;
  updated_at: Date;
};

export function isBlogConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

/** Same requirement as the blog, exposed so the gallery page can ask. */
export function isGalleryConfigured() {
  return Boolean(process.env.MONGODB_URI);
}

declare global {
  // Cached across dev-server hot reloads so every edit doesn't open a new pool.
  var __sksMongoClient: Promise<MongoClient> | undefined;
}

function getClient() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error("Blog is not configured. Add MONGODB_URI to your environment.");
  }
  if (!globalThis.__sksMongoClient) {
    const connecting = new MongoClient(uri, {
      serverSelectionTimeoutMS: 8000,
    }).connect();
    globalThis.__sksMongoClient = connecting;
    connecting.catch(() => {
      if (globalThis.__sksMongoClient === connecting) {
        globalThis.__sksMongoClient = undefined;
      }
    });
  }
  return globalThis.__sksMongoClient;
}

/**
 * One collection, several content types : each caller narrows the document type
 * it expects, and every query filters on `type` so the types never mix.
 */
async function getCollectionOf<T extends Document>(collectionName?: string) {
  const client = await getClient();
  const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
  const name =
    collectionName ??
    (process.env.MONGODB_PORTFOLIO_COLLECTION || DEFAULT_COLLECTION_NAME);
  return client.db(dbName).collection<T>(name);
}

async function getPostsCollection() {
  return getCollectionOf<BlogPostDocument>();
}

async function getGalleryCollection() {
  return getCollectionOf<GalleryImageDocument>();
}

function createIndexes() {
  return (async () => {
    const collection: Collection<BlogPostDocument> = await getPostsCollection();
    await collection.createIndexes([
      {
        // Unique per blog post only : the partial filter stops other content
        // types in this shared collection from colliding on a missing slug.
        key: { slug: 1 },
        name: "blog_slug_unique",
        unique: true,
        partialFilterExpression: { type: BLOG_TYPE },
      },
      { key: { type: 1, published_at: -1 }, name: "blog_type_published" },
      { key: { type: 1, created_at: -1 }, name: "gallery_type_created" },
    ]);
  })();
}

let indexesReady: Promise<void> | null = null;

async function ensureIndexes() {
  indexesReady ??= createIndexes();
  try {
    await indexesReady;
  } catch (error) {
    indexesReady = null; // Let the next request retry a transient failure.
    throw error;
  }
}

function toIso(value: Date | string) {
  return value instanceof Date
    ? value.toISOString()
    : new Date(value).toISOString();
}

function toBlogPost(doc: WithId<BlogPostDocument>): BlogPost {
  return {
    id: doc._id.toHexString(),
    title: doc.title,
    slug: doc.slug,
    excerpt: doc.excerpt,
    content: doc.content,
    cover_image: doc.cover_image ?? null,
    images: doc.images ?? [],
    image_files: doc.image_files ?? [],
    published_at: toIso(doc.published_at),
    created_at: toIso(doc.created_at),
  };
}

function toObjectId(id: string) {
  if (!ObjectId.isValid(id)) throw new Error("That story id is not valid.");
  return new ObjectId(id);
}

function describeError(error: unknown) {
  return error instanceof Error ? error.message : String(error);
}

function isDuplicateKeyError(error: unknown) {
  return (
    typeof error === "object" &&
    error !== null &&
    (error as { code?: unknown }).code === 11000
  );
}

/**
 * Dates come from an `<input type="date">` as `YYYY-MM-DD`. They are stored at
 * local noon so the calendar day an author picked can never slide a day either
 * way when the value is read back (midnight would, in any non-UTC timezone).
 */
const DATE_INPUT_VALUE = /^\d{4}-\d{2}-\d{2}$/;

export function toDateInputValue(value: string | Date | null | undefined) {
  if (!value) return "";
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "";
  const pad = (part: number) => String(part).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Parses a date-picker value, or null when it is blank/invalid. */
export function parsePublishedDate(value: string | null | undefined) {
  const raw = (value ?? "").trim();
  if (!raw) return null;
  if (!DATE_INPUT_VALUE.test(raw)) return null;
  const date = new Date(`${raw}T12:00:00`);
  // `2026-02-31` rolls over to March, so a round trip catches impossible dates.
  return toDateInputValue(date) === raw ? date : null;
}

function buildSlug(title: string) {
  const slugBase = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slugBase || "post"}-${Date.now().toString(36)}`;
}

/**
 * Extra images are whatever ImageKit handed back (or a pasted URL), so keep the
 * list to absolute http(s) URLs and drop blanks and duplicates.
 */
function cleanImages(values: readonly string[]) {
  const seen = new Set<string>();
  const images: string[] = [];
  for (const value of values) {
    const url = value.trim();
    if (!/^https?:\/\//i.test(url) || seen.has(url)) continue;
    seen.add(url);
    images.push(url);
    if (images.length === MAX_POST_IMAGES) break;
  }
  return images;
}

export async function getPublishedPosts() {
  await ensureIndexes();
  const collection = await getPostsCollection();
  const docs = await collection
    .find({ type: BLOG_TYPE })
    .sort({ published_at: -1 })
    .toArray();
  return docs.map(toBlogPost);
}

export async function getAdminPosts() {
  await ensureIndexes();
  const collection = await getPostsCollection();
  const docs = await collection
    .find({ type: BLOG_TYPE })
    .sort({ created_at: -1 })
    .toArray();
  return docs.map(toBlogPost);
}

export async function getPublishedPost(slug: string) {
  await ensureIndexes();
  const collection = await getPostsCollection();
  const doc = await collection.findOne({ type: BLOG_TYPE, slug });
  return doc ? toBlogPost(doc) : null;
}

/**
 * Keeps only the upload ids that belong to a URL this story actually uses, so a
 * row the author deleted before publishing cannot leave a stray reference.
 */
function cleanImageFiles(
  files: readonly BlogImageFile[],
  usedUrls: readonly string[]
) {
  const used = new Set(usedUrls.map((url) => url.trim()).filter(Boolean));
  const seen = new Set<string>();
  const kept: BlogImageFile[] = [];
  for (const file of files) {
    const url = file?.url?.trim();
    const fileId = file?.fileId?.trim();
    const filePath = file?.filePath?.trim();
    if (!url || !fileId || !filePath) continue;
    if (!used.has(url) || seen.has(url)) continue;
    seen.add(url);
    kept.push({ url, fileId, filePath });
  }
  return kept;
}

export async function createBlogPost(input: {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  images?: readonly string[];
  imageFiles?: readonly BlogImageFile[];
  /** Blank means "publish with today's date". */
  publishedAt?: string;
}) {
  await ensureIndexes();
  const collection = await getPostsCollection();
  const slug = buildSlug(input.title);
  const now = new Date();
  const publishedAt = parsePublishedDate(input.publishedAt) ?? now;
  const images = cleanImages(input.images ?? []);
  try {
    await collection.insertOne({
      type: BLOG_TYPE,
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      cover_image: input.coverImage || null,
      images,
      image_files: cleanImageFiles(input.imageFiles ?? [], [
        input.coverImage,
        ...images,
      ]),
      published_at: publishedAt,
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    if (isDuplicateKeyError(error)) {
      throw new Error("A story with that address already exists. Try again.");
    }
    throw new Error(`Unable to publish blog post: ${describeError(error)}`);
  }
  return slug;
}

export async function updateBlogPost(input: {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  images?: readonly string[];
  imageFiles?: readonly BlogImageFile[];
  /** Blank leaves the story's existing date untouched. */
  publishedAt?: string;
}) {
  await ensureIndexes();
  const collection = await getPostsCollection();
  const publishedAt = parsePublishedDate(input.publishedAt);
  const images = cleanImages(input.images ?? []);
  try {
    await collection.updateOne(
      { _id: toObjectId(input.id), type: BLOG_TYPE },
      {
        $set: {
          title: input.title,
          excerpt: input.excerpt,
          content: input.content,
          cover_image: input.coverImage || null,
          images,
          image_files: cleanImageFiles(input.imageFiles ?? [], [
            input.coverImage,
            ...images,
          ]),
          ...(publishedAt ? { published_at: publishedAt } : {}),
          updated_at: new Date(),
        },
      }
    );
  } catch (error) {
    throw new Error(`Unable to update blog post: ${describeError(error)}`);
  }
}

/** Gallery photos, newest first : the order the gallery page renders them in. */
export async function getGalleryImages() {
  await ensureIndexes();
  const collection = await getGalleryCollection();
  const docs = await collection
    .find({ type: GALLERY_TYPE })
    .sort({ created_at: -1 })
    .toArray();
  return docs.map(toGalleryImage);
}

function toGalleryImage(doc: WithId<GalleryImageDocument>): GalleryImage {
  return {
    id: doc._id.toHexString(),
    url: doc.url,
    fileId: doc.fileId ?? "",
    filePath: doc.filePath ?? "",
    title: doc.title,
    category: isGalleryCategory(doc.category) ? doc.category : "Concerts",
    created_at: toIso(doc.created_at),
  };
}

function isGalleryCategory(value: string): value is GalleryCategory {
  return (GALLERY_CATEGORIES as readonly string[]).includes(value);
}

export async function createGalleryImage(input: {
  url: string;
  title: string;
  category: string;
  fileId?: string;
  filePath?: string;
}) {
  await ensureIndexes();
  const collection = await getGalleryCollection();
  const now = new Date();
  try {
    await collection.insertOne({
      type: GALLERY_TYPE,
      url: input.url,
      fileId: input.fileId ?? "",
      filePath: input.filePath ?? "",
      title: input.title,
      category: isGalleryCategory(input.category) ? input.category : "Concerts",
      created_at: now,
      updated_at: now,
    });
  } catch (error) {
    throw new Error(`Unable to add that gallery image: ${describeError(error)}`);
  }
}

/**
 * Removes a gallery photo and hands back the ImageKit identity it was stored
 * with, so the caller can clean up exactly that one file.
 */
export async function removeGalleryImage(id: string) {
  await ensureIndexes();
  const collection = await getGalleryCollection();
  try {
    const removed = await collection.findOneAndDelete({
      _id: toObjectId(id),
      type: GALLERY_TYPE,
    });
    if (!removed) return null;
    return {
      url: removed.url,
      fileId: removed.fileId ?? "",
      filePath: removed.filePath ?? "",
    };
  } catch (error) {
    throw new Error(`Unable to remove that gallery image: ${describeError(error)}`);
  }
}

/**
 * Removes the story and hands back the images it carried, so the caller can
 * clean up exactly those ImageKit files (see `deleteBlogImages`).
 */
export async function deleteBlogPost(id: string) {
  await ensureIndexes();
  const collection = await getPostsCollection();
  try {
    const removed = await collection.findOneAndDelete({
      _id: toObjectId(id),
      type: BLOG_TYPE,
    });
    if (!removed) return null;
    return {
      coverImage: removed.cover_image ?? null,
      images: removed.images ?? [],
      imageFiles: removed.image_files ?? [],
    };
  } catch (error) {
    throw new Error(`Unable to delete blog post: ${describeError(error)}`);
  }
}

/**
 * Which of these image URLs are still referenced by a story in this collection?
 * An image shared by another story is left in ImageKit rather than deleted out
 * from under it. Runs after the deleted story is gone, so it only sees the
 * remaining stories.
 */
/**
 * Which of these image URLs are still referenced by anything in this collection
 * : another story, or a gallery image. An image shared by another content type
 * is left in ImageKit rather than deleted out from under it. Runs after the
 * deleted document is gone, so it only sees what remains.
 */
export async function getReferencedImageUrls(urls: readonly string[]) {
  await ensureIndexes();
  const collection = await getCollectionOf<{
    cover_image?: string | null;
    images?: string[];
    url?: string;
  }>();
  const unique = [...new Set(urls.map((url) => url.trim()).filter(Boolean))];
  if (unique.length === 0) return new Set<string>();

  const docs = await collection
    .find(
      {
        $or: [
          {
            type: BLOG_TYPE,
            $or: [{ cover_image: { $in: unique } }, { images: { $in: unique } }],
          },
          { type: GALLERY_TYPE, url: { $in: unique } },
        ],
      },
      { projection: { cover_image: 1, images: 1, url: 1 } }
    )
    .toArray();

  const referenced = new Set<string>();
  for (const doc of docs) {
    for (const candidate of [doc.cover_image, doc.url, ...(doc.images ?? [])]) {
      if (candidate && unique.includes(candidate)) referenced.add(candidate);
    }
  }
  return referenced;
}
