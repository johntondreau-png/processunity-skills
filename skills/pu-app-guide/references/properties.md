# Properties Reference

## Table of Contents
1. [Concepts](#concepts)
2. [Property Types](#property-types)
3. [Adding and Editing Properties](#adding-and-editing-properties)
4. [Calculated Properties](#calculated-properties)
5. [Aggregate Properties](#aggregate-properties)
6. [Pick Lists and Reference Data](#pick-lists-and-reference-data)
7. [Cascading Pick Lists](#cascading-pick-lists)
8. [Advanced Pick List Search](#advanced-pick-list-search)
9. [Auto-Update Rules](#auto-update-rules)
10. [Validation Rules](#validation-rules)
11. [View and Edit Access](#view-and-edit-access)
12. [Display and Layout](#display-and-layout)
13. [Section Headers](#section-headers)
14. [Application-Level Properties](#application-level-properties)
15. [Property History Tracking](#property-history-tracking)
16. [Item Last Modified](#item-last-modified)

---

## Concepts

Properties are fields/attributes on a subject area (Object Type). Two kinds:
- **Standard** (locked 🔒): built-in, essential — cannot delete, can hide/rename
- **Custom**: admin-created — fully configurable, subject to platform limits

Path: **Settings → General → Properties** → select Object Type in Main panel → Properties tab in Detail panel.

**Property Usage** icon shows everywhere a property is referenced (reports, notifications, aggregates, calculations, rules). A property cannot be deleted if referenced elsewhere.

**Bulk Update**: edit multiple property attributes at once via the **Bulk Update** button. Can also multi-select checkboxes to move/delete in bulk.

---

## Property Types

### Text
| Type | Max Length | Notes |
|------|-----------|-------|
| Text - Short | 100 chars | Good for codes, URLs (display format: hyperlink/email). Supports embedded hyperlinks `[[url|label]]` |
| Text - Long | 4,000 chars | Strips formatting on paste. Supports embedded hyperlinks |
| Text - Memo | 32,000 chars | Strips formatting. No history tracking |
| Text - Rich | Unlimited | Preserves RTF formatting. **Use with caution** — can degrade performance, doesn't export well, can't convert back to plain text. No history tracking |

### Numbers
| Type | Notes |
|------|-------|
| Number - Integer | Whole numbers only; max 2,147,483,647. Use Text for larger numbers (phone numbers, etc.) |
| Number - Decimal | Supports positive/negative with decimal places |
| Number - Sequence | System-generated auto-incrementing integer. Read-only (editable only via import). Can set starting value via import. Display format supports alphanumeric prefix/suffix (e.g., "I-0019") |

### Date/Time
| Type | Notes |
|------|-------|
| Date - Calendar | Data entry via typing or calendar widget. Browser locale determines format |
| Date - Timestamp | Stores date+time. Read-only — must be set via TIMESTAMP() function in auto-update rules. Stored in UTC, displayed in user's local time |

### Pick Lists
| Type | Notes |
|------|-------|
| Pick List - Yes/No | Simple boolean. Can upgrade to Select One or Select Many |
| Pick List - Select One | Single value from admin-defined list. Can upgrade to Select Many. Values editable anytime; deleted values persist on existing records until re-saved |
| Pick List - Select Many | Multiple values. Import uses pipe delimiter `|`. Display format: comma, semicolon, or new line |

### Relationship Properties
| Type | Notes |
|------|-------|
| Individual - Select One/Many | Links to People. Supports individual filter property/expression. Participates in Ownership option. Drilldown via hyperlink |
| Team - Select One/Many | Links to Teams. Participates in Ownership option |
| Reference Data - Select One/Many | Links to Reference Data items. Filterable by type and expression. Supports cascading pick lists |
| Vendor - Select One/Many | Links to Vendor subject area |

All relationship properties support **Advanced Pick List Search** (see below).

### Calculated / Aggregate / Image
| Type | Notes |
|------|-------|
| Calculated (Text/Number/Date) | Value from expression. Recalculates on save and nightly for date-dependent expressions |
| Aggregate (Text/Number/Date/Individual) | Summarizes related records. Types: Count, Sum, Average, Max, Min, Distinct List, Latest/Earliest Value |
| Image | User-uploadable image on Details tab |
| Image - Calculated | Expression-driven image from Image Library (Settings → Images) |
| External Component | iFrame embedding external web content via URL expression. Add-on feature |
| Section Header | Visual separator — not a data property |

---

## Adding and Editing Properties

### Add Property Dialog Tabs

| Tab | Purpose |
|-----|---------|
| **Details** | Name, property type, required, hidden, read-only, disable drilldown, hide in edit mode, capture history, track changes, description |
| **Display** | Label (overrides name on details tab), report label, tooltip, tooltip display mode (view/edit/both), layout, font/background color (static or expression-driven), display format, font weight |
| **Rules** | Default value, value on copy/paste (keep/blank/default), value on new version (keep/blank/default), validation rule, auto-update rule |
| **View Access** | View Access (All Users / Selected Roles / Selected Teams), Conditional Display Property (pick list or expression) |
| **Edit Access** | Edit Access (All Users / Selected Roles / Selected Teams), Conditional Edit Property (pick list or expression) |

### Reordering
Use Move Up / Move Down arrows, or **Move After** button for faster repositioning. Property order on the Properties tab = display order on the Details tab.

### Deleting
**Irreversible.** Deletes all data for that property across all records. Cannot delete if referenced by calculations, aggregates, reports, notifications, etc. Cannot delete Standard properties.

### Changing Property Types
Upgrades allowed in some cases (Short Text → Long Text, Select One → Select Many, Integer → Decimal, Yes/No → Select One/Many). Downgrades require creating a new property and migrating data via import/export.

---

## Calculated Properties

Types: Calculated Text, Calculated Number, Calculated Date.

1. Set Name and Property Type
2. Click **Function** button → opens Expression dialog
3. Write expression using properties, functions, operators
4. Click **Check Expression** to validate syntax and return type match
5. Click OK

Recalculation triggers:
- On item creation
- Whenever the item is updated (saved)
- Nightly processing for date-dependent expressions (TODAY(), NOW(), business day functions)

Expressions are used system-wide: calculated properties, calculated report columns, conditional colors, validation rules, notification conditions, aggregate filters, questionnaire scoring, pick list filtering.

---

## Aggregate Properties

Summarize data from related records. Types: Text, Number, Date, Individual.

### Configuration
1. **Aggregate Item Type**: source object (related items, parent, or children)
2. **Aggregate Type**: Count, Sum, Average, Max, Min, Distinct List, Latest Value, Earliest Value
3. **Aggregate Property**: which property on the source to aggregate
4. **Aggregate Filter Property** (optional): filter which source records to include — pick list value or expression evaluating to True/False
5. For Latest/Earliest Value: specify a date property to determine ordering

### Versioned Objects
When aggregating from versioned objects (managed documents, policies): choose **Active Only** or **Active or Latest** versions.

### Key Behaviors
- Auto-recalculates when related source data changes
- Platform limits on aggregate count per object
- If no filter specified, all related items are included
- Filter expressions can combine multiple conditions: `[Classification] = "Major" AND [Region] = "Northeast"`

---

## Pick Lists and Reference Data

### Standard Pick Lists
Defined directly on the property. Values are ordered as entered; can sort alphabetically. Changing a value auto-updates all items. Deleting a value does NOT auto-clear existing items — best practice: clean up data via import before deleting values.

### Reference Data
Path: **Settings → General → Reference Data**

Reference Data provides dynamic, filterable pick lists backed by the Reference Data object. Advantages over standard pick lists: type-ahead search, drilldown, filtering by Type or expression, cascading support.

Setup: Add Reference Data Type (a pick list value like "Country", "Department"), then add Reference Data items for each type.

On properties: choose Reference Data - Select One/Many, set **Reference Data Filter Property** (typically "Type") and **Reference Data Filter Values**.

---

## Cascading Pick Lists

Dependent pick lists where a child list filters based on the parent selection (e.g., Country → State → City).

Setup process:
1. Create Reference Data types for each level (e.g., Country, State/Province, City)
2. Add Reference Data items for all levels
3. Add Reference Data properties to the Reference Data object for each parent level (e.g., a "Country" property on Reference Data itself for States to reference)
4. Use conditional display on these helper properties to prevent circular display
5. Relate each child item to its parent in the Reference Data task (set the parent property on each child)
6. On the target object's properties, set **Reference Data Filter Property** = Expression, then write: `[Country] = [Value]` with Lookup Value = "Country"

Both master and child lists must be Reference Data properties.

---

## Advanced Pick List Search

Relationship properties (Individual, Vendor, Reference Data) support an Advanced Pick List Search — a magnifying glass icon that opens a popup grid showing additional columns beyond just the name.

### Configuration
Path: **Settings → General → Grids** → configure "Advanced Pick List Search" grid items.

Available grids: Individuals (2), Vendors (2), Reference Data (5).

Grid options: columns (add/calculated), row height, sort, set-filters-before-running (for high-volume lists), row limit (e.g., 50).

On property definition: set **Advanced Pick List Search Grid** to the configured grid name. If not set, advanced search is disabled for that property.

---

## Auto-Update Rules

Configured on the **Rules** tab of Add/Edit Property dialog. Three event types:

### On Change to True
Triggers when an expression transitions from false → true. Requires:
- **Auto Update Condition**: logical expression (True/False)
- **Auto Update Value**: expression returning the new value

Tips: Only fires on transition. Avoid TODAY()/NOW() — use Nightly If True instead.

### On Value Change
Triggers whenever an expression's result changes. Requires:
- **Auto Update Expression**: any expression (text/date/number)
- **Auto Update Value**: expression returning the new value

Tips: Fires every time the watched expression changes value.

### Nightly If True
Evaluated during nightly processing. Triggers every night the condition is true. Requires:
- **Auto Update Condition**: logical expression
- **Auto Update Value**: expression returning the new value

Tips: If true every night, the rule runs every night. Good for date-based logic (overdue checks, reminders). Test with calculated report columns first.

### Run This Rule
One-time option: check box to globally apply the rule to all existing records when saved. Use carefully.

---

## Validation Rules

Configured on the **Rules** tab. An expression that returns a message string when validation fails, or empty string on success.

Example: `IF([Risk Level] <= 0 OR [Risk Level] > 10, "Risk Level must be between 1-10", "")`

Validated on save. Prevents saving if message is non-empty.

---

## View and Edit Access

### View Access Tab
- **View Access to this Property**: All Users, Selected Roles, or Selected Teams
- **Conditional Display Property**: pick list value or expression (True/False) — hides property from Details tab when condition not met
- Conditional Display only affects Details tab, NOT reports (View Access restrictions DO affect reports — restricted columns show blank)

### Edit Access Tab
- **Edit Access to this Property**: All Users, Selected Roles, or Selected Teams
- **Conditional Edit Property**: pick list value or expression — makes property read-only when condition not met
- Conditional view/edit recalculates in real time during edit sessions

### Defaults
All properties default to All Users for both view and edit, with no conditional rules.

---

## Display and Layout

### Layout Options
Properties display in a two-column format. Layout options on Display tab:
- **Auto** (default): alternating left/right
- **Force Left / Force Right**: override auto placement
- **Full Row Left / Full Row Right**: single-column row
- Long Text, Memo, Rich Text, Section Headers: always full row

### Display Format
- Numbers: currency symbols, decimal precision, positive/negative/zero formatting
- Dates: various format strings (full day name, month abbreviations, 2-4 digit years)
- Text: hyperlink, email address format
- Select Many: comma, semicolon, or new line delimiter

### Color
Font Color and Background Color support static colors or expression-driven conditional colors. Colors use syntax `[#colorname]` or `[#RRGGBB]`. Background color auto-contrasts font (light bg → black font, dark bg → white font).

### Labels
- **Label**: overrides property name on the Details tab
- **Report Label**: overrides property name in custom reports
- **Tooltip**: help text on hover. Display modes: View only, Edit only, or Both

---

## Section Headers

Visual separators for organizing the Details tab. Not data properties — cannot be imported, exported, or used in reports.

Features: custom background/font colors, optional subtext (view/edit/both modes), collapsible sections (default collapsed option), can be hidden (hides entire section when all properties below are also hidden).

Best practice: Always use section headers for organized property sheets.

---

## Application-Level Properties

Properties on the **Application** object type. Not tied to individual records — hold global values.

Use cases:
- **Global Expression Variables**: check "Global Expression Variable" on the property → appears on the Globals tab in any Expression dialog. Examples: fiscal period end date, risk threshold percentage.
- **System aggregates**: count active clients, total high-severity issues
- **Historical tracking**: capture snapshots of system-wide metrics over time

Path: create/edit via Settings → General → Properties → Application object. Values displayed on Settings → General → Application Settings → Application Details tab.

---

## Property History Tracking

Automatic weekly and/or monthly snapshots of property values for trend reporting.

### Enable
1. Settings → General → Application Settings → General Settings → **Enable Property History Tracking** (Disabled / Monthly Only / Weekly Only / Both)
2. On individual properties: check **Capture History Monthly** and/or **Capture History Weekly** on the Details tab

Nightly processing takes snapshots on the configured day (weekly) or end of month.

Not available for: Memo, Rich Text, Section Header, some internal locked properties.

View historical data only via Custom Reports using the **Historical Data Report** setting.

---

## Item Last Modified

Hidden-by-default standard property `[Item Last Modified]` on every object. Read-only datetime, updated automatically on save.

### What updates it
- Editing and saving property values on the Details tab
- Auto-Update Rules that change a property value

### What does NOT update it
- Calculated property changes
- Aggregate property changes
- Related item changes (new issues, attachments, etc.)
- These exclusions are intentional — `[Item Last Modified]` tracks "active" changes only

### Workflow use
Can be used in notification rules, auto-update rules, calculations, and reports. Careful with trigger expressions — consider defaults and auto-update timing. Examples:

| Expression | When it works | Gotcha |
|-----------|---------------|--------|
| `!ISNULL([Item Last Modified])` | New item saved first time | Fails if property defaults trigger a save before user edit |
| `LEFT([Name], 4) <> "-New"` | User changes default name | Fails if auto-update or default changes the name |
| `[Owner] <> ""` | Owner is set and required | Only fires once if using On Change to True |
