---
tags:
  - processunity
  - reports
  - automation
  - mcp
created: 2026-04-09
related:
  - "[[PU Environment Setup]]"
  - "[[PU Report Builder]]"
  - "[[PU Admin Navigator]]"
  - "[[PU Data Model]]"
---

# PU Scaffold Reports

Automated creation of one Custom Report per object type — gives an MCP agent read access to every field on every object in any PU instance.

## What It Does

1. **Discovers** all available object types from the Level 1 dropdown
2. **Checks** which `[MCP - *]` reports already exist (idempotent)
3. **Creates** missing reports with: name, Level 1, all columns, MCP role access, automated export
4. **Fixes** existing reports that are missing Level 1 or columns (partial failure recovery)

## Key Innovation: Two-Pass Algorithm

PU requires Level 1 to be **saved server-side** before the "Add Columns" button appears. The script saves the report shell first, then re-edits to add columns. This was the critical lesson from the initial automation attempt where all batch-created reports got 0 columns.

## Usage

```
/pu-scaffold-reports desert
```

Or invoke the skill directly when connecting a new instance.

## Automation Details

Uses Playwright browser automation to drive the PU admin UI. Key patterns:
- **React dropdown widget**: Must use native value setter + input event dispatch
- **Busy shield bypass**: Use `page.evaluate()` for all clicks to bypass PU's loading overlay
- **Dialog retry loop**: Column picker dialog needs 3-12 seconds to load; poll for `rows.length > 1`

## Related Skills
- [[PU Environment Setup]] — prerequisite: roles, credentials, MCP server config
- [[PU Report Builder]] — manual report design (columns, groups, charts, multi-level)
- [[PU Admin Navigator]] — general browser automation patterns for PU

*See also:* `skills/pu-scaffold-reports/references/scaffold-reports.js` for the full Playwright script
