---
description: Check the current configuration status of a ProcessUnity object
allowed-tools: Bash, Read
argument-hint: <object name, e.g. "Vendors">
---

Check the current configuration status of the "$ARGUMENTS" object in ProcessUnity.

## Instructions

1. Read the pu-data-model skill at `${CLAUDE_PLUGIN_ROOT}/skills/pu-data-model/SKILL.md` and the objects reference
2. Navigate to Settings → General → Properties → [Object] in the PU browser
3. Read the current property list for the object
4. Summarize:
   - Total number of custom properties
   - Property names, types, and key flags (required, hidden, calculated)
   - Any section headers and how properties are organized
   - Any obvious gaps or issues
5. If the user has an execution plan, compare current state against the plan and report what's done vs. remaining
