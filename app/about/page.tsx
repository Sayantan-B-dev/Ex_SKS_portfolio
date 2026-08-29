import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import SpotlightCard from "@/components/reactbits/SpotlightCard";
import DecryptedText from "@/components/reactbits/DecryptedText";

export const metadata = {
  title: "About Samrat Sarkar",
  description:
    "Bollywood playback singer, composer, and electrifying live performer Samrat Sarkar. Sa Re Ga Ma prodigy, debut album Dil Se chart-topper, Cannes-acclaimed Lines soundtrack, Roland & Samson endorser. 1300+ shows in 40+ countries.",
  keywords: [
    "Samrat Sarkar biography",
    "Bollywood singer profile",
    "playback singer India",
    "music director",
    "live performer",
    "Mirchi Music Awards",
    "Roland endorser",
    "Samson endorser",
    "Cannes Festival Lines",
    "Dil Se album",
    "Sa Re Ga Ma",
  ],
  openGraph: {
    title: "About Samrat Sarkar | SKS Music Band",
    description:
      "Bollywood playback singer, composer, and electrifying live performer. 1300+ shows across 40+ countries. Winner of Mirchi Music Awards.",
    url: "https://sksband.com/about",
    images: [
      {
        url: "/images/smiling_head_tilting_with_mic_stage_lights.webp",
        width: 1200,
        height: 630,
        alt: "Samrat Sarkar portrait with microphone",
      },
    ],
  },
  twitter: {
    card: "summary_large_image" as const,
    title: "About Samrat Sarkar | SKS Music Band",
    description:
      "Bollywood playback singer, composer, and electrifying live performer. 1300+ shows across 40+ countries.",
    images: ["/images/smiling_head_tilting_with_mic_stage_lights.webp"],
  },
  alternates: {
    canonical: "https://sksband.com/about",
  },
};

const MILESTONES = [
  {
    year: "EARLY BEGINNINGS",
    title: "Sa Re Ga Ma Prodigy",
    desc: "Participated in Zee TV's iconic Sa Re Ga Ma as a child artist in 5th standard, hosted by Sonu Nigam. Started his formal singing journey in Kolkata.",
    tag: "Television Debut",
  },
  {
    year: "DEBUT ALBUM",
    title: "Dil Se (Sagarika / Seagrams)",
    desc: "His debut studio album 'Dil Se' topped music charts across India for months. Award-winning single 'Majhire Majhi' garnered widespread critical acclaim.",
    tag: "Chartbuster",
  },
  {
    year: "BOLLYWOOD & OTT",
    title: "Film & Web Soundtracks",
    desc: "Lent his voice to Bollywood films, regional cinema, and major OTT soundtracks including Singardaan, Wishlist, Love 3, 2 BHK, and the Cannes-acclaimed Lines.",
    tag: "Film Playback",
  },
  {
    year: "GLOBAL TOURS",
    title: "1300+ Shows in 40+ Countries",
    desc: "Commanding stadiums and grand arenas worldwide—from opening for Bryan Adams to sharing stages with Amitabh Bachchan, SRK, Salman Khan, and Akshay Kumar.",
    tag: "Live Wire",
  },
];

export default function AboutPage() {
  return (
    <>
      <ScrollEffects />
      <Header />
      <main className="page-main">
        {/* Page Hero */}
        <section className="subpage-hero">
          <div className="subpage-hero-bg">
            <Image
              src="/images/posing_on_stage_after_singing_background_crowd_with_flashlight.webp"
              alt="Samrat on stage"
              fill
              priority
              sizes="100vw"
              className="subpage-hero-img"
            />
            <div className="subpage-hero-overlay" />
          </div>
          <div className="wrap subpage-hero-content reveal-up">
            <p className="subpage-tag">BIOGRAPHY &amp; ARTISTRY</p>
            <h1 className="subpage-title">
              <DecryptedText text="ABOUT SAMRAT SARKAR" speed={30} maxIterations={14} />
            </h1>
            <p className="subpage-subtitle">
              Playback Singer • Music Director (Film/OTTs) • Live Wire Performer
            </p>
          </div>
        </section>

        {/* Bio Section */}
        <section className="about-bio-sec wrap">
          <div className="about-grid">
            <div className="about-img-col reveal-up">
              <div className="about-portrait-card">
                <Image
                  src="/images/smiling_head_tilting_with_mic_stage_lights.webp"
                  alt="Samrat portrait with microphone"
                  fill
                  priority
                  className="img-smooth"
                  sizes="(max-width: 768px) 100vw, 480px"
                />
                <div className="about-portrait-badge">
                  <span>WINNER OF</span>
                  <b>MIRCHI MUSIC AWARDS</b>
                </div>
              </div>
            </div>

            <div className="about-text-col reveal-up">
              <h2 className="sec-heading text-left">THE VOICE BEHIND MILLIONS OF HEARTS</h2>
              <div className="sec-underline text-left-underline" />
              <p className="bio-lead">
                Samrat Sarkar is a powerhouse Bollywood playback singer, composer, and electrifying live performer renowned for back-to-back hit singles that resonate across generations.
              </p>
              <p className="bio-para">
                From chartbusters like <i>Aao Huzoor</i>, <i>Dil Di Dhadkan</i>, <i>Bichde</i>, and <i>Mere Sukh Bhi Tere Nein</i> featured on MTV, Zoom, and B4U to soulful Bollywood film anthems, Samrat has amassed millions of streams across Spotify, Apple Music, and YouTube.
              </p>
              <p className="bio-para">
                His music for the film <b>Lines</b>, starring Hina Khan and Farida Jalal, received grand international acclaim at the prestigous <b>Cannes Festival</b>. Signed by <b>Roland India</b> and <b>Samson</b> as an official brand endorser, Samrat brings unrivaled stage energy with his 5–16 member band.
              </p>

              <div className="about-cta-row">
                <Link href="/#songs" className="btn-yellow">
                  LISTEN TO HITS
                </Link>
                <Link href="/#connect" className="btn-outline">
                  BOOK THE BAND
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Milestones / Career Timeline */}
        <section className="milestones-sec wrap">
          <div className="songs-header reveal-up">
            <h2 className="sec-heading">CAREER MILESTONES</h2>
            <div className="sec-underline" />
          </div>

          <div className="milestones-grid reveal-stagger">
            {MILESTONES.map((item, idx) => (
              <div
                className="reveal-item"
                key={item.title}
                style={{ "--i": idx } as React.CSSProperties}
              >
                <SpotlightCard className="milestone-card" spotlightColor="rgba(245, 197, 24, 0.18)">
                  <div className="milestone-tag">{item.tag}</div>
                  <div className="milestone-year">{item.year}</div>
                  <h3 className="milestone-title">{item.title}</h3>
                  <p className="milestone-desc">{item.desc}</p>
                </SpotlightCard>
              </div>
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
