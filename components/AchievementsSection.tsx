"use client";

import Image from "next/image";
import { useState } from "react";
import VideoModal from "@/components/VideoModal";

type AchievementPanel = {
  src: string;
  pos: "p1" | "p2" | "p3" | "p4";
  alt: string;
  eyebrow: string;
  lines: string[];
  body: React.ReactNode;
  cue: string;
  /** Optional press link rendered as the panel cue. */
  article?: { href: string; title: string };
};

const MID_DAY_URL =
  "https://www.mid-day.com/buzz/article/singer-samrat-sarkar-s-career-is-soaring-high-from-hindi-pop-song-collaboration-with-usha-uthup-to-performing-live-in-40-countries-8452";

const PANELS: AchievementPanel[] = [
  {
    src: "/images/achievements/shows_countries.webp",
    pos: "p1",
    alt: "Samrat Sarkar SKS Music Band — over 1300 live shows across 40 countries worldwide",
    eyebrow: "01 · Live Career",
    lines: ["OVER 1300 SHOWS", "40 COUNTRIES"],
    body: "More than 1,300 live shows across 40 countries, building an international performance career.",
    cue: "Live Performer",
  },
  {
    src: "/images/achievements/opening_act_bryan_adams2.webp",
    pos: "p2",
    alt: "Samrat Sarkar career soaring high — Hindi pop collaboration with Usha Uthup, live in 40 countries",
    eyebrow: "02 · Career Milestone",
    lines: ["FROM", "USHA UTHUP", "TO 40 COUNTRIES"],
    body: "Singer Samrat Sarkar's career is soaring high, from Hindi pop song collaboration with Usha Uthup to performing live in 40 countries.",
    cue: "Click to see more",
    article: {
      href: MID_DAY_URL,
      title:
        "Singer Samrat Sarkar's career is soaring high, from Hindi Pop song collaboration with Usha Uthup to performing live in 40 countries",
    },
  },
  {
    src: "/images/achievements/winner_mirchi_music_flipped.webp",
    pos: "p3",
    alt: "Winner of Mirchi Music Awards — Samrat Sarkar SKS Band",
    eyebrow: "03 · Recognition",
    lines: ["WINNER OF", "MIRCHI", "MUSIC"],
    body: "Recognised as a winner at the Mirchi Music Awards.",
    cue: "Award Recognition",
  },
  {
    src: "/images/achievements/sharing_stage_with_bryan.webp",
    pos: "p4",
    alt: "Samrat Sarkar sharing the stage with Bryan Adams at Palace Grounds, Bangalore",
    eyebrow: "04 · Major Performance",
    lines: ["OPENING ACT", "FOR BRYAN", "ADAMS"],
    body: (
      <>
        He notably performed the{" "}
        <strong>opening act for rock legend Bryan Adams</strong> at Palace
        Grounds, Bangalore.
      </>
    ),
    cue: "Palace Grounds · Bangalore",
  },
];

export default function AchievementsSection() {
  const [playSharedStageVideo, setPlaySharedStageVideo] = useState(false);

  return (
    <section className="achievements reveal-stagger" id="achievements">
      <div className="ach-layout">
        {/* Shared-stage strip : full width on top of the 2x2 grid */}
        <div className="ach-wide reveal-item" style={{ "--i": 0 } as React.CSSProperties}>
          <div className="ach-wide-photo" aria-hidden="true">
            <div className="ach-zoom">
              <Image
                src="/images/achievements/shared_stage_crowd.webp"
                alt=""
                fill
                loading="lazy"
                sizes="100vw"
                className="img-smooth"
              />
              <div className="ach-overlay" />
            </div>
          </div>
          <div className="ach-wide-inner">
            <div className="ach-wide-copy">
              <span className="ach-wide-title">SHARED STAGE WITH</span>
              <span className="ach-wide-names">
                MR. BACHCHAN, SRK, SALMAN KHAN, SACHIN TENDULKAR, KAREENA,
                AKSHAY KUMAR &amp; OTHER SUPERSTARS
              </span>
            </div>
            <button
              type="button"
              onClick={() => setPlaySharedStageVideo(true)}
              className="btn-outline ach-wide-watch"
            >
              WATCH VIDEO
            </button>
          </div>
        </div>

        {PANELS.map((panel, idx) => (
          <div
            className={`ach-panel ${panel.pos} reveal-item`}
            key={panel.eyebrow}
            data-parallax="panel"
            style={{ "--i": idx + 1 } as React.CSSProperties}
          >
            <div className="ach-media">
              <div className="ach-zoom">
                <Image
                  src={panel.src}
                  alt={panel.alt}
                  fill
                  loading="lazy"
                  sizes="(max-width: 480px) 100vw, 50vw"
                  className="img-smooth"
                />
                <div className="ach-overlay" />
              </div>
            </div>
            <span className="ach-eyebrow">{panel.eyebrow}</span>
            <div className="ach-text">
              <span className="ach-heading">
                {panel.lines.map((line, i) => (
                  <span key={line}>
                    {i > 0 && <br />}
                    {line}
                  </span>
                ))}
              </span>
              <span className="ach-body">
                {panel.article && (
                  <Image
                    src="/logos/middaylogo.webp"
                    alt="Mid-day"
                    width={112}
                    height={30}
                    loading="lazy"
                    className="ach-press-logo-side"
                  />
                )}
                {panel.body}
              </span>
              {panel.article ? (
                <a
                  className="ach-cue"
                  href={panel.article.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={panel.article.title}
                  aria-label={`Read the full article: ${panel.article.title}`}
                >
                  <span>{panel.cue}</span>
                </a>
              ) : (
                <span className="ach-cue">{panel.cue}</span>
              )}
            </div>
          </div>
        ))}
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
