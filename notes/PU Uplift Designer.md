---
tags: [processunity, skill, automation, regulatory-uplift]
related:
  - "[[PU DORA]]"
  - "[[PU Admin Navigator]]"
  - "[[PU Config Designer]]"
  - "[[ProcessUnity MOC]]"
---

# PU Uplift Designer

Generate automation manifests for deploying any regulatory compliance framework into ProcessUnity.

## What It Does

Takes input documents (STAR sizing docs, reference implementation metadata, regulatory taxonomy sources) and generates **four JSON manifests** that drive automated PU configuration:

1. `{framework}-properties.json` — Every property to create
2. `{framework}-reports.json` — Every report and dashboard
3. `{framework}-buttons.json` — Every button with WFA wiring
4. `{framework}-validation.json` — Pre/post-flight checks

## Architecture

```
pu-uplift-designer → generates manifests
         ↓
pu-dora (data package) → DORA-specific manifests
         ↓
pu-admin-navigator → executes via browser automation
```

## Reference Implementation

[[PU DORA]] is the first complete implementation with:
- 194 properties across 10 objects
- 39 reports (import, export, dashboard, WFA)
- 9 buttons with WFA step wiring
- 643 reference data records
- Full automation helpers + validation scripts

## Key Files

| File | Location | Purpose |
|------|----------|---------|
| SKILL.md | `skills/pu-uplift-designer/` | Manifest generation guide |
| manifest-schema.md | `skills/pu-dora/automation/` | JSON schema for all manifests |
| helpers.js | `skills/pu-dora/automation/` | 20 reusable Playwright functions |

## Skill Dependencies

- [[PU App Guide]] — Platform knowledge
- [[PU Config Designer]] — Configuration patterns
- [[PU Admin Navigator]] — Browser automation execution
- [[PU DORA]] — Reference implementation
