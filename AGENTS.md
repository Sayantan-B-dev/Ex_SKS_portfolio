# AGENTS.md
Canonical instructions for any AI coding agent working in this repo — Claude Code, Cursor, OpenCode, Antigravity, Windsurf, Codex CLI, Copilot, Aider, Cline, or anything else. This is the single source of truth; tool-specific files (`CLAUDE.md`, `.clinerules`) are thin pointers back to this one so instructions never drift out of sync across tools.

## Project summary
`sks-music-band` — a Next.js (App Router) recreation of a music-band landing page, pixel-matched against a reference screenshot (`type--Normal.png`, keep it in the repo root if present). The landing page (`app/page.tsx`) assembles the presentational components under `components/`, opening with a studio-managed tour announcement; there are additionally `/about`, `/shows`, `/gallery`, and a `/blog`. No CMS, no auth provider — the single blog author signs in with env credentials and an HMAC cookie.

- Framework: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Styling: plain CSS in `app/globals.css` using CSS custom properties — no Tailwind, no CSS-in-JS, no CSS modules
- Fonts: loaded via `next/font/google` in `app/layout.tsx` (Big Shoulders, Oswald, Figtree) — not `<link>` tags
- Images: `next/image`, remote source is `picsum.photos` (whitelisted in `next.config.ts`) as placeholder art
- Data: MongoDB Atlas via the official `mongodb` driver, used **only** by the blog (`lib/blog.ts`). No ORM. See the collection-scope gotcha below before touching it.
- Blog and gallery image storage: ImageKit, through `lib/imagekit.ts` (plain `fetch` against the REST API — no SDK dependency). Confined to `/sks-portfolio/blogs`; the studio uploads, and removing the story or gallery photo that owns an image removes that image.
- Studio-managed content: blog stories, gallery photos, and tour events, all authored at `/dashboard` behind the same session (the dashboard is the login page when signed out and the studio when signed in; the legacy `/blog/admin` URL forwards there), all stored in the one `SamratPortfolio` collection distinguished by a `type` tag (`blog_post`, `gallery_image`, `tour_event`).
- Reference: `DESIGN.md` is the values source of truth (colors, type scale, spacing); the screenshot is the layout source of truth

## Setup
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — requires real internet to fetch Google Fonts at build time
npm run lint
npm run seed:blog # optional — seeds two sample stories into MongoDB
npm run setup:imagekit # optional — creates the /sks-portfolio/blogs folders in ImageKit
```
Node 20+ required (see `engines` in `package.json`). Copy `.env.example` to `.env.local` and fill in `MONGODB_URI` before using the blog.

## Non-negotiable constraints
1. **The screenshot is the spec, not inspiration.** Don't redesign, simplify, re-theme, or "improve" sections — match it. If you must deviate, say why.
2. **Don't reorder or remove page sections.** Fixed order: Header → Hero → Tour announcement → Stats bar → Songs → Achievements → Endorsements → FAQ → Connect → Footer. The tour announcement renders nothing when the studio holds no events, so the rest of the order is unaffected.
3. **Keep the component split as-is** (`components/Header.tsx`, `Hero.tsx`, `StatsBar.tsx`, `SongsSection.tsx`, `AchievementsSection.tsx`, `Endorsements.tsx`, `ConnectSection.tsx`, `Footer.tsx`) unless asked to restructure. Don't introduce a UI kit, CSS framework, or state-management library for what is a static marketing page.
4. **Preserve exact copy and line breaks** in headings (e.g. "OVER 1300 SHOWS" / "40 COUNTRIES" as two lines) unless asked to change wording.
5. **Image containers have fixed aspect ratios by design.** When swapping a `src`, never change the container's `aspect-ratio`/width/height to accommodate a differently-shaped image — crop/reposition with `object-position` instead. (Two sanctioned exceptions: `.connect-photo-full`, the last image before the footer, is sized to its photo's own ratio and mask-faded at the sides so it is never cropped; and the tour announcement's image, which renders the studio-uploaded file at its own ratio because the author chooses the crop. Both are documented in `DESIGN.md` — don't extend the pattern to other slots without asking.)
6. **Pull all colors, type sizes, and spacing from `DESIGN.md`.** Don't hardcode a new hex value or px size without adding it there first.
7. **Don't add `"use client"` unless the component genuinely needs interactivity, state, or a browser-only API.** The data-backed route pages (`app/blog/*`) are server components; keep them that way — they reach MongoDB only through `lib/blog.ts`, which is `server-only`.
8. **No commits without explicit permission.** Do not run `git commit`, `git push`, or create PRs unless the user explicitly asks. Git actions require user approval.
9. **ImageKit is scoped to one folder and exactly two operations.** The account holds other apps' media. Allowed: (a) **create** files under `/sks-portfolio/blogs` and create the `/sks-portfolio` + `/sks-portfolio/blogs` folders; (b) **delete, only as part of deleting the document that owns the image** (a blog post, a gallery photo, or a tour event), the images that document itself links to. Nothing else may be created, deleted, overwritten, moved, renamed, copied, or edited — never another folder, never an asset this project did not upload for that story, never a folder deletion, and there must be no standalone "delete this asset" action in the studio. An image that another story still references is never deleted (`getReferencedImageUrls`), a path that does not appear in a fresh listing of `/sks-portfolio/blogs` is skipped rather than deleted, and the deleted files' own URLs are then cache-purged (`POST /v1/files/purge`) so a copy a browser already loaded stops serving. Every ImageKit call must go through `lib/imagekit.ts`, and uploads must pass `folder: IMAGEKIT_BLOG_FOLDER`. Cleaning up media for any other reason is a manual action for the account owner.

## Conventions
- **CSS lives in `public/css/` as separate files, imported via `globals.css`.** Never write CSS rules directly in `globals.css` — it should only contain `@import` statements. Create a new file in `public/css/` (e.g. `cursor.css`, `buttons.css`) and add the import to `globals.css`.
- CSS custom properties for all colors (`--bg`, `--yellow`, `--pink`, etc.) — never inline hex codes.
- Font roles are fixed and don't mix: `Big Shoulders` (`--font-display`) for big display headlines only, `Oswald` (`--font-ui`) for nav/buttons/labels/all-caps UI text, `Figtree` (`--font-body`) for paragraphs.
- Breakpoints: `900px`, `768px`, `480px`. Any layout change should be checked at all three, not just desktop.
- TypeScript strict mode is on — don't add `any` or disable strict checks to work around a type error; fix the type.
- **`next/image` `sizes` describes the element's rendered width, not the viewport.** `100vw` is correct only for genuinely full-bleed images (hero and subpage heroes); cards, logos, grids, and grid tracks each pass a breakpoint-aware `sizes` that matches their own container, or Next warns that the image "is not rendered at full viewport width" and ships an oversized candidate.

## Verification workflow (do this after any non-trivial change)
There's no test suite — this is a static marketing page, so verification is visual:
1. `npm run dev` and view `http://localhost:3000`.
2. Compare against the reference screenshot section by section.
3. Check all three breakpoints (900/768/480px), not just desktop width.
4. `npm run lint` and `npx tsc --noEmit` should both be clean before calling a change done.

If you have headless-browser access (Playwright, Puppeteer, etc.), render the page and screenshot it rather than trusting the DOM by eye:
```bash
npx playwright install chromium   # first time only
```
```js
// shot.js
const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1024, height: 1600 } });
  await page.goto('http://localhost:3000', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'preview.png', fullPage: true });
  await browser.close();
})();
```
Avoid old WebKit-based tools (e.g. `wkhtmltoimage`) for this — they don't support CSS Grid, `aspect-ratio`, or `clip-path` correctly, all of which this layout depends on, and will make correct code look broken.

## Known constraints / gotchas
- **`next build` requires real internet access** to fetch Google Fonts at build time (`next/font/google` downloads and self-hosts them at build). In a sandboxed/offline environment this step will hard-fail — that's expected, not a code bug. `next dev` degrades gracefully to a fallback font instead.
- **`clip-path` panels in `AchievementsSection.tsx`** are sensitive to text overflow — keep `.ach-text` anchored inside the un-clipped portion of each trapezoid when adjusting panel widths.
- If real photography/logos replace the `picsum.photos` placeholders, add the new host to `images.remotePatterns` in `next.config.ts` — Next's image optimizer blocks unlisted remote hosts by default. The ImageKit case is already handled: `imageKitPattern()` derives host and path from `IMAGEKIT_URL_ENDPOINT` at config time (and yields nothing when that variable is absent), which is what lets studio-added gallery photos render through `next/image`.
- **The blog's MongoDB collection is shared infrastructure — never widen its scope.** `lib/blog.ts` reuses the Blue Eye Entertainment Atlas cluster, so it must only ever touch the `SamratPortfolio` collection (env: `MONGODB_PORTFOLIO_COLLECTION`) inside `MONGODB_DB_NAME`. The `artists` collection belongs to a different app and must never be read or written here. Every document carries a `type` tag (`blog_post`) and all queries filter on it, so future content types can share the one collection.
- **The blog's unique `slug` index is deliberately partial** (`partialFilterExpression: { type: "blog_post" }`). A plain unique index would collide as soon as two non-blog documents in the shared collection lack a `slug`. Keep the filter when editing indexes (in `lib/blog.ts` and `scripts/seed-blog.mjs`, which define them independently).
- **`lib/imagekit.ts` is the only module allowed to call ImageKit.** It exposes `uploadBlogImage` (create) and `deleteBlogImages` (delete, called only from `deleteAction` right after a story is removed). Each story stores the ImageKit ids of the files uploaded for it in `image_files` (`{ url, fileId, filePath }`), submitted by `BlogMediaFields` as a hidden `imageFiles` field and trimmed to the URLs the story actually uses by `cleanImageFiles`. Deletion uses those ids and only falls back to a name lookup for a pasted link that has no id. `deleteBlogImages` takes `{ url, fileId? }` refs, derives the path from each URL via `blogImageFilePath` — which returns `null` for any host/folder/nested path outside `/sks-portfolio/blogs` — and only ever deletes a stored id, or a path found by an exact-name lookup inside that folder, so an unrecognised path is skipped instead of removed. It calls `POST /v1/files/batch/deleteByFileIds`, then purges the CDN cache for exactly those deleted URLs (`purgeBlogImageUrls` → `POST /v1/files/purge`, guarded by the same folder check); purge failures are reported, never fatal. There is no other delete/move/rename helper, and deleting the folder itself is never possible. The admin studio calls it through `uploadImageAction` in `app/blog/actions.ts`, which requires an authenticated session. Env names are spelled `IMGEKIT_PRIVATE_KEY` / `IMGEKIT_PUBLIC_KEY` in the live environment (missing the second "A"), so the module accepts both spellings — do not "fix" the typo in code without also updating the environment.
- **ImageKit's search index lags behind an upload — in both directions.** Right after an upload, `GET /v1/files?path=…` (or an exact-`name` lookup) can still miss the file, and right after a delete it can still list it. Never decide whether to delete based on a lookup alone: delete by the `fileId` recorded at upload time, which is why `image_files` is stored per story. The name lookup exists only for hand-pasted links, and both `blogImageFilePath` and an exact `filePath` match still gate every deletion. `POST /v1/files/bulk/delete` is **not** usable here — it answers `403 Invalid CSRF Token`.
- **Uploads are capped at 3MB by the Server Action body limit.** `next.config.ts` sets `experimental.serverActions.bodySizeLimit` to `"3mb"` (Next's default is 1MB, which showed up as a raw `500 Body exceeded 1 MB limit` on the studio's upload form). `lib/image-limits.ts` is client-safe and holds the matching byte cap (`MAX_IMAGE_BYTES`, just under the raw body limit because multipart framing adds a little) plus the allowed MIME types and `imageUploadProblem`. The studio checks that **before** calling the action and renders the message inline, so an oversized file is a field error rather than a 500 — keep the two in step when either number changes.
- **Blog images: the cover is required, extra images are optional.** A story needs a cover from *either* a pasted URL *or* an ImageKit upload (`error=cover` when neither is given). Uploads happen one file at a time through `uploadImageAction`, which returns `{ ok, url }` or `{ ok: false, error }` — a plain result rather than a thrown error, so the studio can always show what went wrong. Extra images are stored as the `images` array on the same blog document, capped at `MAX_POST_IMAGES` and filtered to absolute `http(s)` URLs. Reuse `BlogMediaFields` for any future image input rather than re-implementing uploads.
- **`lib/blog.ts` is the only module that talks to MongoDB** (both content types: stories and gallery photos), and it caches one `MongoClient` on `globalThis` so dev hot-reloads don't leak connection pools. Route everything database-related through it, and use `getCollectionOf<T>` when reaching for a different `type` — every query must still filter on `type`.
- **Gallery photos are the second content type in that collection** (`type: "gallery_image"`, `{ url, title, category, fileId, filePath }`). The studio's `GALLERY PHOTOS` panel adds them (upload via the same ImageKit path, or a pasted link) and removes them; `app/gallery/page.tsx` is a server component that reads them and hands them, appended after the built-in shots, to the client `GalleryBrowser`. Keep the built-in eight items and their composition intact — managed photos are additive, and every fifth one spans two columns to hold the masonry rhythm. Nothing but `category` (one of `GALLERY_CATEGORIES`) and `title` is asked of the author.
- **Removing a gallery photo runs the same ImageKit rules as deleting a story**: only that photo's own file, only inside `/sks-portfolio/blogs`, deleted by the id recorded at upload, kept if any other story or photo still references the URL (`getReferencedImageUrls` now checks both content types), then cache-purged. Never add a deletion path that is not tied to removing the document that owns the image.
- **Tour events are the third content type in that collection** (`type: "tour_event"`, `{ kicker, title, date_text, description, image, fileId, filePath, starting_point, cities, ending_text, redirect_to, cta_label, featured }`). `components/TourAnnouncement.tsx` (client, for the switcher and the journey map) renders them on the landing page between the hero and the stats bar as a **full-bleed** section (it deliberately omits the `.wrap` max-width cap, as do the FAQ and connect sections, so their imagery reads large — see DESIGN.md, Spacing), one row of `[info][image][map]`, all three stretched to the same height, collapsing to a single column at ≤768px (the map spans full width at 769–1024px). The image keeps the uploaded file's own aspect ratio (`width: 100%; height: auto` — a documented exception to the fixed-ratio rule), and the map is a low, wide winding road (`1000 × 240` authored units, Catmull-Rom spline) whose lit trail (`pathLength="1"` + `stroke-dashoffset`) and traveller (`getPointAtLength`) share one progress value. The journey loops forever one stop at a time (0.5s travel, 0.5s hold, `MOVE_MS`/`HOLD_MS`), naming each city in the readout and on tiny per-node labels; the cursor scrubs it and milestone clicks pin it. There is no prev/next arrow — the dots switch events and the animation runs itself. Reduced motion steps the trail to full length instead. `components/TourEventForm.tsx` is the studio form and `components/TourEventForm.tsx` is the studio form : image upload goes through the same `uploadImageFile` → `uploadImageAction` path as the blog and gallery. Removing a tour event runs the same ImageKit rules as the other two : only its own file, only inside `/sks-portfolio/blogs`, deleted by the id recorded at upload, kept if any other story, photo, or tour still references the URL, then cache-purged. Cities are one per line, capped at `MAX_TOUR_CITIES` (16); the landing page tolerates as few as zero events and never fetches if `MONGODB_URI` is missing. `app/page.tsx` is ISR (`revalidate = 300`) and the tour actions call `revalidatePath("/")`, so a studio change reaches the landing page without a rebuild.

## Definition of done
- [ ] Matches the reference screenshot at 1024px width (or explicitly diverges for a stated reason)
- [ ] `npm run lint` and `npx tsc --noEmit` pass with no errors
- [ ] Checked at 900px, 768px, and 480px
- [ ] No new dependency, framework, or build-step change introduced without being asked
- [ ] Colors/type/spacing pulled from `DESIGN.md` tokens, not new hardcoded values
