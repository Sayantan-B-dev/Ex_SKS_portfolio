import type { Metadata, Viewport } from "next";
import "./globals.css";
import "../public/css/variables.css";
import "../public/css/base.css";
import "../public/css/animations.css";
import "../public/css/header.css";
import "../public/css/hero.css";
import "../public/css/stats.css";
import "../public/css/songs.css";
import "../public/css/achievements.css";
import "../public/css/endorsements.css";
import "../public/css/connect.css";
import "../public/css/footer.css";
import "../public/css/modals.css";
import "../public/css/subpage.css";
import "../public/css/about.css";
import "../public/css/shows.css";
import "../public/css/gallery.css";
import "../public/css/responsive.css";
import CanvasCursor from "@/components/ui/CanvasCursor";
import { SITE_URL } from "@/lib/site";

const SITE_NAME = "SKS : Samrat Sarkar Music Band";
const OG_IMAGE = `${SITE_URL}/images/hero_samrat_live.webp`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
    template: "%s | Samrat Sarkar : SKS Music Band",
  },
  description:
    "Sammrat Ka Saagar (SKS) : Bollywood playback singer, music director, and electrifying live performer. Over 1300 shows across 40+ countries. Winner of Mirchi Music Awards. Endorsed by Roland & Samson. Book the 5 to 16 member power band for concerts, corporate events, weddings, and global tours.",
  keywords: [
    // Brand & identity
    "Samrat Sarkar",
    "Sammrat Ka Saagar",
    "SKS music band",
    "SKS band",
    "singersamrat",
    "samratsarkar",
    "samrat sarkar singer",
    "samrat sarkar band",
    "samrat sarkar live show",
    "samrat sarkar concert",
    // Core services
    "Bollywood playback singer",
    "Bollywood singer for hire",
    "hire Bollywood singer",
    "book Bollywood singer",
    "live band India",
    "Indian live band",
    "music director",
    "music director India",
    "Bollywood music director",
    // Event booking (high-intent)
    "concert booking India",
    "corporate event band",
    "corporate event entertainment India",
    "hire live band for corporate event",
    "wedding band India",
    "wedding singer India",
    "hire band for wedding",
    "sangeet band India",
    "baraat band India",
    "destination wedding band India",
    "luxury wedding entertainment",
    "private event band India",
    "VIP event entertainment",
    "gala night band India",
    // Awards & achievements
    "Aao Huzoor singer",
    "Mirchi Music Award winner",
    "Bryan Adams opening act",
    "Bryan Adams India opening act",
    "opening act Bryan Adams Bangalore",
    "Mumbai Police Awards singer",
    "Umang Awards performer",
    // Scale & reach
    "global tours",
    "live performer",
    "1300 shows",
    "1300 live shows India",
    "40 countries live band",
    "worldwide touring band India",
    "international live band",
    "over 1300 shows worldwide",
    // Genre & style
    "Bollywood live band",
    "Punjabi live band",
    "Hindi songs live band",
    "Indian pop band live",
    "Bollywood event entertainment",
    "Bollywood concert India",
    // Songs / music
    "Aao Huzoor song",
    "Dil Di Dhadkan singer",
    "Bichde song singer",
    "Majhire Majhi singer",
    "Dil Se album Samrat Sarkar",
    // Film / OTT
    "Lines film soundtrack",
    "Lines Cannes film music",
    "Singardaan singer",
    "Wishlist singer",
    "Bollywood film playback singer",
    "OTT music singer India",
    // Endorsements
    "Roland endorser India",
    "Samson endorser India",
    "Roland India artist",
    // Band packages
    "5 piece band India",
    "16 member band India",
    "customizable live band India",
    "big band India",
    "acoustic band India",
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
    title: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
    description:
      "Over 1300 shows across 40+ countries. Bollywood playback singer, music director, and electrifying live performer. Winner of Mirchi Music Awards. Book the power band.",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Samrat Sarkar performing live on stage with SKS Music Band",
        type: "image/webp",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
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
};

export const viewport: Viewport = {
  themeColor: "#f5c518",
  colorScheme: "dark",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const musicGroupJsonLd = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: "Sammrat Ka Saagar (SKS)",
    alternateName: ["SKS Music Band", "Samrat Sarkar Band", "SKS Band"],
    url: SITE_URL,
    image: OG_IMAGE,
    logo: `${SITE_URL}/images/sks_logo_png.webp`,
    description:
      "Bollywood playback singer, music director, and electrifying live performer. Over 1300 shows across 40+ countries. Winner of Mirchi Music Awards. Endorsed by Roland & Samson. Book the 5 to 16 member power band for concerts, corporate events, weddings, and global tours.",
    genre: ["Bollywood", "Punjabi", "Live Music", "Pop", "Hindi Pop", "Indian Pop"],
    foundingDate: "2003",
    foundingLocation: {
      "@type": "Place",
      name: "Kolkata, India",
    },
    member: {
      "@type": "Person",
      name: "Samrat Sarkar",
      alternateName: ["Sammrat Ka Saagar", "Samrat Sarkar Singer"],
      jobTitle: "Playback Singer, Music Director, Live Performer",
      url: `${SITE_URL}/about`,
      sameAs: [
        "https://www.youtube.com/@SammratKaSaagar",
        "https://www.facebook.com/sammratKaSaagar",
        "https://www.instagram.com/singersamrat",
      ],
    },
    award: ["Mirchi Music Awards", "Umang Mumbai Police Awards"],
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
      name: "Blue Eye Entertainment",
      contactType: "booking",
      email: "Samratkasagar@gmail.com",
      telephone: "+91-91379-52580",
      availableLanguage: ["English", "Hindi", "Bengali"],
    },
    areaServed: {
      "@type": "Country",
      name: "Worldwide",
    },
  };

  const webSiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: "Sammrat Ka Saagar",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${SITE_URL}/?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sammrat Ka Saagar (SKS)",
    alternateName: ["SKS Music Band", "Samrat Sarkar Band"],
    url: SITE_URL,
    logo: `${SITE_URL}/images/sks_logo_png.webp`,
    description:
      "Bollywood playback singer, music director, and electrifying live performer. Over 1300 shows across 40+ countries.",
    foundingDate: "2003",
    foundingLocation: {
      "@type": "Place",
      name: "Kolkata, India",
    },
    contactPoint: {
      "@type": "ContactPoint",
      name: "Blue Eye Entertainment",
      contactType: "booking",
      email: "Samratkasagar@gmail.com",
      telephone: "+91-91379-52580",
      availableLanguage: ["English", "Hindi", "Bengali"],
    },
    sameAs: [
      "https://www.youtube.com/@SammratKaSaagar",
      "https://www.facebook.com/sammratKaSaagar",
      "https://www.instagram.com/singersamrat",
    ],
  };

  const speakableJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: SITE_NAME,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [".subpage-title", ".sec-heading", "h1", "h2"],
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
          dangerouslySetInnerHTML={{ __html: JSON.stringify(musicGroupJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webSiteJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(speakableJsonLd) }}
        />
      </head>
      <body>
        <CanvasCursor />
        {children}
      </body>
    </html>
  );
}
