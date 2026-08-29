# CLAUDE.md

Read **`AGENTS.md`** first — it's the canonical, tool-agnostic instruction set for this repo (project summary, setup, constraints, conventions, verification workflow, definition of done). Everything below is Claude Code–specific only; it does not repeat what's already in `AGENTS.md`.

## Claude Code–specific notes
- This repo has no `.claude/settings.json` or custom permission rules checked in. If you add MCP servers or tool permissions for this project, document them here rather than only in local, untracked settings.
- If you install a project skill for this repo (see the Skills section in `README.md`), it lives in `.claude/skills/<name>/SKILL.md` and should be committed so it travels with the repo.
- No subagents are defined for this project. If you add one (e.g. a dedicated visual-QA subagent that runs the Playwright screenshot workflow from `AGENTS.md`), note its purpose here.

Keep this file thin. If an instruction applies to any coding agent (not just Claude Code), put it in `AGENTS.md` instead — duplicating instructions across files is how they drift out of sync.
