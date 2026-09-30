import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollEffects from "@/components/ScrollEffects";
import GalleryBrowser, { type GalleryItem } from "@/components/GalleryBrowser";
import { getGalleryImages, isGalleryConfigured } from "@/lib/blog";

// New photos added in the studio must show up without a rebuild.
export const dynamic = "force-dynamic";

/** The page's built-in photos : the composition the design was built around. */
const GALLERY_ITEMS: GalleryItem[] = [
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
    src: "/images/achievements/opening_act_bryan_adams2.webp",
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
    src: "/images/achievements/winner_mirchi_music_flipped.webp",
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

export default async function GalleryPage() {
  const photos = isGalleryConfigured() ? await getGalleryImages() : [];
  // Studio photos follow the built-in ones so the designed composition stays
  // intact; every fifth one spans two columns to keep the masonry rhythm.
  const managedItems: GalleryItem[] = photos.map((photo, index) => ({
    src: photo.url,
    title: photo.title,
    category: photo.category,
    span: index % 5 === 0 ? "col-span-2" : "col-span-1",
  }));

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
              quality={100}
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

        <GalleryBrowser items={[...GALLERY_ITEMS, ...managedItems]} />
      </main>
      <Footer />
    </>
  );
}
