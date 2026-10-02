import type { Metadata } from "next";
import ScrollEffects from "@/components/ScrollEffects";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TourAnnouncement, { type TourSlide } from "@/components/TourAnnouncement";
import StatsBar from "@/components/StatsBar";
import SongsSection from "@/components/SongsSection";
import AchievementsSection from "@/components/AchievementsSection";
import Endorsements from "@/components/Endorsements";
import FaqSection from "@/components/FaqSection";
import { FAQS } from "@/lib/faqs";
import ConnectSection from "@/components/ConnectSection";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import { getTourEvents, isTourConfigured } from "@/lib/blog";

/**
 * Studio-managed tour events must reach the landing page without a rebuild, so
 * the page is served from cache and refreshed on demand (`revalidatePath("/")`
 * in app/blog/actions.ts) with a slow safety net underneath.
 */
export const revalidate = 300;

export const metadata: Metadata = {
  title: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
  description:
    "Sammrat Ka Saagar (SKS) : Bollywood playback singer, music director, and electrifying live performer. Over 1300 shows across 40+ countries. Winner of Mirchi Music Awards. Endorsed by Roland & Samson. Book the 5 to 16 member power band.",
  keywords: [
    "Samrat Sarkar",
    "SKS band",
    "Bollywood playback singer",
    "live band India",
    "music director",
    "concert booking",
    "1300 shows",
    "40 countries",
    "Mirchi Music Awards",
    "Aao Huzoor",
    "hire Bollywood singer",
    "corporate event band India",
    "wedding band India",
    "Sammrat Ka Saagar",
    "Bryan Adams opening act",
    "live band for events",
    "Bollywood live band",
    "Indian live band for hire",
    "Samrat Sarkar live show",
    "best live band India",
    "top Bollywood singer",
    "book live band online",
    "event entertainment India",
    "Roland endorser India",
    "Dil Di Dhadkan singer",
    "Bollywood concert booking",
    "destination wedding band",
    "private party band India",
    "sangeet performer",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SKS : Samrat Sarkar Music Band",
    title: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
    description:
      "Over 1300 shows across 40+ countries. Bollywood playback singer, music director, and electrifying live performer.",
    url: SITE_URL,
    images: [
      {
        url: `${SITE_URL}/images/hero_samrat_live.webp`,
        width: 1200,
        height: 630,
        alt: "Samrat Sarkar performing live on stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
    description:
      "Over 1300 shows across 40+ countries. Bollywood playback singer, music director, and electrifying live performer.",
    images: [`${SITE_URL}/images/hero_samrat_live.webp`],
  },
  alternates: {
    canonical: SITE_URL,
  },
};

/**
 * A tour fetch never takes the landing page down with it : if MongoDB is
 * unreachable the section simply does not render.
 */
async function loadTourSlides(): Promise<TourSlide[]> {
  if (!isTourConfigured()) return [];
  try {
    const events = await getTourEvents();
    return events.map((event) => ({
      id: event.id,
      kicker: event.kicker,
      title: event.title,
      dateText: event.dateText,
      description: event.description,
      image: event.image,
      startingPoint: event.startingPoint,
      cities: event.cities,
      endingText: event.endingText,
      redirectTo: event.redirectTo,
      ctaLabel: event.ctaLabel,
    }));
  } catch {
    return [];
  }
}

export default async function Home() {
  const tourSlides = await loadTourSlides();
  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
  return (
    <>
      <ScrollEffects />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <TourAnnouncement events={tourSlides} />
        <StatsBar />
        <SongsSection />
        <AchievementsSection />
        <Endorsements />
        <FaqSection />
        <ConnectSection />
      </main>
      <Footer />
    </>
  );
}
