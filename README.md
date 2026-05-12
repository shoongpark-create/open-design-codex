# open-design-codex

Codex CLI mount for the [Open Design](https://github.com/shoongpark-create/open-design) fashion-business fork.

This repo holds **only a manifest** — no skill content lives here. All 75 skills are symlinks regenerated on a fresh clone by `scripts/link.mjs` from two sibling checkouts:

```
<parent>/
├── system/        ← shoongpark-create/open-design   (55 linked skills)
├── .claude/       ← shoongpark-create/open-design-skills   (20 vendored skills under skills/)
└── .codex/        ← THIS REPO  (75 symlinks: 55 system + 20 vendored)
```

## Why a separate mount?

`.claude/` is the project-level mount that Claude Code reads. `.codex/` is the equivalent mount for Codex CLI, exposing the same skills (plus `.claude/`'s vendored ones, the project-local `imagegen` policy override, the data-intelligence skills, and the project-installed NotebookLM skill) so any agent that scans `~/.codex/skills/` or a project-local `.codex/skills/` finds the full toolkit.

## Setup on a fresh clone

```bash
# Layout assumes the three repos sit side-by-side
git clone https://github.com/shoongpark-create/open-design.git system
git clone https://github.com/shoongpark-create/open-design-skills.git .claude
git clone https://github.com/shoongpark-create/open-design-codex.git .codex

# Materialize the 75 symlinks
cd .codex
node scripts/link.mjs
```

If `system/` or `.claude/` live elsewhere:

```bash
OD_SYSTEM_SKILLS="/abs/or/relative/path/system/skills" \
OD_VENDORED_SKILLS="/abs/or/relative/path/.claude/skills" \
  node scripts/link.mjs
```

Both env vars are interpreted relative to the `.codex/` directory.

## Useful flags

```bash
node scripts/link.mjs --dry-run    # preview, no filesystem changes
node scripts/link.mjs --force      # replace existing symlinks/folders
```

## Adding a new skill

1. Add an entry to `skills.manifest.json` with `source: "system"` or `source: "vendored"`:
   ```json
   { "name": "fashion-new-thing", "source": "system", "target": "fashion/fashion-new-thing" }
   ```
2. Add the same name to `.gitignore` under the symlinks block.
3. Run `node scripts/link.mjs` to materialize the symlink locally.
4. Commit the manifest + `.gitignore` change.

## License

Apache-2.0 — same as the parent project.
