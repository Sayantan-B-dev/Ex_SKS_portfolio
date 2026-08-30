# SKS — Sammrat Ka Saagar Music Band

Next.js (App Router) recreation of a music-band landing page, pixel-matched against a reference screenshot.

## Stack
Next.js 16 · React 19 · TypeScript · plain CSS (no Tailwind/CSS-in-JS) · `next/font` · `next/image`

## Setup
```bash
npm install
npm run dev       # http://localhost:3000
```
```bash
npm run build     # production build — needs real internet (fetches Google Fonts at build time)
npm run start
npm run lint
```
Requires Node 20+.

## Project docs (read these before making changes)
| File | Purpose |
|---|---|
| `AGENTS.md` | **Canonical instructions** for any AI coding agent — project rules, conventions, verification workflow. Start here. |
| `DESIGN.md` | Design tokens (colors, type, spacing) and component patterns — the values source of truth. |
| `CLAUDE.md` | Thin pointer to `AGENTS.md` + Claude Code–only notes. |
| `.clinerules` | Thin pointer to `AGENTS.md` for Cline, which doesn't read `AGENTS.md` natively. |

Cursor, OpenCode, Antigravity, Codex CLI, Windsurf, Copilot, Aider, and current Claude Code all read `AGENTS.md` automatically — no per-tool setup needed for those. Cline needs `.clinerules` (included) since it doesn't parse `AGENTS.md` yet.

## Adding skills (cross-agent, via skills.sh)
This project doesn't require any installed skills to work — `AGENTS.md`/`DESIGN.md` already carry the project-specific instructions. The commands below are optional, for pulling in general-purpose, actively maintained skills if you want an agent to have deeper React/Next.js reference knowledge than the project docs alone provide.

[skills.sh](https://skills.sh) is Vercel's open, cross-agent skill installer — one CLI, 50+ supported agent targets (Claude Code, Cursor, OpenCode, Antigravity, Cline, Windsurf, Codex, Copilot, and more). It detects your agent(s) and installs the skill to the right path automatically.

```bash
# Preview what a skill contains before installing (no changes made)
npx skills add vercel-labs/agent-skills --list

# Distinctive UI direction (Anthropic, ~830K installs)
npx skills add anthropics/skills --skill frontend-design

# Vercel Web Interface Guidelines (accessibility, type, focus, motion)
npx skills add vercel-labs/agent-skills --skill web-design-guidelines

# React + Next.js performance best practices (Vercel Engineering, officially maintained)
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices

# Composable React component architecture patterns
npx skills add vercel-labs/agent-skills --skill react-composition-patterns

# Next.js-specific workflow skills (file conventions, RSC boundaries, caching) — lives in the Next.js repo itself, version-matched to your installed Next version
npx skills add vercel/next.js

# Install to one specific agent instead of auto-detecting all installed ones
npx skills add vercel-labs/agent-skills --skill vercel-react-best-practices --agent cursor
```

Stick to official/high-install sources (`vercel-labs/*`, `vercel/next.js`, `anthropics/skills`) — anyone can publish a skill, and an unvetted one is instructions an agent will follow inside your repo. Prefer skills with a large install count from a recognizable maintainer over an unfamiliar one.

## Known limitation in restricted/offline sandboxes
`next build` fetches and self-hosts Google Fonts at build time via `next/font/google`. In an environment with no internet access this step will fail — that's expected, not a bug in this repo. `next dev` degrades gracefully to a fallback font when fonts can't be reached, so local development still works.

## Song marquee troubleshooting
The song marquee is driven by the `marquee-infinite` animation in `public/css/songs.css`. Its track contains two identical song groups and translates by `-50%`, which makes the loop seamless. The reduced-motion media query in `public/css/responsive.css` intentionally keeps this marquee animation running so it does not become static when the browser reports `prefers-reduced-motion: reduce`; other page animations still honor that preference.
