import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublishedPost, isBlogConfigured } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

function toAbsoluteImage(src: string | null) {
  if (!src) return null;
  if (/^https?:\/\//i.test(src)) return src;
  return `${SITE_URL}${src.startsWith("/") ? src : `/${src}`}`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  if (!isBlogConfigured()) return {};
  const post = await getPublishedPost(slug);
  if (!post) return {};
  const url = `${SITE_URL}/blog/${post.slug}`;
  const cover = toAbsoluteImage(post.cover_image);
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: "article",
      locale: "en_IN",
      siteName: "SKS : Samrat Sarkar Music Band",
      title: `${post.title} | SKS Music Band`,
      description: post.excerpt,
      url,
      ...(cover
        ? { images: [{ url: cover, width: 1200, height: 630, alt: post.title }] }
        : {}),
    },
    twitter: {
      card: "summary_large_image",
      title: `${post.title} | SKS Music Band`,
      description: post.excerpt,
      ...(cover ? { images: [cover] } : {}),
    },
    alternates: {
      canonical: url,
    },
  };
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isBlogConfigured()) notFound();
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  const url = `${SITE_URL}/blog/${post.slug}`;
  const cover = toAbsoluteImage(post.cover_image);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.published_at,
    author: {
      "@type": "Person",
      name: "Samrat Sarkar",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Sammrat Ka Saagar",
      url: SITE_URL,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": url,
    },
    ...(cover ? { image: [cover] } : {}),
  };
  return (
    <>
      <Header />
      <main className="blog-post-page">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
        <Link href="/blog" className="blog-back-link">BACK TO BLOG</Link>
        <article className="blog-post wrap">
          <p className="subpage-tag">FIELD NOTE | {new Date(post.published_at).toLocaleDateString("en-IN")}</p>
          <h1>{post.title}</h1>
          <p className="blog-post-excerpt">{post.excerpt}</p>
          {post.cover_image && <img className="blog-post-image" src={post.cover_image} alt={post.title} />}
          <div className="blog-post-content">{post.content}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
