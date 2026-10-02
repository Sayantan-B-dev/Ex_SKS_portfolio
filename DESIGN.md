# DESIGN.md
Design tokens and component patterns for the SKS site. This file is the values source of truth for every agent/tool working in this repo (see `AGENTS.md`). The reference screenshot is the layout source of truth. If the two ever conflict, the screenshot wins and this file should be updated to match — don't quietly diverge from either.

Tokens live as CSS custom properties in `app/globals.css` (`:root` block) — update them there, this file just documents what they mean and where they're used.

## Color tokens
| Variable | Hex | Used for |
|---|---|---|
| `--bg` | `#0a0712` | page background |
| `--bg-alt` | `#0d0a17` | stats bar background |
| `--bg-panel` | `#110c1c` | reserved / darker panels |
| `--yellow` | `#f5c518` | hero highlight lines, stat numbers, achievement text, icons |
| `--pink` | `#ff2d78` | borders, CTAs, badge, endorsements heading, bullet stars |
| `--white` | `#f3f1f6` | primary text |
| `--muted` | `#a79eb2` | secondary/body copy |
| `--border` | `rgba(255,255,255,0.12)` | hairline dividers, card borders |
| `--border-strong` | `rgba(255,255,255,0.3)` | visible tile/thumbnail outlines on dark imagery (gallery cards) |

## Typography
Fonts are loaded via `next/font/google` in `app/layout.tsx` and exposed as CSS variables consumed in `globals.css`:

| Role | CSS var | Font | Weight | Usage |
|---|---|---|---|---|
| Display | `--font-display` (→ `--font-shoulders`) | Big Shoulders | 700–800 | Hero headline, logo wordmark, section headings, achievement panel text, stat numbers, award badge |
| UI / Nav / Buttons | `--font-ui` (→ `--font-oswald`) | Oswald | 500–700 | Nav links, all buttons, stat labels, logo sublines |
| Body | `--font-body` (→ `--font-figtree`) | Figtree | 400–600 | Paragraphs, bullet list copy, footer contact links |

Type scale (desktop, 1024px — fluid via `clamp` where noted):
- Hero big line: clamp 36–52px (Big Shoulders 800)
- Hero small line: clamp 26–34px (Big Shoulders 700)
- Section heading: clamp 26–34px (Big Shoulders 800)
- Achievement panel text: 16px (Big Shoulders 800)
- Nav links: 12.5px (Oswald, ~0.12em letter-spacing)
- Body paragraph: 14–14.5px (Figtree)
- Stat number: 22px (Big Shoulders Display) / Stat label: 11px (Oswald)
 - Achievement panel eyebrow: 12px (Oswald 700, 0.25em, `--muted`), pinned to each panel's top-left corner (`absolute`, 28/32px offsets) / panel heading: clamp 20–32px (Big Shoulders 800, `--yellow`, 1.02) / body: 14px (Figtree 500, `--muted`, key phrase in `--yellow` at 700) / cue: 11px (Oswald 600, 0.2em, `--pink`) — p2's cue is a prominent solid-`--yellow` button ("Click to see more") linking the mid-day feature — hover lifts it 2px with a yellow glow + arrow slide with the outlet badge above it (`.ach-press-logo-side`: `middaylogo.webp`, 30px tall / 24px ≤768px, floated left so the quote starts from its right)
- Shared-stage strip (`.ach-wide-*`): title clamp 24–38px (Big Shoulders 800, `--pink`) / names 14px (Oswald 500, 0.06em, `--white`) / watch button reuses `.btn-outline` at 11.5px — strip stacks centered ≤768px

Rule: **all-caps + condensed = Big Shoulders or Oswald. Sentence-case paragraphs = Figtree.** Don't mix.

## Spacing
- **Full-bleed sections.** The tour announcement, FAQ, and connect sections deliberately do **not** carry the `.wrap` class : they run the full viewport width with the 40px gutter, like the hero, so their photography renders as large as possible. Everything else (header, hero content, stats, songs, achievements, endorsements, footer, subpages) stays inside `--max: 1400px`. Don't re-add `wrap` to those three, and don't remove it elsewhere without asking.
- Page gutter (desktop): 40px
- Section vertical padding: ~50–60px top/bottom
- Card gap (songs grid): 12px
- Button padding: 12–13px vertical / 22–26px horizontal
- Border radius: 3–4px on buttons/cards (sharp, not rounded — don't default to 8px+ radii). Sanctioned exception: achievement panels use big diagonal curves — p1/p4 `36px 0 36px 0`, p2/p3 `0 36px 0 36px` — and the shared-stage strip uses 24px all round.
- Achievement layout (`.ach-layout`): section gutters 40px each side (30/20/16px down the breakpoints), 2-column grid, 10px gap (8px below 900px); panels min-height 420px (320/300/240/200px down 900/768/720/480); copy bottom-left on all four; 5th strip carries an extra 48px side inset each side (24/12/0px down the breakpoints)

## Breakpoints
| Width | Behavior |
|---|---|
| ≥900px | Full desktop layout as designed; achievements is a plain 2×2 grid (420px panels, diagonal 36px corners) with gutters, shared-stage strip full-width on top with extra inset |
| 768–900px | Same 2-column achievement grid, shrunk; strip text/button stacked centered ≤768px |
| ≤720px | Achievements go single-column, one by one (strip, then 1, 2, 3, 4 in DOM order) — dedicated breakpoint just for this section |
| ≤768px | Nav hides behind burger menu (`components/Header.tsx`), hero text block widens, connect section stacks to 1 column |
| ≤480px | Stats bar → 2 columns, achievements stays single-column but tighter, footer stacks vertically |

## Component patterns
Each pattern below maps to one file under `components/`.

**FAQ** (`FaqSection.tsx`) — native `<details>` accordions answer booking questions about event formats, band sizes, destination shows, and production options. It sits between endorsements and the contact section.

**Buttons** — three variants, all Oswald/uppercase/letter-spaced:
- Filled yellow (`.btn-yellow`) — primary action (Watch Video), in `Hero.tsx`
- Outline pink (`.btn-outline-pink`, `.btn-book`, `.btn-getintouch`) — secondary CTA, fills pink on hover
- Outline white (`.btn-outline`) — tertiary, on dark hero image

**Cards** (`SongsSection.tsx`) — fixed `aspect-ratio: 3/4` on `.song-card`, `next/image` with `fill` + `sizes`, gradient scrim + title anchored bottom-left. Never let card size depend on image intrinsic dimensions — the container drives the crop, not the other way around.

**Achievement grid** (`AchievementsSection.tsx`) — a plain 2-column grid with 40px section gutters (`.ach-layout`, 10px gap): p1 OVER 1300 SHOWS / 40 COUNTRIES, p2 CAREER SOARING HIGH (cue links out to the mid-day Usha Uthup feature, "Click to see more"), p3 WINNER OF MIRCHI MUSIC, p4 OPENING ACT FOR BRYAN ADAMS. Plain panels with big diagonal curves (p1/p4 top-left + bottom-right, p2/p3 top-right + bottom-left), photo fills the curve via `border-radius: inherit` on `.ach-media`. Each panel carries eyebrow + heading + body + cue (`.ach-eyebrow` etc. in `achievements.css`), all four bottom-left. The 5th item — SHARED STAGE WITH + the full old star list + WATCH VIDEO (opens the existing `VideoModal`) — is a full-width strip on top of the grid (`.ach-wide`, `grid-column: 1 / -1`, first in DOM so it stacks first at ≤480px too, 24px radius, crowd photo dimmed + overlay, extra 48px side inset, text left / button right, stacked centered ≤768px).

**Cursor reactions** — the four panels plus the strip answer the cursor: the hairline border lights up `--pink` (`.ach-panel:hover, .ach-wide:hover` swap `border-color`), the photo lifts out of its scrim and zooms in — zoom is a plain `transform: scale()` on a nested `.ach-zoom` wrapper (1.08→1.18 panels, →1.12 strip) while `ScrollEffects.tsx` owns the inner `img` transform for parallax translate only, so the two compose instead of fighting, in every browser — `.ach-text` nudges up 4px, and a `::after` light sweep translates across the artwork (`.ach-media`, `.ach-wide-photo`). The sweep pseudo-elements are hidden under `prefers-reduced-motion` (see `responsive.css`) — never leave a transform-based sweep merely "stopped", it parks its gradient over the photo.

**Badge** ("Winner of Mirchi Music", in `Hero.tsx`) — absolutely positioned, rotated -4deg, pink border, sits over the hero image bottom-right. Positioned relative to `.hero`, not the text column.

**Header** (`Header.tsx`) — the only client component (`"use client"`). Desktop nav is a plain `<nav>`; below 768px it's replaced by a burger button toggling `.mobile-nav.open` via local `useState`. Keep this the only piece of client-side interactivity unless a new feature genuinely needs it.

**Tour announcement** (`TourAnnouncement.tsx`) — a client component (the event switcher and the journey map need state) that sits between the hero and the stats bar, and renders `null` when the studio has no events. It is **full-bleed** (no `.wrap`, see Spacing). Wide screens lay it out as **one row, three columns of equal height**: `[info][image][map]` (`grid-template-columns: 1fr 0.9fr 1.25fr`, 24px gap, `align-items: stretch`), and everything stacks into a single column at ≤768px, with the map dropping under `[info][image]` and spanning full width at 769–1024px. The info column pushes its CTA to the foot (`margin-top: auto`) and the map card is `height: 100%` with its rows spread (`justify-content: space-between`), so all three boxes end on the same line whatever the map's content.
- **Info** : pink kicker 12px Oswald 700 / 0.28em, title `clamp(30–52px)` Big Shoulders 800 uppercase `--yellow`, date 12px Oswald 600 / 0.2em `--white`, description 15px Figtree `--muted`, `.btn-outline-pink` CTA.
- **Image** : the uploaded file keeps its **own** aspect ratio (`width: 100%; height: auto`, never cropped, no fixed frame) inside a hairline 4px-radius border. This is the second sanctioned exception to the fixed-ratio rule, alongside `.connect-photo-full` — the studio uploads whatever shape it likes and the column simply follows it.
- **Journey map** : a low, wide road inside the same hairline card. Geometry is authored in SVG user units (`1000 × 240`, 56px side padding, 3 sine waves) so server and client agree; node x/y are positioned as percentages of those constants and the road is a Catmull-Rom spline through them. The traveller is a pink HTML dot (not an SVG circle, which `preserveAspectRatio="none"` would squash) whose position comes from `getPointAtLength`, and the lit trail is a second copy of the same path with `pathLength="1"`, `stroke-dasharray: 1` and a `stroke-dashoffset` driven from the same progress value — so the road never leads or lags the avatar. `vector-effect: non-scaling-stroke` keeps both strokes 2px/3px at every width, and the lit stroke carries a yellow `drop-shadow`. **Every stop also carries its name**, tiny (8px, 7.5px ≤480px) in Oswald above/below alternating nodes (`is-above`/`is-below`), ellipsised at 92px, with `is-first`/`is-last` anchoring the end labels inward so none spill out of the card.
- **Interaction** : the journey loops **forever, one stop at a time** — 0.5s eased travel to the next stop (`MOVE_MS`), 0.5s hold (`HOLD_MS`), then on to the next, wrapping back to the first stop at the end. The city name and counter therefore change about once a second. Moving the cursor across the map **scrubs** the traveller (cursor x is mapped back onto the curve via a sampled lookup, so it tracks the road, not the straight line); leaving hands the journey back to the loop, resuming from the nearest stop. Milestones are real `<button>`s (keyboard-focusable, `aria-label`, `aria-current`) that pin the traveller, light up as they are passed, and pop the current one; the active city is named again below in `clamp(18–25px)` Big Shoulders `--yellow` with a `START`/`STOP NN` eyebrow and a cursor hint. Map height stays deliberately short — 200px desktop, 185/165/150px down 1024/768/480 — so the road spreads sideways rather than down.
- **Switcher** : with more than one event, a hairline-topped row (label, `01 / 03` counter, yellow dots) flips between them; the `featured` event sorts first and opens it. There are deliberately no prev/next arrows — the journey animates on its own and the dots are the only control.
- **Reduced motion** : no rAF loop — the trail is stepped straight to full length, the traveller parked at the last stop, and the decorative pulse ring hidden (`prefers-reduced-motion` block in `tour.css`).

## Studio-managed media (blog + gallery + tour)
Three places accept images authored in the private studio, and all follow the same visual rules:
- **Blog article** (`app/blog/[slug]/page.tsx`): the whole article sits in one hairline frame (`1px var(--border)`, 4px radius, panel→bg gradient, fluid `clamp(24–58px)` padding). The header (tag / title / excerpt) is separated from the body by a rule; content images keep their own aspect ratio (`width: 100%; height: auto`) and are centred — never cropped, unlike the landing page's fixed-ratio containers. Extra shots are always a **2-up grid** (`repeat(2, minmax(0, 1fr))`, 4:3 tiles via `object-fit: cover`), collapsing to one column at 480px, so any count (5 included) leaves a half-width cell rather than stretching. The closing CTA reuses `.btn-outline-pink` inside `.blog-post-footer` (62px top margin + rule + 40px padding above it).
- **Blog listing** (`app/blog/page.tsx`): a card is clickable anywhere — the title link's `::after` covers the card (`inset: 0`), with `:focus-within` on the card; `READ STORY ↗` is a decorative cue, not a second tab stop.
- **Gallery** (`app/gallery/page.tsx`): a server component that appends studio photos after the built-in eight, passing both to the client `GalleryBrowser`. Managed photos reuse `.gallery-card` exactly (same hover overlay, filter tabs, lightbox); every fifth spans two columns to keep the masonry rhythm.
- **Studio panel** (`/dashboard`, styled in `public/css/blog.css` with the tour form's own rules in `public/css/tour.css` and the shell in `public/css/dashboard.css`): the gallery form is a bordered card with a two-column Caption/Category split (stacked at 768px), 50px-tall fields on `--bg`, a drawn-chevron `select`, and a pink-railed preview strip; the photo list is thumbnail + caption + a `ImageKit`/`Linked` chip + a pink remove button. The tour form reuses that card (`.blog-gallery-form.tour-form`) and adds `.tour-field-row` two-up rows (Kicker/Date, Ending note/Button label), a monospace-free cities textarea (one city per line), and an accent-pink featured checkbox; the tour list reuses the gallery row and adds a pink `Featured` chip.

## Dashboard (`/dashboard`)
One route, two states : **signed out it is the sign-in page** (heading + form side by side, `.dashboard-login` two-column collapsing to one at 900px), **signed in it is the studio**. It is full-bleed (no `.wrap`) and deliberately has no site header — the top bar carries `← RETURN TO HOME` on the left and the `PRIVATE STUDIO` flag plus `SIGN OUT` on the right.

The studio is three tabs — Stories, Gallery, Tour Events — each showing **its listing first and its add/edit form below** (`components/dashboard/*Panel.tsx`). Only the active panel is mounted, so the forms' field ids never collide across tabs. The switcher (`DashboardShell.tsx`) is one markup with two layouts:
- **≥900px : a vertical side nav** (236px track, `position: sticky`) beside the content, with the section count in a chip on each tab and the active tab outlined `--yellow`.
- **≤900px : a horizontal tab strip** pinned to the top (`flex-direction: row`, `position: sticky`, horizontal scroll, blurred `rgba(10,7,18,.94)` bar, hidden scrollbar) so switching never costs a scroll back up.

Tabs are a real ARIA `tablist`/`tabpanel` pair with roving `tabIndex` and arrow/Home/End key handling. Which tab opens is decided server-side: an `edit` flag wins for Stories, `tourEdit` for Tour, otherwise the `tab` param, defaulting to Stories. Each tab renders only its own toasts (`DashboardMessages.tsx`), and the server actions redirect back to `/dashboard?tab=…` so a save always lands on the section you were working in.

## Image/asset rules
- Every image slot has a fixed container `aspect-ratio` (see `globals.css`) — this preserves the reference composition even with placeholder art. Containers use `position: relative` so `next/image fill` can fill them.
- Current placeholders: `picsum.photos/seed/<name>/<w>/<h>` — deterministic per seed, swappable 1:1 with real assets later. `picsum.photos` is whitelisted in `next.config.ts` under `images.remotePatterns`; add any new host there before using it.
- **Crop anchor is top-left, site-wide.** `img` in `base.css` sets `object-fit: cover` + `object-position: left top`, so whatever the source's aspect ratio, the frame is cropped from the right/bottom and nothing is trimmed off the top or left of the photo. Don't reintroduce per-image `object-position` offsets; if one image needs different framing, change the crop by other means and check the fixed container ratio (rule 5 in `AGENTS.md`). Two kinds of image opt out. (1) `.footer-bg-img` (`50% 25%`) keeps horizontal centring because its subject sits centred — it's a portrait head-shot stretched into a wide strip, so a left-top anchor would push the face out of view. (1b) `.hero-img-wrap img` switches to `center` at ≤768px — on narrow phones the left-top anchor crops the performer out of frame. (2) `object-fit: contain` images — header/footer logos, endorsement logos, and the gallery lightbox — stay `object-position: center`, because `contain` never crops and a top-left anchor would shove a logo into the corner.
- **`.connect-photo-full` (last image before the footer) always renders the photo's original width and height.** Static import hands Next the intrinsic dimensions; `width: 100% / height: auto` scales them fluidly — no `aspect-ratio`, no fixed sizes, never cropped. Middle track is `1.5fr` so the photo gets room on desktop; full width when stacked.
- **`.connect-photo-full` keeps full detail**: `quality={100}` with `sizes` (`100vw` ≤900px, `45vw` above), no `saturate`/`contrast` filter
- **`sizes` must describe the real rendered width, not the viewport.** A `fill` image gets `100vw` only when it genuinely spans the viewport (hero and subpage heroes). Everything else — song cards, achievement panels and the shared-stage strip, endorsement logo cards, gallery cards, show cards, the about portrait, `.connect-photo-full` — passes a `sizes` that matches its own container, otherwise Next warns that the image "is not rendered at full viewport width" and ships an oversized candidate. Keep these in step when a container's width changes.
- **`.connect-photo-full` has a magnet drift**: the container never moves (`overflow: hidden` clips); an overscanned inner layer (`.connect-magnet`, 8px larger per side) leans up to ±7px toward the cursor via `onMouseMove` and springs back on leave, centred at rest on all screens. Needs `"use client"` (genuine cursor interactivity). No scroll parallax on this photo — nothing else writes transforms here. Skipped under `prefers-reduced-motion`.
- **Hero images** use a CSS duotone/gradient overlay (`.hero-duo`) to unify placeholder photography with the cinematic blue/purple/gold palette — keep this overlay even after swapping to real photos, it's part of the visual identity, not a placeholder crutch.
