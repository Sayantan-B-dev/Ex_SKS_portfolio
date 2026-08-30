import type { Metadata } from "next";
import dynamic from "next/dynamic";
import ScrollEffects from "@/components/ScrollEffects";
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import LoadingFallback from "@/components/LoadingFallback";

const SongsSection = dynamic(() => import("@/components/SongsSection"), {
  loading: () => <LoadingFallback />,
  ssr: true,
});
const AchievementsSection = dynamic(
  () => import("@/components/AchievementsSection"),
  { loading: () => <LoadingFallback />, ssr: true }
);
const Endorsements = dynamic(() => import("@/components/Endorsements"), {
  loading: () => <LoadingFallback />,
  ssr: true,
});
const ConnectSection = dynamic(() => import("@/components/ConnectSection"), {
  loading: () => <LoadingFallback />,
  ssr: true,
});
const Footer = dynamic(() => import("@/components/Footer"), {
  loading: () => <LoadingFallback />,
  ssr: true,
});

export const metadata: Metadata = {
  title: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
  description:
    "Sammrat Ka Saagar (SKS) : Bollywood playback singer, music director, and electrifying live performer. Over 1300 shows across 40+ countries. Winner of Mirchi Music Awards. Endorsed by Roland & Samson. Book the 5–16 member power band.",
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
  ],
  openGraph: {
    title: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
    description:
      "Over 1300 shows across 40+ countries. Bollywood playback singer, music director, and electrifying live performer.",
    url: "",
    images: [
      {
        url: "/images/hero_samrat_live.webp",
        width: 1200,
        height: 630,
        alt: "Samrat Sarkar performing live on stage",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "SKS | Samrat Sarkar : Bollywood Playback Singer & Live Band",
    description:
      "Over 1300 shows across 40+ countries. Bollywood playback singer, music director, and electrifying live performer.",
    images: ["/images/hero_samrat_live.webp"],
  },
  alternates: {
    canonical: "",
  },
};

export default function Home() {
  return (
    <>
      <ScrollEffects />
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Header />
      <main id="main">
        <Hero />
        <StatsBar />
        <SongsSection />
        <AchievementsSection />
        <Endorsements />
        <ConnectSection />
      </main>
      <Footer />
    </>
  );
}
