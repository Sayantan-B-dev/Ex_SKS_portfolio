"use client";

import { useState } from "react";

const NAV_ITEMS = [
  { href: "#home", label: "HOME", active: true },
  { href: "#about", label: "ABOUT" },
  { href: "#songs", label: "MUSIC" },
  { href: "#shows", label: "SHOWS" },
  { href: "#achievements", label: "ACHIEVEMENTS" },
  { href: "#gallery", label: "GALLERY" },
  { href: "#connect", label: "CONTACT" },
];

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header>
      <div className="header-inner wrap">
        <div className="logo">
          <div className="sks">SKS</div>
          <div className="sub1">SAMMRAT KA SAAGAR</div>
          <div className="sub2">MUSIC BAND</div>
        </div>

        <nav>
          <ul>
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <a href={item.href} className={item.active ? "active" : ""}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="header-right">
          <a href="#connect" className="btn-book">
            BOOK NOW
          </a>
          <button
            type="button"
            className="burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div className={`mobile-nav${open ? " open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <a
            key={item.href}
            href={item.href}
            className={item.active ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </a>
        ))}
      </div>
    </header>
  );
}
