import Image from "next/image";

const PANELS = [
  {
    src: "/images/achievements/shows_countries.webp",
    className: "p1",
    alt: "Over 1300 shows across 40 countries",
    text: ["OVER 1300 SHOWS", "40 COUNTRIES"],
  },
  {
    src: "/images/achievements/opening_act_bryan_adams.webp",
    className: "p2",
    alt: "Opening act for Bryan Adams",
    text: ["OPENING ACT", "FOR BRYAN ADAMS"],
  },
  {
    src: "/images/achievements/winner_mirchi_music.webp",
    className: "p3",
    alt: "Winner of Mirchi Music",
    text: ["WINNER OF", "MIRCHI MUSIC"],
  },
];

export default function AchievementsSection() {
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
          alt="Shared stage with superstars"
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
        </div>
      </div>
    </section>
  );
}
