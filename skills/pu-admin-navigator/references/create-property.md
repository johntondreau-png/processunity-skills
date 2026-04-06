# Creating Properties in ProcessUnity (Browser Automation Guide)

## Navigation Path

Settings → General → Properties → [Select Object]

## Canonical UI Workflow

### Step 1: Navigate to Properties
1. Click the **SETTINGS** tab in the main navigation
2. In the left panel, find **General** → **Properties**
3. The center panel shows a list of available Object Types with the number of custom properties each has

### Step 2: Select the Target Object
1. Scroll to (or search for) the target object in the center panel
2. Click to select it — the right panel will show all current properties for that object

### Step 3: Enter Edit Mode
1. Click **Edit** in the right panel (single click, wait for postback — do NOT double-click)
2. Confirm Edit mode by verifying the **Add Property** button is visible
3. Optionally click **Show Details** to see deeper property attributes

### Step 4: Add a New Property
1. Click **Add Property**
2. In the dialog that appears, fill in the **General** tab:

   **Name** — The internal/system name. This is the identifier used in admin settings, API calls, expressions, and import templates. Use `snake_case` or short descriptive names (e.g., `issuing_body`, `effective_date`, `scf_control_ids`). Must be unique within the object.

   **Description** — A clear explanation of the property's purpose, what data it holds, and any relevant context. This helps administrators and future configurators understand the intent. **Always populate this field.**

3. **Select Property Type** using type-ahead:
   - Click the Property Type dropdown
   - Start typing the canonical type string (e.g., "Number - Calc", "Pick List - Select")
   - Select the matching option
   - If the expected type doesn't appear, STOP — the tenant may not support it

4. For Pick List types, enter values one per line

5. Configure flags:
   - **Required** — true/false
   - **Hidden** — true/false
   - **Read Only** — true/false
   - **Hide in Edit Mode** — true/false
   - **Track Changes** — true/false
   - **Capture History Monthly/Weekly** — true/false

### Step 5: Configure Display Tab

> **MANDATORY**: Every property must have Label, Tooltip, and Description configured for completeness.

- **Label** — The user-facing display name. This is what end users see on forms, detail views, and reports. Use proper casing and readable language (e.g., `Issuing Body`, `Effective Date`, `SCF Control IDs`). The Label should be visually appealing and self-explanatory to a non-technical user.
- **Report Label** — Default column name when used in reports (defaults to Label if not set)
- **Tooltip** — Descriptive help text shown to end users on hover. Should explain what the field is for and what kind of data to enter. **Always populate this field.**
- **Tooltip Display** — "View and Edit Modes" (default)
- **Layout** — "Auto" (default) or specific width
- Font/background colors (expression-based for conditional coloring)
- Display format (for numbers, dates)
- Bold setting

#### Name vs. Label — Key Distinction

| Attribute | Purpose | Where it appears | Convention |
|-----------|---------|-----------------|------------|
| **Name** | System identifier | Admin settings, API calls, expressions, import templates | `snake_case` or short technical names (e.g., `scf_mapped`, `display_id`) |
| **Label** | User-facing display | Forms, detail views, reports, column headers | Title Case, readable (e.g., `SCF Mapped`, `Display ID`, `Issuing Body`) |

**Example:**
- Name: `effective_date` → Label: `Effective Date`
- Name: `scf_control_ids` → Label: `SCF Control IDs`
- Name: `issuing_body` → Label: `Issuing Body`
- Name: `last_synced_at` → Label: `Last Synced`

### Step 6: Configure Rules Tab
- **Copy/Paste behavior** — how value is handled when record is duplicated
- **Validation Expression** — returns empty string if valid, or error message text
  - For calculated properties, this is where the expression goes
- **Auto Update Rule** — event type and condition/value expression

### Step 7: Configure View/Edit Access Tabs (if needed)
- Restrict visibility by condition or role/team
- Restrict editability by condition or role/team

### Step 8: Save
- Click **OK** or **Save**
- If the modal reopens with blank fields, the property may have saved successfully — check the list

### Step 9: Post-Save Verification (REQUIRED)

For every property created or modified, verify:
- [ ] Property appears in the property list
- [ ] **Name** matches spec (system/API name)
- [ ] **Label** matches spec (user-facing display name, properly cased)
- [ ] **Description** is populated (explains the property's purpose)
- [ ] **Tooltip** is populated (help text for end users)
- [ ] Type matches spec
- [ ] Flags match spec (Required, Hidden, Read Only)
- [ ] If calculated:
  - [ ] Expression is saved correctly
  - [ ] References resolve (no errors)
  - [ ] Quick sanity test matches expected output

## Completeness Rule

**Every property MUST have all four metadata fields populated:**

1. **Name** — System identifier (`snake_case`, used in API/expressions/import templates)
2. **Description** — Admin-facing explanation of the property's purpose (General tab)
3. **Label** — User-facing display name (Display tab) — use Title Case, make it readable and visually appealing
4. **Tooltip** — End-user help text (Display tab) — explain what to enter and why

If an execution plan or spec does not provide values for Description, Label, or Tooltip, generate reasonable defaults:
- **Label**: Convert the Name to Title Case (e.g., `effective_date` → `Effective Date`)
- **Description**: Brief statement of what the property stores (e.g., "The date this regulation became effective")
- **Tooltip**: Instructional text for end users (e.g., "Enter the date this regulation went into effect")

## Bulk Property Creation

When creating multiple properties from an execution plan:
1. Stay in Edit mode throughout
2. Create properties in dependency order (base properties before calculated properties that reference them)
3. Ensure every property has Name, Description, Label, and Tooltip populated
4. Verify each property after creation before moving to the next
5. Produce a complete Change Log at the end

## Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Add Property button missing | Not in Edit mode | Click Edit button |
| Property type list is huge | — | Use type-ahead search |
| Modal reopens blank after save | May have saved successfully | Check the property list |
| Expression field missing | Wrong property type selected | Hard stop — check type |
| Type not in dropdown | Tenant doesn't support it | Hard stop — report to user |
| Expression won't save | Syntax error | Check function syntax (no spaces before parentheses) |
