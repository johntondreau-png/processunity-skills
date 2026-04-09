---
description: Create MCP read-access reports for every object type in a ProcessUnity instance
allowed-tools: Bash, Read, Write, Edit, Glob, Grep, mcp__plugin_playwright_playwright__browser_navigate, mcp__plugin_playwright_playwright__browser_run_code, mcp__plugin_playwright_playwright__browser_snapshot, mcp__plugin_playwright_playwright__browser_click, mcp__plugin_playwright_playwright__browser_fill_form, mcp__plugin_playwright_playwright__browser_type, mcp__plugin_playwright_playwright__browser_wait_for, mcp__plugin_playwright_playwright__browser_evaluate, mcp__processunity__list_reports, mcp__processunity-desert__list_reports
argument-hint: "<instance-name e.g. desert>"
---

# /pu-scaffold-reports

Create one Custom Report per object type in a ProcessUnity instance, with all columns
and scoped to the MCP service role.

## Instructions

1. Read the skill definition at `${CLAUDE_PLUGIN_ROOT}/skills/pu-scaffold-reports/SKILL.md`
2. Read the automation script at `${CLAUDE_PLUGIN_ROOT}/skills/pu-scaffold-reports/references/scaffold-reports.js`
3. Determine which PU instance to target:
   - If `${ARGUMENTS}` is provided (e.g., "desert"), use `https://app.processunity.net/${ARGUMENTS}`
   - Otherwise, ask the user which instance to scaffold
4. Check existing reports via the MCP API (`list_reports` on the target instance):
   - Identify which `[MCP - *]` reports already exist
   - Determine which object types still need reports
5. If no reports exist yet, run the full scaffolding:
   a. Log into PU via Playwright browser automation
   b. Navigate to REPORTS > Custom Reports
   c. Discover available object types from the Level 1 dropdown
   d. Create reports using the two-pass algorithm (see SKILL.md)
   e. Set access to the MCP role for each report
6. If some reports exist but lack columns (Level 1 missing), run Pass 2 only on those
7. Verify all reports are accessible via the MCP API
8. Report results to the user with a summary table

## Inputs to Confirm with User
- Instance URL (or tenant name)
- Login credentials (username + password)
- Target role name (default: `MCP - Model Context Protocol`)
- Whether to create reports for ALL object types or a specific subset

## Output
Print a summary table showing:
- Object type
- Report name
- Column count
- Status (created / already existed / error)
