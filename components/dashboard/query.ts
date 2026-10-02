/**
 * The flags the dashboard's server actions bounce back to it with. One flat
 * shape for all three tabs : each panel reads only the flags it owns, so a
 * gallery toast never shows up under the stories tab.
 */
export type DashboardQuery = {
  tab?: string;
  error?: string;
  published?: string;
  updated?: string;
  deleted?: string;
  images?: string;
  kept?: string;
  imagesFailed?: string;
  purgeFailed?: string;
  galleryAdded?: string;
  galleryRemoved?: string;
  galleryImagesFailed?: string;
  galleryPurgeFailed?: string;
  tourAdded?: string;
  tourUpdated?: string;
  tourRemoved?: string;
  tourImagesFailed?: string;
  tourPurgeFailed?: string;
  edit?: string;
  tourEdit?: string;
};

/** Narrows Next's search-param bag to the string flags we actually read. */
export function readDashboardQuery(
  raw: Record<string, string | string[] | undefined>
): DashboardQuery {
  const query: DashboardQuery = {};
  for (const [key, value] of Object.entries(raw)) {
    if (typeof value === "string") {
      query[key as keyof DashboardQuery] = value;
    }
  }
  return query;
}

/** Which tab a redirect's flags belong to, used by the legacy /blog/admin route. */
export function tabForFlags(query: DashboardQuery) {
  if (
    query.galleryAdded ||
    query.galleryRemoved ||
    query.galleryImagesFailed ||
    query.galleryPurgeFailed ||
    query.error === "galleryImage" ||
    query.error === "galleryTitle"
  ) {
    return "gallery";
  }
  if (query.tourAdded || query.tourUpdated || query.tourRemoved || query.tourEdit) {
    return "tour";
  }
  if (query.error?.startsWith("tour")) return "tour";
  return "stories";
}
