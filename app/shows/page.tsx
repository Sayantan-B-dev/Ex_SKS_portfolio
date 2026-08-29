import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import DecryptedText from "@/components/reactbits/DecryptedText";

export const metadata = {
  title: "Live Shows & Global Tours",
  description:
    "Explore 1300+ live performances by Samrat Sarkar & The Band across 40+ countries. Bryan Adams opening act, Mumbai Police Awards, celebrity mega concerts. Book customizable 5–16 member band packages.",
  keywords: [
    "live shows India",
    "global tours",
    "concert booking",
    "Bryan Adams opening act",
    "corporate event band",
    "wedding band India",
    "Mumbai Police Awards",
    "1300 shows",
    "40 countries",
    "Sammrat Ka Saagar live",
  ],
  openGraph: {
    title: "Live Shows & Global Tours | SKS Music Band",
    description:
      "1300+ live performances across 40+ countries. Bryan Adams opening act, celebrity mega concerts, customizable band packages.",
    url: "https://sksband.com/shows",
    images: [
      {
        url: "/images/achievements/opening_act_bryan_adams.webp",
        width: 1200,
        height: 630,
        alt: "Samrat Sarkar opening act for Bryan Adams",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "Live Shows & Global Tours | SKS Music Band",
    description:
      "1300+ live performances across 40+ countries. Book the power band.",
    images: ["/images/achievements/opening_act_bryan_adams.webp"],
  },
  alternates: {
    canonical: "https://sksband.com/shows",
  },
};

const COUNTRIES = [
  "London (UK)",
  "New York (USA)",
  "Los Angeles (USA)",
  "Dubai (UAE)",
  "Sydney (Australia)",
  "Moscow (Russia)",
  "Singapore",
  "Cape Town (South Africa)",
  "Johannesburg",
  "Durban",
  "Kuala Lumpur (Malaysia)",
  "Langkawi",
  "Bali (Indonesia)",
  "Bangkok (Thailand)",
  "Phuket",
  "Pattaya",
  "Fiji Islands",
  "Caribbean",
  "Colombo (Sri Lanka)",
  "Kathmandu (Nepal)",
  "Dhaka (Bangladesh)",
  "Kuwait",
  "Philippines",
  "Mumbai, Delhi, Kolkata, Bangalore & Major Metros",
];

const HIGHLIGHT_SHOWS = [
  {
    title: "OPENING ACT FOR BRYAN ADAMS",
    venue: "Palace Gardens, Bangalore",
    desc: "Commanded the opening act for legendary global rock icon Bryan Adams in front of 30,000+ roaring music fans.",
    image: "/images/achievements/opening_act_bryan_adams.webp",
  },
  {
    title: "UMANG MUMBAI POLICE AWARDS",
    venue: "Cineyug & Sony TV Broadcast",
    desc: "Electrifying star performance honoring the Mumbai Police department alongside Bollywood's elite superstar fraternity.",
    image: "/images/achievements/winner_mirchi_music.webp",
  },
  {
    title: "CELEBRITY MEGA CONCERTS",
    venue: "Shared Stage With Superstars",
    desc: "Direct performance collaboration sharing the grand stage with Amitabh Bachchan, Shah Rukh Khan, Salman Khan, Sachin Tendulkar, and Akshay Kumar.",
    image: "/images/achievements/shared_stage_crowd.webp",
  },
];

export default function ShowsPage() {
  return (
    <>
      <ScrollEffects />
      <Header />
      <main className="page-main">
        {/* Page Hero */}
        <section className="subpage-hero">
          <div className="subpage-hero-bg">
            <Image
              src="/images/singing_on_stage_background_fire.webp"
              alt="Samrat live concert stage"
              fill
              priority
              sizes="100vw"
              className="subpage-hero-img"
            />
            <div className="subpage-hero-overlay" />
          </div>
          <div className="wrap subpage-hero-content reveal-up">
            <p className="subpage-tag">STAGE PRESENCE &amp; TOURS</p>
            <h1 className="subpage-title">
              <DecryptedText text="OVER 1300 SHOWS WORLDWIDE" speed={28} maxIterations={14} />
            </h1>
            <p className="subpage-subtitle">
              40+ Countries • 100+ Shows Annually • 5 to 16 Member Power Band
            </p>
          </div>
        </section>

        {/* Major Show Highlights */}
        <section className="shows-highlights-sec wrap">
          <div className="songs-header reveal-up">
            <h2 className="sec-heading">LEGENDARY STAGE HIGHLIGHTS</h2>
            <div className="sec-underline" />
          </div>

          <div className="shows-cards-grid reveal-stagger">
            {HIGHLIGHT_SHOWS.map((show, idx) => (
              <div
                className="reveal-item"
                key={show.title}
                style={{ "--i": idx } as React.CSSProperties}
              >
                <SpotlightCard className="show-highlight-card" spotlightColor="rgba(255, 45, 120, 0.2)">
                  <div className="show-card-img-wrap">
                    <Image
                      src={show.image}
                      alt={show.title}
                      fill
                      loading="lazy"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="img-smooth"
                    />
                    <div className="show-card-overlay" />
                  </div>
                  <div className="show-card-content">
                    <span className="show-card-venue">{show.venue}</span>
                    <h3 className="show-card-title">{show.title}</h3>
                    <p className="show-card-desc">{show.desc}</p>
                  </div>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </section>

        {/* Global Destinations */}
        <section className="destinations-sec wrap reveal-up">
          <div className="songs-header">
            <h2 className="sec-heading">GLOBAL TOUR DESTINATIONS</h2>
            <div className="sec-underline" />
            <p className="destinations-sub">
              From historic international arenas to luxury destination weddings and corporate mega-galas.
            </p>
          </div>

          <div className="countries-pill-grid reveal-stagger">
            {COUNTRIES.map((c, idx) => (
              <div
                className="country-pill reveal-item"
                key={c}
                style={{ "--i": idx % 8 } as React.CSSProperties}
              >
                <span className="country-dot" /> {c}
              </div>
            ))}
          </div>
        </section>

        {/* Live Setup Banner */}
        <section className="live-setup-banner wrap reveal-up">
          <div className="live-setup-content">
            <h2>CUSTOMIZABLE LIVE BAND PACKAGES</h2>
            <p>
              Available for Concerts, Corporate Summits, Luxury Destination Weddings, Sangeet, Barat, and VIP Gala Nights. Setups scale from a dynamic 5-piece acoustic ensemble to a thunderous 16-member big band with 48 dancers and international artist collaborations.
            </p>
            <Link href="/#connect" className="btn-yellow">
              BOOK TOUR DATES
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
