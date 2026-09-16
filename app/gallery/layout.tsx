import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Photo & Stage Gallery",
  description:
    "Visual archives of Samrat Sarkar & The Band : live concerts, stadium lights, award ceremonies, celebrity galas, and album artwork from 40+ countries.",
  keywords: [
    "Samrat Sarkar photos",
    "SKS band gallery",
    "live concert photos",
    "stage performance",
    "award ceremony",
    "Bollywood singer photos",
    "concert photography",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SKS : Samrat Sarkar Music Band",
    title: "Photo & Stage Gallery | SKS Music Band",
    description:
      "Visual archives of live concerts, stadium lights, award ceremonies, and album artwork.",
    url: `${SITE_URL}/gallery`,
    images: [
      {
        url: `${SITE_URL}/images/hero_samrat_live.webp`,
        width: 1200,
        height: 630,
        alt: "SKS Music Band stage gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Photo & Stage Gallery | SKS Music Band",
    description:
      "Visual archives of live concerts, stadium lights, award ceremonies.",
    images: [`${SITE_URL}/images/hero_samrat_live.webp`],
  },
  alternates: {
    canonical: `${SITE_URL}/gallery`,
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
