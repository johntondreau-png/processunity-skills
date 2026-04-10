# Report Builder Reference

Design and build Custom Reports, Charts, and Dashboards in ProcessUnity — from simple data views
to sophisticated multi-level reports with visually compelling charts that tell a risk story.

## Before Starting

### Required Context
1. **Instance URL** — which PU instance
2. **Environment** — Prod / Sandbox / Training
3. **Report Purpose** — what question does this report answer?
4. **Audience** — who will consume it? (executive, analyst, AI agent, automated export)

## Understanding the PU Reporting Architecture

PU's Custom Report facility is a **home-grown analytics engine** for the semantic data model. Key facts:
- PU data is stored in a **semantic AI data model** — Custom Reports are the ONLY way to query data in a flat/relational format
- Reports are used for visual analytics, integration, workflow, and web services
- Charts require **at least one Group** and **at least one Column Total** (the "series")
- Charts can be added to **Dashboards** (max 16 charts per dashboard)
- The same chart can appear multiple times on a dashboard with different Run Time Filters

## Multi-Level Reports and Relationship Joins

### The Critical Rule

**Multi-level reports can ONLY join two objects that have an existing, named relationship configured between them in the data model.** If no relationship exists, the report will return zero rows — no error, just empty results.

This is the single most important concept in PU reporting. Before designing any multi-level report, verify the relationship exists in **Settings > Subject Areas > [Object] > Related Items/Roles**.

### How Relationship Joins Work

When you add a Level 2 to a report, you don't just pick an object type — you pick a **named relationship**. The same pair of objects can have **multiple distinct relationships**, each returning different data. For example:

- Agreement → Legal Entity via **"Legal Entities Making Use of This Agreement"** — returns entities that USE the agreement
- Agreement → Legal Entity via **"(DORA_03.03.0020) - LEI of the entity providing ICT services"** — returns entities that PROVIDE services under the agreement

Choosing the wrong relationship returns the wrong data (or nothing).

### Multi-Level Report Configuration Fields

| Field | Meaning |
|-------|---------|
| **Level 1 Object** | The primary/parent object — report rows start here |
| **Level 2 Object** | The related/child object — adds detail rows per Level 1 record |
| **Level 2 Relationship** | The named relationship path from Level 1 to Level 2. This is NOT optional — it determines which records join. |
| **Level 3/4 Object** | Additional hops through further relationships (up to 4 levels) |

### Common Relationship Patterns

| Level 1 | Level 2 | Relationship Name | Use Case |
|---------|---------|-------------------|----------|
| Vendor | Vendor Service | Child / Vendor Services | Service portfolio per vendor |
| Vendor | Assessment | Assessment Scope | Assessment history per vendor |
| Vendor | Fourth Party | Vendor Fourth Party | Subcontractor mapping |
| Vendor | Legal Entity | Legal Entities (Legal Entity) | Entity hierarchy per vendor |
| Vendor | Issue | Issues (Issue) | Issues per vendor |
| Agreement | Legal Entity | Legal Entities Making Use of This Agreement | Entities on contract |
| Agreement | Vendor Service | DORA Linked Service(s) | Services under agreement |
| Assessment | Vendor | Vendors (Assessment Scope) | Vendor being assessed |
| Questionnaire Question | Questionnaire Response | Questionnaire Responses | Response data per question |
| Vendor Service | Service Add On | Service Add Ons (Related) | Service detail breakdown |
| Vendor Service | Fourth Party | Vendor Fourth Party | Fourth parties per service |
| Legal Entity Contract | Agreement | Contractual arrangement reference | Contracts per entity |

### Deep Multi-Level Reports (3-4 Levels)

Each level adds another hop through a relationship chain. Example:
- **Level 1**: Agreement → **Level 2**: Vendor Service (via "DORA Linked Service(s)") → **Level 3**: Service Add On → **Level 4**: Fourth Party

Plan each hop carefully — verify the relationship exists at each level before building.

### Report Categories and Naming Conventions

Reports in a production instance fall into functional categories. Common patterns observed:

| Pattern | Purpose | Example |
|---------|---------|---------|
| **IMPORT** prefix | Data ingestion reports — ordered sequence for loading data | DORA IMPORT 1: LEGAL ENTITY |
| **EXCEL_** prefix | Export templates — maps to external report formats | EXCEL_DORA_RT.01.01 |
| **DASH:** prefix | Dashboard source reports — optimized for chart rendering | DASH: DORA Vendors |
| **BTN:** prefix | Button-driven operational reports — triggered from record actions | BTN: AGREEMENT: SERVICE: Relate |
| **📃** prefix | User-facing operational reports | 📃 D. DORA Fourth Parties |
| Alphabetic prefix (A., B., C.) | Ordered report sets within a category | DORA - A. Legal Entity Master |

Report categories act as folders — organize reports logically so administrators can find them.

### Report Pipeline Pattern

For regulatory reporting or data migration, build reports as an **ordered pipeline**:

1. **IMPORT reports** (numbered sequence) — reports whose output maps to import templates, used for initial data loading
2. **Operational reports** (lettered/named) — day-to-day data views for administrators and users
3. **EXCEL export reports** — formatted to match external regulatory templates (column names match regulator requirements)
4. **DASH reports** — chart-optimized reports feeding dashboard tiles
5. **BTN reports** — operational reports triggered from record action buttons

This pipeline pattern ensures data flows in → gets worked → flows out in the required format.

## Chart Types Reference

### Standard Charts (require Group + Total)
| Type | Best For | PU Value |
|------|----------|----------|
| **Pie** | Part-of-whole distribution (few categories) | `Pie` |
| **Doughnut** | Same as Pie but with center hole — cleaner look | `Doughnut` |
| **Column** | Comparing values across categories | `Column` |
| **Bar** | Horizontal comparison — good for long category labels | `Bar` |
| **Line** | Trends over time or ordered sequence | `Line` |
| **Area** | Trends with volume emphasis | `Area` |
| **Spline** | Smooth trend lines | `Spline` |
| **SplineArea** | Smooth filled area | `SplineArea` |
| **Point** | Scatter-style data points | `Point` |

### Stacked Charts (require Group + multiple Totals/Series)
| Type | Best For | PU Value |
|------|----------|----------|
| **Stacked Column** | Category composition breakdown | `StackedColumn` |
| **Stacked Bar** | Horizontal composition breakdown | `StackedBar` |
| **Stacked Area** | Composition trends over time | `StackedArea` |

### Special Chart Types
| Type | Requires | Best For | PU Display Type |
|------|----------|----------|-----------------|
| **Gauge** | Single grand total, optional group | KPI with target range (e.g., avg risk score) | `Chart - Gauge` |
| **Number Box** | Single grand total | Single KPI highlight (e.g., total vendors) | `Chart - Number Box` |
| **Table - List** | Columns, optional groups | Tabular data view in dashboard tile | `Table - List` |
| **Table - Summary** | Group + Total | Collapsed summary in dashboard tile | `Table - Summary` |
| **Geographical Map** | Location column + Group + Total | Mapping vendor/facility locations | `Chart - Geographical Map` |
| **Matrix** | Two groups (X + Y axis) + Total | Risk heatmaps, cross-tabulation | `Chart - Matrix` |

### Chart Properties
| Property | Options | Notes |
|----------|---------|-------|
| **3D Display** | Yes / No | Adds depth effect. No is cleaner for modern dashboards |
| **Drawing Style** | Default / Gradient | Gradient adds visual richness to chart fills |
| **Show Legend** | Yes / No | Legend identifies chart series/slices |
| **Show Point Labels** | Yes / No | Labels on data points/slices with values |
| **Palette Starting Color** | Color name | Starting color for auto-generated palette |
| **Initial Display** | Show Report / Show Chart | Whether report or chart view appears first |

### Chart Color Control — The [Group Color] Secret

**CRITICAL DISCOVERY**: PU chart colors can be controlled semantically using the `[Group Color]` palette option.

**Palette Options** (`ddlPalette` select):
- `Green`, `Royal Blue`, `Orange`, `Gray`, `Purple`, `Gold`, `Light Blue`, `Dark Blue` — preset auto-generated palettes (bars/slices get assigned colors in group order, NOT by semantic meaning)
- **`[Group]` aka [Group Color]** — chart inherits colors from the **property-level value color definitions** configured in Settings > Properties

**How to make chart colors match the risk story:**
1. Go to **Settings > Properties** and find the property being grouped (e.g., Risk Severity, Risk Index Rating)
2. Each property value (Critical, High, Medium, Low) should have a **Background Color** set at the property level
3. In the chart config, set **Palette** to `[Group Color]` (value `[Group]`)
4. The chart slices/bars will now use those property-defined colors

**Result**: Critical = Red, High = Orange, Medium = Yellow, Low = Green — automatically, without any fx expressions on the report column.

**If property values don't have colors configured**: Set the palette to a preset (e.g., Orange for risk-heavy reports) as a fallback, OR go configure the property value colors first in Settings.

**Palette select name**: `paneDetail$customReportSetupView$ddlPalette`
**[Group Color] value**: `[Group]`

### Choosing the Right Chart for the Risk Story

| Risk Story | Recommended Chart | Why |
|------------|------------------|-----|
| **Portfolio risk distribution** | Doughnut or Pie | Shows proportion of vendors in each risk tier |
| **Risk trends over time** | Line or Spline | Shows direction of risk posture |
| **Vendor comparison** | Bar (horizontal) | Easy to compare across many vendors |
| **Issue severity breakdown** | Stacked Column | Shows composition within categories |
| **Single KPI** | Number Box | Clean, bold, dashboard-friendly |
| **Target vs actual** | Gauge | Shows where a metric falls on a scale |
| **Risk heatmap** | Matrix | Visualizes two-dimensional risk classification |
| **Geographic risk** | Map | Shows where risk is concentrated |
| **Top/bottom N** | Table - List | Clean tabular view for ranked lists |
| **Assessment coverage** | Gauge or Number Box | Percentage or count metric |

## Column Styling for Visual Impact

### Color Coding with Expressions
All color properties (Font Color, Background Color, Cell Background Color, Header Background Color) use **fx expressions**, enabling dynamic coloring based on cell values.

**Common risk color patterns:**
```
// Background Color by risk rating
CASEX([ProcessUnity Risk Index Rating],
  "Very Strong", "#22c55e",
  "Strong", "#86efac",
  "Fair", "#fbbf24",
  "Weak", "#f97316",
  "Very Weak", "#ef4444",
  "#e5e7eb")

// Background Color by severity
CASEX([Risk Severity],
  "Critical", "#dc2626",
  "High", "#f97316",
  "Medium", "#eab308",
  "Low", "#22c55e",
  "Nominal", "#94a3b8",
  "#e5e7eb")
```

### Display Format Options
- **Numbers**: `#,##0` (integer), `#,##0.00` (2 decimal), `$#,##0.00` (currency)
- **Dates**: `dd-MMM-yyyy`, `MM/dd/yyyy`, `MMM yyyy`
- **Text**: Hyperlink format, email address format
- **Totals**: Can have separate display format (e.g., `Average: #,##0.0`)

### Column Group Labels
Adjacent columns can share a top-level **Column Group Label** to create visual groupings. Example: columns "Risk Score", "Risk Rating", and "Risk Trend" can all share the group label "ProcessUnity Risk Index" — they'll appear under a merged header.

### Format Options
- **Bold**: Emphasize key columns
- **Alignment**: Left (text), Center (ratings), Right (numbers)
- **Borders**: Left/Right single or double lines between column groups
- **Font Size**: X-Small to X-Large (5 options)
- **Rotate Label**: 90-degree rotation for narrow columns
- **Hide Column**: Keep column for calculations/filters but hide from output
- **Suppress Repeating Values**: Clean multi-level reports by hiding duplicate parent values

## Report Design Patterns

### Pattern 1: Risk Distribution Overview (Doughnut)
**Story**: How is risk distributed across the portfolio?
```
Level 1: Third Party
Columns: Name, Risk Index Score, Risk Index Rating, Inherent Risk, Criticality Rating
Groups: Risk Index Rating
Totals: Count on Name, Average on Risk Index Score
Chart: Doughnut on Name (Count), Gradient style
Colors: Risk-tier background coloring on Risk Index Rating
```

### Pattern 2: Threat Alert Monitor (Bar)
**Story**: Which vendors have elevated threat intelligence?
```
Level 1: Third Party
Columns: Name, Recorded Future Overall Rating, RF Company Criticality, RF Triggered Rules, Risk Index Score
Filter: Recorded Future Overall Rating IN (High, Very High)
Groups: Recorded Future Overall Rating
Totals: Count on Name
Chart: Bar on Name (Count), ordered by severity
```

### Pattern 3: Issue Pipeline (Stacked Column)
**Story**: What's the issue volume and severity mix?
```
Level 1: Issue
Columns: Issue Title, Issue Status, Risk Severity, Issue Stage, Owner, Related Third Party
Groups: Risk Severity
Totals: Count on Issue Title
Chart: Column on Issue Title (Count)
Filter: Issue Status != Closed
Colors: Severity-based background on Risk Severity column
```

### Pattern 4: Assessment Coverage (Gauge)
**Story**: What percentage of vendors have current assessments?
```
Level 1: Third Party
Columns: Name, Last Assessment Date, Assessment Status, Days Since Last Assessment
Totals: Count on Name
Chart: Gauge (Number Box alternative) on Name (Count)
Filter: Status = Active
```

### Pattern 5: Top Risk Vendors (Table - List)
**Story**: Which vendors pose the greatest risk?
```
Level 1: Third Party
Columns: Name, Risk Index Score, Risk Index Rating, Inherent Risk, Criticality Rating, # Active Issues
Sort: Risk Index Score (Ascending — lowest/worst first)
Totals: None needed for Table-List
Chart: Table - List
Options: Row Limit (Top 10/15/20)
Colors: Conditional background on all risk columns
```

### Pattern 6: Integration Health (Number Box)
**Story**: How many vendors have intelligence data coverage?
```
Level 1: Third Party
Columns: Name, RiskRecon Overall Score (or Rating)
Filter: RiskRecon Overall Score > 0 (or IS NOT BLANK)
Totals: Count on Name
Chart: Number Box on Name (Count)
```

### Pattern 7: Risk Heatmap (Matrix)
**Story**: How does inherent risk intersect with residual risk?
```
Level 1: Third Party
Columns: Name, Inherent Risk, Residual Risk
Groups: Inherent Risk (X-axis), Residual Risk (Y-axis — via second group)
Totals: Count on Name
Chart: Matrix
```

### Pattern 8: Agent-Ready Data Feed
**Story**: Structured data for AI consumption
```
Level 1: Third Party (or any object)
Columns: Include system Names, IDs, all fields AI needs
Filters: Design-time only (AI can't interact with run-time)
Options: Enable for Automated Export
Naming: Prefix with "skillz_" or "ai_"
Instructions: Describe the AI use case
```

## Dashboard Design

### VS - Command Center Dashboard (Example)
A compelling TPRM dashboard tells a risk story in 4-6 tiles:

| Position | Report | Chart Type | Story |
|----------|--------|-----------|-------|
| Top-left | VS - Portfolio Risk Distribution | Doughnut | Risk tier breakdown |
| Top-right | VS - Threat Alert Monitor | Bar | Active threat alerts |
| Mid-left | VS - Issue Pipeline | Stacked Column | Issue severity mix |
| Mid-right | VS - Assessment Coverage | Gauge / Number Box | Coverage metric |
| Bottom-left | VS - Top Risk Vendors | Table - List | Highest-risk vendors |
| Bottom-right | VS - Integration Health | Number Box | Data coverage KPIs |

### Dashboard Creation Steps
1. Build each report with chart configured (Chart tab → Display Type, Series, Type, Properties)
2. Navigate: Reports → Administration → Custom Dashboards → +New
3. Enter Name, Description, Tooltip
4. Click **Dashboard Details** to enter edit mode
5. Click **Add Chart** for each report:
   - Source = Level 1 object type of the report
   - Chart = select the report with a configured chart
6. Resize and arrange tiles on the canvas
7. Apply Run Time Filters per chart tile if needed
8. **Save** layout
9. Publish via **Access** tab to roles/teams

### Dashboard Tips
- Same chart can appear **multiple times with different filters** (e.g., by region, by owner)
- Max **16 charts** per dashboard
- Dashboard consumers click a chart to **drilldown** to the underlying report
- Personal Dashboards are private; Custom Dashboards are shared
- Number Boxes can also publish to the **ProcessUnity Inbox Dashboard Panel**

## Report Naming Convention

| Prefix | Purpose | Example |
|--------|---------|---------|
| `VS -` | VendorShield-designed reports | VS - Portfolio Risk Distribution |
| `skillz_` | Agent/AI data feed reports | skillz_irq.auto.classify |
| `ai_` | AI input/output reports | ai_portfolio_risk_feed |
| (none) | Standard operational reports | Third Party Connector Information |

## Help System Article URLs

For reference, key articles in the PU in-app help system (via HELP button):

| Article | URL Name |
|---------|----------|
| Custom Reports Guide | `getting-started-with-custom-reports` |
| Charts & Dashboards Glossary | `charting-dashboards-overview` |
| Dashboards | `dashboards` |
| Custom Reports Overview | `custom-reports-overview` |
| Historical Trending | `historical-data-and-trending` |
| Report Actions | `report-actions` |

Access via: `https://processunity.my.site.com/support/apex/ExternalArticleViewer?urlName={url-name}`

## Reference Files

- **`references/available-columns-by-object.md`** — Properties available on each object type for report columns
- **`pu-admin-navigator/references/create-report.md`** — Browser automation guide for the Add Columns modal
- **`pu-admin-navigator/references/ui-navigation.md`** — UI targeting and MUI DataGrid patterns

## Browser Automation Notes for Chart Configuration

### Chart Tab Workflow
1. Save report with at least one Group and one Column Total first
2. Click **Chart** tab → **edit**
3. Set **Display Type** (e.g., `Chart - Standard`)
4. Click **done** to save → this creates the Chart Series section
5. Click **edit** again
6. Set **Column** in Chart Series dropdown (only columns with totals appear)
7. Click **done** → this creates the Type column for the series
8. Click **edit** again
9. Now all chart selects are available:
   - `ddlChartType_*`: Pie, Doughnut, Column, Bar, Line, Area, Point, Spline, SplineArea, StackedColumn, StackedBar, StackedArea
   - `ddl3D`: Yes/No
   - `ddlDrawingStyle`: Default/Gradient
   - `ddlLegend`: Yes/No
   - `ddlLabels`: Yes/No
   - `ddlPaletteStartColor` / `ddlPaletteColor`: Color selection
   - `ddlInitialDisplay`: Show Report/Show Chart
10. Set chart type and properties via JS or form_input
11. Click **done**

### Key Lesson: Chart configuration is a multi-save process
The chart UI progressively reveals options. You must save (done) after each stage:
- Stage 1: Set Display Type → save
- Stage 2: Set Column Series → save (creates Type)
- Stage 3: Set chart Type + Properties → save (full chart configured)

## Post-Build Checklist
- [ ] Report runs without errors
- [ ] All expected columns appear with correct labels
- [ ] Color coding makes risk levels instantly recognizable
- [ ] Groups display properly with correct totals
- [ ] Chart renders with meaningful data and correct type
- [ ] Chart tells the intended risk story at a glance
- [ ] Dashboard tile looks good at dashboard scale
- [ ] Published to correct audience (if sharing)
- [ ] Instructions field explains the report's purpose
