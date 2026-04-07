# ProcessUnity Property Types Reference

Properties are fields/attributes configured on objects that define the details of a record. They appear on the Details tab. Every property supports tooltips, required/read-only/hidden settings, and role-based view/edit access.

## Basic Property Types

| Type | Description | Use When |
|------|-------------|----------|
| **Text** | Freeform text input | Names, descriptions, notes, short answers |
| **Rich Text** | Formatted text with HTML support | Long descriptions, instructions, formatted content |
| **Number** | Numeric values | Scores, counts, amounts, percentages |
| **Date** | Date with optional calendar popup | Due dates, review dates, effective dates |
| **DateTime** | Read-only datetime (set via Auto Update Rules or workflow) | Timestamps, system-generated dates |
| **Pick List - Select One** | Single-select dropdown with static values | Status, category, region, priority (fixed options) |
| **Pick List - Select Many** | Multi-select with static values | Tags, applicable categories, multiple selections |
| **Yes/No** | Boolean toggle | Flags, toggles, binary decisions |
| **Image** | User-uploadable image | Headshots, company logos, screenshots |

## Advanced Property Types

| Type | Description | Use When |
|------|-------------|----------|
| **Calculated** | Read-only value from an expression referencing other properties + PU function library. Auto-recalculates when referenced values change. | Risk scores, derived ratings, concatenated labels, conditional values |
| **Aggregate** | Read-only summary from related records (parent, child, or Related Items). Methods: count, sum, average, min, max, first, last, distinct list. Supports filtering. | Total issue count on a vendor, average assessment score, count of overdue items |
| **Reference Data** | Dynamic pick list sourced from the Reference Data object. Supports type-ahead, filtering, and drilldown. Required for cascading pick lists. | Country/State/City, LOB/Department, any shared pick list used across multiple objects |
| **Image - Calculated** | Expressions that resolve to images from PU's Image Library | Visual status indicators, health icons, traffic lights |
| **Section Header** | Not a data field — acts as a heading to organize other properties. Supports color coding and sub-text. | Grouping related properties into logical sections on the Details tab |
| **External Component** | Read-only iframe showing external web content. Expression can reference record properties for dynamic URLs. (Add-on feature) | Embedded Google Maps, stock tickers, external dashboards |

## Cascading Pick Lists

Two Reference Data pick lists where the child list's options are filtered based on the parent's selected value. Both master and child must be Reference Data properties. Common patterns: Country → State → City, LOB → Department, Code → Subcode.

## Property Configuration Options

When creating/editing a property, these settings are available:

**Core Settings:**
- **Required** — Must have a value during data entry
- **Hidden** — Not visible on the Details tab
- **Read Only** — Value cannot be changed by users
- **Hide in Edit Mode** — Visible in view mode but hidden during editing
- **Track Changes** — All value changes logged in the Change Log (limited number per object)
- **Capture History Monthly/Weekly** — Snapshots value at end of each month/week for trending (must be enabled in App Settings first)

**Display Tab:**
- Descriptive label, default report column name
- Tooltip text
- Layout behavior, font/background colors
- Display format
- Bold setting

**Rules Tab:**
- **Copy/Paste behavior** — How value is handled when a record is duplicated
- **Validation Rule** — Expression that returns empty string (valid) or error message (invalid). Prevents save if validation fails.
- **Auto Update Rule** — Automatically sets value based on conditions. Events: On Value Change, On Change to True, or Nightly if True. Extremely powerful for automation.

**View Access / Edit Access Tabs:**
- Restrict visibility/editability by condition or by role/team
- Conditional show/hide based on expressions

## Property Utilities

- **Usage Button** — Shows everywhere a property is referenced (reports, expressions, workflow). A property cannot be deleted if it has usage.
- **Bulk Property Update** — Select multiple properties via checkboxes, bulk-edit common attributes at once.

## Conditional Color Coding

Any property can have dynamic font and/or background color based on its value. Colors are set via expressions that access [value] and conditionally return color codes. Useful for visual indicators (red/yellow/green for risk levels).

## Application-Level Properties / Global Variables

Properties defined on the Application object that can access data from anywhere in the instance. When flagged as Global Variables, their values become usable in expressions across all objects. Common use: aggregate counts, program-level thresholds, organization-wide settings.

## Canonical Property Type Strings (for type-ahead selection)

When creating properties in the PU admin UI, use these exact strings in the Property Type dropdown (type-ahead). Do not abbreviate or invent type names.

**Text Types:**
- `Text - Short (100 chars)`
- `Text - Long (4,000 chars)`
- `Text - Memo (32,000 chars)`
- `Text - Rich Text`
- `Text - Calculated` (or `Text - Calcs & Aggs` in some tenants)
- `Text - Aggregate`

**Number Types:**
- `Number – Integer`
- `Number – Decimal`
- `Number – Sequence`
- `Number - Calculated` (or `Number - Calcs & Aggs` in some tenants)
- `Number - Aggregate`

**Date Types:**
- `Date - Calendar`
- `Date - Calculated`
- `Date - Aggregate`
- `Date - Timestamp`

**Pick List Types:**
- `Pick List - Yes/No`
- `Pick List – Select One`
- `Pick List – Select Many`

**People / Teams:**
- `Individual – Select One`
- `Individual – Select Many`
- `Individual – Aggregate`
- `Team – Select One`
- `Team – Select Many`

**Files / Media:**
- `Attachment – Upload One`
- `Attachment – Upload Many`
- `Image`
- `Image - Calculated`

**Reference / Relationships:**
- `Reference Data – Select One`
- `Reference Data – Select Many`
- `Object - Select One`
- `Object - Select Many`
- `Vendor - Select One`
- `Vendor - Select Many`

**Widgets:**
- `External Component`

### Quick Use Case → Type Mapping

- Yes/No toggle → `Pick List - Yes/No`
- Single select dropdown → `Pick List – Select One`
- Multi select → `Pick List – Select Many`
- Free text → `Text - Short` / `Text - Long` / `Text - Memo` / `Text - Rich Text` (based on length)
- Calculated value → `Text - Calculated` / `Number - Calculated` / `Date - Calculated` (match output type)
- Aggregate from children → `Text - Aggregate` / `Number - Aggregate` / `Date - Aggregate` / `Individual – Aggregate`
- Read-only timestamp → `Date - Timestamp`
- Choose a person → `Individual – Select One` / `Select Many`
- Choose a team → `Team – Select One` / `Select Many`
- Link to other records → `Object - Select One` / `Select Many` (or `Vendor` / `Reference Data` types)

## Conditional Display / Conditional Edit

Properties can be shown/hidden or made editable/read-only based on the value of another property. This is configured via **View Access** and **Edit Access** tabs.

**ConditionalDisplayProperty / ConditionalDisplayValue** — The property appears on the form only when the condition is met.
**ConditionalEditProperty / ConditionalEditValue** — The property is editable only when the condition is met (otherwise read-only).

### Common Conditional Display Patterns

**State-gating**: Show fields only after a workflow milestone
- Show scoring fields when `[Questionnaire Submitted?] = "Yes"`
- Show cancellation details when `[Status] = "X. Cancelled"`
- Show deactivation fields when `[Service Status] = "B - Inactive"`

**Scope-type filtering**: Show fields relevant to the current mode
- Show questionnaire fields when `[Scope Type] = "Questionnaire"`
- Show DORA fields when `[DORA?] = "Yes"`

**Multi-value matching**: Use pipe `|` for OR conditions
- Show field when `[Status] = "2. Under Review|C. Complete|X. Cancelled"`
- Edit field when `[State] = "In Process|Planned"`

**Polymorphic objects**: Reference Data uses conditional display to behave like multiple object types
- Show country fields when `[Type] = "Country"`
- Show workflow fields when `[Type] = "Assessment Workflow Type"`

**Role-based progressive disclosure**: Show contact-type vs system-type fields
- Show vendor contact fields when `[Vendor Contact] = "Yes"`
- Show system access fields when `[System Access] = "Yes"`

## Auto Update Rules

Auto Update Rules set property values automatically when conditions are met. Two event types:

### ValueChange
Fires when any of the watched fields change. The **AutoUpdateExpression** lists the fields to watch (pipe-delimited). The **AutoUpdateValue** is the expression that computes the new value.

**Pattern: Composite Name Generation**
- Watch: `[Request ID]+"|"+[Requester]+"|"+[Vendor Name]+"|"+[Request Date]`
- Value: `[Vendor Name] + " - " + [Assessment Type] + " - " + TOSTRING([Start Date], "MMM yyyy")`

**Pattern: Cascading Field from Aggregate**
- Watch: `[Primary Contact Agg]` (an aggregate lookup from child records)
- Value: `[Primary Contact Agg]` (copies the aggregate value into a regular field)

**Pattern: Date Math on Trigger**
- Watch: `[Last Completed Assessment Date]`
- Value: `DAYSADD([Last Completed Assessment Date], [Assessment Frequency (Days)])`

### Conditional
Fires when a condition expression evaluates to true. The **AutoUpdateExpression** is the boolean condition. The **AutoUpdateValue** is set once when the condition first becomes true.

**Pattern: Timestamp Capture**
- Condition: `[Assessment Sent Date] != ""`
- Value: `TIMESTAMP()`
- Captures the exact moment a milestone is reached.

**Pattern: User Capture ([Me])**
- Condition: `[Assessment Submitted Date] != "" AND [Submit By] = ""`
- Value: `[Me]`
- Records who performed the action. The `AND [field] = ""` prevents overwriting (one-time capture).

**Pattern: Snapshot at Completion**
- Condition: `[Completion Date] != ""`
- Value: `[# Issues (Active/Open)]`
- Freezes a point-in-time count when an assessment completes.

**Pattern: Boolean Flag Toggle**
- Condition: `[DORA Identification Code] != ""`
- Value: `"Yes"`
- Auto-sets a flag when a related field is populated.

**Pattern: State Machine**
- Condition: Watches multiple date fields via ValueChange
- Value: Multi-branch CASE expression that derives status from which dates are populated
- Example: Status progresses from "Prepare to Send" → "With Respondent" → "Analyst Review" → "Completed" based on sent/submitted/completion dates.

## Color Coding Reference

### Standard Color Palette

| Hex | Usage | Context |
|-----|-------|---------|
| `#AE312E` | Critical / Very Weak / Red | Risk severity, failing scores |
| `#d05656` | Very Weak (lighter red) | Risk index ratings |
| `#F88438` | High / Orange | Second-tier risk |
| `#F7CF47` | Medium / Yellow | Moderate risk |
| `#f3e896` | Fair (light yellow) | Risk index ratings |
| `#F5E33A` | Yellow / Moderate | Score thresholds |
| `#85d581` | Strong (light green) | Good risk posture |
| `#B5D551` | Good / Active | Active status, populated dates |
| `#388E46` | Very Strong / Dark green | Excellent scores |
| `#64B150` | Very Strong green | Top-tier rating |
| `#008000` | Excellent | Score >= 90% |
| `#F3F3F3` | Cancelled / Grey | Inactive records |
| `#2C4D7F` | Advanced / Navy | BitSight top tier |

### Common Color Expression Patterns

**Text Rating (5-tier):**
```
CASEX([Value], "Very Weak","#d05656", "Weak","#fabd78", "Fair","#f3e896", "Strong","#85d581", "Very Strong","#64B150","")
```

**Numeric Score (5-tier):**
```
CASE([Value]>=80,"#388E46", [Value]>=70,"#85d581", [Value]>=60,"#f3e896", [Value]>=50,"#fabd78", [Value]>=0,"#d05656","")
```

**Percentage Score (4-tier):**
```
CASE([Value]>=90,"#008000", [Value]>=70,"#F5E33A", [Value]>=50,"#F88438", "#AE312E")
```

**Status Code by Prefix:**
```
CASEX(LEFT([Value],1), "1","#AE312E", "2","#F88438", "3","#F7CF47", "4","#66A515", "")
```

**Non-Zero Alert:**
```
IF([Value]="0", "", "#F7CF47")
```

**Populated/Empty Indicator:**
```
IF(!ISNULL([Value]), "#B5D551", "")
```

## Best Practices for Property Design

- Use Section Headers generously to organize the Details tab — it dramatically improves user adoption
- Prefer Reference Data properties over static pick lists when values are shared across objects or may change
- Use calculated properties for derived values rather than relying on users to compute them
- Enable Track Changes sparingly (there's a per-object limit of 50) — focus on critical fields
- Write clear Tooltips explaining what each property means and how it should be used
- Use Auto Update Rules to reduce manual data entry and ensure consistency
- Use Validation Rules to catch data quality issues at the point of entry
- Use Conditional Display to progressively disclose fields — hide complexity until it's relevant
- Use the "External ID shadow" pattern for Reference Data relationships: create a hidden Text - Aggregate companion that stores the lookup code, so reports can output the code directly
- Keep aggregate property count under 50 per object (hard limit) — plan carefully
