# Procedure: create_report

Create a custom report in ProcessUnity.

## Inputs (required)

| Parameter | Type | Description |
|-----------|------|-------------|
| name | string | Report name (internal identifier, keep brief) |
| level_1_type | string | Primary object type (e.g., "Third Parties", "Issues", "Risks", "Regulations") |
| columns | string[] | List of property names to include as columns (always include "Name") |

## Inputs (optional)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| report_title | string | Same as name | Display title shown in report heading when run |
| instructions | string | — | Text shown at top of report explaining what it shows |
| tooltip | string | — | Hover text in the nav panel when published |
| category | string | — | Report category for organization |
| owner | string | Current user | Report owner |
| level_2_type | string | — | Secondary object type for multi-level reports |
| level_3_type | string | — | Tertiary object type for multi-level reports |
| groups | object[] | — | Grouping columns: `[{ column, background_color? }]` |
| sort_columns | object[] | — | Sort order: `[{ column, direction }]` |
| design_time_filters | object[] | — | Query-level filters: `[{ column, operator, value }]` |
| run_time_filters | object[] | — | Interactive user filters: `[{ column, type, default? }]` |
| calculated_columns | object[] | — | Calculated columns: `[{ name, type, expression }]` |
| chart | object | — | Chart config: `{ series_column, chart_type, initial_display? }` |
| access | object | `{ type: "Only Me" }` | Publish settings: `{ type, roles?, teams?, task_area?, report_group? }` |
| display_grand_totals | boolean | false | Show grand total row |
| display_detail_rows | boolean | true | Show individual data rows |
| auto_refresh | boolean | true | Auto-refresh on open (disable for high-volume reports) |
| enable_workflow_actions | boolean | false | Allow workflow actions from report |
| enable_automated_export | boolean | false | Enable for web services / Excel connector |
| owned_items_only | boolean | false | Restrict to report consumer's owned records |
| allow_creation | boolean | false | Add +New button to report toolbar |

## Prerequisites

- Logged into the target PU instance in the browser
- Browser at 100% zoom, window maximized
- Can see main navigation tabs (WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP)
- Know the exact property names that should be columns (use `pu-data-model` skill to look up)

## Navigation

Reports > Administration > Custom Reports > +New

## Steps

1. **Navigate to Custom Reports**
   - Click **REPORTS** tab in main navigation
   - In the left panel, click **Administration** > **Custom Reports**
   - Center panel shows the list of existing custom reports

2. **Create the report shell**
   - Click **+New** in the middle panel toolbar
   - Enter **Name**: `name`
   - Enter **Report Title**: `report_title` (if provided, overrides Name in heading)
   - Enter **Instructions**: `instructions` (shown at top of report output)
   - Enter **Tooltip**: `tooltip` (shown on hover in nav panel)
   - Set **Owner** if different from current user
   - Select **Category** if provided

3. **Set Level 1 (primary object)**
   - Select **Type (Level 1)**: `level_1_type`
   - Configure Level 1 options:
     - **Display Owned Items Only**: set to `owned_items_only`
     - **Allow Creation of New Items**: set to `allow_creation`

4. **Set additional levels** (if multi-level report)
   - Select **Type (Level 2)**: `level_2_type` if provided
   - Select **Type (Level 3)**: `level_3_type` if provided

5. **Add columns**
   - Click **Add Columns**
   - Select each property from `columns` list (click to select, Shift+Click for ranges)
   - Always include "Name" as the primary identifier
   - Click **OK** to add selected columns
   - Columns appear in the right panel in selection order

6. **Add calculated columns** (if specified)
   - For each item in `calculated_columns`:
     - Click **Add Calculated Column**
     - Choose type (Number, Date, or Text)
     - Enter column name and write the expression
   - Limit: 20 calculated columns per type

7. **Reorder columns**
   - Use up/down arrows or move-after icon to arrange columns in desired sequence

8. **Configure column attributes** (for each column needing customization)
   - Click the column in the right panel to open its settings
   - **Display tab**: Column Name, Label, Tooltip, colors (expression-based), display format, width, alignment
   - **Totals tab**: Total Type (Sum, Average, Count, Min, Max, etc.), display format
   - **Filters tab**: Design Time Filter and/or Run Time Filter
   - **Drilldown tab**: Target (record Details tab or Context Report)

9. **Configure grouping** (if specified)
   - For each item in `groups`:
     - Add the column to the Groups area in the right panel
     - Apply background color if specified
   - Recommended: no more than 3 groups

10. **Configure filters**
    - Add **Design Time Filters** from `design_time_filters` (reduces data at query level)
    - Add **Run Time Filters** from `run_time_filters` (interactive end-user filters)
    - For high-volume reports (>1,000 rows), always use design-time filters

11. **Configure sorting**
    - Set sort order from `sort_columns` in the Sort area of the right panel

12. **Set report options**
    - Display Grand Totals: `display_grand_totals`
    - Display Detail Rows: `display_detail_rows`
    - Automatic Refresh: `auto_refresh`
    - Enable for Workflow Actions: `enable_workflow_actions`
    - Enable for Automated Export: `enable_automated_export`

13. **Run and preview**
    - Click **Run/Refresh** in the middle panel toolbar
    - Review the report output — iterate on column attributes and re-run as needed

14. **Add chart** (if specified)
    - Go to the **Chart tab** in report configuration
    - Select **Chart Series**: `chart.series_column` (must have a column with totals)
    - Select **Chart Type**: `chart.chart_type` (Bar, Column, Pie, Donut, Line, Area, Gauge, Number Box, Table)
    - Configure chart properties (legend, colors, drawing style)
    - Set **Initial Display**: `chart.initial_display` (report view or chart view)

15. **Publish / share** (if specified)
    - Click the **Access tab**
    - Set access type: `access.type` (Only Me, Selected Roles, Selected Teams, All Users)
    - If Selected Roles/Teams: specify `access.roles` or `access.teams`
    - Publish to `access.task_area` and `access.report_group` in the nav panel

## Verification

- [ ] Report runs without errors
- [ ] All expected columns appear in correct order
- [ ] Column labels and formatting are correct
- [ ] Design-time filters reduce data correctly
- [ ] Run-time filters work interactively
- [ ] Groups display properly with correct background colors
- [ ] Totals calculate correctly (if configured)
- [ ] Chart renders correctly (if configured)
- [ ] Drilldown works (if configured)
- [ ] Published to correct audience (if sharing)
- [ ] Report appears in the correct nav panel location (if published)

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| +New button missing | Not in Administration > Custom Reports | Navigate to Reports > Administration > Custom Reports |
| Column not in Add Columns list | Property doesn't exist on this object type | Verify the property exists — may need to create it first |
| Chart Series dropdown empty | No columns have Totals configured | Add a Total Type (Count, Sum, etc.) to at least one column |
| Report timeout or slow | Too many rows without design-time filter | Add design-time filters; set auto_refresh to false |
| Blank report output | Design-time filter too restrictive | Relax or remove design-time filters and re-run |
| Calculated column error | Expression syntax error | Check expression syntax — same rules as property expressions |
| Access tab not saving | Must select at least one role/team | Select roles or teams, or use "All Users" |
| Groups not showing | Column not in Groups area | Drag the column into the Groups section of the right panel |
