# Procedure: create_dashboard

Create a custom dashboard from existing report charts in ProcessUnity.

## Inputs (required)

| Parameter | Type | Description |
|-----------|------|-------------|
| name | string | Dashboard name |
| charts | object[] | Charts to include: `[{ report_name, chart_label? }]` |

## Inputs (optional)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| description | string | — | Dashboard description/instructions shown to viewers |
| tooltip | string | — | Hover text in the nav panel when published |
| category | string | — | Dashboard category for organization |
| layout | string | "Auto" | Layout mode: "Auto" or manual grid positioning |
| chart_sizes | object[] | — | Per-chart sizing: `[{ report_name, width?, height? }]` |
| run_time_filters | object[] | — | Dashboard-level run-time filters applied across charts |
| access | object | `{ type: "Only Me" }` | Publish settings: `{ type, roles?, teams?, task_area?, report_group? }` |
| auto_refresh | boolean | true | Auto-refresh charts on open |

## Prerequisites

- Logged into the target PU instance in the browser
- Browser at 100% zoom, window maximized
- Can see main navigation tabs (WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP)
- **Charts must already exist**: each report referenced in `charts` must have a chart configured (Chart tab with series, type, and properties set). Use the `create_report` procedure to create reports with charts first.

## Navigation

Reports > Administration > Custom Dashboards > +New

## Steps

1. **Navigate to Custom Dashboards**
   - Click **REPORTS** tab in main navigation
   - In the left panel, click **Administration** > **Custom Dashboards**
   - Center panel shows existing custom dashboards

2. **Create the dashboard shell**
   - Click **+New** in the middle panel toolbar
   - Enter **Name**: `name`
   - Enter **Description**: `description` (if provided)
   - Enter **Tooltip**: `tooltip` (if provided)
   - Select **Category**: `category` (if provided)
   - Click **Save** or **OK**

3. **Enter edit mode**
   - Click **Dashboard Details** button in the middle panel to enter edit mode
   - The canvas area becomes editable with add/arrange controls visible

4. **Add charts**
   - For each item in `charts`:
     - Click **Add Chart**
     - In the chart picker, search for or browse to `report_name`
     - Select the chart from that report
     - Set **Chart Label**: `chart_label` if provided (overrides default)
     - Click **OK** or **Add** to place the chart on the canvas
   - Repeat for all charts

5. **Arrange and size charts**
   - Drag charts on the canvas to arrange them in the desired layout
   - Resize charts by dragging edges or corners
   - If `chart_sizes` is provided, apply specific width/height per chart
   - Aim for a balanced layout — common patterns:
     - 2x2 grid for 4 charts
     - Full-width summary chart on top, detail charts below
     - Number boxes in a row at the top, larger charts below

6. **Configure dashboard-level filters** (if specified)
   - For each item in `run_time_filters`:
     - Add a run-time filter that applies across all charts
     - This allows viewers to filter the entire dashboard interactively

7. **Set dashboard options**
   - Auto-refresh: `auto_refresh`

8. **Save the dashboard**
   - Click **Save** to persist layout and chart configuration

9. **Publish / share** (if specified)
   - Click the **Access tab**
   - Set access type: `access.type` (Only Me, Selected Roles, Selected Teams, All Users)
   - If Selected Roles/Teams: specify `access.roles` or `access.teams`
   - Publish to `access.task_area` and `access.report_group` in the nav panel

## Verification

- [ ] Dashboard appears in the Custom Dashboards list
- [ ] Dashboard name matches specification
- [ ] All charts are present on the canvas
- [ ] Charts render data correctly (not blank)
- [ ] Chart layout/arrangement is visually balanced
- [ ] Chart labels are correct
- [ ] Dashboard-level run-time filters work (if configured)
- [ ] Published to correct audience (if sharing)
- [ ] Dashboard appears in correct nav panel location (if published)

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| +New button missing | Not in Administration > Custom Dashboards | Navigate to Reports > Administration > Custom Dashboards |
| Report not in chart picker | Report doesn't have a chart configured | Edit the report and configure a chart (Chart tab) first |
| Chart shows blank/no data | Report has no data or filter is too restrictive | Run the source report directly to verify it returns data |
| Charts overlap | Manual placement issue | Drag charts to separate positions; resize if needed |
| Dashboard-level filter not working | Filter column not present in all chart source reports | Ensure the filter column exists on all underlying report objects |
| Save button unresponsive | Edit mode not active | Click Dashboard Details to enter edit mode first |
| Charts not refreshing | Auto-refresh disabled or data stale | Click refresh manually; verify auto_refresh setting |
