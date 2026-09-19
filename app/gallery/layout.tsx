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
    "Samrat Sarkar gallery",
    "SKS band live photos",
    "Indian singer photos",
    "Bollywood live concert images",
    "concert stage photos India",
    "celebrity concert photos",
    "stadium concert photos",
    "award night photos India",
    "Bryan Adams opening act photo",
    "live band performance photos",
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
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Gallery",
        item: `${SITE_URL}/gallery`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      {children}
    </>
  );
}
