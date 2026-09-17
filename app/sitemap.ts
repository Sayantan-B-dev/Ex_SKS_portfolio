import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

const BASE_URL = SITE_URL.replace(/\/$/, "");

type SitemapPost = {
  slug: string;
  published_at?: string | Date | null;
  updated_at?: string | Date | null;
};

type StaticPage = {
  path: string;
  lastModified: string;
};

const STATIC_PAGES: readonly StaticPage[] = [
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
];

function validDate(
  value?: string | Date | null,
): Date | undefined {
  if (!value) return undefined;

  const date =
    value instanceof Date
      ? value
      : new Date(value);

  return Number.isNaN(date.getTime())
    ? undefined
    : date;
}

function sitemapEntry(
  path: string,
  lastModified?: string | Date | null,
): MetadataRoute.Sitemap[number] {
  const item: MetadataRoute.Sitemap[number] = {
    url: `${BASE_URL}${path}`,
  };

  const date = validDate(lastModified);

  if (date) {
    item.lastModified = date;
  }

  return item;
}

function dedupeEntries(
  entries: MetadataRoute.Sitemap,
): MetadataRoute.Sitemap {
  const seen = new Set<string>();

  return entries.filter((item) => {
    if (seen.has(item.url)) {
      return false;
    }

    seen.add(item.url);
    return true;
  });
}

export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries: MetadataRoute.Sitemap =
    STATIC_PAGES.map(({ path, lastModified }) =>
      sitemapEntry(path, lastModified),
    );

  let blogEntries: MetadataRoute.Sitemap = [];

  try {
    const {
      isBlogConfigured,
      getPublishedPosts,
    } = await import("@/lib/blog");

    if (isBlogConfigured()) {
      const posts =
        (await getPublishedPosts()) as SitemapPost[];

      blogEntries = posts
        .filter(
          (post) =>
            Boolean(post?.slug) &&
            Boolean(
              post?.updated_at ??
                post?.published_at,
            ),
        )
        .map((post) =>
          sitemapEntry(
            `/blog/${encodeURIComponent(post.slug)}`,
            post.updated_at ??
              post.published_at,
          ),
        );
    }
  } catch (error) {
    console.error(
      "Sitemap: failed to fetch blog posts:",
      error,
    );
  }

  return dedupeEntries([
    ...staticEntries,
    ...blogEntries,
  ]);
}