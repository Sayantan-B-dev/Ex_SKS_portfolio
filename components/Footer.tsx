import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer-full">
      {/* Background image strip */}
      <div className="footer-img-wrap">
        <Image
          src="/images/smiling_head_tilting_with_mic_stage_lights.webp"
          alt="Samrat smiling on stage"
          fill
          loading="lazy"
          className="footer-bg-img img-smooth"
          sizes="100vw"
        />
        <div className="footer-img-overlay" />
      </div>

      <div className="footer-inner wrap">
        {/* Logo column */}
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <Image
              src="/images/sks_logo_png.webp"
              alt="SKS Official Logo"
              width={60}
              height={60}
              className="footer-sks-logo"
            />
          </div>
          <div className="footer-brand-text">
            {/* <div className="footer-sks">SKS</div> */}
            <div className="footer-tagline">SAMMRAT KA SAAGAR</div>
            <div className="footer-sub2">MUSIC BAND</div>
          </div>
          <p className="footer-bio">
            Playback Singer. Music Director. Live Wire Performer. Performing
            across 40+ countries since 2003.
          </p>
        </div>

        {/* Social icons */}
        <div className="footer-social-col">
          <div className="footer-col-title">FOLLOW</div>
          <div className="footer-social-row">
            <a
              href="https://www.youtube.com/@SammratKaSaagar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="YouTube"
              className="footer-social-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.5.4A3 3 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4a3 3 0 0 0 2.1-2.1C22 15.2 22 12 22 12z" />
                <polygon points="10,9 16,12 10,15" fill="#0a0712" />
              </svg>
              YOUTUBE
            </a>
            <a
              href="https://www.facebook.com/sammratKaSaagar"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="footer-social-btn"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.3c0-.87.24-1.46 1.5-1.46h1.6V4.14C15.8 4.06 14.9 4 13.85 4 11.6 4 10 5.36 10 7.9v2.6H7.5v3H10V21z" />
              </svg>
              FACEBOOK
            </a>
            <a href="#" aria-label="Instagram" className="footer-social-btn">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                <rect x="3" y="3" width="18" height="18" rx="5" />
                <circle cx="12" cy="12" r="4" />
                <circle cx="17.2" cy="6.8" r="1" />
              </svg>
              INSTAGRAM
            </a>
          </div>
        </div>

        {/* Quick links */}
        <div className="footer-links-col">
          <div className="footer-col-title">PAGES</div>
          <nav className="footer-links">
            <Link href="/">Home</Link>
            <Link href="/about">About</Link>
            <Link href="/shows">Shows</Link>
            <Link href="/gallery">Gallery</Link>
            <Link href="/#connect">Contact</Link>
          </nav>
        </div>

        {/* Contact */}
        <div className="footer-contact-col">
          <div className="footer-col-title">CONTACT</div>
          <a className="footer-contact-item" href="mailto:bookings@samratmusic.com">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
              <path d="M2.5 6.5l9.5 7 9.5-7" />
            </svg>
            bookings@samratmusic.com
          </a>
          <a className="footer-contact-item" href="tel:+919876543210">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
              <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.2 2 2 0 0 1 4 1h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7 8.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
            </svg>
            +91 98765 43210
          </a>
        </div>
      </div>

      <div className="footer-bottom">
        <div className="wrap">
          © {new Date().getFullYear()} Sammrat Ka Saagar Music Band. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
