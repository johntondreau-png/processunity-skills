# Reports & Dashboards Reference

## Table of Contents
1. [Custom Report Basics](#custom-report-basics)
2. [Report Configuration](#report-configuration)
3. [Column Configuration](#column-configuration)
4. [Calculated Columns](#calculated-columns)
5. [Filters](#filters)
6. [Grouping and Totals](#grouping-and-totals)
7. [Conditional Colors](#conditional-colors)
8. [Charting](#charting)
9. [Dashboards](#dashboards)
10. [Report Access and Publishing](#report-access-and-publishing)
11. [Historical Data and Trending](#historical-data-and-trending)
12. [Automated Reports / Exports](#automated-reports)
13. [Best Practices](#best-practices)

---

## Custom Report Basics

Path: **Reports → Administration → Custom Reports → New**

Requirements: Reports permission in role, knowledge of data model, rough idea of desired output.

### Quick Start
1. Name the report
2. Select **Type (Level 1)** — the primary data source (subject area/object type)
3. Optionally select **Type (Level 2, 3, 4)** for related data
4. Click **Add Columns** — select properties to display (include Name as primary column)
5. Click **Run/Refresh** to preview
6. Iterate: add columns, groups, filters, formatting
7. Share via Access tab when ready

Reports default to owner + all app admins. No one else can see it until shared.

---

## Report Configuration

### Report-Level Properties (Details Tab)

| Property | Description |
|----------|-------------|
| Name | Report name in navigation |
| Report Title | Alternate name displayed on the report itself |
| Description | Internal notes |
| Report Instructions | Optional instructions shown at top of report (toggle via "i" icon) |
| Type (Level 1-4) | Data sources. Level 1 is primary; Levels 2-4 add related data. Can only change type when no columns are selected for that level |
| Display Owned Items Only | Row-level filter: shows only items owned by the person running the report |
| Historical Data Report | Enables Capture Date column for trend reporting |
| Display Grand Totals | Show totals at bottom when groups are used |
| Display Detail Rows | Default Yes. Set to No to show only group summaries. Toggleable at runtime |
| Display Detail Row Count | Show total row count at bottom |
| Set Filters before Running | Prevent auto-run; user sets runtime filters first. Recommended for high-volume reports |
| Automatic Refresh | Default No. Cached version shown with last-refresh timestamp. Recommended to keep No for high-volume reports |
| Enable for Automated Export | Admin only. Allows external access via automation/web services |
| Row Limit | Limit display to top N rows (after sort) |

### Report Appearance
- **Border Color**: custom report border
- **Header Background Default Color**: column header background (overrideable per column)

---

## Column Configuration

Click any column name in edit mode to open its **Details** dialog.

### Display Tab
| Property | Notes |
|----------|-------|
| Column Name | Must be unique |
| Property Name | System-generated, locked |
| Column Label | Override display name on report |
| Column Group Label | Group adjacent columns under a shared header |
| Tooltip | Hover text on column header |
| Font/Background Color | Static or expression-driven conditional colors |
| Display Format | Link (clickable drilldown) or plain text |
| Width | Narrow/Medium/Wide presets or Auto (recommended) |
| Hide Column | Hidden from display but still usable in calculations/filters |
| Suppress Repeating Values | Blanks out consecutive duplicate values |

### Totals Tab
Total types: Count, Count Unique, Sum, Average, Min, Max, First, Last (availability depends on data type). Custom formatting, colors, font weight, alignment, font size for totals.

### Filters Tab
Pre-filters (always applied) and Run-time Filters (user-selectable at report execution).

### Drilldown Tab
Configure what happens when a value is clicked — navigate to item details or open related report.

---

## Calculated Columns

Add calculated columns via **Add Calculated Columns** button. Same expression engine as calculated properties — functions, operators, property references.

Key difference: calculated columns operate on report data at display time, not stored data.

Types: Calculated Text, Calculated Number, Calculated Date.

Use cases: derived metrics, conditional labels, date arithmetic, formatted output.

---

## Filters

### Pre-Filters
Always applied. Configured on column's Filters tab. Filter by specific values, ranges, null/not null.

### Run-Time Filters
User-selectable filters shown at report execution. Configured on column's Filters tab by enabling "Run-Time Filter." Users can change filter values before or during report viewing.

**Set Filters before Running** (report property): when enabled, report doesn't auto-run — user must set filters and click Run.

### Filter Best Practices
- Use run-time filters for frequently changing criteria (date ranges, status, owner)
- Use pre-filters for permanent exclusions (e.g., exclude deleted items)
- For automation, run-time filters can be passed as parameters

---

## Grouping and Totals

Groups organize report rows under shared values. Configure by adding a **Group** level on the report's Details tab.

- Up to 4 grouping levels
- Groups enable charting (required: at least 1 group + 1 numeric total)
- Groups enable subtotals per group level
- Groups can be expanded/collapsed at runtime
- Grand Totals available when groups are present

---

## Conditional Colors

Columns support expression-driven font and background colors. Same syntax as property colors:
```
IF([Risk Rating] = "High", [#red], IF([Risk Rating] = "Medium", [#orange], [#green]))
```

Colors set at the property level carry into reports as defaults. Can be overridden at the column level.

**Group Color** option in charting: uses the grouped property's conditional colors in the chart.

---

## Charting

Requirements: at least 1 group + 1 numeric total column.

### Chart Types
| Type | Single Series | Multi-Series |
|------|:------------:|:------------:|
| Pie, Doughnut | ✓ | ✗ |
| Column, Bar, Line, Area, Point, Spline, Spline Area | ✓ | ✓ |
| Stacked Column, Stacked Bar, Stacked Area | ✗ | ✓ |
| Gauge, Number Box | Single value | Single value |
| Geographic Map | Location-based | Location-based |

### Chart Configuration (Chart Tab)
- **Chart Series**: select totaled columns (one series = basic charts, multiple = stacked)
- **3D Display**: Yes/No
- **Drawing Style**: Cylinder, Emboss, Wedge, etc.
- **Show Legend / Point Labels**: toggleable
- **Palette**: color theme (8 colors cycle)
- **Vary Colors by Point**: different color per bar in single series
- **Chart Axis**: Start at zero (default) or auto
- **Initial Display**: Show Report or Show Chart (toggleable at runtime)

### Gauge Charts
Display a single grand total value. No groups required. Useful for KPI dashboards (e.g., "Open Issues: 47").

---

## Dashboards

### Personal Dashboard
Path: **Workspace → Dashboard**

Users can configure their personal dashboard with published reports displayed as widgets (charts, tables, gauges).

### Custom Dashboards
Admins can create dashboard pages combining multiple reports. Published to specific roles/teams.

Dashboard widgets: chart views of custom reports, gauge charts, number boxes, geographic maps.

### Dashboard Caching
For performance, dashboards cache report data. Cached data shown with timestamp. Manual refresh available. Configure caching behavior in report settings.

---

## Report Access and Publishing

### Access Tab
- **Only Me**: only report owner + app admins
- **Selected Roles**: specific roles
- **Selected Teams**: specific teams
- **All Users**: everyone

### Publishing
Published reports appear in task areas outside Reports → Administration. Configure on the Access tab by selecting a task group location. This lets users access reports without navigating to the Custom Reports task.

Reports are displayed alphabetically in published locations (tip: prefix with numbers to force ordering).

### Security
- Reports respect role-based permissions — restricted columns show blank
- **Display Owned Items Only**: row-level filter by item ownership
- **Team Access Restrictions** (Access tab on items) carry into report results

---

## Historical Data and Trending

### Setup
1. Enable Property History Tracking (Settings → Application Settings → General Settings)
2. Enable Capture History on individual properties (weekly and/or monthly)
3. Create a custom report with **Historical Data Report** = Yes
4. Use the **Capture Date** column to build trend reports

### Use Cases
- Track metric changes over time (e.g., open issues month-over-month)
- Program health trends
- Compliance posture evolution
- Aggregate snapshots (e.g., total contracts, average risk scores)

History data is stored in a separate history table — only accessible via Historical Data Reports.

---

## Automated Reports

### Automated Export
External systems access custom report data via special URLs with credentials.

Setup:
1. Enable Automated Import/Export (Settings → Application Settings → General Settings)
2. Enable Import/Export Automation permission on relevant role(s)
3. On report: check **Enable for Automated Export** → reveals Report ID
4. Access via URL with credentials (interactive or command-line via cURL/wget)
5. Optionally schedule via Windows Task Scheduler or similar

Output format: CSV.

### Considerations
- Respects IP Address Restrictions
- Reports export as-is (groups, sort, filters)
- For ETL feeds: keep reports flat (no groups), use run-time filters to export only changes
- Import/Export Automation Log standard report tracks all automated operations

---

## Best Practices

1. **Start simple** — get basic columns working, then add groups/filters/formatting iteratively
2. **Use Set Filters before Running** for high-volume reports to avoid slow initial loads
3. **Disable Automatic Refresh** for large reports — use cached data with manual refresh
4. **Calculated columns vs. calculated properties**: use properties when the value is needed across multiple reports or in workflow; use report columns for report-specific calculations
5. **Conditional colors on properties** carry to reports as defaults — set once at the property level
6. **Row Limit** for "top N" reports (e.g., top 5 vendors by issue count)
7. **Hide Column** for filter-only or calculation-helper columns
8. **Aggregate properties vs. report totals**: aggregates are real-time on the item; report totals are point-in-time when the report runs. Use aggregates instead of report calculations when the value needs to be available outside reports
9. **Publishing naming**: prefix reports with numbers (01, 02, 03) to control sort order in published locations
