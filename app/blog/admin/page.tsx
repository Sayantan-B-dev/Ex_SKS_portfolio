import { redirect } from "next/navigation";

import { readDashboardQuery, tabForFlags } from "@/components/dashboard/query";

export const dynamic = "force-dynamic";

/**
 * The studio used to live here. It now lives at `/dashboard`, so anything still
 * pointing at the old URL (bookmarks, an old login redirect) is forwarded, with
 * its flags mapped onto the tab that owns them.
 */
export default async function LegacyStudioPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = readDashboardQuery(await searchParams);
  const params = new URLSearchParams();

  const { edit, tourEdit, tab, ...flags } = query;
  if (edit) params.set("edit", edit);
  if (tourEdit) params.set("tourEdit", tourEdit);
  for (const [key, value] of Object.entries(flags)) {
    if (typeof value === "string" && value) params.set(key, value);
  }
  params.set("tab", tab === "gallery" || tab === "tour" ? tab : tabForFlags(query));

  redirect(`/dashboard?${params.toString()}`);
}
