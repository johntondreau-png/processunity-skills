---
name: pu-environment-setup
description: >
  Connect a new ProcessUnity environment for API-driven configuration work. Covers service role
  creation, service account provisioning, credential capture, MCP server configuration, Postman
  environment setup, and API report scaffolding. Use this skill when onboarding a new PU instance,
  setting up API access for the first time, or creating the MCP report layer that enables AI-driven
  workflows. Triggers for: "connect to a new PU environment", "set up API access", "create a
  service account", "configure MCP for PU", "scaffold reports for API access".
depends_on:
  - pu-app-guide
---

# ProcessUnity Environment Setup

Everything needed to connect a fresh ProcessUnity instance for API-driven configuration,
report building, and AI-powered workflows via MCP.

## Before Starting

### Required Information
1. **Instance URL** — e.g., `https://app.processunity.net/desert`
2. **Tenant name** — the path segment (e.g., `desert`, `ocean`)
3. **Admin credentials** — a super admin or Application Admin login to the GUI
4. **Target use case** — read-only MCP access, bidirectional integration, or both

### Prerequisites
- Admin access to the PU instance (GUI login)
- Web Services feature enabled in System Settings
- Claude Code with the `processunity-mcp` server available locally

---

## Phase 1: Enable Web Services

Web Services must be enabled before any API connection will work.

**Navigation**: `SETTINGS > System Administration > System Settings`

Find the **Web Services** toggle and ensure it is **enabled**. Without this, all API
authentication attempts will fail silently or return 401 errors.

> **Lesson learned**: This is easy to forget on fresh environments. Always check first.

---

## Phase 2: Create or Configure Roles

PU uses role-based access control with 5 role types:

| Type | Purpose |
|------|---------|
| **Admin** | Full GUI + config access |
| **Standard** | Normal user access |
| **Lite** | Limited user access |
| **Portal** | External/third-party contact access |
| **Service** | API-only access — no GUI login |

### Role Permission Model

Permissions are per-object with CRUD granularity:

```
Object (e.g., Third Parties)
├── Create
├── View (expandable — shows object tabs/sections)
│   ├── Agreements
│   ├── Approval
│   ├── Assessments
│   ├── Attachments
│   ├── Contacts
│   ├── Details
│   ├── Facilities
│   ├── Fourth Parties
│   ├── Portal Files
│   ├── Related Items (further expandable)
│   └── Third-Party Services
├── Edit
├── Delete
└── Portal Dialog
```

**Key permissions for API access:**
- **Import / Export Automation** — REQUIRED for all API report export and data import operations
- **GRX Integration** — required only if using CyberGRX/ProcessUnity Exchange features
- **Change Log** — optional, for audit trail access

### Recommended Roles

#### MCP - Model Context Protocol (Read-Only API)
- **Type**: Service
- **Description**: Read-only API role for MCP agent automation. Provides view access to all objects and Import/Export Automation permissions, enabling AI-driven report building, data extraction, and configuration discovery across the entire TPRM solution.
- **Permissions**: View on ALL objects + Import / Export Automation
- **Use case**: AI agents that read data via reports, discover schema, build configuration plans

#### INT - Integration Role (Read/Write API)
- **Type**: Service
- **Description**: Service role for bidirectional API integration via Import/Export Automation. Supports automated data import, export, enrichment, and workflow orchestration through external systems such as Postman, custom SDKs, and middleware platforms.
- **Permissions**: Create + View + Edit on all objects + Import / Export Automation
- **Use case**: Automated data pipelines, enrichment workflows, DORA config push

### Creating a Role

**Navigation**: `SETTINGS > People & Permissions > Roles > + New`

1. Set **Name** following convention: `{PREFIX} - {Display Name}` (e.g., `MCP - Model Context Protocol`)
2. Set **Type** to `Service` for API-only roles
3. Add **Description** explaining the role's purpose
4. Configure **Permissions** — check each object and expand to set View/Create/Edit/Delete
5. Check **Import / Export Automation** at the bottom of the permissions list
6. Click **Save**

> **Tip**: The permissions list uses checkboxes with three states:
> - ☐ Empty = no access
> - ☑ Full check = all sub-permissions enabled
> - ▪ Partial (blue dash) = some sub-permissions enabled

---

## Phase 3: Create Service Account (People Record)

**Navigation**: `SETTINGS > People & Permissions > People > + New`

### Standard Service Account Pattern
For consistency across environments, use the same credentials:

| Field | Value |
|-------|-------|
| **Username** | `web.service` |
| **Password** | (use a consistent password across demo environments) |
| **First Name** | `Web` |
| **Last Name** | `Service` |
| **System Access** | Enabled |
| **Roles** | Assign to the appropriate Service role(s) |
| **State** | Active |

### Important Notes
- The **ServicePassword** (GUID) is tied to the `directwebservice` OAuth client, NOT to the People record. It is the same across environments unless explicitly changed.
- The **PU Username/Password** in the People record IS environment-specific — but for demo environments you can reuse the same values.
- A single People record can be assigned to multiple roles.

---

## Phase 4: Configure MCP Server

### File Location
MCP server config lives in `/Users/johntondreau/Projects/.mcp.json` (project-level).

### Multi-Instance Pattern
Each PU environment gets its own MCP server entry. Tools are namespaced by server name:
- `mcp__processunity__*` → ocean instance
- `mcp__processunity-desert__*` → desert instance

### Configuration Template

```json
{
  "mcpServers": {
    "processunity-{tenant}": {
      "command": "/opt/homebrew/bin/node",
      "args": ["/Users/johntondreau/Projects/processunity-mcp/dist/index.js"],
      "env": {
        "PU_BASE_URL": "https://app.processunity.net/{tenant}",
        "PU_SERVICE_NAME": "directwebservice",
        "PU_SERVICE_PASSWORD": "{GUID}",
        "PU_USERNAME": "web.service",
        "PU_PASSWORD": "{password}"
      }
    }
  }
}
```

### Credential Mapping (OAuth Dual-Credential Flow)

| MCP Env Var | Postman Variable | SDK Param | Source |
|-------------|-----------------|-----------|--------|
| `PU_BASE_URL` | `url` | `baseUrl` | Tenant URL |
| `PU_SERVICE_NAME` | `ServiceName` | `serviceName` | Always `directwebservice` |
| `PU_SERVICE_PASSWORD` | `ServicePassword` | `servicePassword` | GUID — same across environments |
| `PU_USERNAME` | `PUUsername` | `username` | People record username |
| `PU_PASSWORD` | `PUPassword` | `password` | People record password |

### After Configuration
- Restart Claude Code (or reload MCP servers) for the new server to connect
- New tools appear as `mcp__processunity-{tenant}__*`
- Test with `list_reports` — should return at least the default MS Word template reports

---

## Phase 5: Configure Postman Environment

Create a matching Postman environment in the `ProcU API Workspace` (ID: `cf833cc3-11e8-4f99-8071-086a9d99c83e`).

### Required Variables

| Key | Value | Type |
|-----|-------|------|
| `url` | `https://app.processunity.net/{tenant}` | default |
| `PUUsername` | `web.service` | default |
| `PUPassword` | `{password}` | secret |
| `ServiceName` | `directwebservice` | default |
| `ServicePassword` | `{GUID}` | secret |
| `mytoken` | *(empty — populated by auth request)* | default |

### Additional Variables (add as needed)

| Key | Purpose |
|-----|---------|
| `reportId` | Default report ID for testing |
| `importTemplateId` | Default import template ID |
| `rpt-Vendors` | Vendor report ID |
| `impTemp-VendorImport` | Vendor import template ID |

---

## Phase 6: Scaffold MCP Reports

For full API read access, create one Custom Report per object type. This gives the MCP
agent a complete view of all data in the instance.

### Report Naming Convention
```
[MCP - {Object Name}]
```

### Report Configuration Pattern
1. **REPORTS > Custom Reports > + New**
2. **Name**: `[MCP - {Object Name}]`
3. **Level 1**: Set to the object type (e.g., Agreement, Third Party)
4. **Details tab > Add Columns**: Select ALL available properties
5. **Access tab**: Selected Roles → `MCP - Model Context Protocol`
6. **Click Done** to save

### Objects to Cover (Alphabetical)

| # | Object | Level 1 Value | Notes |
|---|--------|---------------|-------|
| 1 | Agreements | Agreement | Contract/agreement records |
| 2 | Assessments | Assessment | Risk assessments |
| 3 | Custom Object 1 | Custom Object 1 | Legal Entity (if DORA enabled) |
| 4 | Custom Object 3 | Custom Object 3 | CIF - Critical/Important Function (if DORA enabled) |
| 5 | Documents | Document | Uploaded documents |
| 6 | Fourth Parties | Fourth Party | Subcontractors/Nth parties |
| 7 | GRX Findings | GRX Finding | Exchange intelligence findings |
| 8 | Issues | Issue | Risk issues and remediation |
| 9 | My Organization | My Organization | Single org record |
| 10 | People | Individual | Internal users and contacts |
| 11 | Questionnaires | Questionnaire | Assessment questionnaires |
| 12 | Reference Data | Reference Data | Lookup values and taxonomies |
| 13 | Third Parties | Third Party | Vendors/suppliers |
| 14 | Third-Party Requests | Third-Party Request | Intake/onboarding requests |
| 15 | Third-Party Services | Third-Party Service | Vendor service engagements |

> **Note**: Custom Objects (1-5) only appear if enabled in System Settings. Check the instance before adding these reports.

### Verifying Reports via API

After creating each report:
```
list_reports → find the new report ID
export_report(reportId) → returns [] if no data, or records if data exists
```

The `get_report_columns` endpoint does NOT work on custom reports (known MCP server limitation).
Column schema is only visible when data exists (column names appear as keys on returned records).

---

## Phase 7: Connection Test Checklist

Run these checks to verify the environment is fully connected:

| # | Test | Tool | Expected |
|---|------|------|----------|
| 1 | List reports | `list_reports` | Returns default reports + any MCP reports |
| 2 | List import templates | `list_import_templates` | Returns connector + Quick Start templates |
| 3 | Export a report | `export_report(reportId)` | Returns `[]` (empty) or data array |
| 4 | Import test record | `import_records(templateId, records)` | Returns success with insert count |

---

## Troubleshooting

### Google SSO Error on Login
- **Symptom**: `Error 401: invalid_client` when navigating to instance URL
- **Fix**: Use direct login URL: `https://app.processunity.net/{tenant}/Login.aspx`
- **Root cause**: Instance SSO may not be configured for your Google account

### MCP Server Won't Connect
- **Symptom**: `processunity-{tenant}` tools don't appear after restart
- **Check**: Verify `.mcp.json` syntax is valid JSON
- **Check**: Verify Web Services is enabled in PU System Settings
- **Check**: Verify credentials are correct (test in Postman first)

### API Returns 401 or Empty
- **Check**: Web Services enabled?
- **Check**: Service account has `Import / Export Automation` permission?
- **Check**: Report Access tab includes the service role?
- **Check**: Token TTL is ~20 minutes — long-running operations may need re-auth

### get_report_columns Returns Error
- **Known issue**: `Cannot read properties of null (reading 'HasError')`
- **Workaround**: Use `export_report` instead — column names appear as keys on records
- **Note**: Empty reports return `[]` with no column information

---

## Quick Reference

### Default PU Reports (present in all instances)
These MS Word template reports exist by default and confirm API connectivity:
- `CONTEXT: MY ORG: Add Service Checklist`
- `MS WORD: Executive Assessment Summary: Issues`
- `MS WORD: Executive Third-Party Summary: *` (Agreements, Assessment, Contacts, Issues, Services)

### Environment Registry
| Tenant | URL | Status | MCP Server Name |
|--------|-----|--------|-----------------|
| ocean | `https://app.processunity.net/ocean` | Active | `processunity` |
| desert | `https://app.processunity.net/desert` | Active | `processunity-desert` |
