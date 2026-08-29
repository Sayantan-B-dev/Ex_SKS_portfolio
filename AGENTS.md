# AGENTS.md
Canonical instructions for any AI coding agent working in this repo — Claude Code, Cursor, OpenCode, Antigravity, Windsurf, Codex CLI, Copilot, Aider, Cline, or anything else. This is the single source of truth; tool-specific files (`CLAUDE.md`, `.clinerules`) are thin pointers back to this one so instructions never drift out of sync across tools.

## Project summary
`sks-music-band` — a Next.js (App Router) recreation of a music-band landing page, pixel-matched against a reference screenshot (`type--Normal.png`, keep it in the repo root if present). One route (`/`), no CMS, no database, no auth. Composed of one page (`app/page.tsx`) assembling eight presentational components under `components/`.

- Framework: Next.js 16 (App Router, Turbopack), React 19, TypeScript
- Styling: plain CSS in `app/globals.css` using CSS custom properties — no Tailwind, no CSS-in-JS, no CSS modules
- Fonts: loaded via `next/font/google` in `app/layout.tsx` (Big Shoulders, Oswald, Figtree) — not `<link>` tags
- Images: `next/image`, remote source is `picsum.photos` (whitelisted in `next.config.ts`) as placeholder art
- Reference: `DESIGN.md` is the values source of truth (colors, type scale, spacing); the screenshot is the layout source of truth

## Setup
```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build — requires real internet to fetch Google Fonts at build time
npm run lint
```
Node 20+ required (see `engines` in `package.json`).

## Non-negotiable constraints
1. **The screenshot is the spec, not inspiration.** Don't redesign, simplify, re-theme, or "improve" sections — match it. If you must deviate, say why.
2. **Don't reorder or remove page sections.** Fixed order: Header → Hero → Stats bar → Songs → Achievements → Endorsements → Connect → Footer.
3. **Keep the component split as-is** (`components/Header.tsx`, `Hero.tsx`, `StatsBar.tsx`, `SongsSection.tsx`, `AchievementsSection.tsx`, `Endorsements.tsx`, `ConnectSection.tsx`, `Footer.tsx`) unless asked to restructure. Don't introduce a UI kit, CSS framework, or state-management library for what is a static marketing page.
4. **Preserve exact copy and line breaks** in headings (e.g. "OVER 1300 SHOWS" / "40 COUNTRIES" as two lines) unless asked to change wording.
5. **Image containers have fixed aspect ratios by design.** When swapping a `src`, never change the container's `aspect-ratio`/width/height to accommodate a differently-shaped image — crop/reposition with `object-position` instead.
6. **Pull all colors, type sizes, and spacing from `DESIGN.md`.** Don't hardcode a new hex value or px size without adding it there first.
7. **`Header.tsx` is the only client component** (`"use client"`, for the mobile-menu `useState`). Keep the rest as server components — don't add `"use client"` to a component unless it genuinely needs interactivity, state, or a browser-only API.
8. **No commits without explicit permission.** Do not run `git commit`, `git push`, or create PRs unless the user explicitly asks. Git actions require user approval.

## Conventions
- **CSS lives in `public/css/` as separate files, imported via `globals.css`.** Never write CSS rules directly in `globals.css` — it should only contain `@import` statements. Create a new file in `public/css/` (e.g. `cursor.css`, `buttons.css`) and add the import to `globals.css`.
- CSS custom properties for all colors (`--bg`, `--yellow`, `--pink`, etc.) — never inline hex codes.
- Font roles are fixed and don't mix: `Big Shoulders` (`--font-display`) for big display headlines only, `Oswald` (`--font-ui`) for nav/buttons/labels/all-caps UI text, `Figtree` (`--font-body`) for paragraphs.
- Breakpoints: `900px`, `768px`, `480px`. Any layout change should be checked at all three, not just desktop.
- TypeScript strict mode is on — don't add `any` or disable strict checks to work around a type error; fix the type.

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
- If real photography/logos replace the `picsum.photos` placeholders, add the new host to `images.remotePatterns` in `next.config.ts` — Next's image optimizer blocks unlisted remote hosts by default.

## Definition of done
- [ ] Matches the reference screenshot at 1024px width (or explicitly diverges for a stated reason)
- [ ] `npm run lint` and `npx tsc --noEmit` pass with no errors
- [ ] Checked at 900px, 768px, and 480px
- [ ] No new dependency, framework, or build-step change introduced without being asked
- [ ] Colors/type/spacing pulled from `DESIGN.md` tokens, not new hardcoded values
