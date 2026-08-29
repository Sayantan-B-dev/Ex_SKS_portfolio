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

Rule: **all-caps + condensed = Big Shoulders or Oswald. Sentence-case paragraphs = Figtree.** Don't mix.

## Spacing
- Page gutter (desktop): 40px
- Section vertical padding: ~50–60px top/bottom
- Card gap (songs grid): 12px
- Button padding: 12–13px vertical / 22–26px horizontal
- Border radius: 3–4px on buttons/cards (sharp, not rounded — don't default to 8px+ radii)

## Breakpoints
| Width | Behavior |
|---|---|
| ≥900px | Full desktop layout as designed |
| 768–900px | Achievements grid collapses to 2 columns, "Shared Stage" panel spans full width |
| ≤768px | Nav hides behind burger menu (`components/Header.tsx`), hero text block widens, connect section stacks to 1 column |
| ≤480px | Stats bar → 2 columns, achievements → 1 column, footer stacks vertically |

## Component patterns
Each pattern below maps to one file under `components/`.

**Buttons** — three variants, all Oswald/uppercase/letter-spaced:
- Filled yellow (`.btn-yellow`) — primary action (Watch Video), in `Hero.tsx`
- Outline pink (`.btn-outline-pink`, `.btn-book`, `.btn-getintouch`) — secondary CTA, fills pink on hover
- Outline white (`.btn-outline`) — tertiary, on dark hero image

**Cards** (`SongsSection.tsx`) — fixed `aspect-ratio: 3/4` on `.song-card`, `next/image` with `fill` + `sizes`, gradient scrim + title anchored bottom-left. Never let card size depend on image intrinsic dimensions — the container drives the crop, not the other way around.

**Achievement panels** (`AchievementsSection.tsx`) — `clip-path: polygon(...)` creates the diagonal-cut composition. `.ach-text` must stay left-anchored within the un-clipped portion of each trapezoid — check this whenever panel widths change.

**Badge** ("Winner of Mirchi Music", in `Hero.tsx`) — absolutely positioned, rotated -4deg, pink border, sits over the hero image bottom-right. Positioned relative to `.hero`, not the text column.

**Header** (`Header.tsx`) — the only client component (`"use client"`). Desktop nav is a plain `<nav>`; below 768px it's replaced by a burger button toggling `.mobile-nav.open` via local `useState`. Keep this the only piece of client-side interactivity unless a new feature genuinely needs it.

## Image/asset rules
- Every image slot has a fixed container `aspect-ratio` (see `globals.css`) — this preserves the reference composition even with placeholder art. Containers use `position: relative` so `next/image fill` can fill them.
- Current placeholders: `picsum.photos/seed/<name>/<w>/<h>` — deterministic per seed, swappable 1:1 with real assets later. `picsum.photos` is whitelisted in `next.config.ts` under `images.remotePatterns`; add any new host there before using it.
- Hero and connect-section images use a CSS duotone/gradient overlay (`.hero-duo`, `.connect-img::after`) to unify placeholder photography with the cinematic blue/purple/gold palette — keep this overlay even after swapping to real photos, it's part of the visual identity, not a placeholder crutch.
