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

## Bulk Loading via Import API

Reference data can be bulk-loaded via the Import API, but requires specific setup:

### Prerequisites for API Import

1. **Type values must exist as pick list values FIRST** — Navigate to Settings > General > Properties > Reference Data > Edit > Type property. Add each new type name using the `btnAddItem` button (triggers ASP.NET postback per value). The Type property is a standard pick list on the Reference Data object.

2. **Import template must exist** — Create an import template for Reference Data with columns: External ID (Key), Name, Type. Enable Inserts + Updates and "Enable for Automated Import". See `create-import-template` procedure.

3. **Type is only set on INSERT, not UPDATE** — If a record already exists (matched by External ID), the Type field will NOT be updated. To fix typeless records, delete them first (see `create-delete-report` procedure) and re-import.

### Import API Payload

```json
{
  "Data": [
    { "External ID": "eba_BT:x28", "Name": "Yes", "Type": "DORA - Binary" },
    { "External ID": "eba_BT:x29", "Name": "No", "Type": "DORA - Binary" }
  ]
}
```

### Type Pick List Value Addition (Deterministic Pattern)

When adding new type values to the Reference Data Type pick list:
- Navigate to: Settings > General > Properties > Reference Data > Edit > click "Type" property link
- In the dialog, click `addCustomPropertyDialog_btnAddItem` (triggers ASP.NET postback, creates empty row)
- Fill the new empty text input with the type name using native setter + input/change/blur events
- Must use Playwright `page.click()` + `waitForTimeout(1500)` between iterations — client-side loops break because each postback replaces the DOM
- Click OK, then Done/Save to persist

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| +New button missing | Not in the right navigation area | Ensure you are at Settings > General > Reference Data |
| Add Value button missing | Not in Edit mode | Click Edit in the right panel |
| Duplicate value error | Value name already exists in this type | Use a unique value name or check existing values |
| Values not saving | Did not click Save after adding | Click Save to persist before exiting Edit mode |
| Type not appearing after creation | Page needs refresh | Refresh the browser and navigate back |
| Cannot delete a value | Value is in use by records | Set the value to Inactive instead of deleting |
| Import API "Invalid value (Type)" | Type value not in pick list | Add the type name to Reference Data > Type pick list property FIRST |
| Import updates don't set Type | Type only settable on INSERT | Delete existing records and re-import fresh |
| Client-side pick list manipulation doesn't persist | ASP.NET rebuilds from server state | Must use `btnAddItem` button (server postback) to add values, not hidden field manipulation |
