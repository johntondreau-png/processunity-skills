---
tags:
  - processunity
  - environment
  - setup
  - api
  - mcp
created: 2026-04-09
related:
  - "[[PU Data Model]]"
  - "[[PU Report Builder]]"
  - "[[PU Agentic Pipeline]]"
---

# PU Environment Setup

Connect a new ProcessUnity instance for API-driven work — from service role creation through MCP report scaffolding.

## What It Covers

1. **Enable Web Services** — System Settings toggle (must be on before any API call)
2. **Create Roles** — Service-type roles with per-object CRUD permissions
3. **Create Service Account** — `web.service` People record assigned to role(s)
4. **Configure MCP** — Add server entry to `.mcp.json` with dual-credential OAuth
5. **Configure Postman** — Matching environment in the ProcU API Workspace
6. **Scaffold Reports** — One `[MCP - {Object}]` report per object, all fields, MCP role access
7. **Verify** — `list_reports` → `export_report` → `import_records` test chain

## Key Concepts

### Role Types
- **Service** type = API-only (no GUI login) — use for MCP and integration accounts
- **Admin/Standard/Lite/Portal** = various levels of GUI access

### Permission Granularity
Permissions are per-object with CRUD + sub-permissions under View (each object tab is individually grantable). The critical API permission is **Import / Export Automation**.

### Multi-Instance MCP
Each tenant gets its own MCP server entry. Tools are namespaced: `mcp__processunity-desert__list_reports`.

## Known Issues
- `get_report_columns` returns null error on custom reports — use `export_report` instead
- Reports with no data return `[]` (no column headers)
- Google SSO may block direct URL navigation — use `/Login.aspx` path

## Related Skills
- [[PU Data Model]] — understand available objects before scaffolding reports
- [[PU Report Builder]] — detailed report design (columns, groups, charts, multi-level)
- [[PU Agentic Pipeline]] — what you can do once reports + imports are wired up

*See also:* [[PU Admin Navigator]] for executing UI configuration changes
