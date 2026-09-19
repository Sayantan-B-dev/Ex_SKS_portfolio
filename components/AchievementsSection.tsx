"use client";

import Image from "next/image";
import { useState } from "react";
import VideoModal from "@/components/VideoModal";

const PANELS = [
  {
    src: "/images/achievements/shows_countries.webp",
    className: "p1",
    alt: "Samrat Sarkar SKS Music Band — over 1300 live shows across 40 countries worldwide",
    text: ["OVER 1300 SHOWS", "40 COUNTRIES"],
  },
  {
    src: "/images/achievements/opening_act_bryan_adams.webp",
    className: "p2",
    alt: "Samrat Sarkar opening act for Bryan Adams at Palace Gardens Bangalore",
    text: ["OPENING ACT", "FOR BRYAN ADAMS"],
  },
  {
    src: "/images/achievements/winner_mirchi_music.webp",
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
          <Image
            src={panel.src}
            alt={panel.alt}
            fill
            loading="lazy"
            sizes="(max-width: 900px) 50vw, 25vw"
            className="img-smooth"
          />
          <div className="ach-overlay" />
          <div className="ach-text">
            {panel.text[0]}
            <br />
            {panel.text[1]}
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

      <VideoModal
        isOpen={playSharedStageVideo}
        onClose={() => setPlaySharedStageVideo(false)}
        title="Shared Stage With Superstars : Samrat Sarkar Live"
        videoId="8CZk4NYqApU"
      />
    </section>
  );
}
