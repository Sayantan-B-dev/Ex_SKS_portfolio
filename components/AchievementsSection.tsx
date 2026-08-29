import Image from "next/image";

const PANELS = [
  { seed: "ach1", className: "p1", alt: "Over 1300 shows", text: ["OVER 1300 SHOWS", "40 COUNTRIES"] },
  { seed: "ach2", className: "p2", alt: "Opening act for Bryan Adams", text: ["OPENING ACT", "FOR BRYAN ADAMS"] },
  { seed: "ach3", className: "p3", alt: "Winner of Mirchi Music", text: ["WINNER OF", "MIRCHI MUSIC"] },
];

export default function AchievementsSection() {
  return (
    <section className="achievements" id="achievements">
      {PANELS.map((panel) => (
        <div className={`ach-panel ${panel.className}`} key={panel.seed}>
          <Image
            src={`https://picsum.photos/seed/${panel.seed}/500/600`}
            alt={panel.alt}
            fill
            sizes="25vw"
          />
          <div className="ach-overlay" />
          <div className="ach-text">
            {panel.text[0]}
            <br />
            {panel.text[1]}
          </div>
        </div>
      ))}

      <div className="p4">
        <h4>SHARED STAGE WITH</h4>
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
    </section>
  );
}
