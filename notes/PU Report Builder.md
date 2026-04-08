---
tags:
  - processunity
  - reports
  - dashboards
  - charts
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
  - "[[PU Agentic Pipeline]]"
---

# PU Report Builder

> Design and build Custom Reports, Charts, and Dashboards — from simple data views to sophisticated multi-level reports with visually compelling charts that tell a risk story.

## Before Starting

Required context:
1. **Instance URL** — which PU instance
2. **Environment** — Prod / Sandbox / Training
3. **Report Purpose** — what question does this report answer?
4. **Audience** — executive, analyst, AI agent, or automated export?

## PU Reporting Architecture

PU's Custom Report facility is a **home-grown analytics engine** for the semantic data model:
- Custom Reports are the **ONLY way to query data** in a flat/relational format
- Reports serve visual analytics, integration, workflow, and web services
- Charts require **at least one Group** and **at least one Column Total** (the "series")
- Charts can be added to **Dashboards** (max 16 charts per dashboard)
- Same chart can appear multiple times on a dashboard with different Run Time Filters

## Multi-Level Reports and Relationship Joins

**The critical rule**: Multi-level reports can ONLY join objects with an **existing named relationship** in the data model. No relationship = zero rows returned.

When adding Level 2, you pick a **named relationship** — not just an object type. The same pair can have multiple distinct relationships returning different data (e.g., Agreement → Legal Entity via "Making Use of" vs "LEI of provider").

| Level 1 | Level 2 | Relationship | Use Case |
|---------|---------|-------------|----------|
| Vendor | Vendor Service | Child | Service portfolio |
| Vendor | Fourth Party | Vendor Fourth Party | Subcontractor chain |
| Vendor | Assessment | Assessment Scope | Assessment history |
| Agreement | Legal Entity | Making Use of Agreement | Entities on contract |
| Agreement | Vendor Service | DORA Linked Service(s) | Services under agreement |

**Report pipeline pattern**: IMPORT → Operational → EXCEL export → DASH → BTN reports.

## Chart Types

### Standard Charts (Group + Total)

| Type | Best For |
|------|----------|
| Pie / Doughnut | Part-of-whole distribution |
| Column / Bar | Comparing values across categories |
| Line / Spline | Trends over time |
| Area / SplineArea | Trends with volume emphasis |

### Stacked Charts (Group + multiple Totals)

Stacked Column, Stacked Bar, Stacked Area — for composition breakdowns.

### Special Charts

| Type | Requires | Best For |
|------|----------|----------|
| Gauge | Single grand total | KPI with target range |
| Number Box | Single grand total | Single KPI highlight |
| Table - List | Columns | Tabular dashboard tile |
| Table - Summary | Group + Total | Collapsed summary tile |
| Geographical Map | Location + Group + Total | Risk by geography |
| Matrix | Two groups + Total | Risk heatmaps |

### Chart Color Control — The `[Group Color]` Secret

PU chart colors can be controlled semantically using the `[Group Color]` palette option:
1. In **Settings > Properties**, configure Background Color for each value (Critical=Red, High=Orange, etc.)
2. In chart config, set **Palette** to `[Group Color]` (value `[Group]`)
3. Chart slices/bars automatically inherit the property-defined colors

## Report Design Patterns

### Risk Distribution Overview (Doughnut)
Level 1: Third Party. Group by Risk Index Rating. Count on Name. Doughnut chart with Gradient style.

### Threat Alert Monitor (Bar)
Level 1: Third Party. Filter RF Overall Rating IN (High, Very High). Group by RF Rating. Bar chart.

### Issue Pipeline (Stacked Column)
Level 1: Issue. Group by Risk Severity. Filter Status != Closed. Column chart with severity colors.

### Assessment Coverage (Gauge)
Level 1: Third Party. Filter Status = Active. Count on Name. Gauge chart.

### Top Risk Vendors (Table - List)
Level 1: Third Party. Sort by Risk Index Score ascending (worst first). Row limit Top 10/15/20.

### Agent-Ready Data Feed
For AI consumption. Include system Names and IDs. Design-time filters only. Enable Automated Export. Prefix with `skillz_` or `ai_`.

## Column Styling for Visual Impact

Color properties use **fx expressions** for dynamic coloring:

```
// Risk rating colors
CASEX([ProcessUnity Risk Index Rating],
  "Very Strong", "#22c55e",
  "Strong", "#86efac",
  "Fair", "#fbbf24",
  "Weak", "#f97316",
  "Very Weak", "#ef4444",
  "#e5e7eb")
```

Format options: Bold, Alignment, Borders, Font Size, Column Group Labels (merged headers), Hide Column, Suppress Repeating Values.

## Dashboard Design

### Command Center Example

| Position | Chart Type | Story |
|----------|-----------|-------|
| Top-left | Doughnut | Risk tier breakdown |
| Top-right | Bar | Active threat alerts |
| Mid-left | Stacked Column | Issue severity mix |
| Mid-right | Gauge / Number Box | Coverage metric |
| Bottom-left | Table - List | Highest-risk vendors |
| Bottom-right | Number Box | Data coverage KPIs |

### Dashboard Creation Steps

1. Build each report with chart configured
2. Reports → Administration → Custom Dashboards → +New
3. Enter Name, Description, Tooltip
4. Dashboard Details → Add Chart for each report
5. Resize and arrange tiles → Save
6. Publish via Access tab to roles/teams

**Tips**: Same chart can appear multiple times with different filters. Max 16 charts per dashboard. Number Boxes can publish to the PU Inbox Dashboard Panel.

## Report Naming Convention

| Prefix | Purpose | Example |
|--------|---------|---------|
| `VS -` | VendorShield-designed | VS - Portfolio Risk Distribution |
| `skillz_` | Agent/AI data feed | skillz_irq.auto.classify |
| `ai_` | AI input/output | ai_portfolio_risk_feed |

## Browser Automation: Chart Tab Workflow

Chart configuration is a **multi-save process** — the UI progressively reveals options:
- **Stage 1**: Set Display Type → save (done)
- **Stage 2**: Set Column Series → save (creates Type)
- **Stage 3**: Set chart Type + Properties → save (full chart configured)

## Post-Build Checklist

- [ ] Report runs without errors
- [ ] All expected columns appear with correct labels
- [ ] Color coding makes risk levels instantly recognizable
- [ ] Groups display properly with correct totals
- [ ] Chart renders with meaningful data
- [ ] Chart tells the intended risk story at a glance
- [ ] Dashboard tile looks good at dashboard scale
- [ ] Published to correct audience
- [ ] Instructions field explains the report's purpose

---

*See also: [[PU Data Model]] for available objects, [[PU Agentic Pipeline]] for AI-ready report design, [[PU Ref - Reports and Dashboards]] for full reference.*
