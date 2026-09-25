"use client";

import Image from "next/image";
import { useRef } from "react";

const HIGHLIGHTS = [
  "Playback Singer",
  "Music Director (Film/OTTs)",
  "Live Wire Performer",
  "5 to 16 member Band",
  "Concerts, Corporate Meets, Weddings, Sangeet, Barat, Gala Birthday Bash",
];

const Star = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.9l-6.18 3.12L7 13.14 2 8.27l6.91-1.01z" />
  </svg>
);

export default function ConnectSection() {
  const magnetRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useRef<boolean | null>(null);

  // Magnet drift : the fixed container never moves (overflow hidden clips),
  // the overscanned image inside leans toward the cursor and springs back.
  const onMagnetMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const layer = magnetRef.current;
    if (!layer) return;
    if (reduceMotion.current === null) {
      reduceMotion.current = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
    }
    if (reduceMotion.current) return;
    const box = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - box.left) / box.width - 0.5;
    const y = (e.clientY - box.top) / box.height - 0.5;
    // Subtle : a few px of lean is felt without ever looking off-center.
    const shift = 7;
    layer.style.transform = `translate3d(${(x * 2 * shift).toFixed(1)}px, ${(y * 2 * shift).toFixed(1)}px, 0)`;
  };
  const onMagnetLeave = () => {
    magnetRef.current?.style.setProperty("transform", "translate3d(0, 0, 0)");
  };

  return (
    <section className="connect wrap" id="connect">
      <div className="connect-left reveal-up">
        <h2>
          CONNECT WITH
          <br />
          SAMRAT &amp;
          <br />
          THE BAND
        </h2>
        <ul>
          {HIGHLIGHTS.map((item) => (
            <li key={item}>
              <Star /> {item}
            </li>
          ))}
        </ul>
      </div>

      <div
        className="connect-photo reveal-up"
        data-parallax="connect-img"
        onMouseMove={onMagnetMove}
        onMouseLeave={onMagnetLeave}
      >
        <div className="connect-magnet" ref={magnetRef}>
          <Image
            src="/images/posing_on_stage_after_singing_background_crowd_with_flashlight.webp"
            alt="Samrat Sarkar posing on stage after live performance with crowd — book SKS Music Band for events"
            fill
            loading="lazy"
            quality={100}
            sizes="(max-width: 900px) 100vw, 100vw"
            className="img-smooth"
          />
        </div>
      </div>

      <div className="connect-right reveal-up">
        <div className="cr-item">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path d="M9 18V5l12-2v13" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
          <p>
            Sometimes with a 16 member band, sometimes with 48 dancers, &amp; at
            times collaborating with various artists from various parts of the
            world.
          </p>
        </div>
        <div className="cr-item">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
            <circle cx="12" cy="12" r="9.5" />
            <path d="M2.5 12h19M12 2.5c2.6 2.6 4 6 4 9.5s-1.4 6.9-4 9.5c-2.6-2.6-4-6-4-9.5s1.4-6.9 4-9.5z" />
          </svg>
          <p>Connect with us to know more.</p>
        </div>
        <a href="mailto:Samratkasagar@gmail.com" className="btn-getintouch">
          GET IN TOUCH
        </a>
      </div>
    </section>
  );
}
