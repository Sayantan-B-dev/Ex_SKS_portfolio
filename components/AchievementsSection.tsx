"use client";

import Image from "next/image";
import { useState } from "react";
import VideoModal from "@/components/VideoModal";

type AchievementPanel = {
  src: string;
  className: string;
  alt: string;
  text: [string, string];
  /** Optional press citation rendered under the yellow label. */
  article?: { href: string; headline: string };
};

const PANELS: AchievementPanel[] = [
  {
    src: "/images/achievements/shows_countries.webp",
    className: "p1",
    alt: "Samrat Sarkar SKS Music Band — over 1300 live shows across 40 countries worldwide",
    text: ["OVER 1300 SHOWS", "40 COUNTRIES"],
  },
  {
    src: "/images/achievements/opening_act_bryan_adams2.webp",
    className: "p2",
    alt: "Samrat Sarkar opening act for Bryan Adams at Palace Gardens Bangalore",
    text: ["OPENING ACT", "FOR BRYAN ADAMS"],
    article: {
      href: "https://www.mid-day.com/buzz/article/singer-samrat-sarkar-s-career-is-soaring-high-from-hindi-pop-song-collaboration-with-usha-uthup-to-performing-live-in-40-countries-8452",
      headline:
        "Singer Samrat Sarkar's career is soaring high, from Hindi Pop song collaboration with Usha Uthup to performing live in 40 countries",
    },
  },
  {
    src: "/images/achievements/winner_mirchi_music_flipped.webp",
    className: "p3",
    alt: "Winner of Mirchi Music Awards — Samrat Sarkar SKS Band",
    text: ["WINNER OF", "MIRCHI MUSIC"],
  },
];

export default function AchievementsSection() {
  const [playSharedStageVideo, setPlaySharedStageVideo] = useState(false);

  return (
    <section className="achievements reveal-stagger" id="achievements">
      {PANELS.map((panel, idx) => (
        <div
          className={`ach-panel ${panel.className} reveal-item`}
          key={panel.alt}
          data-parallax="panel"
          style={{ "--i": idx } as React.CSSProperties}
        >
          {/* Clipped 1px inside the panel so the panel's background shows as a
              thin border that follows the trapezoid's diagonal edges. */}
          <div className="ach-media">
            <Image
              src={panel.src}
              alt={panel.alt}
              fill
              loading="lazy"
              sizes="(max-width: 900px) 50vw, 25vw"
              className="img-smooth"
            />
            <div className="ach-overlay" />
          </div>
          <div className="ach-text">
            {panel.text[0]}
            <br />
            {panel.text[1]}
            {panel.article && (
              <a
                className="ach-press"
                href={panel.article.href}
                target="_blank"
                rel="noopener noreferrer"
                title={panel.article.headline}
                aria-label={`Read the full article: ${panel.article.headline}`}
              >
                <span className="ach-press-headline">{panel.article.headline}</span>
                <span className="ach-press-more">Click to see more</span>
              </a>
            )}
          </div>
        </div>
      ))}

      <div
        className="ach-panel p4 reveal-item"
        data-parallax="panel"
        style={{ "--i": PANELS.length } as React.CSSProperties}
      >
        <Image
          src="/images/achievements/shared_stage_crowd.webp"
          alt="Samrat Sarkar shared stage with Amitabh Bachchan, SRK, Salman Khan, Sachin Tendulkar, and Akshay Kumar"
          fill
          loading="lazy"
          sizes="(max-width: 900px) 100vw, 25vw"
          className="img-smooth p4-bg"
        />
        <div className="ach-overlay p4-overlay" />
        <div className="p4-content">
          <h2>SHARED STAGE WITH</h2>
          <p>
            MR. BACHCHAN, SRK,
            <br />
            SALMAN KHAN, SACHIN TENDULKAR,
            <br />
            KAREENA, AKSHAY KUMAR
            <br />
            &amp; OTHER SUPERSTARS
          </p>
          <button
            type="button"
            onClick={() => setPlaySharedStageVideo(true)}
            className="btn-outline p4-watch-link"
          >
            WATCH VIDEO
          </button>
        </div>
      </div>

      {/* Bryan Adams moment : own container so it isn't buried in the p4 list */}
      <div
        className="ach-feature reveal-item"
        style={{ "--i": PANELS.length + 1 } as React.CSSProperties}
      >
        <div className="ach-feature-img">
          <Image
            src="/images/achievements/sharing_stage_with_bryan.webp"
            alt="Samrat Sarkar sharing the stage with Bryan Adams at Palace Grounds, Bangalore"
            fill
            loading="lazy"
            sizes="(max-width: 480px) 100vw, 340px"
            className="img-smooth"
          />
        </div>
        <p className="ach-feature-text">
          He notably performed the{" "}
          <strong>opening act for rock legend Bryan Adams</strong> at Palace
          Grounds, Bangalore.
        </p>
      </div>

      <VideoModal
        isOpen={playSharedStageVideo}
        onClose={() => setPlaySharedStageVideo(false)}
        title="Shared Stage With Superstars : Samrat Sarkar Live"
        videoId="8CZk4NYqApU"
      />
    </section>
  );
}
