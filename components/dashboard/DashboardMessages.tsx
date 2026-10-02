import type { DashboardQuery } from "@/components/dashboard/query";

/**
 * The toasts for one tab. Each panel renders its own, so a message only ever
 * appears above the content it belongs to.
 */
export default function DashboardMessages({
  tab,
  query,
  deletedImages,
  keptImages,
}: {
  tab: "stories" | "gallery" | "tour";
  query: DashboardQuery;
  deletedImages: number;
  keptImages: number;
}) {
  const keptNote = (owner: string) =>
    keptImages > 0
      ? `, ${keptImages} kept because another ${owner} still uses ${
          keptImages === 1 ? "it" : "them"
        }`
      : "";
  const removedNote = (noun: string) =>
    deletedImages > 0
      ? ` : ${deletedImages} ImageKit ${deletedImages === 1 ? noun : `${noun}s`} removed`
      : "";

  if (tab === "stories") {
    return (
      <>
        {query.published && (
          <p className="admin-message admin-success">Published. Your story is live.</p>
        )}
        {query.updated && (
          <p className="admin-message admin-success">Story updated.</p>
        )}
        {query.deleted && (
          <p className="admin-message admin-success">
            Story deleted
            {removedNote("image")}
            {keptNote("story")}.
          </p>
        )}
        {query.imagesFailed && (
          <p className="admin-message admin-error">
            The story was deleted, but its ImageKit images could not be removed. Clear
            those files from ImageKit yourself if you want them gone.
          </p>
        )}
        {query.purgeFailed && (
          <p className="admin-message admin-error">
            The images were removed, but ImageKit&apos;s cache could not be purged, so a
            copy that a browser already loaded may still appear until the cache expires.
          </p>
        )}
        {query.error === "required" && (
          <p className="admin-message admin-error">
            Title, excerpt, and story are required.
          </p>
        )}
        {query.error === "cover" && (
          <p className="admin-message admin-error">
            Add a cover image : paste a link or upload a file.
          </p>
        )}
        {query.error === "date" && (
          <p className="admin-message admin-error">
            That publish date is not valid. Pick a date or leave it empty.
          </p>
        )}
        {query.error === "session" && (
          <p className="admin-message admin-error">
            Your session expired. Sign in again to keep working.
          </p>
        )}
      </>
    );
  }

  if (tab === "gallery") {
    return (
      <>
        {query.galleryAdded && (
          <p className="admin-message admin-success">
            Photo added. It is live on the gallery page.
          </p>
        )}
        {query.galleryRemoved && (
          <p className="admin-message admin-success">
            Photo removed from the gallery
            {removedNote("file")}
            {keptNote("story or photo")}.
          </p>
        )}
        {query.galleryImagesFailed && (
          <p className="admin-message admin-error">
            The photo was removed, but its ImageKit file could not be deleted. Clear it
            from ImageKit yourself if you want it gone.
          </p>
        )}
        {query.galleryPurgeFailed && (
          <p className="admin-message admin-error">
            The photo&apos;s file was removed, but ImageKit&apos;s cache could not be
            purged, so a copy a browser already loaded may still appear until the cache
            expires.
          </p>
        )}
        {query.error === "galleryImage" && (
          <p className="admin-message admin-error">
            A photo needs an https link or an uploaded file.
          </p>
        )}
        {query.error === "galleryTitle" && (
          <p className="admin-message admin-error">Give the photo a caption.</p>
        )}
        {query.error === "session" && (
          <p className="admin-message admin-error">
            Your session expired. Sign in again to keep working.
          </p>
        )}
      </>
    );
  }

  return (
    <>
      {query.tourAdded && (
        <p className="admin-message admin-success">
          Tour event added. It is live in the landing page announcement.
        </p>
      )}
      {query.tourUpdated && (
        <p className="admin-message admin-success">Tour event updated.</p>
      )}
      {query.tourRemoved && (
        <p className="admin-message admin-success">
          Tour event removed
          {removedNote("file")}
          {keptNote("story, photo, or tour")}.
        </p>
      )}
      {query.tourImagesFailed && (
        <p className="admin-message admin-error">
          The tour event was removed, but its ImageKit file could not be deleted. Clear it
          from ImageKit yourself if you want it gone.
        </p>
      )}
      {query.tourPurgeFailed && (
        <p className="admin-message admin-error">
          The tour image was removed, but ImageKit&apos;s cache could not be purged, so a
          copy a browser already loaded may still appear until the cache expires.
        </p>
      )}
      {query.error === "tourRequired" && (
        <p className="admin-message admin-error">
          A tour event needs a title, a description, and a starting point.
        </p>
      )}
      {query.error === "tourImage" && (
        <p className="admin-message admin-error">
          Add a tour image : paste a link or upload a file.
        </p>
      )}
      {query.error === "tourUrl" && (
        <p className="admin-message admin-error">
          That redirect link is not valid. Use a full https link or a path that starts
          with /.
        </p>
      )}
      {query.error === "session" && (
        <p className="admin-message admin-error">
          Your session expired. Sign in again to keep working.
        </p>
      )}
    </>
  );
}
