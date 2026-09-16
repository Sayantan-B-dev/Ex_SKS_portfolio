const FALLBACK_SITE_URL = "https://www.samratsarkar.co";

function readSiteUrl() {
  const raw =
    process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || FALLBACK_SITE_URL;
  return raw.replace(/\/+$/, "") || FALLBACK_SITE_URL;
}

export const SITE_URL = readSiteUrl();
