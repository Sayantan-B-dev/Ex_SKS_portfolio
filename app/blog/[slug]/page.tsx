import Link from "next/link";
import { notFound } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getPublishedPost, isBlogConfigured } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  if (!isBlogConfigured()) notFound();
  const post = await getPublishedPost((await params).slug);
  if (!post) notFound();
  return (
    <>
      <Header />
      <main className="blog-post-page">
        <Link href="/blog" className="blog-back-link">← BACK TO JOURNAL</Link>
        <article className="blog-post wrap">
          <p className="subpage-tag">FIELD NOTE · {new Date(post.published_at).toLocaleDateString("en-IN")}</p>
          <h1>{post.title}</h1>
          <p className="blog-post-excerpt">{post.excerpt}</p>
          {post.cover_image && <img className="blog-post-image" src={post.cover_image} alt="" />}
          <div className="blog-post-content">{post.content}</div>
        </article>
      </main>
      <Footer />
    </>
  );
}
