# Buttons and Workflow Steps Reference

Buttons are the backbone of ProcessUnity's end-user workflow. Combined with Workflow Steps, they enable one-click record creation, relationship linking, data export, external API calls, and multi-step orchestrated workflows.

**Location**: Settings > Notifications & Workflow > Buttons

## The Workflow Action Triad

ProcessUnity has three mechanisms that share the same Workflow Steps engine:

| Mechanism | Trigger | Interactive | Where Configured |
|-----------|---------|------------|-----------------|
| **Buttons** | User clicks on a single record's toolbar | Yes (form, confirmation, navigation) | Settings > Notifications & Workflow > Buttons |
| **Report Actions** | User clicks on a report (single row or bulk) | Yes (form, confirmation) | Custom Report > Actions tab |
| **Automated Actions** | System event/condition | No | Settings > Notifications & Workflow > Automated Actions |

All three use the same 11 step types and the same expression language.

## Button Configuration (6 Tabs)

### Details Tab
| Field | Purpose |
|-------|---------|
| **Name** | Button label shown to users |
| **Description** | Admin notes |
| **Tooltip** | Hover text for users |
| **Require Confirmation** | Yes/No — shows confirmation dialog before executing steps |
| **Confirmation Text** | Text or expression shown in confirmation dialog |
| **Completion Text** | Text or expression shown after all steps complete |

### Display Tab
| Field | Purpose |
|-------|---------|
| **Label** | Internal config name (useful when multiple buttons share the same user-facing Name) |
| **Tooltip** | User-facing tooltip |
| **Enable Grouping** | Groups buttons together; named group or hamburger menu (no name) |

Button sequencing: Use arrow keys and "move after" icons in the admin list to reorder. Grouped buttons always appear before ungrouped.

### View Access Tab
Controls WHO sees the button and WHEN:

| Field | Purpose |
|-------|---------|
| **View Access** | Restrict to specific Roles or Teams, or All Users |
| **Conditional Display Property** | Expression/pick list controlling when button is VISIBLE. Multi-select supported (ctrl+click). |
| **Conditional Enable Property** | Expression/pick list controlling when button is CLICKABLE (vs disabled). |
| **Disabled Message** | Shown when button is visible but disabled — explains why. |

**Example**: "Execute Next Steps" button — visible always but only enabled when `[Request Status] = "B - In Review"`. Disabled message: "Request must be in review status."

### Form Tab
Optional popup form collecting property values before steps run:

| Field | Purpose |
|-------|---------|
| **Properties** | Which properties to show on the form |
| **Read Only** | Per-property toggle |
| **Required** | Per-property toggle |
| **Sequence** | Display order |
| **Form Instructions** | Help text shown at top of form |

Forms always appear before Confirmation Text. Cancel aborts the entire workflow.

### Steps Tab
The execution engine. See **Workflow Step Types** below. Multiple steps execute sequentially. Each can be conditionally disabled.

### Navigation Tab
Where the user goes after all steps complete:

| Navigation Type | Behavior |
|----------------|----------|
| *(blank)* | No navigation — stays on current record |
| **Step** | Navigate to the item created by a specific step. Optional "Open in Edit Mode". |
| **Item** | Navigate to another item by Object Type + Item ID (expression-based) + Tab. If Reports tab, must specify Context Report. |

## Workflow Step Types (11)

### Step 1: Update Property
Change a property value via expression.

| Config Field | Purpose |
|-------------|---------|
| **Property** | Which property to update |
| **Value** | Expression computing the new value |

**Common use**: Set status, capture timestamps, store BALI IDs, toggle flags.

### Step 2: Create New Item
Create a new record using a Custom Report + Import Template pair.

| Config Field | Purpose |
|-------------|---------|
| **Custom Report** | Report providing source data (must be enabled for WFA) |
| **Import Template** | Template defining target object and column mapping |
| **Remote Connection** | Optional — for cross-instance creation |

The report runs in context of the current record, mapping its properties to the import template's columns.

### Step 3: Create Relationship
Relate two existing records.

| Config Field | Purpose |
|-------------|---------|
| **Custom Report** | Report with exactly 2 columns: each record's ID/Name/External ID |
| **Import Template** | Specifies base + related item types and key types |

### Step 4: Send to External API
Push data from PU to an external system.

| Config Field | Purpose |
|-------------|---------|
| **Custom Report** | Report providing the payload data (must be WFA-enabled) |
| **External API Connection** | The configured API endpoint |

### Step 5: Get from External API
Pull data into PU from an external system.

| Config Field | Purpose |
|-------------|---------|
| **Import Template** | Template with Mapping tab (Global Query Path for JSON array, per-column Query Path) |
| **External API Connection** | The configured API endpoint |

### Step 6: Export/Import
Update existing or create new records using Custom Report + Import Template. Similar to Create New Item but can update existing records.

### Step 7: Attach Word Template Document
Generate a Word document from a .dotx/.dotm template and attach to the record's Attachments tab. Requires MS Word Connector.

### Step 8: Screen Vendor
Immediate refresh of third-party content from connectors:
- BitSight, D&B, EcoVadis, RapidRatings, RiskRecon, SecurityScorecard, World-Check One

### Step 9: Resolve Screening
Round-trip processing to update World-Check One environment. Refinitiv WC1 only.

### Step 10: Copy Files
Copy attachments/uploaded files between records.

| Config Field | Purpose |
|-------------|---------|
| **Custom Report** | Report identifying source ID and target ID columns |

Supports multiple sources/targets. Works with Attachment property types. Supports Remote Connections.

### Step 11: Update Mappings
Offer Management only. Sets mapping values on Client Inventory.

## Conditional Steps

Any step can be conditionally disabled via an expression in the **Conditionally Disable** attribute:
- Expression returns **True** → step is SKIPPED
- Expression returns **False** → step EXECUTES
- No expression → step always executes

This reduces button proliferation — one button with conditional steps replaces multiple buttons with show/hide logic.

## ButtonActionLastID (BALI)

**Critical global variable** for multi-step workflows that create records and need to reference them in subsequent steps.

`ButtonActionLastID` contains the PU ID of the most recently created item from a **Create New Item** step. Its lifetime is very short — the next Create New Item step overwrites it.

**Pattern**: Store BALI immediately after creation:
1. **Create New Item** → creates Vendor (BALI now = Vendor ID)
2. **Update Property** → store `ButtonActionLastID` in a property (e.g., `[New Vendor ID]`)
3. **Create New Item** → creates Assessment (BALI now = Assessment ID, Vendor ID is lost)
4. **Update Property** → store `ButtonActionLastID` in `[New Assessment ID]`
5. **Create Relationship** → relate Vendor (from stored ID) to Assessment (from BALI)

**Example — Approve Vendor Request (5 steps)**:
1. Create Vendor from Request data
2. Store Vendor ID via Update Property
3. Create Assessment
4. Store Assessment ID via Update Property
5. Create Relationship between Vendor and Assessment

## Passing Parameters to Reports (Report Filters)

Workflow steps can pass runtime filter values to Custom Reports used in steps:

**Syntax**: `"FilterName:" + [PropertyValue]`

Multiple filters separated by **semicolon**:
```
"VendorName:" + [Vendor Name] + ";" + "Status:" + [Status]
```

Pipe separator between values within a single filter:
```
"Region:" + [Region] + "|" + [Secondary Region]
```

## WFA Report Pairing

Custom Reports must be **enabled for Workflow Actions** to appear in step configuration dropdowns:

| WFA Mode | Meaning |
|----------|---------|
| **In Context** | Report available from workflow steps on the SAME object type as Level 1 |
| **Other Object Types** | Report available from workflow steps on DIFFERENT object types (must tag which types) |
| **Remote** | Report available for cross-instance workflow via ProcessUnity Connector |

Import Templates must similarly be enabled for the relevant step type before they appear in step config.

## Report Actions

Report Actions are like buttons but for bulk operations on report rows.

**Location**: Custom Report > Actions tab

### Execution Modes
| Mode | Trigger | Operates On |
|------|---------|------------|
| **Report-Level** | Toolbar button on report | All visible rows (or selected rows if Show Selection List enabled) |
| **Row-Level** | Ellipsis icon on individual row | Single row |

### Report Action Types
1. **Form / Steps** — Edit data and/or run workflow steps
2. **Bulk Delete** — Delete records shown on report (irreversible)
3. **New Item (Related) Details Tab** — Create related item, open Details in Edit mode
4. **New Item (Unrelated) Details Tab** — Create unrelated item
5. **New Item (Related) Form** — Create related item via popup form
6. **New Item (Unrelated) Form** — Create unrelated item via popup form

### Form Types for Report Actions
| Type | Behavior |
|------|----------|
| **Individual** | Spreadsheet-like editing — different values per row |
| **Global** | Single value applied to ALL selected rows |

**Requirement**: Report must have a **drilldown column** defined for forms to work (so the system knows which record to update).

### Display Options
| Option | Values |
|--------|--------|
| Button Style | Primary / Secondary / Tertiary (Primary not allowed in groups) |
| Enable Grouping | Named group label or hamburger menu |
| View Access | All Users or specific Roles/Teams |

## Button Naming Convention (Production Pattern)

From production instances, buttons follow this convention:
```
BTN: [SUBJECT]: [SEQUENCE]. [ACTION] [QUALIFIER]
```

| Component | Examples |
|-----------|---------|
| **SUBJECT** | REQUEST, VENDOR, SERVICE, AGREEMENT, ASSESS, QR, CI01-CI04, VENDOR SERVICE |
| **SEQUENCE** | 01, 02, 03... (execution order) |
| **ACTION** | Create Vendor, Create Assessment, Link Service, Relate Fourth Party |
| **QUALIFIER** | CONDITIONAL, BULK ACTION, status info |

**Real examples**:
```
BTN: REQUEST: 01. Create Vendor
BTN: REQUEST: 07B. CONDITIONAL Open Assessment - Status 01 to Status 02
BTN: VENDOR: BULK ACTION: 1. Create Bulk Campaign Assessment
BTN: SERVICE: ASMT: 1. Create Assessment
BTN: AGREEMENT: 01. Link Service to Agreement
BTN: CI01: 01. Create Issue from Vendor
```

## Common Button Workflow Patterns

### Pattern: Vendor Onboarding from Request
```
Button: "Approve Request" on Vendor Request object
Steps:
  1. Update Property: [Request Status] = "Approved"
  2. Create New Item: Vendor (from request data)
  3. Update Property: Store ButtonActionLastID as [Created Vendor ID]
  4. Create New Item: Assessment (from request assessment type)
  5. Create Relationship: Link Vendor to Assessment
  6. Update Property: [Assessment Sent Date] = TIMESTAMP()
Navigation: Step 2 (opens new Vendor record)
```

### Pattern: Create Related Issue
```
Button: "Raise Issue" on Vendor/Assessment/Service object
Form: Issue Title (required), Risk Severity, Description
Steps:
  1. Create New Item: Issue (maps form values + context properties)
  2. Create Relationship: Link Issue to source record
Navigation: Step 1 (opens new Issue in Edit mode)
```

### Pattern: Relate Existing Records
```
Button: "Link Service to Agreement" on Agreement object
Steps:
  1. Create Relationship: Agreement ↔ Vendor Service
     (Report has 2 columns: Agreement ID + Service ID)
Conditional: Only visible when [DORA?] = "Yes"
```

### Pattern: Bulk Campaign Assessment
```
Button: "Create Bulk Campaign Assessment" on Vendor object
Report Action (report-level): Operates on all selected vendors
Steps:
  1. For each selected row: Create New Item (Assessment)
  2. Create Relationship (Vendor → Assessment)
  3. Export/Import (populate assessment with vendor contact info)
  4. Update Property (set [Assessment Sent Date])
```

### Pattern: External API Push
```
Button: "Send to ERP" on Vendor object
Steps:
  1. Send to External API: Push vendor data to external system
     (Report columns map to external API payload)
```

## External API Connections

**Location**: Settings > Notifications & Workflow > External API Connections

### Authentication Types
| Type | Fields |
|------|--------|
| **Basic** | Username + Password |
| **API Key** | API key value |
| **OAuth** | Authorization URL, Bearer method, Client ID, Client Secret, optional Scope. Supports MTLS (PKCS12 or PEM/key). |
| **Custom Headers** | Up to 5 custom headers (API keys, tokens, etc.) |

### Shared Configuration
| Field | Purpose |
|-------|---------|
| **Base URL** | Root endpoint |
| **Retry Strategy** | Backoff for 429 responses |
| **Relative Path** | Expression-based URL suffix: `"?ID:" + [Vendor Code]` |
| **Payload limit** | 10MB per workflow step |
| **Test Connection** | Test button with optional Relative Test-Path |

Credentials are instance-specific (production and sandbox can have different credentials).

### GET Step Mapping
Import Template requires:
- "Enable for Get from External API" option checked
- **Mapping tab**: Global Query Path (JSON array entry point) + per-column Query Path Input (JSON property mapping)
- **Validate Mapping** button for testing with sample JSON response

### SEND Step
Custom Report requires "Enable for Workflow Actions" option. Column sequence must match external system expectations.
