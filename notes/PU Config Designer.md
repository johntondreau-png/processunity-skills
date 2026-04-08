---
tags:
  - processunity
  - configuration
  - design
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
  - "[[PU Admin Navigator]]"
---

# PU Config Designer

> Translate customer requirements into a concrete ProcessUnity configuration plan. Produces both human-readable specs and machine-executable JSON that [[PU Admin Navigator]] can run.

## How It Works

You receive requirements (spreadsheet, document, or conversation) and produce a detailed configuration plan specifying exactly what to set up in ProcessUnity.

## Workflow

### Step 1: Understand the Requirements

Extract from the input:
- **Data points to capture** — vendor attributes, risk scores, dates, contacts, etc.
- **Processes to support** — onboarding, assessments, issue remediation, etc.
- **Reports/visibility needs** — dashboards, risk summaries, compliance status
- **User roles** — who uses the system and what should they see/do

### Step 2: Map to PU Objects

Consult [[PU Ref - Objects]] to decide which Subject Areas and objects hold each type of data:

| Data Type | PU Object |
|-----------|-----------|
| Vendor/third-party data | Vendors (+ Services, Contacts, Agreements) |
| Risk assessment data | Risks, Controls, Assessment Types + Questionnaires |
| Issues/findings | Issues |
| Policy documents | Policies & Procedures |
| Compliance tracking | Regulations & Standards, Certifications |
| Custom data | CUSTOM objects (up to 10) or VENDOR CUSTOM (3, as Vendor children) |

Objects with the **RE (Renamable)** trait can be relabeled — e.g., "Vendors" → "Third Parties".

### Step 3: Design Properties

For each object, determine properties. Consult [[PU Ref - Property Types]]. For each property specify:

1. **Name** — clear, concise label
2. **Property Type** — Text, Pick List, Reference Data, Calculated, Aggregate, etc.
3. **Pick List values** (if applicable)
4. **Configuration** — Required? Hidden? Read-only? Track Changes?
5. **Section Header** — which grouping it belongs to
6. **Validation Rules** — constraints on valid values
7. **Auto Update Rules** — automatic value setting based on conditions
8. **Conditional Color Coding** — visual indicators (red/yellow/green)

**Design principles:**
- Group related properties under **Section Headers** for clean layout
- Use **Reference Data** (not static pick lists) when values are shared across objects
- Use **Calculated properties** for derived values
- Design **cascading pick lists** where appropriate (Country → State → City)
- Add **Tooltips** to every property
- Enable **Track Changes** on critical fields (per-object limit applies)

### Step 4: Design Reference Data

For Reference Data pick lists, define:
- Reference Data name and values
- Parent-child relationships for cascading pick lists
- Which objects/properties use this Reference Data

### Step 5: Design Reports

For each report, specify: name/purpose, Level 1 object, columns, groups, filters (Design Time and Run Time), sort order, column formatting/color coding, totals, and chart configuration. See [[PU Report Builder]] for design patterns.

### Step 6: Design Dashboards

For management visibility: dashboard name/audience, charts to include (sourced from reports), layout, filters per chart tile, and publishing to roles/teams.

### Step 7: Output the Plan

Output in **two formats**:

**A) Human-readable summary** for review — tables with property name, type, values, required, section, notes.

**B) Machine-executable JSON** that [[PU Admin Navigator]] can run:

```json
{
  "version": "1.0",
  "object": "Vendors",
  "environment_url": "https://app.processunity.net/ocean",
  "defaults": { "required": false, "hidden": false, "read_only": false, "track_changes": false },
  "steps": [
    {
      "step": "create_property",
      "name": "Region",
      "property_type": "Reference Data – Select One",
      "details_tab": { "Name": "Region", "Property Type": "Reference Data – Select One", "Required": true },
      "display_tab": { "Label": "Region", "Report Label": "Region", "Tooltip": "Geographic region" },
      "rules_tab": {},
      "notes": ["Uses Reference Data: Regions (EMEIA, APAC, UK, NA)"]
    }
  ]
}
```

Save as `execution_plan_[object]_[description].json`. List properties in **dependency order** (base before calculated).

## Working with Spreadsheet Input

1. Read the spreadsheet (use xlsx skill if needed)
2. Identify data fields vs. metadata columns
3. Map each field to a PU property on the appropriate object
4. Choose property type based on data: fixed options → Pick List/Reference Data, dates → Date, numbers → Number/Calculated, free text → Text/Rich Text, aggregations → Aggregate
5. Flag fields that don't map cleanly — ask for guidance

## Best Practices

- **Simplicity over complexity** — complex configs need documentation and reduce adoption
- **Plan the data model first** — objects and hierarchies before properties
- **Use design-time filters** on reports for performance (especially >1,000 rows)
- **Disable auto-refresh** on high-volume reports
- **Document complex expressions** with comments
- **Use tooltips everywhere** — they're the inline help system
- **Use visual indicators** (calculated images, color coding) to summarize complex status
- **Consider who sees what** — conditional view/edit access simplifies the UI by role

---

*See also: [[PU Data Model]] for platform knowledge, [[PU Admin Navigator]] for executing the plan, [[PU Report Builder]] for designing reports.*
