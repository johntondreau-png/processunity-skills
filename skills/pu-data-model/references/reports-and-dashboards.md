# ProcessUnity Reports & Dashboards Reference

Custom Reports are PU's analytics engine. Because of PU's semantic data model, Custom Reports are the ONLY way to query and normalize data into flat/relational output. They're used for visual reporting, integration, workflow, web services, and data export.

## Custom Reports

### Report Levels
Reports support up to 4 levels of linked object types. Level 1 is the primary object. Each subsequent level reports on relationships between objects (multi-level reporting). Start with a single-level report and add levels as needed.

### Creating a Custom Report — Steps

1. Navigate to **Reports → Administration → Custom Reports**
2. Click **+New** in the middle panel toolbar
3. Enter **Name** (keep it brief)
4. Optionally set **Report Title** (overrides Name in the heading when run)
5. Add **Instructions** (shown at top of report for consumers — supports special characters and links)
6. Set **Tooltip** (displays when hovering over published report in nav panel)
7. **Owner** defaults to creator; can be reassigned. Non-admins only see their own reports.
8. Select **Category** (optional, for organization)
9. Select **Type (Level 1)** — the primary object type (e.g., "Third Parties" for vendor reports)
   - Additional options appear: Display Owned Items Only, Allow Creation of New Items, Historical Data Report
10. **Add Columns** — select properties to include. Include "Name" as the primary identifier.
    - Columns show a level number (1-4) or blank (calculated column)
    - Property attributes are inherited: font color, background color, display format, report column title
11. **Run Now** to preview (use Run/Refresh button in middle panel)
12. **Add Calculated Columns** if needed — formula-based columns using expressions (up to 20 per type: Number, Date, Text)
13. **Reorder Columns** with up/down arrows or move-after icon
14. **Modify Column Attributes** (see below)
15. **Group the Report** — categorize rows by common values. Groups support subtotals, expand/collapse, and chart basis. Up to ~3 groups is typical.
16. **Filter the Report** — Design Time (pre-query, improves performance) and/or Run Time (interactive post-filter for end users)
17. **Sort** detail rows within groups
18. **Set Report Options** (grand totals, auto-refresh, workflow enablement, export enablement)
19. **Publish/Share** via the Access tab

### Column Attributes

Each column has these configuration tabs:

**Display Tab:**
- Column Name (must be unique per report)
- Column Label (alternate display name)
- Column Group Label (merge sequential columns under a shared heading)
- Tooltip
- Font Color, Background Color, Cell Background Color, Header Background Color (all expression-based for dynamic coloring)
- Display Format (dates, numbers, currencies, text formats including hyperlinks)
- Width (auto, narrow, medium, wide)
- Format: Bold, Alignment (left/center/right), Left/Right Borders, Font Size (X-Small to X-Large), Rotate Label
- Hide Column (column exists for calculations/filtering but isn't visible)
- Suppress Repeating Values

**Totals Tab:**
- Total Type: None, Sum, Average, Count, Min, Max, First, Last, etc.
- Total Display Format, Total Font Color, Total Background Color
- Total formatting options (bold, alignment, font size)

**Filters Tab:**
- **Design Time Filter** — reduces rows at query level (improves performance)
- **Run Time Filter** — interactive filter for end users (pick list in filter bar above report)
- Run Time Filter Default value
- Run Time Filter Type: Optional Post Filter (default) or Required Pre-Filter (limits query, improves performance)

**Drilldown Tab:**
- Drilldown Target: underlying record's Details tab, or a Context Report

### Report Options

| Option | Purpose |
|--------|---------|
| Display Grand Totals | Show totals at bottom when column totals exist |
| Grand Totals Label | Label for the grand total row (e.g., "Totals") |
| Display Detail Rows | Default expand/collapse state when report loads |
| Automatic Refresh | Auto-refresh on each invocation (disable for high-volume) |
| Enable for Workflow Actions (In Context) | Allow use in Button Actions matching Level1 |
| Enable for Workflow Actions (Other Object Types) | Allow use in Button Actions of other objects |
| Enable for Automated Export | Access via Web Services or Excel Connector |

### Report Toolbar

- **Print** — clean report-only rendering, supports PDF/HTML download
- **Export** — CSV export (no 20,000 cell limit on export, unlike browser display)
- **Reset Report** — restore default filtering and sort
- **Collapse/Expand All** — toggle detail rows (only with groups)
- **Run Report** — refresh data
- **Report Details** — edit configuration (authoring mode only)

### Charts on Reports

To add a chart:
1. Report must have at least one Group and one Column Total
2. Go to Chart tab on the report → Edit
3. Select Chart Series (column with total)
4. Select Chart Type
5. Adjust Chart Properties (legend, colors, drawing style)
6. Set Initial Display (report view or chart view)
7. Chart types include: Bar, Column, Pie, Donut, Line, Area, Gauge, Number Box, Table Chart

### Transpose Reports

Swap columns with rows for comparison-style reporting. Enable "Transpose Rows to Columns" in report details. Get the report working correctly non-transposed first. Transposition depends on sort order — when the transpose group column changes, a new row is created.

## Dashboards

Two types: **Personal** (private, one per user) and **Custom** (shared, published).

### Personal Dashboards
- One per user, found in Workspace → Home
- Configured by each user, cannot be shared
- Admins can copy one user's personal dashboard as a starting point for others

### Custom Dashboards
- Multiple named dashboards, published to different audiences via Access tab
- Created at **Reports → Administration → Custom Dashboards**
- Click +New → Add Name, Description, Tooltip, Owner
- Click **Dashboard Details** → **Add Chart** to add charts from Custom Reports
- Charts can be resized, rearranged, and individually filtered using the report's Run Time Filters
- Same chart can be added multiple times with different filters (e.g., "Bill's Vendors", "Tom's Vendors")
- Rename charts for clarity when using the same source with different filters
- Publish via Access tab (roles and teams)

### Custom Dashboard Landing Page
Administrators can design fully personalized workspace dashboards using a rich text editor — present relevant information, streamline navigation, create engaging UX.

### Dashboard Refresh
- Shows date/time of last refresh; clock turns red if >5 minutes old
- Click Refresh to run all underlying reports
- Auto-refreshes if not refreshed in 5 days
- Data is cached for performance

## Sharing / Publishing

Reports and dashboards are shared via the **Access tab** (admin-only):

- **Only Me** — owner and admins only
- **Selected Roles** — specific roles
- **Selected Teams** — specific teams
- **All Users** — everyone with active accounts

Publishing means making the report/dashboard appear in the navigation panel under a specific task area and report group, rather than requiring users to find it in the Custom Reports grid.
