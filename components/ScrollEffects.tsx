"use client";

import { useEffect } from "react";

export default function ScrollEffects() {
  useEffect(() => {
    // Check reduced motion preference
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // 1. Intersection Observer for Smooth Fade-In and Reveal on Scroll
    const revealElements = document.querySelectorAll(
      ".reveal-up, .reveal-fade, .reveal-stagger"
    );

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    // 2. Parallax Controller (requestAnimationFrame + passive scroll)
    if (!prefersReducedMotion) {
      let ticking = false;
      const heroBg = document.querySelector<HTMLElement>("[data-parallax='hero-bg']");
      const heroBadge = document.querySelector<HTMLElement>("[data-parallax='hero-badge']");
      const connectImg = document.querySelector<HTMLElement>("[data-parallax='connect-img']");
      const achPanels = document.querySelectorAll<HTMLElement>("[data-parallax='panel']");

      const updateParallax = () => {
        const scrollY = window.scrollY;

        // Hero background & badge parallax
        if (heroBg && scrollY <= 850) {
          const heroOffset = scrollY * 0.35;
          heroBg.style.transform = `translate3d(0, ${heroOffset.toFixed(1)}px, 0) scale(1.06)`;
        }

        if (heroBadge && scrollY <= 850) {
          const badgeOffset = scrollY * -0.15;
          heroBadge.style.transform = `translate3d(0, ${badgeOffset.toFixed(1)}px, 0) rotate(-4deg)`;
        }

        // Connect section portrait subtle parallax
        if (connectImg) {
          const rect = connectImg.getBoundingClientRect();
          const viewHeight = window.innerHeight;
          if (rect.top < viewHeight && rect.bottom > 0) {
            const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
            const offset = (progress - 0.5) * 28;
            connectImg.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
          }
        }

        // Achievement panels subtle multi-layer parallax
        achPanels.forEach((panel, idx) => {
          const rect = panel.getBoundingClientRect();
          const viewHeight = window.innerHeight;
          if (rect.top < viewHeight && rect.bottom > 0) {
            const progress = (viewHeight - rect.top) / (viewHeight + rect.height);
            const factor = (idx % 2 === 0 ? 1 : -1) * 18;
            const offset = (progress - 0.5) * factor;
            const img = panel.querySelector<HTMLElement>("img");
            if (img) {
              img.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0) scale(1.08)`;
            }
          }
        });

        ticking = false;
      };

      const onScroll = () => {
        if (!ticking) {
          window.requestAnimationFrame(updateParallax);
          ticking = true;
        }
      };

      window.addEventListener("scroll", onScroll, { passive: true });
      updateParallax();

      return () => {
        observer.disconnect();
        window.removeEventListener("scroll", onScroll);
      };
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return null;
}
