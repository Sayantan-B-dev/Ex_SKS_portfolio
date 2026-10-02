import Link from "next/link";

import BlogMediaFields from "@/components/BlogMediaFields";
import ConfirmActionButton from "@/components/ConfirmActionButton";
import DashboardMessages from "@/components/dashboard/DashboardMessages";
import SubmitButton from "@/components/SubmitButton";
import { deleteAction, publishAction, updateAction } from "@/app/blog/actions";
import type { DashboardQuery } from "@/components/dashboard/query";
import { toDateInputValue, type BlogPost } from "@/lib/blog";

/** The stories tab : listing on top, then the editor. */
export default function StoriesPanel({
  posts,
  editingPost,
  query,
  deletedImages,
  keptImages,
}: {
  posts: BlogPost[];
  editingPost: BlogPost | null;
  query: DashboardQuery;
  deletedImages: number;
  keptImages: number;
}) {
  return (
    <>
      <DashboardMessages
        tab="stories"
        query={query}
        deletedImages={deletedImages}
        keptImages={keptImages}
      />

      <section className="blog-panel">
        <div className="blog-panel-head blog-manage-heading">
          <h2>YOUR STORIES</h2>
          <span>
            {posts.length} {posts.length === 1 ? "story" : "stories"}
          </span>
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
                  <Link href={`/dashboard?tab=stories&edit=${post.id}`}>EDIT</Link>
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
                        &ldquo;{post.title}&rdquo; will be permanently removed from the
                        blog, along with the images it uploaded to ImageKit. This cannot
                        be undone.
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

      <section className="blog-panel">
        <div className="blog-panel-head">
          <h2>{editingPost ? "EDIT THIS STORY" : "NEW STORY"}</h2>
          {editingPost && <span className="blog-panel-meta">{editingPost.title}</span>}
        </div>
        <form
          action={editingPost ? updateAction : publishAction}
          className="blog-editor-form"
        >
          {editingPost && <input type="hidden" name="id" value={editingPost.id} />}
          <label>
            Title
            <input
              name="title"
              required
              defaultValue={editingPost?.title}
              placeholder="A night the crowd sang back"
            />
          </label>
          <label>
            Excerpt
            <textarea
              name="excerpt"
              required
              rows={3}
              defaultValue={editingPost?.excerpt}
              placeholder="A short introduction for the blog card."
            />
          </label>
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
          <label>
            Story
            <textarea
              name="content"
              required
              rows={14}
              defaultValue={editingPost?.content}
              placeholder="Write the story here..."
            />
          </label>
          <div className="blog-editor-actions">
            <SubmitButton
              className="blog-submit-button"
              pendingLabel={editingPost ? "SAVING…" : "PUBLISHING…"}
            >
              {editingPost ? "SAVE CHANGES" : "PUBLISH STORY"}
            </SubmitButton>
            {editingPost && (
              <Link href="/dashboard?tab=stories" className="blog-cancel-link">
                CANCEL EDIT
              </Link>
            )}
          </div>
        </form>
      </section>
    </>
  );
}
