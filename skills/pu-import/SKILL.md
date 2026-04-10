---
name: pu-import
description: >
  Bulk create and update records in any ProcessUnity object via the Import API.
  Use this skill when the user wants to push data into PU programmatically — regulation trees,
  reference data, vendor records, threats, questions, or any object with an import template.
  Triggers for: "import into PU", "push data to ProcessUnity", "bulk create records",
  "load regulations", "import vendors", "upload data to PU", "automated import".
  This skill is the programmatic counterpart to PU's browser-based import.
depends_on:
  - pu-app-guide
  - pu-admin-navigator
---

# PU Import Skill — Generic Data Import via ProcessUnity API

## Purpose

This skill enables bulk creation and update of records in any ProcessUnity object via the Import API. It is the **programmatic counterpart** to PU's browser-based import — use it whenever you need to push data into PU without manual CSV uploads.

## Prerequisites

Before using this skill, ensure:

1. **An Import Template exists** in PU for the target object (Settings → General → Import Templates)
2. You know the **Import Template ID** (visible in the template detail panel)
3. The template has the correct **columns** mapped and a **Key Column** set (for upsert behavior)
4. The template has **Inserts** and/or **Updates** enabled under Import Options
5. The template has **Enable for Automated Import** checked

If no import template exists yet, use the `pu-admin-navigator` skill to create one via browser automation first.

## Authentication

PU uses OAuth2 password grant. Credentials are stored in the plugin config:

```
Config path: <plugin_root>/config.json
Key: processunity

Fields:
  token_url            → https://app.processunity.net/ocean/token
  grant_type           → password
  username             → directwebservice
  processunityUserName → <service_account_username>
  processunityPassword → <service_account_password>
  password             → <API_key_GUID>
```

### Token Request

```
POST {token_url}
Content-Type: application/x-www-form-urlencoded

grant_type={grant_type}&username={username}&processunityUserName={processunityUserName}&processunityPassword={processunityPassword}&password={password}
```

Response: `{ "access_token": "...", "token_type": "bearer", "expires_in": 86399 }`

## Import API

### Endpoint

```
POST https://app.processunity.net/ocean/api/importexport/Import/{importTemplateId}
Authorization: Bearer {access_token}
Content-Type: application/json
```

### Request Body

```json
{
  "data": [
    { "Column Name 1": "value1", "Column Name 2": "value2", ... },
    { "Column Name 1": "value3", "Column Name 2": "value4", ... }
  ],
  "param": {
    "IncludeLog": true
  }
}
```

**Critical rules — POSITIONAL COLUMN MAPPING:**

> **⚠️ The Import API maps data values POSITIONALLY to template columns. Dict key names are completely IGNORED.** The order of values in your JSON dict (i.e., the serialization order) must match the column order in the import template exactly.

1. **Data must be dicts** — sending arrays (lists) silently returns 0 records added/updated with no error
2. **Dict key names are ignored** — only the *position* of values matters. The Nth value in your dict maps to the Nth column in the template
3. **Use strings for all values when in doubt** — integer values sent to text/string property columns have been observed to cause `"General error (line 2)"`. Converting values to strings with `str()` is the safest approach. Numeric property types may accept integers natively, but this hasn't been confirmed.
4. **Column count must match exactly** — if the template has N columns, each dict must have exactly N key-value pairs. A mismatch returns `"Column count mismatch between import template columns and data columns being imported. (N vs. M)"`
5. **The Key Column value determines insert vs. update** — new key = insert, existing key = update
6. Always set `IncludeLog: true` to get per-row success/failure detail

### Determining Template Column Order

The column order in a template depends on how it was built:
- Templates where all columns were added at once (multi-select) tend to have **alphabetical** order
- Templates where standard properties (Name, Description, External Id) were pre-populated and custom properties added later tend to have: **Name, Description, External Id, [custom props in add order], Parent External Id**

**To discover the actual column order**, use the Export API:

```
POST https://app.processunity.net/ocean/api/importexport/export/{importTemplateId}
Authorization: Bearer {access_token}
Content-Type: application/json
Body: {}
```

The response `Data` array contains existing records with keys in the **actual template column order**. Read the key order from the first record.

Alternatively, send a test import with deliberately wrong values and read the `Log` entry — the log keys reveal the actual column order, showing which value landed in which column.

### Building Correctly-Ordered Data Rows

Use `OrderedDict` (or a regular dict in Python 3.7+ which preserves insertion order) with keys in the template's column order:

```python
from collections import OrderedDict

# Template column order: Name, Description, External Id, display_id, sort_order, ...
def make_row(col_order, values_dict):
    od = OrderedDict()
    for col in col_order:
        od[col] = str(values_dict.get(col, ""))
    return od
```

### Response

**⚠️ Response shape varies between endpoints and PU versions.** The result may arrive in two different shapes:

**Shape A — Direct result (common with `/Import/{id}`):**
```json
{
  "TotalRecords": 52,
  "TotalAddedRecords": 52,
  "TotalUpdatedRecords": 0,
  "TotalSkippedInserts": 0,
  "TotalSkippedUpdates": 0,
  "TotalEmptyRecords": 0,
  "TotalNoKeyRecords": 0,
  "TotalInvalid": 0,
  "TotalWarnings": 0,
  "HasError": false,
  "Message": null,
  "Log": [
    {
      "Column1": "value",
      "Column2": "value",
      "STATUS": "SUCCESS",
      "MESSAGE": "Item inserted."
    }
  ]
}
```

**Shape B — Wrapped in `Data` (seen with some API clients):**
```json
{
  "HasError": false,
  "HasErrors": false,
  "Message": null,
  "Data": {
    "TotalInsertRecords": 52,
    "TotalUpdateRecords": 0,
    "TotalErrorRecords": 0,
    "TotalReadyRecords": 52,
    "TotalRecords": 52,
    "TotalDeleteRecords": 0
  }
}
```

**Always handle both shapes:**
```typescript
const importData = result.Data ?? result;
const inserted = importData.TotalAddedRecords ?? importData.TotalInsertRecords ?? 0;
const updated = importData.TotalUpdatedRecords ?? importData.TotalUpdateRecords ?? 0;
```

**Key result fields (may appear under either naming convention):**
- `TotalAddedRecords` / `TotalInsertRecords` — new records created
- `TotalUpdatedRecords` / `TotalUpdateRecords` — existing records updated (matched by Key Column)
- `TotalSkippedInserts` — rows skipped because insert not enabled on template
- `TotalSkippedUpdates` — rows skipped because update not enabled on template
- `TotalNoKeyRecords` — rows missing the Key Column value
- `TotalInvalid` / `TotalErrorRecords` — rows with validation errors
- `HasError` / `HasErrors` — true if the import itself failed (not per-row errors)
- `Log` — array of per-row results (only when `IncludeLog: true`; may not be present in Shape B)

### Alternative Endpoint: ImportWithResults

```
POST https://app.processunity.net/ocean/api/importexport/ImportWithResults/{templateExternalId}
```

Same body format. Uses the template's External ID instead of numeric ID. Returns additional metadata including created object IDs.

## Import Template Reference

### Getting Template Info via API

```
GET https://app.processunity.net/ocean/api/dataexchange/ImportableTemplates/{importTemplateId}
Authorization: Bearer {access_token}
```

Returns template metadata including column names.

### Getting Template Columns via API

```
GET https://app.processunity.net/ocean/api/importexport/GetColumns/{templateExternalId}
Authorization: Bearer {access_token}
```

Returns the list of columns configured on the template.

### Listing All Import Templates with Columns (Recommended)

```
GET https://app.processunity.net/ocean/api/dataexchange/ImportableTemplates/0
Authorization: Bearer {access_token}
```

Returns all import templates with their `Columns` array in the correct positional order:

```json
{
  "HasError": false,
  "Data": [
    {
      "Id": 258740,
      "Name": "VendorShield - Regulations Import",
      "Inserts": true,
      "Updates": true,
      "ImportType": "Regulation",
      "KeyColumn": "External Id",
      "ParentKeyColumn": "",
      "Columns": ["Description", "display_id", "effective_date", "External Id", "issuing_body", "jurisdiction", "last_synced_at", "Name", "scf_mapped", "scf_version", "source_url", "status", "sync_source", "type", "version"],
      "ExternalId": "vendorshield-regulations-import"
    }
  ]
}
```

**This is the most reliable way to discover column order at runtime.** The `Columns` array is in the exact positional order the Import API expects. Use this to build correctly-ordered records dynamically:

```typescript
// Fetch template columns at runtime
const templates = await fetchImportTemplates(credentials);
const templateColumnsMap = new Map<string, string[]>();
for (const t of templates) {
  templateColumnsMap.set(String(t.Id), t.Columns);
}

// Build column-ordered record
function buildOrderedRecord(templateId: string, values: Record<string, string>): Record<string, string> {
  const columns = templateColumnsMap.get(templateId);
  if (!columns) return values;
  const ordered: Record<string, string> = {};
  for (const col of columns) {
    ordered[col] = values[col] ?? "";
  }
  return ordered;
}
```

This approach is used in VendorShield's `pushFrameworkToProcessUnity` action and eliminates hardcoded column orders — if template columns are reordered in PU, the code adapts automatically.

## Known Import Templates

| Template Name | Template ID | Object Type | Key Column | Parent Key | Column Order (positional) |
|---|---|---|---|---|---|
| VendorShield - Reference Data Import | 258681 | Reference Data | External ID | — | Name, Type, Description, External ID |
| VendorShield - Regulations Import | 258740 | Regulation (OID 160) | External Id | — | Description, display_id, effective_date, External Id, issuing_body, jurisdiction, last_synced_at, Name, scf_mapped, scf_version, source_url, status, sync_source, type, version |
| VendorShield - Reg Categories Import | 258756 | Regulation Category (OID 161) | External Id | Parent External Id | Name, Description, External Id, display_id, sort_order, last_synced_at, sync_source, Parent External Id |
| VendorShield - Reg Sub-Categories Import | 258765 | Regulation Sub-Category (OID 162) | External Id | Parent External Id | Name, Description, External Id, display_id, sort_order, last_synced_at, sync_source, Parent External Id |
| VendorShield - Provisions Import | 258774 | Provision (OID 147) | External Id | Parent External Id | Name, Description, External Id, display_id, sort_order, requirement_text, assessment_guidance, criticality, scf_control_ids, last_synced_at, sync_source, Parent External Id |

> **Column Order is critical** — the order listed above is the exact positional order the API expects. Use this order when constructing data dicts.

## Workflow

### Step 1: Identify or Create Import Template

Check the table above. If no template exists for the target object:
1. Use `pu-admin-navigator` to create one via browser
2. Note the Import Template ID
3. Update the table above

### Step 2: Build Import Data

Structure your data as an array of objects where keys match template column names exactly:

```python
rows = [
    {"Name": "value1", "Type": "category1", "External ID": "EXT-001"},
    {"Name": "value2", "Type": "category2", "External ID": "EXT-002"},
]
```

**External ID convention:** `VS-{OBJECT_ABBREV}-{TYPE_SLUG}-{VALUE_SLUG}`
- Reference Data: `VS-RD-{TYPE}-{VALUE}`
- Regulations: `VS-REG-{IDENTIFIER}`
- Threats: `VS-THR-{IDENTIFIER}`

### Step 3: Authenticate and Import

```python
import json, urllib.request, urllib.parse

# 1. Get token
auth_data = urllib.parse.urlencode(AUTH_PARAMS).encode("utf-8")
req = urllib.request.Request(TOKEN_URL, data=auth_data,
    headers={"Content-Type": "application/x-www-form-urlencoded"}, method="POST")
with urllib.request.urlopen(req, timeout=30) as resp:
    token = json.loads(resp.read().decode("utf-8"))["access_token"]

# 2. Import
body = json.dumps({"data": rows, "param": {"IncludeLog": True}}).encode("utf-8")
req = urllib.request.Request(
    f"https://app.processunity.net/ocean/api/importexport/Import/{template_id}",
    data=body,
    headers={"Authorization": f"Bearer {token}", "Content-Type": "application/json"},
    method="POST"
)
with urllib.request.urlopen(req, timeout=120) as resp:
    result = json.loads(resp.read().decode("utf-8"))
```

### Step 4: Validate Results

```python
# Handle both response shapes
data = result.get("Data", result)
added = data.get("TotalAddedRecords") or data.get("TotalInsertRecords") or 0
updated = data.get("TotalUpdatedRecords") or data.get("TotalUpdateRecords") or 0
invalid = data.get("TotalInvalid") or data.get("TotalErrorRecords") or 0
has_error = result.get("HasError") or result.get("HasErrors") or False

if has_error:
    raise Exception(f"Import failed: {result.get('Message', 'Unknown error')}")

if invalid > 0:
    failures = [r for r in result.get("Log", []) if r.get("STATUS") != "SUCCESS"]
    for f in failures:
        print(f"FAILED: {f}")
```

### Step 5: Idempotency Check (Optional)

Re-import the same data. If all records show "Item updated" with zero inserts, the original import is confirmed complete:

```python
# Re-import same rows
result2 = import_data(token, rows)
assert result2["TotalAddedRecords"] == 0, "Unexpected new records!"
assert result2["TotalUpdatedRecords"] == len(rows), "Not all records found!"
```

## Batch Size Limits

- PU does not document a hard row limit per import call
- In practice, imports of 50-200 rows work reliably
- For larger datasets (1000+), batch into chunks of 200 rows and import sequentially
- Always check `HasError` and `TotalInvalid` after each batch

## Pick List / Reference Data Values in Imports

When an import column maps to a **Pick List** or **Reference Data** property:
- The import value must be the **display text** of the option, not an ID
- The value must match exactly (case-sensitive)
- If the value doesn't match any existing option, PU may skip the row or set it to null (depends on configuration)
- Ensure Reference Data values exist BEFORE importing records that reference them

## Error Handling

| Error | Cause | Fix |
|---|---|---|
| HTTP 401 | Token expired | Re-authenticate and retry |
| HTTP 404 | Invalid template ID | Verify template exists in PU |
| `Column count mismatch (N vs. M)` | Dict has wrong number of keys | Ensure each row dict has exactly N keys matching template column count |
| `General error (line 2)` | Likely caused by integer/bool values in text property columns | Convert values to strings with `str()` — safest default approach |
| 0 added, 0 updated, no error | Data sent as arrays instead of dicts | Use dicts (OrderedDict), not lists/arrays |
| Values in wrong columns | Dict key order doesn't match template column order | Use `OrderedDict` with keys in exact template column order |
| `TotalNoParentRecords > 0` | Parent External Id value not found | Ensure parent records imported first; External Id values match exactly |
| `TotalNoKeyRecords > 0` | Rows missing Key Column | Ensure every row has the Key Column populated |
| `TotalSkippedInserts > 0` | Template has Inserts disabled | Enable Inserts on the template |
| `TotalSkippedUpdates > 0` | Template has Updates disabled | Enable Updates on the template |
| `TotalInvalid > 0` | Row data doesn't match column types | Check Log for details, fix data |

## Export API

Use the export endpoint to retrieve existing records and discover column order:

```
POST https://app.processunity.net/ocean/api/importexport/export/{importTemplateId}
Authorization: Bearer {access_token}
Content-Type: application/json
Body: {}
```

Response: `{ "Message": null, "HasError": false, "Data": [ { ... records ... } ] }`

The keys in the `Data` records reveal the **actual template column order**.

## Hierarchical (Tree) Imports

When importing parent-child data (e.g., Regulations → Categories → Sub-Categories → Provisions):

1. **Import top-down** — parents must exist before children can reference them
2. **Wait between levels** — add a 2-3 second delay between each level's import for PU indexing
3. **Parent Key Column** must be set on the child template (requires a separate edit+save cycle in the UI — it doesn't persist when saved alongside column additions)
4. **Parent External Id values must match exactly** — the child's `Parent External Id` must match an existing parent's `External Id`

### Proven: VendorShield → ProcessUnity Regulation Push (April 2026)

Successfully imported GDPR framework from VendorShield into PU's 4-level regulation hierarchy:

**VendorShield data model** (2 models, N-level):
- `RegulatoryFramework` — top-level regulation
- `FrameworkControl` — all children, with `level` field: 0=category, 1=subcategory, 2+=provision

**PU data model** (4 separate object types):
- Regulation → Regulation Category → Regulation Sub-Category → Provision

**Mapping logic:**
```
VendorShield                    → PU Object Type        → Template ID
──────────────────────────────  ──────────────────────── ───────────
RegulatoryFramework             → Regulation             → 258740
FrameworkControl (level=0)      → Regulation Category    → 258756
FrameworkControl (level=1)      → Regulation Sub-Category→ 258765
FrameworkControl (level=2+)     → Provision              → 258774
```

**Parent linkage:**
- Categories: `Parent External Id` = framework.slug (e.g., `gdpr`)
- Sub-Categories: `Parent External Id` = parent category's `controlRef`
- Provisions: `Parent External Id` = parent sub-category's `controlRef`

**Key implementation detail:** Template columns are fetched dynamically via `ImportableTemplates/0`, and each record is built with keys in the exact template column order using `buildOrderedRecord()`. This eliminates hardcoded column orders.

**Result:** Full 4-level tree visible in PU:
```
GDPR (Regulation)
├── Principles (Category)
│   ├── Art.5 — Principles relating to processing (Sub-Category)
│   └── Art.6 — Lawfulness of processing (Sub-Category)
├── Controller and Processor (Category)
│   ├── Data protection by design and by default (Sub-Category)
│   │   ├── Data protection by design (Provision)
│   │   └── Data protection by default (Provision)
│   ├── Processor (Sub-Category)
│   └── Records of processing activities (Sub-Category)
├── Security of Processing (Category)
│   ├── Art.32 — Security of processing (Sub-Category)
│   ├── Art.33 — Notification of breach (Sub-Category)
│   └── Art.35 — DPIA (Sub-Category)
└── International Transfers (Category)
    ├── Art.44-46 (Sub-Categories)
    └── Art.49 — Derogations (Sub-Category)
```
