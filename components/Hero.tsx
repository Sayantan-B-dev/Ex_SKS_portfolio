"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import VideoModal from "@/components/VideoModal";

export default function Hero() {
  const [playHeroVideo, setPlayHeroVideo] = useState(false);

  return (
    <section className="hero" id="home">
        <div className="hero-img-wrap" data-parallax="hero-bg">
        <Image
          src="/images/singing_on_stage_background_fire.webp"
          alt="Samrat performing live on stage with fire"
          fill
          priority
          quality={100}
          sizes="100vw"
        />
      </div>
      <div className="hero-duo" />

      {/* Left-anchored content — no max-width centering */}
      <div className="hero-content reveal-up">
        <p className="hero-line1">LIVE. LOVE. MUSIC.</p>
        <h1 className="hero-line2">
          OVER 1300 SHOWS
          <br />
          40 COUNTRIES
        </h1>
        <p className="hero-sub">
          <b>Playback Singer • Music Director • Live Wire Performer</b>
          <br />
          From chartbuster singles to global stages, Samrat brings soul-stirring
          music to life.
        </p>
        <div className="hero-btns">
          <button
            type="button"
            onClick={() => setPlayHeroVideo(true)}
            className="btn-yellow"
            aria-label="Watch video"
          >
            WATCH VIDEO
            <span className="play-dot" aria-hidden="true">
              <svg width="10" height="10" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="1,0 10,5 1,10" fill="#f5c518" />
              </svg>
            </span>
          </button>
          <Link href="/#connect" className="btn-outline">
            BOOK SAMRAT &amp; THE BAND
          </Link>
        </div>
      </div>
      <div className="badge" data-parallax="hero-badge">
        WINNER OF
        <br />
        MIRCHI MUSIC
      </div>

      <VideoModal
        isOpen={playHeroVideo}
        onClose={() => setPlayHeroVideo(false)}
        title="Aao Huzoor — Samrat Sarkar Live"
        videoId="CdQI-Q0ROVg"
      />
    </section>
  );
}
