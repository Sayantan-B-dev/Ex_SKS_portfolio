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
- Page gutter (desktop): 40px
- Section vertical padding: ~50–60px top/bottom
- Card gap (songs grid): 12px
- Button padding: 12–13px vertical / 22–26px horizontal
- Border radius: 3–4px on buttons/cards (sharp, not rounded — don't default to 8px+ radii). Sanctioned exception: achievement panels use big diagonal curves — p1/p4 `36px 0 36px 0`, p2/p3 `0 36px 0 36px` — and the shared-stage strip uses 24px all round.
- Achievement layout (`.ach-layout`): section gutters 40px each side (30/20/16px down the breakpoints), 2-column grid, 10px gap (8px below 900px); panels min-height 420px (320/280/220px down the breakpoints); copy bottom-left on all four; 5th strip carries an extra 48px side inset each side (24/12/0px down the breakpoints)

## Breakpoints
| Width | Behavior |
|---|---|
| ≥900px | Full desktop layout as designed; achievements is a plain 2×2 grid (420px panels, diagonal 36px corners) with gutters, shared-stage strip full-width on top with extra inset |
| 768–900px | Same 2-column achievement grid, shrunk; strip text/button stacked centered ≤768px |
| ≤768px | Nav hides behind burger menu (`components/Header.tsx`), hero text block widens, connect section stacks to 1 column |
| ≤480px | Stats bar → 2 columns, achievements → 1 column (5th strip first, then 1, 2, 3, 4), footer stacks vertically |

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

## Image/asset rules
- Every image slot has a fixed container `aspect-ratio` (see `globals.css`) — this preserves the reference composition even with placeholder art. Containers use `position: relative` so `next/image fill` can fill them.
- Current placeholders: `picsum.photos/seed/<name>/<w>/<h>` — deterministic per seed, swappable 1:1 with real assets later. `picsum.photos` is whitelisted in `next.config.ts` under `images.remotePatterns`; add any new host there before using it.
- **Crop anchor is top-left, site-wide.** `img` in `base.css` sets `object-fit: cover` + `object-position: left top`, so whatever the source's aspect ratio, the frame is cropped from the right/bottom and nothing is trimmed off the top or left of the photo. Don't reintroduce per-image `object-position` offsets; if one image needs different framing, change the crop by other means and check the fixed container ratio (rule 5 in `AGENTS.md`). Two kinds of image opt out. (1) `.footer-bg-img` (`50% 25%`) keeps horizontal centring because its subject sits centred — it's a portrait head-shot stretched into a wide strip, so a left-top anchor would push the face out of view. (1b) `.hero-img-wrap img` switches to `center` at ≤768px — on narrow phones the left-top anchor crops the performer out of frame. (2) `object-fit: contain` images — header/footer logos, endorsement logos, and the gallery lightbox — stay `object-position: center`, because `contain` never crops and a top-left anchor would shove a logo into the corner.
- **`.connect-photo` (last image before the footer) is a fixed `3 / 4` portrait slot in the middle column.** The container drives the crop per rule 5 in `AGENTS.md`. Its `center` anchor keeps the performer framed when the landscape source is cropped to portrait — same centred-anchor opt-out as `.footer-bg-img`.
- **`.connect-photo` keeps full detail**: `quality={100}` with a generous `sizes` hint (`50vw` ≤900px, `33vw` above — never an undersized fixed-px value, which makes Next serve a blurry variant), no `saturate`/`contrast` filter
- **`.connect-photo` has a magnet drift**: the container never moves (`overflow: hidden` clips); an overscanned inner layer (`.connect-magnet`, `inset: -24px`) leans up to ±14px toward the cursor via `onMouseMove` and springs back on leave. Needs `"use client"` (genuine cursor interactivity). Composes with the scroll parallax, which translates the inner `img` — separate elements, no fight. Skipped under `prefers-reduced-motion`. — the client's "pure and clean" request; it's the one place without a treatment overlay. On phones the stack keeps DOM order so the photo stays in the middle (never `order: -1` it to the top).
- **Hero images** use a CSS duotone/gradient overlay (`.hero-duo`) to unify placeholder photography with the cinematic blue/purple/gold palette — keep this overlay even after swapping to real photos, it's part of the visual identity, not a placeholder crutch.
