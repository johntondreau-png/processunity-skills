---
description: Design a ProcessUnity configuration from requirements (spreadsheet, document, or description)
allowed-tools: Bash, Read, Write, Edit, Glob, Grep
argument-hint: <requirements description or "from spreadsheet">
---

Design a ProcessUnity configuration based on the provided requirements.

## Instructions

1. Read the pu-config-designer skill at `${CLAUDE_PLUGIN_ROOT}/skills/pu-config-designer/SKILL.md`
2. Read the pu-data-model skill at `${CLAUDE_PLUGIN_ROOT}/skills/pu-data-model/SKILL.md`
3. If the user mentioned a spreadsheet, read it using appropriate tools
4. Follow the pu-config-designer workflow:
   - Understand the requirements
   - Map to PU objects
   - Design properties for each object
   - Design Reference Data
   - Design reports and dashboards
5. Output BOTH a human-readable summary AND a JSON execution plan
6. Save the execution plan JSON file for later use by the pu-admin-navigator skill
7. Ask the user to review before proceeding to implementation

Keep the conversation clear and accessible — explain PU concepts when the user may not be familiar with them.
