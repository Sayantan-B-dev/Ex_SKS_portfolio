import Link from "next/link";

import ConfirmActionButton from "@/components/ConfirmActionButton";
import DashboardMessages from "@/components/dashboard/DashboardMessages";
import TourEventForm from "@/components/TourEventForm";
import {
  addTourEventAction,
  removeTourEventAction,
  updateTourEventAction,
} from "@/app/blog/actions";
import type { DashboardQuery } from "@/components/dashboard/query";
import type { TourEvent } from "@/lib/blog";

/** The tour tab : listing on top, then the add/edit form. */
export default function TourPanel({
  tours,
  editingTour,
  query,
  deletedImages,
  keptImages,
}: {
  tours: TourEvent[];
  editingTour: TourEvent | null;
  query: DashboardQuery;
  deletedImages: number;
  keptImages: number;
}) {
  return (
    <>
      <DashboardMessages
        tab="tour"
        query={query}
        deletedImages={deletedImages}
        keptImages={keptImages}
      />

      <section className="blog-panel">
        <div className="blog-panel-head blog-manage-heading">
          <h2>TOUR EVENTS</h2>
          <span>
            {tours.length} {tours.length === 1 ? "event" : "events"}
          </span>
        </div>
        <p className="blog-panel-note">
          Events appear in the tour announcement between the hero and the stats bar. The
          featured one opens the switcher. Uploads go to ImageKit under
          /sks-portfolio/blogs.
        </p>
        {tours.length === 0 ? (
          <p className="blog-manage-empty">Tour events you add will appear here.</p>
        ) : (
          <div className="blog-gallery-list">
            {tours.map((tour) => {
              const facts = [tour.kicker, tour.dateText].filter(Boolean).join(" | ");
              return (
                <div className="blog-gallery-row" key={tour.id}>
                  {tour.image ? (
                    /* eslint-disable-next-line @next/next/no-img-element -- a tour image can live on any host the author pastes */
                    <img src={tour.image} alt={tour.title} loading="lazy" />
                  ) : (
                    <span className="tour-row-no-image">NO IMAGE</span>
                  )}
                  <div className="blog-gallery-meta">
                    <strong>{tour.title}</strong>
                    <span className="blog-gallery-facts">
                      {tour.featured && (
                        <span className="blog-gallery-chip is-featured">Featured</span>
                      )}
                      <span
                        className={`blog-gallery-chip ${
                          tour.fileId ? "is-imagekit" : "is-link"
                        }`}
                      >
                        {tour.fileId ? "ImageKit" : "Linked"}
                      </span>
                      {facts || `${tour.cities.length} cities`}
                    </span>
                  </div>
                  <div className="blog-row-actions">
                    <Link href={`/dashboard?tab=tour&tourEdit=${tour.id}`}>EDIT</Link>
                    <ConfirmActionButton
                      action={removeTourEventAction}
                      name="id"
                      value={tour.id}
                      triggerLabel="REMOVE"
                      ariaLabel={`Remove ${tour.title} from the tour announcements`}
                      tag="REMOVE TOUR EVENT"
                      heading="Remove this tour event?"
                      text={
                        <>
                          &ldquo;{tour.title}&rdquo; will be removed from the landing
                          page, along with the image it uploaded to ImageKit. This cannot
                          be undone.
                        </>
                      }
                      confirmLabel="REMOVE EVENT"
                      pendingLabel="REMOVING…"
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="blog-panel">
        <div className="blog-panel-head">
          <h2>{editingTour ? "EDIT THIS TOUR EVENT" : "ADD A TOUR EVENT"}</h2>
          {editingTour && <span className="blog-panel-meta">{editingTour.title}</span>}
        </div>
        <TourEventForm
          key={editingTour?.id ?? "new"}
          action={editingTour ? updateTourEventAction : addTourEventAction}
          defaults={editingTour}
        />
      </section>
    </>
  );
}
