export default function Footer() {
  return (
    <footer>
      <div className="social-icons">
        <a href="#" aria-label="Facebook">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13.5 21v-7.5h2.5l.5-3h-3V8.3c0-.87.24-1.46 1.5-1.46h1.6V4.14C15.8 4.06 14.9 4 13.85 4 11.6 4 10 5.36 10 7.9v2.6H7.5v3H10V21z" />
          </svg>
        </a>
        <a href="#" aria-label="Instagram">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="3" y="3" width="18" height="18" rx="5" />
            <circle cx="12" cy="12" r="4" />
            <circle cx="17.2" cy="6.8" r="1" />
          </svg>
        </a>
        <a href="#" aria-label="YouTube">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
            <path d="M22 12s0-3.2-.4-4.7a3 3 0 0 0-2.1-2.1C17.9 4.8 12 4.8 12 4.8s-5.9 0-7.5.4A3 3 0 0 0 2.4 7.3C2 8.8 2 12 2 12s0 3.2.4 4.7a3 3 0 0 0 2.1 2.1c1.6.4 7.5.4 7.5.4s5.9 0 7.5-.4a3 3 0 0 0 2.1-2.1C22 15.2 22 12 22 12z" />
            <polygon points="10,9 16,12 10,15" fill="#0a0712" />
          </svg>
        </a>
      </div>

      <div className="foot-div" />

      <a className="foot-contact" href="mailto:bookings@samratmusic.com">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
          <path d="M2.5 6.5l9.5 7 9.5-7" />
        </svg>
        bookings@samratmusic.com
      </a>

      <div className="foot-div" />

      <a className="foot-contact" href="tel:+919876543210">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
          <path d="M22 16.9v2a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 3.2 2 2 0 0 1 4 1h2a2 2 0 0 1 2 1.7c.1.9.3 1.8.6 2.7a2 2 0 0 1-.5 2.1L7 8.6a16 16 0 0 0 6 6l1.1-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.5 2.7.6a2 2 0 0 1 1.7 2z" />
        </svg>
        +91 98765 43210
      </a>
    </footer>
  );
}
