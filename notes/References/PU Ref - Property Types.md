---
tags:
  - processunity
  - reference
  - properties
  - configuration
created: 2026-04-07
parent: "[[PU Data Model]]"
---

# PU Ref - Property Types

> All property types available in ProcessUnity, their configuration options, and best practices. Referenced by [[PU Data Model]] and [[PU Config Designer]].

## Basic Property Types

| Type | Description | Use When |
|------|-------------|----------|
| **Text** | Freeform text | Names, descriptions, short answers |
| **Rich Text** | HTML-formatted text | Long descriptions, instructions |
| **Number** | Numeric values | Scores, counts, amounts |
| **Date** | Date with calendar popup | Due dates, review dates |
| **DateTime** | Read-only (set via rules/workflow) | Timestamps, system dates |
| **Pick List - Select One** | Single-select dropdown | Status, category, priority |
| **Pick List - Select Many** | Multi-select | Tags, multiple categories |
| **Yes/No** | Boolean toggle | Flags, binary decisions |
| **Image** | User-uploadable image | Logos, screenshots |

## Advanced Property Types

| Type | Description | Use When |
|------|-------------|----------|
| **Calculated** | Read-only expression result, auto-recalculates | Risk scores, derived ratings, conditional values |
| **Aggregate** | Summary from related records (count, sum, avg, min, max, etc.) | Total issues on vendor, average score |
| **Reference Data** | Dynamic pick list from Reference Data object, supports cascading | Country/State/City, shared pick lists |
| **Image - Calculated** | Expression resolving to Image Library images | Traffic lights, status icons |
| **Section Header** | Heading to organize properties (not a data field) | Grouping related properties |
| **External Component** | Read-only iframe with dynamic URLs | Embedded maps, external dashboards |

## Cascading Pick Lists

Two Reference Data properties where the child filters based on the parent's value. Both must be Reference Data type. Common patterns: Country → State → City, LOB → Department.

## Configuration Options

**Core Settings**: Required, Hidden, Read Only, Hide in Edit Mode, Track Changes (limited per object), Capture History Monthly/Weekly

**Display Tab**: Label, Report Label, Tooltip, Layout, Font/Background colors (expression-based), Display format, Bold

**Rules Tab**: Copy/Paste behavior, Validation Rule (expression → empty = valid, text = error), Auto Update Rule (On Value Change / On Change to True / Nightly if True)

**View/Edit Access Tabs**: Restrict by condition or role/team

## Canonical Property Type Strings

Use these exact strings in the Property Type dropdown:

**Text**: `Text - Short (100 chars)`, `Text - Long (4,000 chars)`, `Text - Memo (32,000 chars)`, `Text - Rich Text`, `Text - Calculated`, `Text - Aggregate`

**Number**: `Number – Integer`, `Number – Decimal`, `Number – Sequence`, `Number - Calculated`, `Number - Aggregate`

**Date**: `Date - Calendar`, `Date - Calculated`, `Date - Aggregate`, `Date - Timestamp`

**Pick List**: `Pick List - Yes/No`, `Pick List – Select One`, `Pick List – Select Many`

**People/Teams**: `Individual – Select One/Many`, `Individual – Aggregate`, `Team – Select One/Many`

**Files/Media**: `Attachment – Upload One/Many`, `Image`, `Image - Calculated`

**Reference/Relationships**: `Reference Data – Select One/Many`, `Object - Select One/Many`, `Vendor - Select One/Many`

**Widgets**: `External Component`

## Quick Use Case → Type Mapping

- Yes/No toggle → `Pick List - Yes/No`
- Single dropdown → `Pick List – Select One`
- Multi-select → `Pick List – Select Many`
- Free text → `Text - Short/Long/Memo/Rich Text`
- Calculated value → `Text/Number/Date - Calculated`
- Child aggregation → `Text/Number/Date - Aggregate`
- Timestamp → `Date - Timestamp`
- Choose a person → `Individual – Select One/Many`
- Link to records → `Object - Select One/Many`

## Conditional Display / Conditional Edit

Properties can be shown/hidden or made editable/read-only based on another property's value. Configured on **View Access** and **Edit Access** tabs.

**Common patterns:**
- **State-gating**: Show fields after milestones — `[Questionnaire Submitted?] = "Yes"`
- **Scope-type filtering**: Show fields by mode — `[DORA?] = "Yes"`
- **Multi-value matching**: Pipe `|` for OR — `[Status] = "2. Under Review|C. Complete"`
- **Polymorphic objects**: Reference Data acting as multiple types — `[Type] = "Country"`
- **Section Header gating**: Hide entire sections by conditionally displaying the Section Header

## Auto Update Rules

Automatically set property values. Two event types:

**ValueChange**: Fires when watched fields change. Patterns:
- Composite name: `[Vendor Name] + " - " + [Assessment Type] + " - " + TOSTRING([Start Date], "MMM yyyy")`
- Cascading aggregate: Watch `[Primary Contact Agg]` → copy to regular field
- Date math: `DAYSADD([Last Completed Date], [Frequency (Days)])`

**Conditional**: Fires when condition becomes true. Patterns:
- Timestamp: `[Sent Date] != ""` → `TIMESTAMP()`
- User capture: `[Submitted Date] != "" AND [Submit By] = ""` → `[Me]`
- Snapshot: `[Completion Date] != ""` → `[# Issues (Active/Open)]`
- Boolean flag: `[DORA Code] != ""` → `"Yes"`

## Color Coding

Dynamic color expressions on any property. Standard palette:

| Hex | Meaning |
|-----|---------|
| `#AE312E` / `#d05656` | Critical / Very Weak |
| `#F88438` | High / Orange |
| `#F7CF47` / `#f3e896` | Medium / Fair |
| `#85d581` / `#388E46` | Strong / Very Strong |
| `#B5D551` | Active / Good |
| `#F3F3F3` | Cancelled / Grey |

**5-tier pattern:** `CASEX([Value], "Very Weak","#d05656", "Weak","#fabd78", "Fair","#f3e896", "Strong","#85d581", "Very Strong","#64B150","")`

## Best Practices

- Use **Section Headers** generously — dramatically improves adoption
- Prefer **Reference Data** over static pick lists for shared/changing values
- Use **Calculated** properties for derived values
- Enable **Track Changes** sparingly (per-object limit) — critical fields only
- Write clear **Tooltips** for every property
- Use **Auto Update Rules** to reduce manual entry
- Use **Validation Rules** to catch data quality issues at entry
- Use **Conditional Display** to progressively disclose fields
- Use the **External ID shadow** pattern for Reference Data: hidden Text - Aggregate (Lookup) companion stores the code for direct report output
- Plan aggregate properties carefully — hard limit of 50 per object
