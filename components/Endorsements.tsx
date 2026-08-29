"use client";

import Image from "next/image";
import SpotlightCard from "@/components/reactbits/SpotlightCard";

const ENDORSEMENTS = [
  {
    name: "SAMSON",
    src: "/logos/samson_logo_transparent.webp",
    alt: "Samson Audio",
    spotlight: "rgba(47, 124, 246, 0.25)",
  },
  {
    name: "ROLAND",
    src: "/logos/roland_logo_transparent.webp",
    alt: "Roland Musical Instruments",
    spotlight: "rgba(255, 106, 26, 0.25)",
  },
  {
    name: "POWERMAX",
    src: "/logos/powermax_logo.webp",
    alt: "Powermax Fitness",
    spotlight: "rgba(111, 123, 216, 0.25)",
  },
  {
    name: "SHURE",
    src: "/logos/shure_logo.webp",
    alt: "Shure Microphones",
    spotlight: "rgba(141, 226, 58, 0.25)",
  },
];

export default function Endorsements() {
  return (
    <section className="endorse">
      <div className="wrap">
        <h2 className="reveal-up">DONE ENDORSEMENTS FOR</h2>
        <div className="logo-row reveal-stagger">
          {ENDORSEMENTS.map((item, idx) => (
            <div
              className="reveal-item"
              key={item.name}
              style={{ "--i": idx } as React.CSSProperties}
            >
              <SpotlightCard
                className="logo-card"
                spotlightColor={item.spotlight}
              >
                <div className="logo-img-wrapper">
                  <Image
                    src={item.src}
                    alt={item.alt}
                    fill
                    loading="lazy"
                    className="endorse-logo-img"
                    sizes="200px"
                  />
                </div>
              </SpotlightCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
