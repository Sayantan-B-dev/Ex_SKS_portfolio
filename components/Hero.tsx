import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero" id="home">
      <div className="hero-img-wrap">
        <Image
          src="https://picsum.photos/seed/sksstage9/900/900"
          alt="Samrat performing live"
          fill
          priority
          sizes="100vw"
        />
      </div>
      <div className="hero-duo" />

      <div className="hero-content wrap">
        <div className="hero-line1">LIVE. LOVE. MUSIC.</div>
        <div className="hero-line2">
          OVER 1300 SHOWS
          <br />
          40 COUNTRIES
        </div>
        <p className="hero-sub">
          <b>Playback Singer • Music Director • Live Wire Performer</b>
          <br />
          From chartbuster singles to global stages, Samrat brings soul-stirring
          music to life.
        </p>
        <div className="hero-btns">
          <a
            href="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-yellow"
          >
            WATCH VIDEO
            <span className="play-dot">
              <svg width="9" height="9" viewBox="0 0 10 10" fill="currentColor">
                <polygon points="1,0 10,5 1,10" fill="#f5c518" />
              </svg>
            </span>
          </a>
          <a href="#connect" className="btn-outline">
            BOOK SAMRAT &amp; THE BAND
          </a>
        </div>
      </div>

      <div className="badge">
        WINNER OF
        <br />
        MIRCHI MUSIC
      </div>
    </section>
  );
}
