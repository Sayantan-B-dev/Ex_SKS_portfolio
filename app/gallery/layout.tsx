import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Photo & Stage Gallery",
  description:
    "Visual archives of Samrat Sarkar & The Band — live concerts, stadium lights, award ceremonies, celebrity galas, and album artwork from 40+ countries.",
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
    title: "Photo & Stage Gallery | SKS Music Band",
    description:
      "Visual archives of live concerts, stadium lights, award ceremonies, and album artwork.",
    url: "https://sksband.com/gallery",
    images: [
      {
        url: "/images/hero_samrat_live.webp",
        width: 1200,
        height: 630,
        alt: "SKS Music Band stage gallery",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Photo & Stage Gallery | SKS Music Band",
    description:
      "Visual archives of live concerts, stadium lights, award ceremonies.",
    images: ["/images/hero_samrat_live.webp"],
  },
  alternates: {
    canonical: "https://sksband.com/gallery",
  },
};

export default function GalleryLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
