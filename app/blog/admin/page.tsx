import type { Metadata } from "next";
import Link from "next/link";
import { SITE_URL } from "@/lib/site";
import BlogMediaFields from "@/components/BlogMediaFields";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import GalleryAddForm from "@/components/GalleryAddForm";
import PasswordField from "@/components/PasswordField";
import SubmitButton from "@/components/SubmitButton";
import { isAuthenticated, isConfigured } from "@/lib/blog-auth";
import {
  addGalleryImageAction,
  deleteAction,
  loginAction,
  logoutAction,
  publishAction,
  removeGalleryImageAction,
  updateAction,
} from "@/app/blog/actions";
import {
  getAdminPosts,
  getGalleryImages,
  toDateInputValue,
  type BlogPost,
  type GalleryImage,
} from "@/lib/blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Studio Login",
  description: "Private author studio for SKS blog management.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: `${SITE_URL}/blog/admin`,
  },
};

export default async function BlogAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    error?: string;
    published?: string;
    updated?: string;
    deleted?: string;
    images?: string;
    kept?: string;
    imagesFailed?: string;
    purgeFailed?: string;
    galleryAdded?: string;
    galleryRemoved?: string;
    galleryImagesFailed?: string;
    galleryPurgeFailed?: string;
    edit?: string;
  }>;
}) {
  const loggedIn = await isAuthenticated();
  const query = await searchParams;
  const deletedImages = Number(query.images ?? 0) || 0;
  const keptImages = Number(query.kept ?? 0) || 0;
  let posts: BlogPost[] = [];
  let photos: GalleryImage[] = [];
  let editingPost: BlogPost | null = null;
  if (loggedIn && isConfigured()) {
    posts = await getAdminPosts();
    photos = await getGalleryImages();
    editingPost = posts.find((post) => post.id === query.edit) ?? null;
  }
  return (
    <main className="blog-admin-page">
      <div className="blog-admin-shell">
        <div className="blog-admin-topbar">
          <Link href="/blog" className="blog-back-link">← VIEW BLOG</Link>
          <span className="blog-admin-flag">PRIVATE STUDIO</span>
        </div>
        <header className="blog-admin-header">
          <p className="subpage-tag">PRIVATE STUDIO</p>
          <h1>{loggedIn ? "PUBLISH A FIELD NOTE" : "ENTER THE STUDIO"}</h1>
          <p className="blog-admin-lede">
            {loggedIn
              ? "Write the story, add a cover and any extra shots, then publish it to the blog."
              : "Sign in to write, edit, and publish field notes."}
          </p>
        </header>
        {!isConfigured() ? (
          <p className="admin-message admin-error">Add the BLOG_AUTHOR_* and BLOG_SESSION_SECRET variables to your environment first.</p>
        ) : loggedIn ? (
          <>
            {query.published && <p className="admin-message admin-success">Published. Your story is live.</p>}
            {query.updated && <p className="admin-message admin-success">Story updated.</p>}
            {query.deleted && (
              <p className="admin-message admin-success">
                Story deleted
                {deletedImages > 0
                  ? ` : ${deletedImages} ImageKit ${deletedImages === 1 ? "image" : "images"} removed`
                  : ""}
                {keptImages > 0
                  ? `, ${keptImages} kept because another story still uses ${keptImages === 1 ? "it" : "them"}`
                  : ""}
                .
              </p>
            )}
            {query.imagesFailed && (
              <p className="admin-message admin-error">
                The story was deleted, but its ImageKit images could not be removed. Clear those files
                from ImageKit yourself if you want them gone.
              </p>
            )}
            {query.purgeFailed && (
              <p className="admin-message admin-error">
                The images were removed, but ImageKit&apos;s cache could not be purged, so a copy that a
                browser already loaded may still appear until the cache expires.
              </p>
            )}
            {query.galleryAdded && (
              <p className="admin-message admin-success">
                Photo added. It is live on the gallery page.
              </p>
            )}
            {query.galleryRemoved && (
              <p className="admin-message admin-success">
                Photo removed from the gallery
                {deletedImages > 0
                  ? ` : ${deletedImages} ImageKit ${deletedImages === 1 ? "file" : "files"} removed`
                  : ""}
                {keptImages > 0
                  ? `, ${keptImages} kept because another story or photo still uses ${keptImages === 1 ? "it" : "them"}`
                  : ""}
                .
              </p>
            )}
            {query.galleryImagesFailed && (
              <p className="admin-message admin-error">
                The photo was removed, but its ImageKit file could not be deleted. Clear it from
                ImageKit yourself if you want it gone.
              </p>
            )}
            {query.galleryPurgeFailed && (
              <p className="admin-message admin-error">
                The photo&apos;s file was removed, but ImageKit&apos;s cache could not be purged, so a
                copy a browser already loaded may still appear until the cache expires.
              </p>
            )}
            {query.error === "required" && <p className="admin-message admin-error">Title, excerpt, and story are required.</p>}
            {query.error === "cover" && <p className="admin-message admin-error">Add a cover image : paste a link or upload a file.</p>}
            {query.error === "date" && <p className="admin-message admin-error">That publish date is not valid. Pick a date or leave it empty.</p>}

            <section className="blog-panel">
              <div className="blog-panel-head">
                <h2>{editingPost ? "EDIT THIS STORY" : "NEW STORY"}</h2>
                {editingPost && <span className="blog-panel-meta">{editingPost.title}</span>}
              </div>
              <form action={editingPost ? updateAction : publishAction} className="blog-editor-form">
                {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
                <label>Title<input name="title" required defaultValue={editingPost?.title} placeholder="A night the crowd sang back" /></label>
                <label>Excerpt<textarea name="excerpt" required rows={3} defaultValue={editingPost?.excerpt} placeholder="A short introduction for the blog card." /></label>
                <label>
                  Publish date
                  <input
                    name="publishedDate"
                    type="date"
                    defaultValue={toDateInputValue(editingPost?.published_at)}
                  />
                  <span className="blog-field-hint">
                    {editingPost
                      ? "Leave empty to keep this story's current date."
                      : "Leave empty to publish with today's date. You can edit it any time."}
                  </span>
                </label>
                <BlogMediaFields
                  key={editingPost?.id ?? "new"}
                defaultCover={editingPost?.cover_image ?? ""}
                defaultImages={editingPost?.images ?? []}
                defaultImageFiles={editingPost?.image_files ?? []}
              />
                <label>Story<textarea name="content" required rows={14} defaultValue={editingPost?.content} placeholder="Write the story here..." /></label>
                <div className="blog-editor-actions">
                  <SubmitButton
                    className="blog-submit-button"
                    pendingLabel={editingPost ? "SAVING…" : "PUBLISHING…"}
                  >
                    {editingPost ? "SAVE CHANGES" : "PUBLISH STORY"}
                  </SubmitButton>
                  {editingPost && <Link href="/blog/admin" className="blog-cancel-link">CANCEL EDIT</Link>}
                </div>
              </form>
            </section>

            <section className="blog-manage blog-panel">
              <div className="blog-panel-head blog-manage-heading">
                <h2>YOUR STORIES</h2>
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
                        <ConfirmActionButton
                          action={deleteAction}
                          name="id"
                          value={post.id}
                          triggerLabel="DELETE"
                          ariaLabel={`Delete ${post.title}`}
                          tag="DELETE STORY"
                          heading="Delete this story?"
                          text={
                            <>
                              &ldquo;{post.title}&rdquo; will be permanently removed from
                              the blog, along with the images it uploaded to ImageKit. This
                              cannot be undone.
                            </>
                          }
                          confirmLabel="DELETE STORY"
                          pendingLabel="DELETING…"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section className="blog-panel" id="gallery">
              <div className="blog-panel-head blog-manage-heading">
                <h2>GALLERY PHOTOS</h2>
                <span>
                  {photos.length} {photos.length === 1 ? "photo" : "photos"}
                </span>
              </div>
              <p className="blog-panel-note">
                Photos added here appear on the gallery page, newest first. Uploads go to
                ImageKit under /sks-portfolio/blogs.
              </p>
              <GalleryAddForm action={addGalleryImageAction} />
              {photos.length === 0 ? (
                <p className="blog-manage-empty">Photos you add will appear here.</p>
              ) : (
                <div className="blog-gallery-list">
                  {photos.map((photo) => (
                    <div className="blog-gallery-row" key={photo.id}>
                      {/* eslint-disable-next-line @next/next/no-img-element -- gallery files can live on any host the author pastes */}
                      <img src={photo.url} alt={photo.title} loading="lazy" />
                      <div className="blog-gallery-meta">
                        <strong>{photo.title}</strong>
                        <span className="blog-gallery-facts">
                          <span
                            className={`blog-gallery-chip ${
                              photo.fileId ? "is-imagekit" : "is-link"
                            }`}
                          >
                            {photo.fileId ? "ImageKit" : "Linked"}
                          </span>
                          {photo.category} | {new Date(photo.created_at).toLocaleDateString("en-IN")}
                        </span>
                      </div>
                      <ConfirmActionButton
                        action={removeGalleryImageAction}
                        name="id"
                        value={photo.id}
                        triggerLabel="REMOVE"
                        ariaLabel={`Remove ${photo.title} from the gallery`}
                        tag="REMOVE FROM GALLERY"
                        heading="Remove this photo?"
                        text={
                          <>
                            &ldquo;{photo.title}&rdquo; will be removed from the gallery page,
                            along with the file it uploaded to ImageKit. This cannot be undone.
                          </>
                        }
                        confirmLabel="REMOVE PHOTO"
                        pendingLabel="REMOVING…"
                      />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <div className="blog-admin-signout">
              <form action={logoutAction}>
                <SubmitButton className="blog-logout-button" pendingLabel="SIGNING OUT…">SIGN OUT</SubmitButton>
              </form>
            </div>
          </>
        ) : (
          <section className="blog-panel blog-login-panel">
            <div className="blog-panel-head">
              <h2>AUTHOR SIGN IN</h2>
            </div>
            {query.error && (
              <p className="admin-message admin-error">
                Those details did not match. Try again.
              </p>
            )}
            <form action={loginAction} className="blog-login-form">
              <label>Username<input name="username" required autoComplete="username" /></label>
              <PasswordField />
              <SubmitButton className="blog-submit-button" pendingLabel="UNLOCKING…">UNLOCK STUDIO</SubmitButton>
            </form>
          </section>
        )}
      </div>
    </main>
  );
}
