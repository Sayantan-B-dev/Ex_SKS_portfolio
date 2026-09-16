import "server-only";

import { MongoClient, ObjectId, type Collection, type WithId } from "mongodb";

export type BlogPost = {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
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
const DEFAULT_DB_NAME = "BlueEyeEntertainment";
const DEFAULT_COLLECTION_NAME = "SamratPortfolio";

type BlogPostDocument = {
  type: typeof BLOG_TYPE;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image: string | null;
  published_at: Date;
  created_at: Date;
  updated_at: Date;
};

export function isBlogConfigured() {
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

async function getPostsCollection() {
  const client = await getClient();
  const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
  const collectionName =
    process.env.MONGODB_PORTFOLIO_COLLECTION || DEFAULT_COLLECTION_NAME;
  return client
    .db(dbName)
    .collection<BlogPostDocument>(collectionName);
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

function buildSlug(title: string) {
  const slugBase = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${slugBase || "post"}-${Date.now().toString(36)}`;
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

export async function createBlogPost(input: {
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
}) {
  await ensureIndexes();
  const collection = await getPostsCollection();
  const slug = buildSlug(input.title);
  const now = new Date();
  try {
    await collection.insertOne({
      type: BLOG_TYPE,
      title: input.title,
      slug,
      excerpt: input.excerpt,
      content: input.content,
      cover_image: input.coverImage || null,
      published_at: now,
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
}) {
  await ensureIndexes();
  const collection = await getPostsCollection();
  try {
    await collection.updateOne(
      { _id: toObjectId(input.id), type: BLOG_TYPE },
      {
        $set: {
          title: input.title,
          excerpt: input.excerpt,
          content: input.content,
          cover_image: input.coverImage || null,
          updated_at: new Date(),
        },
      }
    );
  } catch (error) {
    throw new Error(`Unable to update blog post: ${describeError(error)}`);
  }
}

export async function deleteBlogPost(id: string) {
  await ensureIndexes();
  const collection = await getPostsCollection();
  try {
    await collection.deleteOne({ _id: toObjectId(id), type: BLOG_TYPE });
  } catch (error) {
    throw new Error(`Unable to delete blog post: ${describeError(error)}`);
  }
}
