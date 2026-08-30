"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "HOME" },
  { href: "/about", label: "ABOUT" },
  { href: "/#songs", label: "MUSIC" },
  { href: "/shows", label: "SHOWS" },
  { href: "/#achievements", label: "ACHIEVEMENTS" },
  { href: "/gallery", label: "GALLERY" },
  { href: "/blog", label: "JOURNAL" },
  { href: "/#connect", label: "CONTACT" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  const isItemActive = (href: string) => {
    if (href === "/" && pathname === "/") return true;
    if (href !== "/" && !href.startsWith("/#") && pathname === href) return true;
    return false;
  };

  return (
    <header>
      <div className="header-inner wrap">
        <Link href="/" className="logo-brand">
          <div className="logo-img-wrap">
            <Image
              src="/images/sks_logo_png.webp"
              alt="SKS Sammrat Ka Saagar Official Logo"
              width={54}
              height={54}
              className="sks-official-logo"
              priority
            />
          </div>
          <div className="logo-text-block">
            {/* <div className="sks">SKS</div> */}
            <div className="sub1">SAMMRAT KA SAAGAR</div>
            <div className="sub2">MUSIC BAND</div>
          </div>
        </Link>

        <nav>
          <ul>
            {NAV_ITEMS.map((item) => {
              const active = isItemActive(item.href);
              return (
                <li key={item.href}>
                  <Link href={item.href} className={active ? "active" : ""}>
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="header-right">
          <Link href="/#connect" className="btn-book">
            BOOK NOW
          </Link>
          <button
            type="button"
            className="burger"
            aria-label="Toggle menu"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </div>

      <div id="mobile-nav" className={`mobile-nav${open ? " open" : ""}`}>
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={isItemActive(item.href) ? "active" : ""}
            onClick={() => setOpen(false)}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
