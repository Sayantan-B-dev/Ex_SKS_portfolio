import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE_URL } from "@/lib/site";
import {
  type BlogPost,
  getPublishedPosts,
  isBlogConfigured,
} from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Blog : Notes From The Road",
  description:
    "Stories, studio moments, and tour diaries from Samrat Sarkar and the SKS live band. Concert notes and soundtracked memories from 40 plus countries.",
  keywords: [
    "Samrat Sarkar blog",
    "SKS band stories",
    "tour diary",
    "studio moments",
    "live band India",
    "Samrat Sarkar tour diary",
    "SKS music band blog",
    "Bollywood singer blog",
    "Indian musician blog",
    "concert stories India",
    "live music stories",
    "backstage stories India",
    "Bollywood band diary",
    "Indian live band stories",
    "music tour blog India",
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: "SKS : Samrat Sarkar Music Band",
    title: "Blog : Notes From The Road | SKS Music Band",
    description:
      "Stories, studio moments, and tour diaries from Samrat Sarkar and the SKS live band.",
    url: `${SITE_URL}/blog`,
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog : Notes From The Road | SKS Music Band",
    description:
      "Stories, studio moments, and tour diaries from Samrat Sarkar and the SKS live band.",
  },
  alternates: {
    canonical: `${SITE_URL}/blog`,
  },
};

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  if (isBlogConfigured()) {
    posts = await getPublishedPosts();
  }
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Blog",
        item: `${SITE_URL}/blog`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <Header />
      <main className="blog-page">
        <section className="blog-hero">
          <p className="subpage-tag">THE SKS BLOG</p>
          <h1>NOTES FROM THE ROAD</h1>
          <p>Stories, studio moments, and soundtracked memories from Samrat&apos;s world.</p>
          <p className="blog-hero-links">
            <Link href="/#connect" className="blog-author-link">BOOK SAMRAT FOR YOUR EVENT <span>↗</span></Link>
          </p>
          <Link href="/blog/admin" className="blog-author-link">AUTHOR LOGIN <span>↗</span></Link>
        </section>
        <section className="blog-grid wrap">
          {!isBlogConfigured() ? (
            <p className="blog-empty">Connect MongoDB to publish the first story.</p>
          ) : posts.length === 0 ? (
            <p className="blog-empty">The first story is being tuned. Check back soon.</p>
          ) : (
            posts.map((post, index) => (
              <article className={`blog-card blog-card-${(index % 3) + 1}`} key={post.id}>
                <div className="blog-card-art">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt={post.title} />
                  ) : (
                    <span>{String(index + 1).padStart(2, "0")}</span>
                  )}
                  <span className="blog-card-kicker">FIELD NOTE</span>
                </div>
                <div className="blog-card-body">
                  <time dateTime={post.published_at}>{formatDate(post.published_at)}</time>
                  <h2><Link href={`/blog/${post.slug}`}>{post.title}</Link></h2>
                  <p>{post.excerpt}</p>
                  <Link className="blog-read-link" href={`/blog/${post.slug}`}>READ STORY <span>↗</span></Link>
                </div>
              </article>
            ))
          )}
        </section>
      </main>
      <Footer />
    </>
  );
}
