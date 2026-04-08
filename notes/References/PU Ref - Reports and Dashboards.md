---
tags:
  - processunity
  - reference
  - reports
  - dashboards
created: 2026-04-07
parent: "[[PU Data Model]]"
---

# PU Ref - Reports and Dashboards

> Detailed reference for PU's Custom Reports and Dashboards. See [[PU Report Builder]] for design patterns and [[PU Ref - Create Report]] for browser automation steps.

## Custom Reports

Custom Reports are PU's analytics engine — the **only way** to query the semantic data model in a flat/relational format.

### Report Levels
Up to 4 levels of linked objects. Level 1 is primary. Start single-level, add as needed.

### Creating a Report

1. Reports → Administration → Custom Reports → +New
2. Enter Name (brief), optional Report Title, Instructions, Tooltip
3. Select Type (Level 1) — primary object
4. Add Columns (always include "Name")
5. Run/Refresh to preview
6. Add Calculated Columns if needed (up to 20 per type)
7. Reorder, configure column attributes
8. Group the report (basis for subtotals and charts)
9. Add filters: Design Time (pre-query, performance) and Run Time (interactive)
10. Sort detail rows
11. Set Report Options
12. Add Chart if needed
13. Publish via Access tab

### Column Attributes

**Display**: Name, Label, Group Label, Tooltip, dynamic colors (expression-based), Display Format, Width, Bold, Alignment, Borders, Font Size, Hide Column, Suppress Repeating Values

**Totals**: Sum, Average, Count, Min, Max, First, Last + formatting

**Filters**: Design Time (reduces rows at query), Run Time (interactive post-filter or required pre-filter)

**Drilldown**: Record Details tab or Context Report

### Report Options

| Option | Purpose |
|--------|---------|
| Display Grand Totals | Show totals row at bottom |
| Display Detail Rows | Default expand/collapse state |
| Automatic Refresh | Auto-refresh on invocation (disable for high-volume) |
| Enable for Workflow Actions | Allow in Button Actions |
| Enable for Automated Export | Web Services / Excel Connector access |

### Charts on Reports

Requirements: at least one Group + one Column Total

Chart types: Bar, Column, Pie, Donut, Line, Area, Gauge, Number Box, Table Chart

Set Initial Display to report view or chart view.

### Transpose Reports

Swap columns with rows for comparison-style output. Enable "Transpose Rows to Columns." Get it working non-transposed first.

## Dashboards

**Personal**: One per user, private, configured individually
**Custom**: Multiple, shared, published via Access tab

### Custom Dashboard Workflow

1. Reports → Administration → Custom Dashboards → +New
2. Enter Name, Description, Tooltip, Owner
3. Dashboard Details → Add Chart (from reports with configured charts)
4. Resize and arrange tiles
5. Apply per-chart Run Time Filters
6. Save layout
7. Publish via Access tab

**Tips**: Same chart can appear multiple times with different filters. Max 16 charts. Number Boxes can publish to PU Inbox Dashboard Panel. Dashboard auto-refreshes if >5 days stale.

## Multi-Level Reports and Relationship Joins

**Critical rule**: Multi-level reports can ONLY join objects with an **existing named relationship** in the data model. No relationship = zero rows.

When adding Level 2, you pick a **named relationship** — not just an object type. Same pair can have multiple relationships returning different data (e.g., Agreement → Legal Entity via "Making Use of" vs "LEI of provider").

### Report Pipeline Pattern

For regulatory/migration scenarios, build reports as an ordered pipeline:
1. **IMPORT** reports (numbered) — output maps to import templates for data loading
2. **Operational** reports (lettered) — day-to-day admin views
3. **EXCEL** export reports — formatted to match external templates
4. **DASH:** reports — chart-optimized for dashboard tiles
5. **BTN:** reports — triggered from record action buttons

### Report Naming Conventions

| Prefix | Purpose |
|--------|---------|
| `IMPORT N:` | Data loading sequence |
| `EXCEL_` | External format export |
| `DASH:` | Dashboard source |
| `BTN:` | Button-driven operational |
| `📃` | User-facing operational |

## Sharing / Publishing

Access tab options: Only Me, Selected Roles, Selected Teams, All Users. Publishing places the report/dashboard in the navigation panel under a task area/report group.
