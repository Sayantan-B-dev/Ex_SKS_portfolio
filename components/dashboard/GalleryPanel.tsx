import ConfirmActionButton from "@/components/ConfirmActionButton";
import DashboardMessages from "@/components/dashboard/DashboardMessages";
import GalleryAddForm from "@/components/GalleryAddForm";
import { addGalleryImageAction, removeGalleryImageAction } from "@/app/blog/actions";
import type { DashboardQuery } from "@/components/dashboard/query";
import type { GalleryImage } from "@/lib/blog";

/** The gallery tab : listing on top, then the add form. */
export default function GalleryPanel({
  photos,
  query,
  deletedImages,
  keptImages,
}: {
  photos: GalleryImage[];
  query: DashboardQuery;
  deletedImages: number;
  keptImages: number;
}) {
  return (
    <>
      <DashboardMessages
        tab="gallery"
        query={query}
        deletedImages={deletedImages}
        keptImages={keptImages}
      />

      <section className="blog-panel">
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
                    {photo.category} |{" "}
                    {new Date(photo.created_at).toLocaleDateString("en-IN")}
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

      <section className="blog-panel">
        <div className="blog-panel-head">
          <h2>ADD A PHOTO</h2>
        </div>
        <GalleryAddForm action={addGalleryImageAction} />
      </section>
    </>
  );
}
