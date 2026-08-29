"use client";

import { useState } from "react";
import Image from "next/image";
import VideoModal from "@/components/VideoModal";

const SONGS = [
  {
    title: "AAO HUZOOR",
    videoId: "CdQI-Q0ROVg",
  },
  {
    title: "MERE SUKH BHI TERE NAIN",
    videoId: "TymQvultiAw",
  },
  {
    title: "TUM ITNI KHOOBSURAT HO",
    videoId: "C-DQBUY0VQc",
  },
  {
    title: "BICHDE",
    videoId: "dbILxBMJaAM",
  },
  {
    title: "DIL DI DHADKAN",
    videoId: "lNtUVYC1uc0",
  },
  {
    title: "MAJHI RE MAJHI",
    videoId: "1WxZcbJaOHQ",
  },
  {
    title: "LINES",
    videoId: "EovwiZ1tp7I",
  },
];

function youtubeThumb(videoId: string) {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
}

function SongCard({
  song,
  onClick,
  prefix,
}: {
  song: (typeof SONGS)[number];
  onClick: () => void;
  prefix: string;
}) {
  return (
    <button
      type="button"
      className="song-card"
      key={`${prefix}-${song.title}`}
      onClick={onClick}
      aria-label={`Play ${song.title} video`}
    >
      <div className="song-img-wrapper">
        <Image
          src={youtubeThumb(song.videoId)}
          alt={song.title}
          fill
          loading="lazy"
          quality={100}
          sizes="280px"
          className="img-smooth"
        />
        <div className="song-play-overlay">
          <span className="song-play-icon" aria-hidden="true">
            <svg width="18" height="18" viewBox="0 0 10 10" fill="currentColor">
              <polygon points="1,0 10,5 1,10" fill="#0a0712" />
            </svg>
          </span>
          <span className="song-play-text">PLAY VIDEO</span>
        </div>
      </div>
      <div className="song-title">{song.title}</div>
    </button>
  );
}

export default function SongsSection() {
  const [activeVideo, setActiveVideo] = useState<{
    title: string;
    videoId: string;
  } | null>(null);

  return (
    <section className="songs" id="songs">
      <div className="songs-header reveal-up">
        <h2 className="sec-heading">SONGS THAT TOUCH HEARTS</h2>
        <div className="sec-underline" />
      </div>

      <div className="song-marquee-container">
        <div className="song-marquee-track">
          {/* First group — visible, interactive */}
          <div className="song-marquee-group">
            {SONGS.map((song, idx) => (
              <SongCard
                key={`first-${idx}`}
                song={song}
                prefix="first"
                onClick={() =>
                  setActiveVideo({
                    title: song.title,
                    videoId: song.videoId,
                  })
                }
              />
            ))}
          </div>

          {/* Second group — aria-hidden duplicate for seamless loop */}
          <div className="song-marquee-group" aria-hidden="true">
            {SONGS.map((song, idx) => (
              <SongCard
                key={`second-${idx}`}
                song={song}
                prefix="second"
                onClick={() =>
                  setActiveVideo({
                    title: song.title,
                    videoId: song.videoId,
                  })
                }
              />
            ))}
          </div>
        </div>
      </div>

      <div className="songs-footer reveal-up">
        <a
          href="https://www.youtube.com/@SammratKaSaagar"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline-pink btn-large"
        >
          EXPLORE ALL SONGS
        </a>
      </div>

      {activeVideo && (
        <VideoModal
          isOpen={!!activeVideo}
          onClose={() => setActiveVideo(null)}
          title={activeVideo.title}
          videoId={activeVideo.videoId}
        />
      )}
    </section>
  );
}
