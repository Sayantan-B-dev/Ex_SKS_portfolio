import type { Metadata } from "next";
import "./globals.css";

const SITE_URL = "https://sksband.com";
const SITE_NAME = "SKS — Samrat Sarkar Music Band";
const OG_IMAGE = "/images/hero_samrat_live.webp";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SKS | Samrat Sarkar — Bollywood Playback Singer & Live Band",
    template: "%s | Samrat Sarkar — SKS Music Band",
  },
  description:
    "Sammrat Ka Saagar (SKS) — Bollywood playback singer, music director, and electrifying live performer. Over 1300 shows across 40+ countries. Winner of Mirchi Music Awards. Endorsed by Roland & Samson. Book the 5–16 member power band for concerts, corporate events, weddings, and global tours.",
  keywords: [
    "Samrat Sarkar",
    "Sammrat Ka Saagar",
    "SKS music band",
    "Bollywood playback singer",
    "live band India",
    "music director",
    "concert booking",
    "corporate event band",
    "wedding band India",
    "Aao Huzoor singer",
    "Mirchi Music Award winner",
    "Bryan Adams opening act",
    "global tours",
    "live performer",
    "1300 shows",
  ],
  authors: [{ name: "Samrat Sarkar", url: SITE_URL }],
  creator: "Samrat Sarkar",
  publisher: "Sammrat Ka Saagar",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: "SKS | Samrat Sarkar — Bollywood Playback Singer & Live Band",
    description:
      "Over 1300 shows across 40+ countries. Bollywood playback singer, music director, and electrifying live performer. Winner of Mirchi Music Awards. Book the power band.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Samrat Sarkar performing live on stage — SKS Music Band",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SKS | Samrat Sarkar — Bollywood Playback Singer & Live Band",
    description:
      "Over 1300 shows across 40+ countries. Bollywood playback singer, music director, and electrifying live performer.",
    images: [OG_IMAGE],
    creator: "@singersamrat",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  icons: {
    icon: "/images/sks_logo_png.webp",
    shortcut: "/images/sks_logo_png.webp",
    apple: "/images/sks_logo_png.webp",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: SITE_URL,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Sammrat Ka Saagar (SKS)",
    alternateName: "SKS Music Band",
    url: SITE_URL,
    image: OG_IMAGE,
    description:
      "Bollywood playback singer, music director, and electrifying live performer. Over 1300 shows across 40+ countries.",
    genre: ["Bollywood", "Punjabi", "Live Music", "Pop"],
    foundingDate: "2003",
    foundingLocation: {
      "@type": "Place",
      name: "Kolkata, India",
    },
    member: {
      "@type": "Person",
      name: "Samrat Sarkar",
      jobTitle: "Playback Singer, Music Director, Live Performer",
      url: SITE_URL,
      sameAs: [
        "https://www.youtube.com/@SammratKaSaagar",
        "https://www.facebook.com/sammratKaSaagar",
        "https://www.instagram.com/singersamrat",
      ],
    },
    award: ["Mirchi Music Awards"],
    producer: [
      { "@type": "Organization", name: "Roland India" },
      { "@type": "Organization", name: "Samson" },
    ],
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    performIn: {
      "@type": "MusicPlaylist",
      name: "SKS Live Shows",
      numberOfTracks: 1300,
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "booking",
      email: "bookings@samratmusic.com",
      telephone: "+91-98765-43210",
    },
  };

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Limelight&family=Oswald:wght@400;500;600;700&family=Figtree:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
