# Procedure: configure_pick_list

Configure pick list values on a property in ProcessUnity, including optional colored values for chart Group Color rendering.

## Inputs (required)

| Parameter | Type | Description |
|-----------|------|-------------|
| object_name | string | Target object type (e.g., "Third Party", "Regulation", "Issues") |
| property_name | string | Name of the existing pick list property to configure |
| values | object[] | Pick list values: `[{ name, color?, description?, sort_order? }]` |

## Inputs (optional)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| replace_existing | boolean | false | If true, remove all existing values before adding new ones. If false, append to existing values. |
| default_value | string | — | Value to set as the default selection |
| allow_multiple | boolean | — | For "Pick List - Select Multiple" types only. Do not change type — this is informational. |

## Value Object Schema

Each item in `values` supports:

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| name | string | Yes | Display text of the pick list value |
| color | string | No | Hex color code (e.g., "#FF0000") or named color. Used as the Group Color in report charts. |
| description | string | No | Description/tooltip for this value |
| sort_order | number | No | Explicit sort position (1-based). If omitted, values are ordered as listed. |

## Prerequisites

- Logged into the target PU instance in the browser
- Browser at 100% zoom, window maximized
- Can see main navigation tabs (WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP)
- The target property must already exist and be a Pick List type ("Pick List - Select One" or "Pick List - Select Multiple")

## Navigation

Settings > General > Properties > [object_name] > Edit > [property_name]

## Steps

1. **Navigate to Properties**
   - Click **SETTINGS** tab in main navigation
   - In the left panel, click **General** > **Properties**
   - Center panel shows the list of Object Types

2. **Select the target object**
   - Click `object_name` in the center panel
   - Right panel shows current properties for that object

3. **Enter Edit mode**
   - Click **Edit** in the right panel (single click, wait for postback)
   - Confirm Edit mode is active

4. **Open the property for editing**
   - Find `property_name` in the property list
   - Click the property to open its configuration dialog
   - Verify the property type is a Pick List type

5. **Clear existing values** (if `replace_existing` is true)
   - Remove all existing pick list values from the values area
   - This clears the slate for the new value set

6. **Add pick list values**
   - For each item in `values`:
     - Enter the value **Name**: `name`
     - The value appears in the pick list values area (typically one per line)
   - Enter all values before configuring colors

7. **Configure value colors** (if any value has `color` specified)
   - For each value with a `color`:
     - Click the value or its color indicator in the values list
     - Set the color to the specified hex code or named color
     - This color is used as the **Group Color** when the property is used as a grouping column in report charts (Bar, Column, Pie, Donut)
   - Color assignment makes charts visually meaningful:
     - Red/Orange for high-risk values
     - Yellow for medium
     - Green for low-risk values
     - Gray for informational/neutral values

8. **Set default value** (if specified)
   - Mark `default_value` as the default selection for new records

9. **Configure sort order** (if specified)
   - If `sort_order` values are provided: arrange values in the specified order
   - If not specified: values remain in the order they were entered

10. **Save**
    - Click **OK** or **Save** to close the property dialog
    - Click **Save** on the properties panel to persist changes

## Verification

- [ ] Property still shows correct type (Pick List - Select One / Select Multiple)
- [ ] All specified values appear in the pick list
- [ ] Values are spelled correctly
- [ ] Colors are correctly assigned to the right values
- [ ] Sort order matches specification
- [ ] Default value is set (if specified)
- [ ] Test on a record: open a record of this object type, verify the pick list dropdown shows all values
- [ ] Test in a report chart: create or view a report grouped by this property — verify chart segments use the assigned colors

## Color Usage in Charts

Pick list colors flow through to report charts as **Group Colors**:

| Chart Type | Color Behavior |
|------------|----------------|
| Bar / Column | Each bar segment uses the pick list value's color |
| Pie / Donut | Each slice uses the pick list value's color |
| Line / Area | Each series line uses the color |
| Number Box | Background or indicator uses the color |
| Table | Can be used for conditional row/cell coloring via expressions |

To leverage colors in charts:
1. Configure colors on the pick list values (this procedure)
2. Create a report with the pick list property as a **grouping column**
3. In the report's Chart tab, the Group Color picks up the configured colors automatically

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| No values area in property dialog | Property is not a Pick List type | HARD STOP — verify the property type. Use `create_property` to create a Pick List property if needed. |
| Color picker not appearing | PU version may not support per-value colors | Set colors via expression-based background coloring on the Display tab instead |
| Values not saving | Did not click Save on both the dialog and the properties panel | Click OK on the dialog, then Save on the properties panel |
| Chart not showing colors | Property not used as a grouping column | Add the property to the Groups section of the report |
| Duplicate value error | Value name already exists in this pick list | Use unique value names |
| Values appear in wrong order | Sort order not configured | Set explicit sort_order values or reorder manually |
| Existing records show blank | Replaced values that were in use | Old records keep their value text but it may not match new values — run a cleanup report |
