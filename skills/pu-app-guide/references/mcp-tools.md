# MCP Tools Reference

The ProcessUnity automation stack has two layers:

1. **MCP Data Tools** (`mcp__processunity__*`) — 13 tools that read and write ProcessUnity data through the Import/Export API. These handle report discovery, data export, record import, and file attachments. They run headlessly and are the primary interface for agentic workflows.
2. **Browser Automation** (`pu-admin-navigator` skill + computer-use/Playwright MCP) — for configuration tasks that have no API surface: creating properties, building reports, managing reference data, setting up dashboards, configuring workflow rules, etc.

The MCP server connects via stdio (local Claude Code) or HTTP (remote, API-key-protected). Each PU environment gets its own MCP server instance — `processunity` for Ocean, `processunity-desert` for Desert. Tool names follow the pattern `mcp__processunity__<tool>` or `mcp__processunity-desert__<tool>`.

---

## Tool Inventory

| Tool | What It Does | Key Parameters | When to Use |
|------|-------------|----------------|-------------|
| `mcp__processunity__list_reports` | Lists all exportable reports in the instance | None | First step in any read workflow. Discover report IDs and names. |
| `mcp__processunity__list_remote_reports` | Lists exportable reports from federated/remote PU instances | None | When working with multi-instance (parent/child) PU deployments. |
| `mcp__processunity__list_import_templates` | Lists all import templates for writing data | None | First step in any write workflow. Discover template IDs, key columns, insert/update support. |
| `mcp__processunity__list_remote_import_templates` | Lists import templates from federated/remote instances | None | Multi-instance imports. |
| `mcp__processunity__export_report` | Exports data from a report as an array of record objects | `reportId` (number, required), `filters` (array of `{ColumnName, Values}`, optional) | Read any data from PU: vendors, assessments, regulations, questions, findings. |
| `mcp__processunity__get_columns` | Gets column metadata for an import template | `objectInstanceId` (number) | Before importing: discover exact column names, types, and order required by the template. |
| `mcp__processunity__get_report_columns` | Gets column metadata for a report | `objectInstanceId` (number) | Before exporting: discover available fields and their names for filter construction. |
| `mcp__processunity__import_records` | Imports records via an import template | `templateId` (number), `records` (array of string-keyed objects), `includeLog` (boolean, optional) | Bulk data writes: create/update vendors, regulations, questions, assessments. Primary write tool. |
| `mcp__processunity__import_with_results` | Imports records with detailed per-row results | `objectInstanceId` (number), `records` (array of string-keyed objects) | Smaller batches where you need row-level success/error feedback. Better for debugging. |
| `mcp__processunity__list_files` | Lists file names attached to a PU object | `objectId` (number) | Check what files exist on a vendor, assessment, or other object before downloading. |
| `mcp__processunity__download_files` | Downloads file contents (base64-encoded) | `objectId` (number), `filenames` (string array, optional), `zipContent` (boolean, optional) | Retrieve SOC reports, questionnaire responses, evidence files for AI analysis. |
| `mcp__processunity__upload_file` | Uploads a file attachment to a PU object | `objectId` (number), `fileName` (string), `content` (base64 string), `contentLength` (number) | Attach generated reports, enrichment results, or evidence to PU records. |
| `mcp__processunity__copy_files` | Server-side copy of files between PU objects | `sourceObjectTypeId`, `sourceObjectId`, `targetObjectTypeId`, `targetObjectId` (all numbers), `fileFilters` (string array, optional) | Copy evidence or attachments between vendors, assessments, or other objects without downloading. |

---

## Tool Composition Patterns

### Instance Discovery

Always start by discovering what is available in the instance:

```
1. mcp__processunity__list_reports          → get report IDs/names
2. mcp__processunity__list_import_templates → get template IDs/names/key columns
```

This gives you the full read/write surface of the instance. Report IDs are needed for `export_report`, template IDs for `import_records`.

### Data Export with Filtering

```
1. mcp__processunity__get_report_columns  → { objectInstanceId: 12345 }
   // Returns column names available for filtering

2. mcp__processunity__export_report → {
     reportId: 12345,
     filters: [
       { ColumnName: "Status", Values: ["Active"] },
       { ColumnName: "Risk Rating", Values: ["High", "Critical"] }
     ]
   }
```

Filters use exact string matching. Multiple values in the `Values` array act as OR (match any). Multiple filter objects act as AND (match all).

### Hierarchical Import (Regulation Trees, Questionnaires)

PU enforces referential integrity. Parent records must exist before children. Import in dependency order with pauses between levels:

```
1. mcp__processunity__import_records → { templateId: 258740, records: regulations }
   // Wait ~2 seconds for PU to index

2. mcp__processunity__import_records → { templateId: 258756, records: categories }
   // Wait ~2 seconds

3. mcp__processunity__import_records → { templateId: 258765, records: subCategories }
   // Wait ~2 seconds

4. mcp__processunity__import_records → { templateId: 258774, records: provisions }
```

Critical gotchas:
- **All values must be strings.** Sending `sort_order: 3` instead of `sort_order: "3"` causes silent failures.
- **Column keys must match template column names exactly.** Use `get_columns` to verify names.
- **Response shape varies.** Check both `result.Data.TotalInsertRecords` and `result.TotalInsertRecords`.

### File Attachment Workflow

Read files from one object, analyze, then attach results:

```
1. mcp__processunity__list_files → { objectId: 98765 }
   // See what's there: ["SOC2_Report_2025.pdf", "Questionnaire.xlsx"]

2. mcp__processunity__download_files → {
     objectId: 98765,
     filenames: ["SOC2_Report_2025.pdf"]
   }
   // Returns base64 content — decode and analyze

3. mcp__processunity__upload_file → {
     objectId: 98765,
     fileName: "SOC2_Analysis_Summary.pdf",
     content: "<base64-encoded-content>",
     contentLength: 45230
   }
```

For copying files between objects without downloading:

```
mcp__processunity__copy_files → {
  sourceObjectTypeId: 10,    // e.g., Vendor object type
  sourceObjectId: 98765,
  targetObjectTypeId: 15,    // e.g., Assessment object type
  targetObjectId: 11234,
  fileFilters: ["SOC2_Report_2025.pdf"]  // optional, copies all if omitted
}
```

### Export-Transform-Import (Enrichment Pipeline)

The core BYOAI pattern: read data, enrich with AI or external APIs, write back:

```
1. mcp__processunity__export_report → { reportId: <vendors-report> }
   // Get vendor records

2. [AI analysis or external API call]
   // Enrich: risk scoring, news monitoring, compliance mapping

3. mcp__processunity__get_columns → { objectInstanceId: <update-template> }
   // Get exact column schema for the update template

4. mcp__processunity__import_records → {
     templateId: <update-template>,
     records: enrichedRecords,  // all values as strings
     includeLog: true
   }
```

---

## Authentication & Connection

The MCP server requires 5 environment variables for ProcessUnity's dual-credential OAuth 2.0 flow:

| Variable | Description | Example |
|----------|-------------|---------|
| `PU_BASE_URL` | Full tenant URL | `https://app.processunity.net/moodysapipoc` |
| `PU_SERVICE_NAME` | OAuth service account name | `directwebservice` |
| `PU_SERVICE_PASSWORD` | OAuth service account password (GUID) | `a1b2c3d4-e5f6-7890-abcd-ef1234567890` |
| `PU_USERNAME` | PU user account | `user@company.com` |
| `PU_PASSWORD` | PU user password | `password123` |

The **dual-credential flow** works in two stages:
1. Service credentials (`serviceName` + `servicePassword`) authenticate the API client itself
2. User credentials (`username` + `password`) authenticate as a specific PU user, inheriting that user's role permissions

The SDK's `TokenManager` handles token acquisition and refresh automatically. Tokens are cached and reused until expiry.

For HTTP transport (remote deployments), an additional `MCP_API_KEY` env var protects the MCP endpoint with Bearer token auth. Set `MCP_TRANSPORT=http` and optionally `MCP_PORT` (defaults to 3001).

---

## CLI Commands

The MCP server package also exposes a standalone CLI (`processunity`) for shell-based workflows:

| Command | Description |
|---------|-------------|
| `processunity reports [--json]` | List all exportable reports |
| `processunity templates [--json]` | List all import templates |
| `processunity export <reportId> [--filter col=val] [--csv] [--json]` | Export data from a report |
| `processunity lookup <name> [-r reportId] [--json]` | Search for a vendor by name |
| `processunity columns <id> [--json]` | Get column metadata for a template |
| `processunity files <objectId> [--json]` | List files attached to an object |
| `processunity import <templateId> <jsonFile> [--dry-run]` | Import records from a JSON file |
| `processunity serve` | Start as MCP server (stdio transport) |

The CLI uses the same 5 environment variables as the MCP server. It reads `.env` files from the current working directory.

---

## What MCP Tools Don't Cover

The Import/Export API surface is limited to CRUD operations on existing data structures. The following configuration tasks have **no API endpoint** and require browser automation via the `pu-admin-navigator` skill:

- **Creating/editing object properties** (fields, dropdowns, text areas, date pickers)
- **Building custom reports** (selecting columns, configuring filters, setting report permissions)
- **Creating dashboard widgets** (Rich Text, charts, metric cards)
- **Managing reference data** (status values, risk ratings, category lists)
- **Configuring workflow rules** (triggers, conditions, actions, email notifications)
- **Setting up user roles and permissions**
- **Creating object types or subject areas**
- **Configuring external API connections** (the PU-native feature for GET/SEND integrations)
- **Managing form layouts and section ordering**
- **Setting up scheduled tasks and automation rules**

For these tasks, use the `pu-admin-navigator` skill which drives the PU admin UI through browser automation (computer-use or Playwright MCP). The typical workflow is: use `pu-config-designer` to plan the configuration, then `pu-admin-navigator` to execute it.
