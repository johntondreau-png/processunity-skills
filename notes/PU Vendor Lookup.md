---
tags:
  - processunity
  - vendor-lookup
  - mcp
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU App Guide]]"
---

# PU Vendor Lookup

> **This skill has been moved to the MCP layer.** Vendor lookup is now handled directly by the ProcessUnity MCP server tools and CLI.

## How to Look Up a Vendor

**Via MCP tools** (Claude calls these directly):
```
mcp__processunity__export_report(reportId, filters: [{ColumnName: "Third-Party", Values: ["Acme"]}])
```

**Via CLI**:
```bash
processunity lookup "Acme Corp"
processunity lookup "Acme" --json
```

**Via the MCP tools reference**: See `pu-app-guide/references/mcp-tools.md` for all available data tools.

*See also: [[PU App Guide]]*
