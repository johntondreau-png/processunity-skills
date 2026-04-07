# Common ProcessUnity Configuration Patterns

These are proven patterns for configuring ProcessUnity based on typical customer requirements.

## Pattern: TPRM / Vendor Risk Management

**Objects used:** Vendors, Vendor Requests, Issues, Assessments, Questionnaires, Custom objects (for Fourth Party, Concentration Risk, etc.)

**Typical Vendor properties:**
- Section: Vendor Profile — Name, DBA, Industry, Region, Country, Vendor Type, Tier/Criticality
- Section: Risk Classification — Inherent Risk, Residual Risk, Risk Index Score (calculated), Risk Rating (calculated)
- Section: Relationship — Vendor Owner, Business Unit, LOB, Contract Start/End, Services Provided
- Section: Compliance — Regulatory Requirements, Certifications, Last Assessment Date, Next Assessment Due
- Section: Contacts — Primary Contact, Risk Contact (often via child Contact object)

**Reports:**
- Vendor Inventory — all vendors with key attributes, grouped by Tier or Region
- Risk Summary — grouped by Risk Rating with color-coded totals
- Assessment Status — vendors with assessment dates, overdue flagging
- Issue Tracker — open issues by vendor with severity and due dates

**Dashboard:** Executive Risk Dashboard with charts from the above reports

## Pattern: Issue/Finding Management

**Objects used:** Issues (often renamed to "Findings" or "Action Items")

**Typical properties:**
- Section: Issue Details — Title, Description, Category, Source, Severity, Priority
- Section: Assignment — Assigned To, Due Date, Escalation Date (calculated), Days Open (calculated)
- Section: Resolution — Resolution Status, Resolution Notes, Closed Date, Root Cause
- Section: Related — Related Vendor (via Related Items), Related Assessment

**Reports:**
- Open Issues — filtered to exclude Closed, grouped by Severity
- Aging Report — calculated Days Open with color coding (green <30, yellow 30-60, red >60)
- Issues by Owner — grouped by Assigned To with counts

## Pattern: Assessment/Questionnaire Program

**Objects used:** Assessment Types, Questionnaires, Assessments (with scope tied to Auditable Entities)

**Design considerations:**
- Define Assessment Types first — they control which objects can be scoped
- Build Questionnaire templates as hierarchies: Questionnaire → Sections → Questions
- Use Assessment Periods for time-based reporting
- Link findings back to Issues object for remediation tracking

## Pattern: Regulatory Compliance

**Objects used:** Regulations & Standards, Controls, Risks

**Structure:**
- Regulations as the top-level tree (Framework → Requirements → Sub-requirements)
- Controls mapped to Regulation requirements via Related Items
- Risks linked to Controls for residual risk calculation
- Auditable Entity trait on Regulations allows them to be scoped into Assessments

## Property Design Pattern: Risk Scoring

A common pattern for risk calculation on any object:

1. **Likelihood** — Pick List (1-5 or Low/Medium/High)
2. **Impact** — Pick List (1-5 or Low/Medium/High)
3. **Inherent Risk Score** — Calculated: numeric mapping of Likelihood × Impact
4. **Inherent Risk Rating** — Calculated: maps score to text (e.g., IF([Inherent Risk Score] > 15, "Critical", IF(...)))
5. **Control Effectiveness** — Pick List or Aggregate from related Controls
6. **Residual Risk Score** — Calculated: adjusted by Control Effectiveness
7. **Residual Risk Rating** — Calculated: maps residual score to text
8. Color code all rating fields (red = Critical/High, yellow = Medium, green = Low)

## Property Design Pattern: Status Tracking with Visual Indicators

1. **Status** — Pick List with state values (Not Started, In Progress, Complete, Overdue)
2. **Status Image** — Image Calculated: maps status to traffic light images from PU Image Library
3. **Days Until Due** — Calculated: date math between today and due date
4. **Overdue Flag** — Calculated: Yes/No based on Days Until Due < 0
5. Auto Update Rule on Status: set to "Overdue" if current date > due date (Nightly if True)
6. Conditional color coding on Status: red background for Overdue, green for Complete

## Reference Data Design Pattern: Shared Taxonomies

When multiple objects need the same classification:

1. Create Reference Data entries (e.g., "Risk Categories": Operational, Financial, Compliance, Strategic, Reputational)
2. Use Reference Data properties on each object that needs this classification
3. This ensures consistency across Vendors, Risks, Issues, etc.
4. Changes to the Reference Data list propagate to all objects that use it

## Report Design Pattern: Executive Summary Dashboard

1. **Vendor Risk Summary Report** — Vendors grouped by Risk Rating, totals = Count. Chart: Pie/Donut.
2. **Issue Aging Report** — Issues grouped by Severity, total = Count. Chart: Stacked Bar.
3. **Assessment Completion Report** — Assessment Types grouped by Status, total = Count. Chart: Gauge showing % complete.
4. **Trend Report** — Historical Data Report showing risk scores over time. Chart: Line.
5. Create a Custom Dashboard, add all four charts, resize and arrange.
6. Publish to executive roles.

## Pattern: Conditional Display / Conditional Edit

Properties can be shown/hidden or made editable/read-only based on the value of another property. This reduces visual clutter and progressively discloses fields only when relevant.

**Configuration:** Set on the property's **View Access** tab (ConditionalDisplayProperty / ConditionalDisplayValue) and **Edit Access** tab (ConditionalEditProperty / ConditionalEditValue).

### Sub-pattern: State-Gating
Show fields only after a workflow milestone is reached.
- Show scoring fields when `[Questionnaire Submitted?] = "Yes"`
- Show cancellation details when `[Status] = "X. Cancelled"`
- Show deactivation fields when `[Service Status] = "B - Inactive"`

### Sub-pattern: Scope-Type Filtering
Show fields relevant only to the current object mode.
- Show questionnaire fields when `[Scope Type] = "Questionnaire"`
- Show regulatory fields when `[DORA?] = "Yes"`
- Show branch fields when `[Branch?] = "Yes"`

### Sub-pattern: Multi-Value Matching
Use pipe `|` for OR conditions in a single conditional display value.
- Show field when `[Status] = "2. Under Review|C. Complete|X. Cancelled"`
- Edit field when `[State] = "In Process|Planned"`

### Sub-pattern: Polymorphic Objects
Reference Data uses conditional display to behave like multiple object types.
- Show country fields when `[Type] = "Country"`
- Show workflow fields when `[Type] = "Assessment Workflow Type"`

### Sub-pattern: Role-Based Progressive Disclosure
Show different property groups based on record classification.
- Show vendor contact fields when `[Vendor Contact] = "Yes"`
- Show technical fields when `[Technical Service?] = "Yes"`

### Sub-pattern: Section Header Gating
Use conditional display on Section Header properties to show/hide entire groups of fields at once. All properties below a Section Header visually belong to it — if the header is hidden, the section effectively disappears.
- Section Header `DORA (RT.05.01)` conditional on `[DORA?] = "Yes"` → entire DORA section appears only when needed

## Pattern: Auto Update Rules

Auto Update Rules set property values automatically. Two event types:

### ValueChange Events
Fire when any watched field changes. The **AutoUpdateExpression** lists watched fields (pipe-delimited). The **AutoUpdateValue** computes the new value.

**Composite Name Generation:**
- Watch: `[Request ID]+"|"+[Requester]+"|"+[Vendor Name]+"|"+[Request Date]`
- Value: `[Vendor Name] + " - " + [Assessment Type] + " - " + TOSTRING([Start Date], "MMM yyyy")`

**Cascading Field from Aggregate:**
- Watch: `[Primary Contact Agg]` (aggregate from child records)
- Value: `[Primary Contact Agg]` (copies aggregate value into editable field)

**Date Math on Trigger:**
- Watch: `[Last Completed Assessment Date]`
- Value: `DAYSADD([Last Completed Assessment Date], [Assessment Frequency (Days)])`

### Conditional Events
Fire when a condition evaluates to true. **AutoUpdateExpression** is the boolean condition. **AutoUpdateValue** is set once when condition first becomes true.

**Timestamp Capture:**
- Condition: `[Assessment Sent Date] != ""`
- Value: `TIMESTAMP()`

**User Capture ([Me]):**
- Condition: `[Assessment Submitted Date] != "" AND [Submit By] = ""`
- Value: `[Me]`
- The `AND [field] = ""` prevents overwriting (one-time capture).

**Snapshot at Completion:**
- Condition: `[Completion Date] != ""`
- Value: `[# Issues (Active/Open)]`

**Boolean Flag Toggle:**
- Condition: `[DORA Identification Code] != ""`
- Value: `"Yes"`

**State Machine:**
- Condition: Watches multiple date fields via ValueChange
- Value: Multi-branch CASE expression deriving status from which dates are populated
- Example: Status progresses Prepare → With Respondent → Analyst Review → Completed based on sent/submitted/completion dates

## Pattern: Color Coding for Visual Indicators

Dynamic color expressions make risk levels, statuses, and scores instantly recognizable.

### Standard Risk Color Palette

| Hex | Meaning |
|-----|---------|
| `#AE312E` | Critical / Very Weak / Red |
| `#d05656` | Very Weak (lighter red) |
| `#F88438` | High / Orange |
| `#F7CF47` | Medium / Yellow |
| `#f3e896` | Fair (light yellow) |
| `#85d581` | Strong (light green) |
| `#B5D551` | Good / Active |
| `#388E46` | Very Strong / Dark green |
| `#F3F3F3` | Cancelled / Grey |

### Color Expression Patterns

**5-Tier Text Rating:**
```
CASEX([Value], "Very Weak","#d05656", "Weak","#fabd78", "Fair","#f3e896", "Strong","#85d581", "Very Strong","#64B150","")
```

**4-Tier Numeric Score:**
```
CASE([Value]>=90,"#008000", [Value]>=70,"#F5E33A", [Value]>=50,"#F88438", "#AE312E")
```

**Populated/Empty Indicator:**
```
IF(!ISNULL([Value]), "#B5D551", "")
```

## Pattern: External ID Shadow for Reference Data

When a Reference Data relationship stores a display name but you need the underlying code (e.g., EBA taxonomy code) in reports:

1. Create a **hidden Text - Aggregate** (Lookup, Type 5) companion property
2. Set AggregateProperty to `External Id` on the Reference Data object
3. Set AggregateItemType to the same relationship as the Reference Data pick list
4. The aggregate reads the External ID (code) from the selected Reference Data record
5. Reports can now output the code directly without expression parsing

**Example:** Property `(DORA_05.01.0070) - Type of person` is a Reference Data pick list showing "Legal person". Its companion `(DORA_05.01.0070) - Type of person - External ID` is a hidden aggregate that stores `eba_CT:x200` — the EBA taxonomy code needed for regulatory export reports.

## Pattern: Blank Date Sentinel

When date fields may be empty but need to sort/filter correctly:

1. Create a **hidden Text - Calculated** property
2. Expression: `IF([Source Date]="","9999-12-31",[Source Date])`
3. Use the sentinel property for sorting (empty dates sort to end instead of beginning)
4. Use in report filters to distinguish "never happened" from "happened in the past"

## Pattern: Regulatory Compliance Flag + Section Gating

For regulatory overlays (DORA, SOX, GDPR) that add fields to existing objects:

1. Add a **flag property** (Pick List Yes/No) to each affected object — e.g., `[DORA?]`
2. Add **Section Header** properties named after regulatory sections — e.g., `DORA (RT.05.01)`
3. Set conditional display on all Section Headers: show when `[DORA?] = "Yes"`
4. Add regulatory-specific properties below each Section Header
5. Properties inherit the visual grouping of their Section Header
6. Result: Non-regulated records show clean, standard forms; regulated records show additional compliance sections

This pattern keeps the base object clean while allowing regulatory modules to be toggled on/off per record.
