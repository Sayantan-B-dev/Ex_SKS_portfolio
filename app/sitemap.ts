import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL;

// Static last-modified dates keep the sitemap cacheable. Bump a date only
// when that route's content actually changes.
const STATIC_LAST_MODIFIED = {
  home: new Date("2026-09-10"),
  about: new Date("2026-09-10"),
  shows: new Date("2026-09-10"),
  gallery: new Date("2026-09-10"),
  blog: new Date("2026-09-10"),
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: STATIC_LAST_MODIFIED.home,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/shows`,
      lastModified: STATIC_LAST_MODIFIED.shows,
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/about`,
      lastModified: STATIC_LAST_MODIFIED.about,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: STATIC_LAST_MODIFIED.blog,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/gallery`,
      lastModified: STATIC_LAST_MODIFIED.gallery,
      changeFrequency: "weekly",
      priority: 0.7,
    },
  ];

  try {
    const { isBlogConfigured, getPublishedPosts } = await import("@/lib/blog");
    if (!isBlogConfigured()) return staticEntries;
    const posts = await getPublishedPosts();
    const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${BASE_URL}/blog/${post.slug}`,
      lastModified: new Date(post.published_at),
      changeFrequency: "weekly",
      priority: 0.6,
    }));
    return [...staticEntries, ...postEntries];
  } catch {
    // Build and offline environments have no DB access. Never fail the
    // build for sitemap generation; return static entries only.
    return staticEntries;
  }
}
