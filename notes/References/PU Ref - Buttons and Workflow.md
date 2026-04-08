---
tags:
  - processunity
  - reference
  - buttons
  - workflow
  - automation
created: 2026-04-08
parent: "[[PU Admin Navigator]]"
---

# PU Ref - Buttons and Workflow

> Complete reference for Buttons, Workflow Steps, Report Actions, and External API Connections. See [[PU Admin Navigator]] for execution context and [[PU Ref - Automated Actions]] for system-triggered automation.

## The Workflow Action Triad

Three mechanisms share the same step engine:

| Mechanism | Trigger | Interactive | Location |
|-----------|---------|------------|----------|
| **Buttons** | User clicks on record toolbar | Yes (form, confirm, navigate) | Settings > Notifications & Workflow > Buttons |
| **Report Actions** | User clicks on report (row or bulk) | Yes (form, confirm) | Custom Report > Actions tab |
| **Automated Actions** | System event/condition | No | Settings > Notifications & Workflow > Automated Actions |

## Button Configuration (6 Tabs)

1. **Details** — Name, Tooltip, Require Confirmation, Confirmation/Completion Text (expression-capable)
2. **Display** — Label (internal), Tooltip, Enable Grouping (named group or hamburger menu)
3. **View Access** — Roles/Teams restriction, Conditional Display Property, Conditional Enable Property + Disabled Message
4. **Form** — Optional popup collecting property values (Read Only, Required, Sequenced, Form Instructions)
5. **Steps** — 11 workflow step types, sequenced, conditionally disableable
6. **Navigation** — Where user goes after: blank, Step (created item), Item (by ID + Tab)

## 11 Workflow Step Types

| # | Type | What It Does | Requires |
|---|------|-------------|----------|
| 1 | **Update Property** | Change a property value | Expression |
| 2 | **Create New Item** | Create a record | WFA Report + Import Template |
| 3 | **Create Relationship** | Link two records | Report (2 columns) + Import Template |
| 4 | **Send to External API** | Push data out | WFA Report + External API Connection |
| 5 | **Get from External API** | Pull data in | Import Template (with Mapping) + API Connection |
| 6 | **Export/Import** | Update or create records | WFA Report + Import Template |
| 7 | **Attach Word Template** | Generate .docx | Word Template + MS Word Connector |
| 8 | **Screen Vendor** | Refresh connector data | BitSight/D&B/EcoVadis/RiskRecon/SSC/WC1 |
| 9 | **Resolve Screening** | WC1 round-trip | Refinitiv WC1 only |
| 10 | **Copy Files** | Copy attachments | Report (source + target IDs) |
| 11 | **Update Mappings** | Offer Management only | Client Inventory |

**Conditional Steps**: Any step can be conditionally disabled via expression (True = skip).

## ButtonActionLastID (BALI)

Global variable holding the PU ID of the last record created by a Create New Item step. **Overwritten by the next Create New Item** — store immediately via Update Property.

**Pattern**: Create Vendor → Store BALI → Create Assessment → Store BALI → Create Relationship

## WFA Report Pairing

Reports must be enabled for Workflow Actions:
- **In Context** — same object type as Level 1
- **Other Object Types** — different object types (must tag which)
- **Remote** — cross-instance via PU Connector

Import Templates must also be enabled for the relevant step type.

## Report Filter Passing

Syntax: `"FilterName:" + [PropertyValue]` — semicolons between filters, pipes between values.

## Report Actions

| Mode | Trigger | Operates On |
|------|---------|------------|
| Report-Level | Toolbar button | All rows or selected rows |
| Row-Level | Ellipsis icon | Single row |

6 types: Form/Steps, Bulk Delete, New Item (Related/Unrelated) Details/Form. Forms can be Individual (per-row editing) or Global (single value to all rows).

## Button Naming Convention

```
BTN: [SUBJECT]: [SEQUENCE]. [ACTION] [QUALIFIER]
```

Examples: `BTN: REQUEST: 01. Create Vendor`, `BTN: VENDOR: BULK ACTION: 1. Create Bulk Campaign Assessment`

## External API Connections

**Auth types**: Basic, API Key, OAuth (with MTLS support), Custom Headers (up to 5).

Shared config: Base URL, Retry Strategy, Relative Path (expression-based), 10MB payload limit, Test Connection button.

---

*See also: [[PU Ref - Automated Actions]] for system-triggered workflow, [[PU Ref - Function Library]] for expression syntax, [[PU Admin Navigator]] for UI execution.*
