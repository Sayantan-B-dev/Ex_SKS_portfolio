// Seeds the two sample stories into this site's own `SamratPortfolio` collection.
// The collection lives on the shared Blue Eye Entertainment cluster, but nothing
// outside this project's own collection is read or written.
//
//   npm run seed:blog
import { readFileSync } from "node:fs";

import { MongoClient } from "mongodb";

const BLOG_TYPE = "blog_post";
const DEFAULT_DB_NAME = "BlueEyeEntertainment";
const DEFAULT_COLLECTION_NAME = "SamratPortfolio";

function loadEnvFile(path) {
  try {
    for (const line of readFileSync(path, "utf8").split(/\r?\n/)) {
      const match = /^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/.exec(line);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key] !== undefined) continue;
      process.env[key] = rawValue.replace(/^(['"])(.*)\1$/, "$2");
    }
  } catch {
    // The file is optional — real environment variables always win.
  }
}

loadEnvFile(".env.local");
loadEnvFile(".env");

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error("MONGODB_URI is not set. Add it to .env.local, then run npm run seed:blog.");
  process.exit(1);
}

const daysAgo = (days) => new Date(Date.now() - days * 24 * 60 * 60 * 1000);

// Dates are only applied on insert, so re-running the seed never reshuffles
// stories that are already published.
const posts = [
  {
    slug: "when-the-crowd-sings-back",
    title: "When the Crowd Sings Back",
    excerpt:
      "The quiet, electric second when a room of strangers becomes one choir.",
    content:
      "Every live show has a turning point. The band locks in, the lights fall just right, and the audience gives the song back to you. That exchange is why we keep travelling, rehearsing, and showing up with everything we have.",
    cover_image: "/images/hero_samrat_live.webp",
    published_at: daysAgo(2),
  },
  {
    slug: "a-song-finds-its-shape",
    title: "A Song Finds Its Shape",
    excerpt:
      "From a first melody in the studio to the final note under stage lights.",
    content:
      "A song rarely arrives finished. It grows through late-night ideas, patient musicians, and the small decisions that make a performance feel honest. The best version is the one that leaves room for people to bring their own story.",
    cover_image: "/images/singing_on_stage_background_fire.webp",
    published_at: daysAgo(7),
  },
];

const client = new MongoClient(uri, { serverSelectionTimeoutMS: 8000 });

try {
  await client.connect();
  const dbName = process.env.MONGODB_DB_NAME || DEFAULT_DB_NAME;
  const collection = client
    .db(dbName)
    .collection(
      process.env.MONGODB_PORTFOLIO_COLLECTION || DEFAULT_COLLECTION_NAME
    );

  await collection.createIndexes([
    {
      key: { slug: 1 },
      name: "blog_slug_unique",
      unique: true,
      partialFilterExpression: { type: BLOG_TYPE },
    },
    { key: { type: 1, published_at: -1 }, name: "blog_type_published" },
  ]);

  for (const { published_at, ...post } of posts) {
    const now = new Date();
    const result = await collection.updateOne(
      { type: BLOG_TYPE, slug: post.slug },
      {
        $set: { ...post, type: BLOG_TYPE, updated_at: now },
        $setOnInsert: { published_at, created_at: now },
      },
      { upsert: true }
    );
    console.log(`${result.upsertedCount ? "seeded" : "kept  "}  ${post.slug}`);
  }

  console.log(
    `\nDone — ${collection.collectionName} in "${dbName}". Other collections were untouched.`
  );
} finally {
  await client.close();
}
