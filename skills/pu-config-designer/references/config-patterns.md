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
