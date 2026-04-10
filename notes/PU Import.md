---
tags:
  - processunity
  - import-api
  - data-pipeline
created: 2026-04-10
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
  - "[[PU Configuration]]"
  - "[[PU Admin Navigator]]"
  - "[[PU Enrich]]"
---

# PU Import

> Bulk create and update records in any ProcessUnity object via the Import API. The programmatic counterpart to PU's browser-based import — use whenever you need to push data into PU without manual CSV uploads.

## When to Use

Consult this when you need to:
- Push data into PU programmatically (regulations, vendors, threats, questions, reference data)
- Understand the Import API's positional column mapping behavior
- Debug import errors ("General error", column count mismatches, 0 records added)
- Build hierarchical (tree) imports with parent-child relationships
- Validate import results and handle both response shapes

## Critical API Behavior

**The Import API maps values POSITIONALLY, not by key name.** This is the single most important thing to know:

1. Dict key names are **ignored** — only value position matters
2. Column count must match the template **exactly**
3. All values should be **strings** — integers cause `"General error (line 2)"`
4. Use `ImportableTemplates/0` to discover actual column order at runtime
5. Key Column value determines insert vs. update (upsert)

## Prerequisites

Each import requires an **Import Template** in PU with:
- Correct columns mapped
- Key Column set (for upsert matching)
- Inserts and/or Updates enabled
- "Enable for Automated Import" checked

No template? Use [[PU Admin Navigator]] to create one via browser automation.

## Known Templates (Ocean Instance)

| Template | ID | Object | Key |
|----------|-----|--------|-----|
| Regulations Import | 258740 | Regulation | External Id |
| Reg Categories Import | 258756 | Regulation Category | External Id |
| Reg Sub-Categories Import | 258765 | Regulation Sub-Category | External Id |
| Provisions Import | 258774 | Provision | External Id |
| Reference Data Import | 258681 | Reference Data | External ID |

## Hierarchical Imports

For tree data (e.g., Regulation → Category → Sub-Category → Provision):
1. Import **top-down** — parents must exist before children
2. Add **2-3 second delay** between levels for PU indexing
3. Child's `Parent External Id` must match parent's `External Id` exactly

## Response Shapes

The API returns two different shapes — always handle both:
- **Shape A**: `result.TotalAddedRecords` (direct)
- **Shape B**: `result.Data.TotalInsertRecords` (wrapped)
- Safe pattern: `const data = result.Data ?? result`

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| `General error (line 2)` | Integer values in text columns | Wrap with `String()` |
| `Column count mismatch (N vs M)` | Wrong number of keys per row | Match template column count exactly |
| 0 added, 0 updated, no error | Data sent as arrays not dicts | Use dicts/objects |
| Values in wrong columns | Key order doesn't match template | Build ordered records from `Columns` array |

*See also: [[PU Configuration]], [[PU Data Model]], [[PU Admin Navigator]], [[PU Enrich]]*
