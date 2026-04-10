# Procedure: create_property

Create a custom property on a ProcessUnity object type.

## Inputs (required)

| Parameter | Type | Description |
|-----------|------|-------------|
| object_name | string | Target object type (e.g., "Regulation", "Third Party", "Issues") |
| name | string | System/API name. Use `snake_case` or short descriptive names (e.g., `issuing_body`, `effective_date`) |
| property_type | string | PU type string from dropdown (e.g., "Text - Single Line", "Number - Calcs & Aggs", "Pick List - Select One", "Date - Date Only") |

## Inputs (optional)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| label | string | Auto from name (Title Case) | User-facing display name (e.g., `Effective Date`) |
| description | string | Auto-generated | Admin-facing explanation of the property's purpose |
| tooltip | string | Auto-generated | End-user help text shown on hover |
| report_label | string | Same as label | Column header when used in reports |
| required | boolean | false | Whether the field is mandatory |
| hidden | boolean | false | Hide from end users |
| read_only | boolean | false | Prevent editing |
| hide_in_edit_mode | boolean | false | Show in view mode only |
| track_changes | boolean | false | Enable change tracking |
| pick_list_values | string[] | — | Values for Pick List types, one per line |
| expression | string | — | Validation or calculation expression (for calculated types) |
| tooltip_display | string | "View and Edit Modes" | When to show tooltip |
| layout | string | "Auto" | Width/layout setting |

## Prerequisites

- Logged into the target PU instance in the browser
- Browser at 100% zoom, window maximized
- Can see main navigation tabs (WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP)

## Navigation

Settings > General > Properties > [object_name] > Edit

## Steps

1. **Navigate to Properties**
   - Click **SETTINGS** tab in main navigation
   - In the left panel, click **General** > **Properties**
   - Center panel shows the list of Object Types with custom property counts

2. **Select the target object**
   - Scroll or search for `object_name` in the center panel
   - Click to select it — right panel shows current properties for that object

3. **Enter Edit mode**
   - Click **Edit** in the right panel (single click, wait for postback — do NOT double-click)
   - Confirm Edit mode: the **Add Property** button must be visible
   - Optionally click **Show Details** to see deeper property attributes

4. **Click Add Property**
   - Click the **Add Property** button in the properties panel header
   - A dialog/modal appears with tabbed configuration

5. **Fill General tab**
   - **Name**: Enter `name` value (system identifier)
   - **Description**: Enter `description` value (or auto-generate: brief statement of what the property stores)
   - **Property Type**: Click the dropdown, type-ahead search for `property_type`, select the match
   - If Pick List type: enter `pick_list_values` one per line in the values area
   - Configure flags: Required, Hidden, Read Only, Hide in Edit Mode, Track Changes as specified

6. **Fill Display tab**
   - **Label**: Enter `label` value (or auto-generate from name as Title Case)
   - **Report Label**: Enter `report_label` if different from label
   - **Tooltip**: Enter `tooltip` value (or auto-generate: instructional text for end users)
   - **Tooltip Display**: Set to `tooltip_display` value
   - **Layout**: Set to `layout` value
   - Configure font/background colors and display format if specified

7. **Fill Rules tab** (if applicable)
   - **Validation Expression**: Enter `expression` if this is a calculated property
   - Configure Copy/Paste behavior and Auto Update Rules if specified

8. **Fill View/Edit Access tabs** (if applicable)
   - Restrict visibility or editability by condition, role, or team as specified

9. **Save**
   - Click **OK** or **Save** at bottom of the dialog
   - If the modal reopens with blank fields, the property may have saved — check the property list

## Verification

- [ ] Property appears in the property list for the target object
- [ ] **Name** matches the specified system name
- [ ] **Label** matches the specified display name (properly cased)
- [ ] **Description** is populated
- [ ] **Tooltip** is populated
- [ ] **Type** matches the specified property type
- [ ] Flags match specification (Required, Hidden, Read Only)
- [ ] If calculated: expression is saved, references resolve, quick sanity test passes

## Completeness Rule

Every property MUST have all four metadata fields populated:

| Field | Tab | Convention |
|-------|-----|------------|
| Name | General | `snake_case`, used in API/expressions/import templates |
| Description | General | Admin-facing explanation of purpose |
| Label | Display | Title Case, user-facing display name |
| Tooltip | Display | End-user help text (what to enter and why) |

If the caller does not provide Description, Label, or Tooltip, generate reasonable defaults:
- **Label**: Convert Name to Title Case (`effective_date` > `Effective Date`)
- **Description**: Brief statement (`"The date this regulation became effective"`)
- **Tooltip**: Instructional text (`"Enter the date this regulation went into effect"`)

## Bulk Creation Notes

When creating multiple properties from an execution plan:
1. Stay in Edit mode throughout (do not exit and re-enter between properties)
2. Create in dependency order (base properties before calculated properties that reference them)
3. Verify each property after creation before moving to the next
4. Produce a complete Change Log at the end

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| Add Property button missing | Not in Edit mode | Click Edit button in the right panel |
| Property type list is huge | Normal behavior | Use type-ahead search — start typing the type name |
| Modal reopens blank after save | May have saved successfully | Check the property list for the new property |
| Expression field missing | Wrong property type selected | HARD STOP — verify the correct type before proceeding |
| Type not in dropdown | Tenant doesn't support it | HARD STOP — report to user |
| Expression won't save | Syntax error | Check function syntax (no spaces before parentheses) |
| Duplicate name error | Name already exists on this object | Use a unique name or check existing properties first |
