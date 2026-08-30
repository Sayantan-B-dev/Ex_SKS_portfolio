import Link from "next/link";
import { isAuthenticated, isConfigured } from "@/lib/blog-auth";
import {
  deleteAction,
  loginAction,
  logoutAction,
  publishAction,
  updateAction,
} from "@/app/blog/actions";
import { getAdminPosts, type BlogPost } from "@/lib/blog";

export const dynamic = "force-dynamic";

export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    published?: string;
    updated?: string;
    deleted?: string;
    edit?: string;
  }>;
}) {
  const loggedIn = await isAuthenticated();
  const query = await searchParams;
  let posts: BlogPost[] = [];
  let editingPost: BlogPost | null = null;
  if (loggedIn && isConfigured()) {
    posts = await getAdminPosts();
    editingPost = posts.find((post) => post.id === query.edit) ?? null;
  }
  return (
    <main className="blog-admin-page">
      <div className="blog-admin-shell">
        <Link href="/blog" className="blog-back-link">← VIEW BLOG</Link>
        <p className="subpage-tag">PRIVATE STUDIO</p>
        <h1>{loggedIn ? "PUBLISH A FIELD NOTE" : "ENTER THE STUDIO"}</h1>
        {!isConfigured() ? (
          <p className="admin-message admin-error">Add the BLOG_AUTHOR_* and BLOG_SESSION_SECRET variables to your environment first.</p>
        ) : loggedIn ? (
          <>
            {query.published && <p className="admin-message admin-success">Published. Your story is live.</p>}
            {query.updated && <p className="admin-message admin-success">Story updated.</p>}
            {query.deleted && <p className="admin-message admin-success">Story deleted.</p>}
            {query.error === "required" && <p className="admin-message admin-error">Title, excerpt, and story are required.</p>}
            <form action={editingPost ? updateAction : publishAction} className="blog-editor-form">
              {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
              <label>Title<input name="title" required defaultValue={editingPost?.title} placeholder="A night the crowd sang back" /></label>
              <label>Excerpt<textarea name="excerpt" required rows={3} defaultValue={editingPost?.excerpt} placeholder="A short introduction for the blog card." /></label>
              <label>Cover image URL<input name="coverImage" type="url" defaultValue={editingPost?.cover_image ?? ""} placeholder="https://..." /></label>
              <label>Story<textarea name="content" required rows={14} defaultValue={editingPost?.content} placeholder="Write the story here..." /></label>
              <div className="blog-editor-actions">
                <button type="submit" className="blog-submit-button">{editingPost ? "SAVE CHANGES" : "PUBLISH STORY"}</button>
                {editingPost && <Link href="/blog/admin" className="blog-cancel-link">CANCEL EDIT</Link>}
              </div>
            </form>
            <section className="blog-manage">
              <div className="blog-manage-heading">
                <p className="subpage-tag">YOUR STORIES</p>
                <span>{posts.length} {posts.length === 1 ? "story" : "stories"}</span>
              </div>
              {posts.length === 0 ? (
                <p className="blog-manage-empty">Your published stories will appear here.</p>
              ) : (
                <div className="blog-manage-list">
                  {posts.map((post) => (
                    <div className="blog-manage-row" key={post.id}>
                      <div>
                        <strong>{post.title}</strong>
                        <span>{new Date(post.published_at).toLocaleDateString("en-IN")}</span>
                      </div>
                      <div className="blog-row-actions">
                        <Link href={`/blog/admin?edit=${post.id}`}>EDIT</Link>
                        <form action={deleteAction} className="blog-delete-form">
                          <input type="hidden" name="id" value={post.id} />
                          <button
                            type="submit"
                            className="blog-delete-button"
                            aria-label={`Delete ${post.title}`}
                          >
                            DELETE
                          </button>
                        </form>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
            <form action={logoutAction}><button className="blog-logout-button" type="submit">SIGN OUT</button></form>
          </>
        ) : (
          <>
            {query.error && <p className="admin-message admin-error">Those details did not match. Try again.</p>}
            <form action={loginAction} className="blog-login-form">
              <label>Username<input name="username" required autoComplete="username" /></label>
              <label>Password<input name="password" type="password" required autoComplete="current-password" /></label>
              <button type="submit" className="blog-submit-button">UNLOCK STUDIO</button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
