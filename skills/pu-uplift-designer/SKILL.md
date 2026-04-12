---
name: pu-uplift-designer
description: >
  Generate automation manifests for any regulatory compliance uplift in ProcessUnity.
  Takes STAR sizing documents, reference implementation metadata, and regulatory taxonomy
  sources as input, and produces data-driven JSON manifests that the pu-admin-navigator
  automation helpers can execute against any PU instance.
  Triggers for: "design an uplift", "generate manifests", "new regulation", "STAR document",
  "compliance framework", "NIS2", "CPS 230", "SOX", "GDPR", "regulatory uplift",
  "uplift plan from STAR", "parse sizing document".
depends_on:
  - pu-app-guide
  - pu-config-designer
  - pu-admin-navigator
  - pu-dora
---

# ProcessUnity Uplift Designer

Generate automation manifests for deploying any regulatory compliance framework into ProcessUnity.

## What This Skill Does

Takes input documents describing a compliance framework and generates four JSON manifests:

1. **`{framework}-properties.json`** — Every property to create, with types, formulas, filters
2. **`{framework}-reports.json`** — Every report, import template, and dashboard
3. **`{framework}-buttons.json`** — Every button with WFA wiring
4. **`{framework}-validation.json`** — Pre/post-flight validation rules

These manifests drive the `pu-admin-navigator/automation/uplift-helpers.js` functions, which execute the actual PU configuration via browser automation.

## Input Sources (provide one or more)

| Input | What It Contains | Priority |
|-------|-----------------|----------|
| **STAR Sizing Document** | Property counts per object, report counts, button counts | Required |
| **Reference Implementation Metadata** | Property names, types, formulas from an existing PU instance (CSV/JSON export) | Strongly recommended |
| **Regulatory Taxonomy Source** | Code lists, EBA codes, reference data values (e.g., `dora.py`, regulatory schema JSON) | Recommended for reference data |
| **Requirements Document** | SOW, BRD, or configuration requirements describing the solution | Alternative to STAR |

## Output Manifest Schema

See `pu-dora/automation/manifest-schema.md` for the complete JSON schema with all fields, type IDs, and examples.

## Process

### Step 1: Parse Input Documents

Read the provided documents and extract:
- **Objects used** — which PU objects get DORA/NIS2/etc. properties (Legal Entity, CIF, Vendor, etc.)
- **Property inventory** — name, type, object assignment for each property
- **Formula definitions** — calculated and aggregate expressions
- **Reference Data types** — taxonomy code lists with external IDs
- **Report definitions** — import templates, export reports, dashboards
- **Button definitions** — WFA workflow chains
- **Object renames** — Custom Object mappings (e.g., Custom Object One → Legal Entity)

### Step 2: Map to PU Object Types

For each object in the framework, determine:
- PU system name (e.g., "Third Party" not "Vendor")
- PU Object Type ID (e.g., 214)
- Whether it requires Custom Objects, child objects, or standard objects
- System settings that need to be enabled

Use this reference table:

| Common Name | PU System Name | Type ID | Requires |
|------------|---------------|---------|----------|
| Vendor | Third Party | 214 | Standard |
| Vendor Service | Third-Party Service | 216 | Vendor Services enabled |
| Legal Entity | Custom Object One | 237 | Custom Object One enabled + renamed |
| CIF | Custom Object Three | 239 | Custom Object Three enabled + renamed |
| Service Add On | Service Add On | 263 | Vendor Custom Object One enabled + renamed |
| Agreement | Agreement | 256 | Agreements enabled |
| Fourth Party | Fourth Party | 226 | Fourth Parties enabled |
| Legal Entity Contract | Custom Object One Child Object | 274 | Custom Object One Child Objects enabled |
| Questionnaire Response | Questionnaire Response | 153 | Standard |
| Reference Data | Reference Data | 209 | Standard |

### Step 3: Map Property Types

For each property, determine the correct PU property type ID:

| If the property is... | Use Type ID | Notes |
|-----------------------|------------|-------|
| A short text field (names, IDs, codes) | 17 | Text - Short |
| A long text field (descriptions, reasons) | 14 | Text - Long |
| A formula/derived value | 13 | Text - Calculated |
| A lookup from a related record | 21 | Text - Aggregate |
| A whole number (days, hours, rank) | 7 | Number - Integer |
| A decimal number (cost, amount) | 6 | Number - Decimal |
| A date picker | 2 | Date - Calendar |
| A date formula (sentinels) | 1 | Date - Calculated |
| A Yes/No toggle | 11 | Pick List - Yes/No |
| A dropdown with custom values | 10 | Pick List - Select One |
| A reference data picker | 1005 | Reference Data - Select One |
| A link to another object | 1013 | Object - Select One |
| A multi-link to another object | 1014 | Object - Select Many |
| A section divider | 3 | Section Header |

### Step 4: Identify External ID Shadow Pattern

For every Reference Data property that maps to a regulatory taxonomy code:
1. Create the Ref Data property (type 1005)
2. Create a companion Text - Aggregate (type 21) with `"aggregateSource": "External Id"` and `"hidden": true`
3. Name the shadow: same as the Ref Data property + " - External ID"

### Step 5: Generate Reference Data

For each taxonomy code list:
1. Map to a DORA-style type name (e.g., "NIS2 - Entity Category")
2. Generate values with name + externalId
3. Check for External ID conflicts across types (shared codes need type-specific suffixes)

### Step 6: Generate Report Manifest

For each RTS/regulatory template:
1. Create an EXCEL export report with columns matching the regulatory fields
2. Use External ID shadow properties for coded fields
3. For multi-level reports, define Level 1 + Level 2 objects and relationships

### Step 7: Generate Button Manifest

For each data entry workflow:
1. Create a button on the source object
2. Define WFA steps (Export/Import, Create Relationship, etc.)
3. Set conditional display on the framework's master flag property (e.g., "DORA?")

### Step 8: Generate Validation Manifest

From the STAR/requirements doc:
1. Extract expected property counts per object
2. Extract expected report/template counts
3. Define system settings requirements
4. Define subject area rename requirements

## DORA as Reference Implementation

The `pu-dora` skill contains a complete set of manifests generated from this process:

- `pu-dora/manifests/dora-properties.json` — 194 properties
- `pu-dora/manifests/dora-reports.json` — 39 reports
- `pu-dora/manifests/dora-buttons.json` — 9 buttons
- `pu-dora/manifests/dora-formulas.json` — 75 formulas
- `pu-dora/manifests/dora-validation.json` — Validation rules

Use these as templates when generating manifests for new frameworks.

## Automation Execution

Once manifests are generated, the uplift is executed by `pu-admin-navigator` using:

1. `automation/pre-flight.js` — Validate instance readiness
2. `automation/uplift-helpers.js` — 20+ reusable Playwright functions
3. `automation/post-flight.js` — Verify completion

The execution flow reads each manifest and calls the appropriate helper function for each item. See `pu-dora/automation/manifest-schema.md` for the 11-step execution sequence.
