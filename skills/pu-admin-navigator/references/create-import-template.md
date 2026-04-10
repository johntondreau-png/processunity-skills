# Procedure: create_import_template

Create an import template in ProcessUnity for bulk data loading via the UI or API.

## Inputs (required)

| Parameter | Type | Description |
|-----------|------|-------------|
| name | string | Import template name (e.g., "Regulation Import", "Third Party Bulk Load") |
| object_type | string | Target object type (e.g., "Regulation", "Third Party", "Issues") |
| columns | object[] | Columns to include: `[{ property_name, is_key? }]` |

## Inputs (optional)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| description | string | — | Description of the template's purpose |
| enable_inserts | boolean | true | Allow creating new records via this template |
| enable_updates | boolean | true | Allow updating existing records via this template |
| key_column | string | First column with `is_key: true` | Column used to match existing records for updates |
| delimiter | string | "," | CSV delimiter for file-based imports |
| skip_header_row | boolean | true | Whether to skip the first row of imported files |
| column_mappings | object[] | — | Custom column mappings: `[{ property_name, column_header?, position? }]` |

## Prerequisites

- Logged into the target PU instance in the browser
- Browser at 100% zoom, window maximized
- Can see main navigation tabs (WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP)
- Know the exact property names to include (use `pu-data-model` skill to look up)

## Navigation

Settings > General > Import & Export (or Settings > General > Import Templates)

## Steps

1. **Navigate to Import Templates**
   - Click **SETTINGS** tab in main navigation
   - In the left panel, click **General** > **Import & Export** (or **Import Templates** depending on PU version)
   - Center panel shows existing import templates

2. **Create the import template**
   - Click **+New** in the middle panel toolbar
   - Enter **Name**: `name`
   - Enter **Description**: `description` (if provided)
   - Select **Object Type**: `object_type`
   - Click **Save** or **OK** to create the shell

3. **Configure import options**
   - Set **Allow Inserts**: `enable_inserts`
   - Set **Allow Updates**: `enable_updates`
   - Configure delimiter and header row settings if applicable

4. **Add columns**
   - Click **Add Column** or **Add Property** (depending on PU version)
   - For each item in `columns`:
     - Select the property `property_name` from the available properties list
     - If `is_key` is true: mark this column as the **Key Column** (used to match records for updates)
     - Set column position/order as needed
   - Repeat until all columns are added

5. **Set the key column**
   - Ensure exactly one column is marked as the key column
   - The key column determines how imported rows match to existing records
   - Common key columns: "Name", "Display ID", or a unique identifier property

6. **Configure column order**
   - Arrange columns in the desired import order
   - This order determines the positional mapping when using the API
   - **API gotcha**: The PU Import API maps values by column **position**, not by JSON key name

7. **Save the template**
   - Click **Save** to persist the template configuration
   - Note the template ID — this is needed for API-based imports

## Verification

- [ ] Template appears in the import templates list
- [ ] Template name matches specification
- [ ] Object type is correct
- [ ] All specified columns are present
- [ ] Key column is correctly set
- [ ] Column order matches the intended import format
- [ ] Insert/update flags are correct
- [ ] Test import with a small sample file (1-2 rows) to verify mapping

## API Usage Notes

After creating the template, it can be used via the PU Import API:

- Use `listImportTemplates()` to get the template ID and column metadata
- Template `.Columns` array gives exact column names and positions
- Records must have keys matching exact column names from the `.Columns` array
- **All values must be strings** — sending integers causes "General error (line 2)"
- Response shape varies: check both `result.Data.TotalInsertRecords` and `result.TotalInsertRecords`

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| +New button missing | Not in the correct navigation area | Navigate to Settings > General > Import & Export |
| Object type not in dropdown | Object doesn't support imports | Verify the object type supports import templates |
| Property not in column list | Property doesn't exist on this object | Create the property first using `create_property` procedure |
| No key column set | Key column is required for updates | Mark one column as the key column |
| API import "General error (line 2)" | Non-string values in import data | Wrap all values with `String()` |
| API import wrong columns | Column order mismatch | Verify column order matches template `.Columns` array positions |
| Import creates duplicates | Key column value doesn't match existing records | Check the key column — values must exactly match existing record field values |
| Template not visible in API | Permissions or caching | Refresh the template list; verify API user has access |
