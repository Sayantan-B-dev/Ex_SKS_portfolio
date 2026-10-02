import type { Metadata } from "next";
import Link from "next/link";

import DashboardShell, {
  type DashboardTab,
} from "@/components/dashboard/DashboardShell";
import GalleryPanel from "@/components/dashboard/GalleryPanel";
import StoriesPanel from "@/components/dashboard/StoriesPanel";
import TourPanel from "@/components/dashboard/TourPanel";
import { readDashboardQuery } from "@/components/dashboard/query";
import PasswordField from "@/components/PasswordField";
import SubmitButton from "@/components/SubmitButton";
import { loginAction, logoutAction } from "@/app/blog/actions";
import { isAuthenticated, isConfigured } from "@/lib/blog-auth";
import {
  getAdminPosts,
  getGalleryImages,
  getTourEvents,
  type BlogPost,
  type GalleryImage,
  type TourEvent,
} from "@/lib/blog";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Private dashboard for stories, gallery photos, and tour events.",
  robots: {
    index: false,
    follow: false,
    nocache: true,
  },
  alternates: {
    canonical: `${SITE_URL}/dashboard`,
  },
};

const TABS: DashboardTab[] = ["stories", "gallery", "tour"];

function isTab(value: string | undefined): value is DashboardTab {
  return TABS.includes(value as DashboardTab);
}

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = readDashboardQuery(await searchParams);
  const configured = isConfigured();
  const loggedIn = configured && (await isAuthenticated());

  // ── Not configured : say so instead of rendering a login that cannot work.
  if (!configured) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <DashboardTopbar />
          <header className="dashboard-header">
            <p className="subpage-tag">PRIVATE STUDIO</p>
            <h1>STUDIO NOT CONFIGURED</h1>
            <p className="dashboard-lede">
              Add the BLOG_AUTHOR_* and BLOG_SESSION_SECRET variables to your environment
              first.
            </p>
          </header>
        </div>
      </main>
    );
  }

  // ── Logged out : the dashboard route doubles as the sign-in page.
  if (!loggedIn) {
    return (
      <main className="dashboard-page">
        <div className="dashboard-shell">
          <DashboardTopbar />
          <div className="dashboard-login">
            <header className="dashboard-header">
              <p className="subpage-tag">PRIVATE STUDIO</p>
              <h1>ENTER THE STUDIO</h1>
              <p className="dashboard-lede">
                Sign in to write stories, manage the gallery, and publish tour events.
              </p>
            </header>
            <section className="blog-panel">
              <div className="blog-panel-head">
                <h2>AUTHOR SIGN IN</h2>
              </div>
              {query.error && (
                <p className="admin-message admin-error">
                  Those details did not match. Try again.
                </p>
              )}
              <form action={loginAction} className="blog-login-form">
                <label>
                  Username
                  <input name="username" required autoComplete="username" />
                </label>
                <PasswordField />
                <SubmitButton className="blog-submit-button" pendingLabel="UNLOCKING…">
                  UNLOCK STUDIO
                </SubmitButton>
              </form>
            </section>
          </div>
        </div>
      </main>
    );
  }

  // ── Signed in : load all three content types for the tabs.
  let posts: BlogPost[] = [];
  let photos: GalleryImage[] = [];
  let tours: TourEvent[] = [];
  try {
    [posts, photos, tours] = await Promise.all([
      getAdminPosts(),
      getGalleryImages(),
      getTourEvents(),
    ]);
  } catch {
    // A database blip shows empty lists rather than blanking the dashboard.
  }

  const editingPost = posts.find((post) => post.id === query.edit) ?? null;
  const editingTour = tours.find((tour) => tour.id === query.tourEdit) ?? null;

  // An edit link wins over the tab param so the form is always on screen.
  const activeTab: DashboardTab = query.tourEdit
    ? "tour"
    : query.edit
      ? "stories"
      : isTab(query.tab)
        ? query.tab
        : "stories";

  const deletedImages = Number(query.images ?? 0) || 0;
  const keptImages = Number(query.kept ?? 0) || 0;

  return (
    <main className="dashboard-page">
      <div className="dashboard-shell">
        <DashboardTopbar signedIn />

        <header className="dashboard-header">
          <p className="subpage-tag">PRIVATE STUDIO</p>
          <h1>MANAGE YOUR CONTENT</h1>
          <p className="dashboard-lede">
            Everything the public site reads : blog stories, gallery photos, and tour
            events. Pick a section to manage it.
          </p>
        </header>

        <DashboardShell
          initialTab={activeTab}
          counts={{
            stories: posts.length,
            gallery: photos.length,
            tour: tours.length,
          }}
          panels={{
            stories: (
              <StoriesPanel
                posts={posts}
                editingPost={editingPost}
                query={query}
                deletedImages={deletedImages}
                keptImages={keptImages}
              />
            ),
            gallery: (
              <GalleryPanel
                photos={photos}
                query={query}
                deletedImages={deletedImages}
                keptImages={keptImages}
              />
            ),
            tour: (
              <TourPanel
                tours={tours}
                editingTour={editingTour}
                query={query}
                deletedImages={deletedImages}
                keptImages={keptImages}
              />
            ),
          }}
        />
      </div>
    </main>
  );
}

/** Shared top bar : return home on the left, studio flag and sign-out on the right. */
function DashboardTopbar({ signedIn = false }: { signedIn?: boolean }) {
  return (
    <div className="dashboard-topbar">
      <Link href="/" className="blog-back-link">
        ← RETURN TO HOME
      </Link>
      <div className="dashboard-topbar-right">
        <span className="blog-admin-flag">PRIVATE STUDIO</span>
        {signedIn && (
          <form action={logoutAction}>
            <SubmitButton className="dashboard-signout" pendingLabel="SIGNING OUT…">
              SIGN OUT
            </SubmitButton>
          </form>
        )}
      </div>
    </div>
  );
}
