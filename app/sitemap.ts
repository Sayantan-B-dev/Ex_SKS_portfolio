import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL.replace(/\/$/, "");

const staticPages = [
  {
    path: "",
    lastModified: "2026-09-10",
  },
  {
    path: "/shows",
    lastModified: "2026-09-10",
  },
  {
    path: "/about",
    lastModified: "2026-09-10",
  },
  {
    path: "/blog",
    lastModified: "2026-09-10",
  },
  {
    path: "/gallery",
    lastModified: "2026-09-10",
  },
] as const;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = staticPages.map(
    ({ path, lastModified }) => ({
      url: `${BASE_URL}${path}`,
      lastModified: new Date(lastModified),
    }),
  );

  try {
    const { isBlogConfigured, getPublishedPosts } =
      await import("@/lib/blog");

    if (!isBlogConfigured()) {
      return staticEntries;
    }

    const posts = await getPublishedPosts();

    const postEntries: MetadataRoute.Sitemap = posts
      .filter((post) => post.slug && post.published_at)
      .map((post) => ({
        url: `${BASE_URL}/blog/${encodeURIComponent(post.slug)}`,
        lastModified: new Date(post.published_at),
      }));

    return [...staticEntries, ...postEntries];
  } catch {
    return staticEntries;
  }
}