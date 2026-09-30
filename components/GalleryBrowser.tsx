"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

import LoadingOverlay from "@/components/LoadingOverlay";

export type GalleryItem = {
  src: string;
  title: string;
  category: string;
  span: string;
};

const CATEGORIES = ["ALL", "Concerts", "Crowd", "Portraits", "Awards"];

/**
 * The gallery's filters, grid, and lightbox. Photos the studio added are passed
 * in alongside the built-in ones and behave identically : same card, same
 * filter tabs, same click-to-open lightbox.
 */
export default function GalleryBrowser({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [activeImage, setActiveImage] = useState<{ src: string; title: string } | null>(null);
  // Spinner shows until the open image reports loaded — derived, no effect.
  const [loadedSrc, setLoadedSrc] = useState<string | null>(null);
  const lightboxLoading = !!activeImage && loadedSrc !== activeImage.src;

  const openImage = (item: { src: string; title: string }) => {
    setLoadedSrc(null);
    setActiveImage(item);
  };
  const closeImage = () => {
    setLoadedSrc(null);
    setActiveImage(null);
  };

  const filteredItems =
    activeCategory === "ALL"
      ? items
      : items.filter((item) => item.category === activeCategory);

  return (
    <section className="gallery-section wrap">
      <div className="gallery-filter-tabs reveal-up">
        {CATEGORIES.map((cat) => (
          <button
            type="button"
            key={cat}
            className={`gallery-tab-btn ${activeCategory === cat ? "active" : ""}`}
            onClick={() => setActiveCategory(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="gallery-masonry-grid reveal-stagger">
        {filteredItems.map((item, idx) => (
          <div
            className={`gallery-card reveal-item ${item.span}`}
            key={`${item.title}-${idx}`}
            style={{ "--i": idx % 6 } as React.CSSProperties}
            onClick={() => openImage({ src: item.src, title: item.title })}
          >
            <Image
              src={item.src}
              alt={item.title}
              fill
              loading="lazy"
              sizes="100vw"
              className="img-smooth"
            />
            <div className="gallery-card-overlay">
              <span className="gallery-card-cat">{item.category}</span>
              <h3 className="gallery-card-title">{item.title}</h3>
              <span className="gallery-zoom-icon">🔍 VIEW FULL</span>
            </div>
          </div>
        ))}
      </div>

      <div className="gallery-cta-row reveal-up">
        <Link href="/#connect" className="btn-yellow">
          BOOK SAMRAT AND THE BAND
        </Link>
      </div>

      {activeImage && (
        <div
          className="video-modal-backdrop"
          onClick={() => closeImage()}
          role="dialog"
          aria-modal="true"
        >
          <div
            className="lightbox-modal-content"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="video-modal-close"
              onClick={() => closeImage()}
              aria-label="Close image"
            >
              ✕
            </button>
            <div className="lightbox-img-wrap">
              {lightboxLoading && <LoadingOverlay label={`Loading ${activeImage.title}`} />}
              <Image
                src={activeImage.src}
                alt={activeImage.title}
                fill
                onLoad={() => setLoadedSrc(activeImage.src)}
                className="lightbox-img"
                sizes="100vw"
              />
            </div>
            <div className="lightbox-caption">{activeImage.title}</div>
          </div>
        </div>
      )}
    </section>
  );
}
