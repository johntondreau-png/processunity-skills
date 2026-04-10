---
name: pu-config-designer
description: >
  Design ProcessUnity configurations from customer requirements. Use this skill when someone provides
  a spreadsheet, document, or verbal description of what they need configured in ProcessUnity and
  wants Claude to figure out which objects to use, what properties to create, what reports to build,
  and what the overall configuration plan should look like. Triggers for: "configure ProcessUnity for
  this customer", "here are the requirements, design the PU setup", "what fields do I need on the
  Vendor object", "map these requirements to ProcessUnity", "design the data model for this use case",
  "create a config plan", or any scenario where requirements need to be translated into PU configuration
  decisions. Also use when reviewing or improving an existing PU configuration.
---

# ProcessUnity Configuration Designer

Translate customer requirements into a concrete ProcessUnity configuration plan.

## How This Works

You receive requirements (spreadsheet, document, or conversation) and produce a detailed configuration
plan that specifies exactly what needs to be set up in ProcessUnity. The pu-admin-navigator skill
can then execute that plan via browser automation, or the plan can serve as a human-readable spec.

## Workflow

### Step 1: Understand the Requirements

Read the input carefully — it might be a spreadsheet with columns/fields, a written description of
a risk program, or a conversation about what the customer needs. Extract:

- **Data points to capture** — What information needs to be stored? (vendor attributes, risk scores, dates, contacts, etc.)
- **Processes to support** — What workflows are needed? (onboarding, assessments, issue remediation, etc.)
- **Reports/visibility needs** — What does management need to see? (dashboards, risk summaries, compliance status)
- **User roles** — Who will use the system and what should they see/do?

### Step 2: Map to PU Objects

Consult the pu-app-guide skill (specifically `references/objects.md`) to decide which Subject Areas
and objects will hold each type of data. Key mapping decisions:

- **Vendor/third-party data** → Vendors object (and its children: Services, Contacts, Agreements)
- **Risk assessment data** → Risks, Controls, and/or Assessment Types + Questionnaires
- **Issues/findings** → Issues object
- **Policy documents** → Policies & Procedures
- **Compliance tracking** → Regulations & Standards, Certifications
- **Custom data that doesn't fit** → CUSTOM objects (up to 10 available) or VENDOR CUSTOM (3 available as Vendor children)

Remember: objects with the RE (Renamable) trait can be relabeled. For example, "Vendors" can become
"Third Parties" or "Suppliers" if that matches the customer's terminology.

### Step 3: Design Properties for Each Object

For each object, determine what properties (fields) to create. Consult `references/property-types.md`
for the available types. For each property, specify:

1. **Name** — Clear, concise label
2. **Property Type** — Text, Pick List, Reference Data, Calculated, Aggregate, etc.
3. **Pick List values** (if applicable) — One per line
4. **Configuration** — Required? Hidden? Read-only? Track Changes?
5. **Section Header** — Which section grouping does it belong to?
6. **Validation Rules** — Any constraints on valid values?
7. **Auto Update Rules** — Should this value be automatically set based on conditions?
8. **Conditional Color Coding** — Visual indicators (e.g., red/yellow/green for risk levels)?

**Design principles:**
- Group related properties under Section Headers for clean Details tab layout
- Use Reference Data properties (not static pick lists) when values are shared across objects or will change
- Use Calculated properties for derived values — don't make users compute things manually
- Design cascading pick lists where appropriate (Country → State → City)
- Add Tooltips to every property explaining its purpose
- Enable Track Changes on critical fields (there's a per-object limit)

### Step 4: Design Reference Data

If properties use Reference Data pick lists, define the Reference Data entries needed:
- Reference Data name
- Values/entries in the list
- Parent-child relationships for cascading pick lists
- Which objects/properties will use this Reference Data

### Step 5: Design Reports

For each report the customer needs, specify:
- **Name and purpose**
- **Level 1 object** (and additional levels if needed)
- **Columns** — which properties to include
- **Groups** — how to categorize rows
- **Filters** — Design Time (reduce data) and Run Time (interactive)
- **Sort order**
- **Column formatting** — color coding, display formats
- **Totals** — which columns need sums, counts, averages
- **Chart** — chart type, series, and whether it should be available for dashboards

Consult `pu-app-guide/references/reports-and-dashboards.md` for all report configuration options.

### Step 6: Design Dashboards

For management-level visibility, design dashboards:
- **Dashboard name and audience**
- **Charts to include** (sourced from reports designed in Step 5)
- **Layout** — how charts should be arranged
- **Filters** — per-chart filtering for different views of the same data
- **Publishing** — which roles/teams should see this dashboard

### Step 7: Output the Configuration Plan

Output the plan in TWO formats:

**A) Human-readable summary** for review:
```
## [Object Name]
### Properties to Add
| # | Name | Type | Values/Expression | Required | Section | Notes |
|---|------|------|-------------------|----------|---------|-------|
| 1 | Region | Reference Data | EMEIA, APAC, UK, NA | Yes | Profile | Cascading with Country |
```

**B) Machine-executable JSON execution plan** that the pu-admin-navigator skill can run:

```json
{
  "version": "1.0",
  "object": "Vendors",
  "environment_url": "https://app.processunity.net/ocean",
  "defaults": {
    "required": false,
    "hidden": false,
    "read_only": false,
    "track_changes": false
  },
  "steps": [
    {
      "step": "create_property",
      "name": "Region",
      "property_type": "Reference Data – Select One",
      "details_tab": {
        "Name": "Region",
        "Property Type": "Reference Data – Select One",
        "Required": true,
        "Hidden": false,
        "Read Only": false,
        "Track Changes": false
      },
      "display_tab": {
        "Label": "Region",
        "Report Label": "Region",
        "Tooltip": "Geographic region of the vendor's primary operations"
      },
      "rules_tab": {},
      "notes": ["Uses Reference Data: Regions (EMEIA, APAC, UK, NA)"]
    }
  ]
}
```

Save the JSON execution plan as a file so it can be reused or handed to an automation agent. Use the naming convention: `execution_plan_[object]_[description].json`

**Key rules for execution plans:**
- List properties in dependency order (base properties before calculated ones that reference them)
- Use the exact canonical Property Type strings from `references/property-types.md`
- For calculated properties, put the expression in `rules_tab.Validation Expression`
- Include notes for each step about UI pitfalls or special handling
- Set sensible defaults at the top level to reduce repetition

## Working with Spreadsheet Input

When the user provides a spreadsheet of requirements:

1. Read the spreadsheet using the xlsx skill if needed
2. Identify columns that represent data fields vs. metadata (descriptions, notes)
3. Map each data field to a PU property on the appropriate object
4. Choose the right property type based on the data:
   - Columns with fixed option lists → Pick List or Reference Data
   - Columns with dates → Date
   - Columns with numbers/scores → Number (or Calculated if derived)
   - Columns with free text → Text or Rich Text
   - Columns that aggregate child data → Aggregate property
5. Flag any fields that don't map cleanly and ask the user for guidance

## Configuration Best Practices

These come from ProcessUnity's own best practices documentation:

- **Simplicity over complexity** — just because PU can do something doesn't mean it should. Complex configs need documentation and reduce adoption.
- **Plan the data model first** — decide on objects and hierarchies before adding properties
- **Use design-time filters** on reports for performance (especially with >1,000 rows)
- **Disable auto-refresh** on high-volume reports
- **Document complex expressions** with comments
- **Use tooltips everywhere** — they're the inline help system
- **Organize workflow buttons** into meaningful groups, shown only when appropriate
- **Use visual indicators** (calculated images, color coding) to summarize complex status
- **Consider who sees what** — use conditional view/edit access to simplify the UI by role
- **Keep report names brief** — use Report Title for longer display names
