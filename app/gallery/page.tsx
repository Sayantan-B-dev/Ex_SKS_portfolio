"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import LoadingOverlay from "@/components/LoadingOverlay";

const GALLERY_ITEMS = [
  {
    src: "/images/hero_samrat_live.webp",
    title: "Global Arena Live in Blue Suit",
    category: "Concerts",
    span: "col-span-2",
  },
  {
    src: "/images/singing_on_stage_background_fire.webp",
    title: "Pyrotechnics & High-Octane Vocals",
    category: "Concerts",
    span: "col-span-1",
  },
  {
    src: "/images/posing_on_stage_after_singing_background_crowd_with_flashlight.webp",
    title: "30,000+ Flashlight Stadium Moment",
    category: "Crowd",
    span: "col-span-1",
  },
  {
    src: "/images/smiling_head_tilting_with_mic_stage_lights.webp",
    title: "Intimate Soulful Melody Session",
    category: "Portraits",
    span: "col-span-2",
  },
  {
    src: "/images/achievements/opening_act_bryan_adams.webp",
    title: "Opening Act for Bryan Adams, Bangalore",
    category: "Concerts",
    span: "col-span-1",
  },
  {
    src: "/images/achievements/shows_countries.webp",
    title: "Live Stage Command in Yellow Jacket",
    category: "Concerts",
    span: "col-span-1",
  },
  {
    src: "/images/achievements/winner_mirchi_music.webp",
    title: "Winner of Mirchi Music Awards",
    category: "Awards",
    span: "col-span-1",
  },
  {
    src: "/images/achievements/shared_stage_crowd.webp",
    title: "Celebrity Gala Mega Crowd",
    category: "Crowd",
    span: "col-span-2",
  },
];

const CATEGORIES = ["ALL", "Concerts", "Crowd", "Portraits", "Awards"];

export default function GalleryPage() {
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
      ? GALLERY_ITEMS
      : GALLERY_ITEMS.filter((item) => item.category === activeCategory);

  return (
    <>
      <ScrollEffects />
      <Header />
      <main className="page-main">
        {/* Page Hero */}
        <section className="subpage-hero">
          <div className="subpage-hero-bg">
            <Image
              src="/images/hero_samrat_live.webp"
              alt="Samrat Sarkar live concert crowd with stage lights — SKS Music Band photo and stage gallery"
              fill
              priority
              loading="eager"
              sizes="100vw"
              className="subpage-hero-img"
            />
            <div className="subpage-hero-overlay" />
          </div>
          <div className="wrap subpage-hero-content reveal-up">
            <p className="subpage-tag">VISUAL ARCHIVES</p>
              <h1 className="subpage-title">
                PHOTO AND STAGE GALLERY
              </h1>
            <p className="subpage-subtitle">
              Live Concerts • Stadium Lights • Award Ceremonies • Album Artwork
            </p>
          </div>
        </section>

        {/* Gallery Filter & Grid */}
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
                  sizes="(max-width: 768px) 100vw, 33vw"
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
        </section>

        {/* Lightbox Modal */}
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
                  sizes="90vw"
                />
              </div>
              <div className="lightbox-caption">{activeImage.title}</div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
