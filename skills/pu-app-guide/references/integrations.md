# Integrations & Automation Reference

## Table of Contents
1. [Import Templates](#import-templates)
2. [Data Import](#data-import)
3. [Data Export](#data-export)
4. [Automated Import/Export](#automated-import-export)
5. [Web Services](#web-services)
6. [Connectors](#connectors)
7. [SSO and Auto-Provisioning](#sso-and-auto-provisioning)
8. [External Components](#external-components)
9. [Workflow Steps (Buttons, Report Actions, Automated Actions)](#workflow-steps)

---

## Import Templates

Path: **Settings → General → Import Templates → New**

Import Templates define the mapping between CSV columns and ProcessUnity properties. Used for bulk data entry, updates, and automated workflows.

### Creating an Import Template
1. Name the template
2. Select **Import Type**: Items, Relationships, History, etc.
3. Choose properties to import — sequence must match CSV column order
4. Select a **Key Column** (Name, ID, or External ID) for matching records
5. Configure **Import Options**: Insert only, Update only, or Insert and Update
6. Click Done

### Import Types
- **Items**: import/update object records
- **Relationships**: import relationships between objects (e.g., assign roles to people)
- **History**: import historical property snapshots

### Key Columns
Three options for matching CSV rows to existing records:
- **Name**: matches by item name (not unique — risky for common names)
- **ID**: internal ProcessUnity OID
- **External ID**: customer-defined unique identifier (recommended for bulk operations)

### Import Access
Access tab on each template controls external access: No External Access, Selected Roles, Selected Teams, All Users.

---

## Data Import

Data is imported via CSV files using Import Templates.

### Process
1. Create/obtain CSV with columns matching Import Template
2. Navigate to the Import Template
3. Click **Import** in toolbar → select CSV file
4. Review import summary/log for errors

### Key Rules
- Pick list values in CSV must match PU values (case-insensitive)
- Multi-select values use pipe delimiter `|`
- For hierarchical imports: specify parent item (by name, ID, or External ID) — parent must already exist
- CSV must use commas as separators (not semicolons, regardless of locale)
- Insert-only imports can create duplicates if re-run — switch to Insert+Update with a key column for safety

### Global Updates
Bulk update a single property across multiple records. Path: Settings → General → Import Templates → Global Updates.

---

## Data Export

### Manual Export
Any custom report can be exported to CSV via the Export button in the report toolbar.

### Automated Export
Custom reports enabled for automated export can be accessed via URL with credentials. See Reports reference for setup details.

---

## Automated Import/Export

### Enable
1. Settings → Application Settings → General Settings → **Enable Automated Import/Export** = Yes
2. Grant **Import/Export Automation** permission on relevant role(s)
3. On reports: enable **Enable for Automated Export**
4. On import templates: configure external access

### Automated Actions
Path: **Settings → Notifications & Workflow → Automated Actions**

Server-side scheduled or event-driven actions that run imports/exports, connectors, or other operations without manual intervention.

### Import/Export Automation Log
Standard report tracking all automated operations: date, user, status, messages.

---

## Web Services

Add-on feature for programmatic data exchange between ProcessUnity and external applications.

### Methods
- **Import**: pass data to a predefined Import Template via API (no CSV file needed)
- **Export**: run a predefined custom report and receive data as a data table
- **Copy Files**: import/export attachments, or copy between objects

### Setup
1. Enable Web Services in instance settings
2. Assign **Web Services** permission to relevant role(s)
3. Enable reports/templates for external access
4. Technical resources develop client-side integration

### Authentication
Uses ProcessUnity credentials. Respects IP Address Restrictions.

---

## Connectors

Add-on features enabling data exchange with specific external tools. Require **Connectors** role permission.

### Available Connectors

| Connector | Purpose |
|-----------|---------|
| **Excel Connector** | Excel add-in for live data access. Export reports to Excel, bulk import/update via Excel. Requires desktop installation (Excel 2010+). |
| **MS Word Connector** | Generate Word documents from ProcessUnity data using Word templates with merge fields |
| **ProcessUnity Connector** | Transfer data between ProcessUnity instances (production ↔ sandbox, or multi-instance). Uses Remote Connections (grant/accept permission handshake). |
| **BitSight Connector** | Import BitSight security ratings for vendors. Auto-populates risk data. |
| **D&B Connector** | Import Dun & Bradstreet data for vendor enrichment |
| **EcoVadis Connector** | Import EcoVadis sustainability ratings |
| **SIG Connector** | Auto-build questionnaire templates from Standardized Information Gathering (SIG) questionnaire |
| **WC1 Connector** | World-Check One integration for vendor screening |

### Excel Connector Setup
1. Instance must be enabled by ProcessUnity Support
2. Download installer from Help Center
3. Install on each client workstation
4. Grant **Import/Export Automation** and **Excel Connector** permissions
5. Connect from Excel's ProcessUnity tab using instance URL + credentials

### ProcessUnity Connector
Enables cross-instance workflow steps. Uses Remote Connections (Settings → General → Remote Connections):
1. Instance A grants access to Instance B
2. Instance B accepts access from Instance A
3. Workflow steps can now reference remote imports/exports

---

## SSO and Auto-Provisioning

### Single Sign-On (SSO)
ProcessUnity supports SSO via SAML 2.0. When enabled:
- Internal users bypass the login page (authenticated by identity provider)
- Password Policy settings are disabled
- Password send/reset functions are disabled
- Portal (vendor) users still get the login page regardless

Requirements: user account must exist in PU, be assigned to a role, and be Active.

### Lite User Auto-Provisioning (LUAP)
Add-on feature that auto-creates user accounts for SSO-authenticated users who don't yet exist in PU. They're assigned a pre-designated Lite role. Useful for infrequent users (e.g., submitting vendor requests via SSO without admin creating each account).

---

## External Components

Add-on feature for embedding external web content in ProcessUnity via iFrames.

### Two Publishing Modes
1. **Task Area**: external content appears as a task in the navigation panel
2. **Object Type (Property)**: external content appears on an object's Details tab as a property

### Task Area External Components
Path: **Settings → General → External Components → New**

1. Name the component
2. Enter **URL Expression** (must be valid HTTPS in quotes, can include property references for dynamic URLs)
3. On Access tab: select which Task Area + Task Group to publish to
4. Set access: Only Me, Selected Roles, Selected Teams, or All Users

### Property External Components
Add a property of type **External Component** to any object type. The expression constructs the URL, which can include property values from the current record (e.g., embed a Google Map based on the vendor's address).

### Limitations
- URL must be HTTPS
- Target site must support iFrame embedding (some block it)
- Performance depends on external site
- Display size configurable (various presets)
- Read-only in ProcessUnity

---

## Workflow Steps

### Detail Buttons
Path: **Settings → Notifications & Workflow → Detail Buttons**

Custom buttons on the Details tab toolbar. Configurable per object type. Actions triggered by button click:
- Set property values (via import template logic)
- Send notifications
- Create related items
- Execute remote operations (with ProcessUnity Connector)
- Run import/export steps

Buttons support permissions: can be restricted to specific roles/teams.

### Report Actions
Custom actions available from within report rows. Allow users to trigger workflow from report context (e.g., "Approve" action on a report row).

### Automated Actions
Path: **Settings → Notifications & Workflow → Automated Actions**

Scheduled or event-driven server-side actions. Can chain multiple steps: export from one source, transform, import to another. Support: import, export, connector execution, remote workflow steps.
