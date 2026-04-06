---
description: Execute a ProcessUnity configuration plan via browser automation
allowed-tools: Bash, Read, Write, Edit
argument-hint: <path to execution plan JSON>
---

Execute a ProcessUnity configuration plan by driving the PU admin UI via browser automation.

## Instructions

1. Read the pu-admin-navigator skill at `${CLAUDE_PLUGIN_ROOT}/skills/pu-admin-navigator/SKILL.md`
2. Read the relevant reference files:
   - `${CLAUDE_PLUGIN_ROOT}/skills/pu-admin-navigator/references/create-property.md` (for property creation)
   - `${CLAUDE_PLUGIN_ROOT}/skills/pu-admin-navigator/references/create-report.md` (for report creation)
   - `${CLAUDE_PLUGIN_ROOT}/skills/pu-admin-navigator/references/ui-navigation.md` (for UI targeting)
   - `${CLAUDE_PLUGIN_ROOT}/skills/pu-admin-navigator/references/expression-standards.md` (for expressions)
3. Load the execution plan from "$ARGUMENTS" (or ask the user for it)
4. Verify all Hard Stop requirements are met:
   - Instance URL is known
   - Environment is confirmed
   - Target object is identified
   - Change policy is agreed
   - User is logged into PU in the browser
5. Execute each step in the plan:
   - Navigate to the correct Properties/Reports page
   - Enter Edit mode
   - Create each property/report following the canonical workflow
   - Perform Post-Save Verification after each step
6. Produce a Change Log at the end

## Safety Rules
- Always verify after each save
- Stop on any Hard Stop condition
- Prefer disable/hide over delete for mistakes
- Single-click Edit, never double-click
- Use type-ahead for all dropdowns
