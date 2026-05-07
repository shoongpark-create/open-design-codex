#!/usr/bin/env node
/**
 * .codex/scripts/link.mjs
 *
 * Regenerates the symlinks under skills/ from skills.manifest.json.
 * Each link has a `source` ("system" or "vendored") that selects the root
 * — by default `../system/skills` and `../.claude/skills` respectively —
 * and a `target` path within that root.
 *
 * Override with env vars:
 *   OD_SYSTEM_SKILLS    — overrides systemSkillsRoot
 *   OD_VENDORED_SKILLS  — overrides vendoredSkillsRoot
 *
 * Both env vars are interpreted relative to the .codex/ repo root.
 */
import { readFile, symlink, rm, stat, mkdir } from 'node:fs/promises';
import { join, dirname, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const MANIFEST_PATH = join(ROOT, 'skills.manifest.json');

const args = new Set(process.argv.slice(2));
const DRY = args.has('--dry-run') || args.has('-n');
const FORCE = args.has('--force') || args.has('-f');

const log = (...a) => console.log(...a);
const warn = (...a) => console.warn('⚠ ', ...a);

const manifest = JSON.parse(await readFile(MANIFEST_PATH, 'utf8'));
const roots = {
  system: process.env.OD_SYSTEM_SKILLS || manifest.systemSkillsRoot,
  vendored: process.env.OD_VENDORED_SKILLS || manifest.vendoredSkillsRoot,
};

const skillsDir = join(ROOT, 'skills');
await mkdir(skillsDir, { recursive: true });

let created = 0, skipped = 0, replaced = 0, broken = 0;

for (const { name, source, target } of manifest.links) {
  const root = roots[source];
  if (!root) {
    warn(`unknown source "${source}" for "${name}" — skipped`);
    broken++;
    continue;
  }
  const linkPath = join(skillsDir, name);
  const absTarget = resolve(ROOT, root, target);
  const relTarget = relative(skillsDir, absTarget);

  let existing;
  try { existing = await stat(linkPath); } catch {}

  try { await stat(absTarget); }
  catch {
    warn(`target missing for "${name}": ${absTarget}`);
    broken++;
    continue;
  }

  if (existing) {
    if (!FORCE) {
      log(`skip   ${name} (already exists; use --force to replace)`);
      skipped++;
      continue;
    }
    if (DRY) { log(`replace ${name} -> ${relTarget} [dry]`); replaced++; continue; }
    await rm(linkPath, { recursive: true, force: true });
    await symlink(relTarget, linkPath);
    log(`replace ${name} -> ${relTarget}`);
    replaced++;
    continue;
  }

  if (DRY) { log(`create ${name} -> ${relTarget} [dry]`); created++; continue; }
  await symlink(relTarget, linkPath);
  log(`create ${name} -> ${relTarget}`);
  created++;
}

log('');
log(`done: created=${created} replaced=${replaced} skipped=${skipped} broken=${broken}`);
if (broken > 0) {
  log('');
  log(`Hint: ensure ../system/skills and ../.claude/skills exist, or set:`);
  log(`  OD_SYSTEM_SKILLS=/abs/path/system/skills`);
  log(`  OD_VENDORED_SKILLS=/abs/path/.claude/skills`);
  process.exit(1);
}
