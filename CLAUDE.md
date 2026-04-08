# ProcessUnity Skills — Project Instructions

## What This Is

A Claude Code plugin AND Obsidian vault in one repo. Contains AI skills for configuring and managing ProcessUnity instances.

## Dual-Write Rule

**When adding or updating any skill, ALWAYS write to BOTH locations:**

1. **`skills/<skill-name>/SKILL.md`** — The authoritative skill definition. Include YAML frontmatter with `name`, `description`, and `depends_on`. Add a `references/` subfolder for supporting docs.

2. **`notes/<Skill Display Name>.md`** — The Obsidian browsing note. Must include:
   - YAML frontmatter: `tags`, `created`, `related` (with `[[wiki links]]`)
   - Condensed summary of the skill (not a copy — a human-readable overview)
   - `[[wiki links]]` to related skills and references
   - Footer with `*See also:*` cross-references

3. **`notes/ProcessUnity MOC.md`** — Update the Core Skills table and Learning Path to include the new skill.

## Obsidian Integration

- This repo is symlinked into the Obsidian Work vault at `~/Documents/Obsidian Vaults/Work/30 Reference/ProcessUnity`
- `.obsidian/` is gitignored — vault config stays local
- Obsidian Git plugin handles sync — just commit and push
- `[[wiki links]]` in notes resolve within the `notes/` folder
- Obsidian graph view shows skill interconnections

## File Structure

```
skills/              ← Authoritative SKILL.md files (Claude Code reads these)
  pu-data-model/
  pu-config-designer/
  pu-admin-navigator/
  pu-import/
  pu-report-builder/
  pu-agentic-pipeline/
  pu-enrich/
  pu-configuration/
  pu-instance-analyzer/
  pu-dora/
  vendor-lookup/
notes/               ← Obsidian browsing layer (wiki links, MOC, frontmatter)
  ProcessUnity MOC.md
  PU Data Model.md
  PU DORA.md
  ...
  References/
commands/            ← Slash commands (/pu-configure, /pu-dora, etc.)
execution-plans/     ← Pre-built JSON config plans
```

## Naming Conventions

| Location | Convention | Example |
|----------|-----------|---------|
| Skills folder | `pu-<name>/SKILL.md` | `skills/pu-connector-bitsight/SKILL.md` |
| Notes file | `PU <Display Name>.md` | `notes/PU Connector BitSight.md` |
| Commands | `pu-<name>.md` | `commands/pu-connector.md` |
| Wiki links | `[[PU Display Name]]` | `[[PU Connector BitSight]]` |

## Commit Conventions

- Always commit both `skills/` and `notes/` changes together
- Use descriptive commit messages: "Add BitSight connector skill with setup guide and field mappings"
- Push after commit — Obsidian Git picks up on next open

## What's Next

Connector skills to add (from PU help system articles):
- BitSight, SecurityScorecard, RiskRecon, Recorded Future
- GRX Exchange, Interos, CyberGRX
- Each gets: skill definition + references + Obsidian note + MOC entry
