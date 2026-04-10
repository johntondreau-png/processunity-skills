# Procedure: create_reference_data

Create reference data types and values in ProcessUnity. Reference data provides shared lookup lists used across multiple objects and properties (e.g., countries, risk categories, industry types).

## Inputs (required)

| Parameter | Type | Description |
|-----------|------|-------------|
| type_name | string | Name of the reference data type (e.g., "Country", "Risk Category", "Industry") |
| values | string[] | List of values to add to this type |

## Inputs (optional)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| description | string | — | Description of the reference data type's purpose |
| sort_order | string | "Alphabetical" | How values are ordered: "Alphabetical", "Custom", or "As Entered" |
| value_descriptions | object | — | Map of value name to description: `{ "High": "Critical risk level", ... }` |
| active_flags | object | — | Map of value name to active status: `{ "Deprecated Value": false }`. All default to true. |

## Prerequisites

- Logged into the target PU instance in the browser
- Browser at 100% zoom, window maximized
- Can see main navigation tabs (WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP)

## Navigation

Settings > General > Reference Data

## Steps

1. **Navigate to Reference Data**
   - Click **SETTINGS** tab in main navigation
   - In the left panel, click **General** > **Reference Data**
   - Center panel shows existing reference data types

2. **Check if the type already exists**
   - Scroll or search the center panel for `type_name`
   - If it exists: click to select it and skip to Step 4 (add values to existing type)
   - If it does not exist: proceed to Step 3

3. **Create the reference data type**
   - Click **+New** in the middle panel toolbar
   - Enter **Name**: `type_name`
   - Enter **Description**: `description` (if provided)
   - Click **Save** or **OK**
   - The new type appears in the center panel list

4. **Select the reference data type**
   - Click `type_name` in the center panel
   - The right panel shows existing values for this type

5. **Enter Edit mode**
   - Click **Edit** in the right panel (single click, wait for postback)
   - Confirm Edit mode: the **Add Value** or **+New** button must be visible

6. **Add values**
   - For each value in `values`:
     - Click **Add Value** (or **+New** in the values area)
     - Enter the **Value** name
     - Enter **Description** from `value_descriptions` if provided
     - Set **Active** flag from `active_flags` if specified (default: true)
     - Click **Save** or **OK** for each value
   - Repeat until all values are added

7. **Configure sort order** (if specified)
   - If `sort_order` is "Custom": drag values into the desired order using the reorder handles
   - If "Alphabetical": values sort automatically

8. **Save**
   - Click **Save** to persist all changes to the reference data type
   - Exit Edit mode

## Verification

- [ ] Reference data type appears in the center panel list
- [ ] Type name matches specification
- [ ] All values are present in the right panel
- [ ] Values are spelled correctly
- [ ] Sort order is correct
- [ ] Descriptions are populated (if specified)
- [ ] Active/inactive flags are correct

## Post-Creation: Linking to Properties

After creating reference data, you may need to link it to properties:
- Navigate to Settings > General > Properties > [Object] > Edit
- Edit the target property (must be a reference-data-backed type)
- In the property configuration, select this reference data type as the source

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| +New button missing | Not in the right navigation area | Ensure you are at Settings > General > Reference Data |
| Add Value button missing | Not in Edit mode | Click Edit in the right panel |
| Duplicate value error | Value name already exists in this type | Use a unique value name or check existing values |
| Values not saving | Did not click Save after adding | Click Save to persist before exiting Edit mode |
| Type not appearing after creation | Page needs refresh | Refresh the browser and navigate back |
| Cannot delete a value | Value is in use by records | Set the value to Inactive instead of deleting |
