import Image from "next/image";

const HIGHLIGHTS = [
  "Playback Singer",
  "Music Director (Film/OTTs)",
  "Live Wire Performer",
  "5–16 member Band",
  "Concerts, Corporate Meets, Weddings, Sangeet, Barat, Gala Birthday Bash",
];

const Star = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
    <path d="M12 1l3.09 6.26L22 8.27l-5 4.87 1.18 6.88L12 16.9l-6.18 3.12L7 13.14 2 8.27l6.91-1.01z" />
  </svg>
);

export default function ConnectSection() {
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

      <div className="connect-img reveal-up" data-parallax="connect-img">
        <Image
          src="/images/posing_on_stage_after_singing_background_crowd_with_flashlight.webp"
          alt="Samrat posing on stage after performance with crowd"
          fill
          loading="lazy"
          sizes="(max-width: 768px) 100vw, 33vw"
          className="img-smooth"
          style={{ objectPosition: "50% 20%" }}
        />
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
        <a href="mailto:bookings@samratmusic.com" className="btn-getintouch">
          GET IN TOUCH
        </a>
      </div>
    </section>
  );
}
