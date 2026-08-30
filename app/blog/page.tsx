import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import {
  BlogSchemaMissingError,
  type BlogPost,
  getPublishedPosts,
  isBlogConfigured,
} from "@/lib/blog";

export const dynamic = "force-dynamic";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(value));
}

export default async function BlogPage() {
  let posts: BlogPost[] = [];
  let schemaMissing = false;
  if (isBlogConfigured()) {
    try {
      posts = await getPublishedPosts();
    } catch (error) {
      if (!(error instanceof BlogSchemaMissingError)) throw error;
      schemaMissing = true;
    }
  }
  return (
    <>
      <Header />
      <main className="blog-page">
        <section className="blog-hero">
          <p className="subpage-tag">THE SKS JOURNAL</p>
          <h1>NOTES FROM THE ROAD</h1>
          <p>Stories, studio moments, and soundtracked memories from Samrat&apos;s world.</p>
          <Link href="/blog/admin" className="blog-author-link">AUTHOR LOGIN <span>↗</span></Link>
        </section>
        <section className="blog-grid wrap">
          {!isBlogConfigured() ? (
            <p className="blog-empty">Connect Supabase to publish the first story.</p>
          ) : schemaMissing ? (
            <p className="blog-empty">Run <code>supabase/blog_posts.sql</code> in Supabase to open the journal.</p>
          ) : posts.length === 0 ? (
            <p className="blog-empty">The first story is being tuned. Check back soon.</p>
          ) : (
            posts.map((post, index) => (
              <article className={`blog-card blog-card-${(index % 3) + 1}`} key={post.id}>
                <div className="blog-card-art">
                  {post.cover_image ? (
                    <img src={post.cover_image} alt="" />
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
