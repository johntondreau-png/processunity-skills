# Configuration Best Practices Reference

## Table of Contents
1. [Performance](#performance)
2. [Properties](#properties)
3. [Reporting](#reporting)
4. [Importing Data](#importing-data)
5. [Workflow & Notifications](#workflow-and-notifications)
6. [Expression Writing](#expression-writing)
7. [TPRM / Assessments](#tprm-and-assessments)
8. [General Administration](#general-administration)

---

## Performance

**The two performance killers**: data volume × implementation complexity. Plan for growth.

### Diagnosis Steps
1. **Document** the exact steps that produce the performance issue
2. **Reproduce** — try again later, on different machines, off-network
3. **Compare** — new issue or always slow? What changed? (more data, new columns, new calculations?)
4. **Review best practices** below for the specific area
5. **Contact Support** with documented steps-to-reproduce

### Key Principle
"High-volume" for best practice purposes means ≥1,000 rows. Design-time filters, disabling auto-refresh, and reducing report complexity are the top quick wins.

---

## Properties

| # | Best Practice | Impact |
|---|--------------|--------|
| PROP.01 | Use the "Configuration Change Log" report to audit config changes | Maintenance |
| PROP.02 | Enable "Track Changes" on important properties (up to 50 per object) | Audit |
| PROP.03 | Make properties with Auto-Update Rules **read-only** — prevents user edits conflicting with automation | Data quality |
| PROP.04 | Replace unnecessary calculated properties with read-only pick lists set by auto-update rules — reduces calculation overhead | Performance |
| PROP.05 | Use a property naming convention (e.g., prefix with object abbreviation) | Maintenance |
| PROP.06 | Keep property names short — use **Label** (Display tab) for longer user-facing text | Scalability |
| PROP.07 | Use Section Headers generously to organize Details tabs | User adoption |
| PROP.08 | Limit property creation — only add properties that add business value. More properties = more complexity | Performance, UX |
| PROP.09 | Avoid Rich Text properties — they degrade performance, export poorly, can't be converted back | Performance |
| PROP.10 | Avoid Memo Text unless truly needed (32K chars) — Long Text (4K) usually suffices | Performance |
| PROP.11 | Use Sequence Number properties for auto-incrementing IDs (e.g., "I-0019") | Data quality |
| PROP.12 | Use reliable naming conventions for child records in hierarchies | Maintenance |
| PROP.13 | Use Calculated Image properties to visually depict workflow stages/status | User adoption |
| PROP.14 | Employ property-level View/Edit Access for field-level security | Security |
| PROP.15 | Color-code Section Headers differently per object type | User adoption |
| PROP.16 | Prefix pick list values with numbers to control sort order (e.g., "01 - High", "02 - Medium") | UX |
| PROP.17 | Add Tooltips everywhere — especially on edit mode for data entry guidance | User adoption |
| PROP.18 | Extend solutions with Custom Subject Areas (up to 10) for unique requirements | Scalability |
| PROP.19 | Trend data with Global Aggregates on the Application object | Reporting |
| PROP.20 | Add a `[Search Keywords]` property for better global search results | UX |
| PROP.21 | Leverage `[Item Last Modified]` for workflow triggers and integration | Workflow |
| PROP.22 | Use Date-Timestamp properties (set via TIMESTAMP() in auto-update rules) for precise timing | Data quality |
| PROP.23 | Avoid over-use of aggregate properties — they recalculate on every save of related items | Performance |
| PROP.24 | Use Reference Data "Lookup" properties for enriched pick lists | Data quality |
| PROP.25 | Aggregate performance: filter aggressively, minimize cross-object aggregation depth | Performance |
| PROP.26 | Use Advanced Pick List Search for high-volume relationship properties | Performance, UX |

---

## Reporting

| # | Best Practice | Impact |
|---|--------------|--------|
| REP.01 | Fewer report levels are best — each level multiplies data volume | Performance |
| REP.02 | Use aggregate properties to simplify multi-level reports (pre-compute at property level) | Performance |
| REP.03 | Employ **design-time filters** on high-volume reports (>1000 rows) | Performance |
| REP.04 | Use Run-Time Filters with **"Set Filters before Running"** for large reports | Performance |
| REP.05 | Beware of join behavior with 3+ levels — cartesian effects multiply rows | Performance |
| REP.06 | Disable **Auto Refresh** on high-volume reports — use cached data with manual refresh | Performance |
| REP.07 | Dashboard charts from high-volume reports: use caching, pre-filtering, and aggregates | Performance |
| REP.08 | Enable "Allow Creation of New Items" on reports for direct data entry from report context | UX |
| REP.09 | Avoid "Tree Sort" in high-volume reports or report actions | Performance |
| REP.10 | Avoid `[Parent Name]` column on high-volume hierarchical reports | Performance |
| REP.11 | Use "Negative Filters" sparingly — they scan all rows to exclude | Performance |
| REP.12 | Use "Prompt for Filters before Running" for any report with run-time filters | UX |
| REP.13 | Use "Immediate Export" for quick CSV downloads without running the full report | Performance |
| REP.14 | Avoid excessively wide reports (many columns) — harder to read and slower | Performance, UX |
| REP.15 | Organize Custom Reports into categories/folders | Maintenance |
| REP.16 | Publish common reports to custom task groups for easy access | User adoption |
| REP.17 | Color-code and bold all report group rows | UX |
| REP.18 | Collapse detail rows by default for summary-focused reports | UX |
| REP.19 | Use Column Group Labels and header colors for visual organization | UX |
| REP.20 | Use indicator-based calculated columns (icons/emojis) for visual status at a glance | UX |
| REP.21 | Use Group Sort to order groups by meaning (not alphabetical) | UX |
| REP.22 | Keep report column labels short — use tooltips for descriptions | UX |
| REP.23 | Filter every report — both design-time and run-time | Performance |
| REP.24 | Add a "Search" run-time filter to nearly all custom reports | UX |
| REP.25 | Apply conditional color coding to reports | UX |
| REP.26 | Build and publish highly visual dashboards | User adoption |
| REP.27 | Add the same report multiple times to a dashboard (different filters/views) | UX |
| REP.28 | Replace subject area tasks with simple drillable custom reports for casual users | UX |
| REP.29 | For Date-Timestamp data in reports/exports: be aware of UTC conversion | Data quality |
| REP.30 | Create trend reports using Historical Data Reports + property history tracking | Reporting |
| REP.31 | Consolidate business logic to properties (not report calcs) — reusable across reports | Maintenance |

---

## Importing Data

| # | Best Practice | Impact |
|---|--------------|--------|
| IMP.01 | Export from an Import Template first to see the expected format | Data quality |
| IMP.02 | Ensure import template keys are unique (prefer External ID over Name) | Data quality |
| IMP.03 | Start small with bulk imports — test with 5-10 rows before importing thousands | Data quality |
| IMP.04 | Always check import logs to fix unsuccessful imports | Data quality |
| IMP.05 | Be careful with "Insert Only" — re-running creates duplicates. Switch to Insert+Update with key column | Data quality |
| IMP.06 | Importing Date-Timestamp: use the importing user's local date/time format | Data quality |
| IMP.07 | Use Excel Connector for data migration activities (more interactive than CSV imports) | Productivity |

---

## Workflow and Notifications

| # | Best Practice | Impact |
|---|--------------|--------|
| WF.01 | Keep button expression/view-access syntax clean and documented | Maintenance |
| WF.02 | Use naming conventions for button-related reports and import templates (prefix with object/purpose) | Maintenance |
| WF.03 | **Disable notification rules during bulk operations** — re-enable after | Performance |
| WF.04 | Use "Bulk Email" option for nightly notifications to reduce email volume | UX |
| WF.05 | Test email notifications with yourself as the sole recipient before going live | Data quality |
| WF.06 | Test nightly notification rules with **"Manual if True"** option (don't wait for nightly processing) | Productivity |
| WF.07 | Avoid notification rules on high-volume objects — or filter aggressively | Performance |
| WF.08 | Combine notification rules when possible (one rule with multiple conditions vs. many rules) | Performance |
| WF.09 | Confirm notification activity with the "Notification Log" standard report | Monitoring |
| WF.10 | Simplify data entry with Named Button Forms (button → import template → pre-populated form) | UX |
| WF.11 | Use MS Word Template for branded HTML email notifications | UX |
| WF.12 | "Ghost Properties" for button form automation — hidden properties that drive workflow without user interaction | Workflow |
| WF.13 | Start integration planning early — identify data flows, frequency, direction | Architecture |
| WF.14 | Use ProcessUnity Connector for cross-instance workflows | Integration |
| WF.16 | Reference Data "Bridge" technique — use ref data as lookup tables for complex workflow routing | Workflow |
| WF.18 | Enable automatic Inbox cleanup to manage notification volume | UX |
| WF.21 | Institute business day calculations using DAYSADDB/DAYSBETWEENB + Workdays/Holidays config | Data quality |
| WF.23 | Be aware that "On Value Change" triggers fire on ANY change to the watched expression — not just user edits | Data quality |

---

## Expression Writing

| # | Best Practice | Impact |
|---|--------------|--------|
| EXP.01 | Master expressions by starting with Excel — similar syntax | Productivity |
| EXP.02 | Study ProcessUnity's function library (all functions listed in expressions reference) | Productivity |
| EXP.03 | Use custom reports with calculated columns to test expressions against live data | Productivity |
| EXP.04 | Clean up expressions — use `//` comments, line breaks, indentation for readability | Maintenance |
| EXP.05 | Share/reuse expressions across the team — build an internal expression library | Productivity |
| EXP.06 | Create a personal expression cheat sheet for frequently used patterns | Productivity |
| EXP.07 | Break complex expressions into multiple calculated properties (chain them) | Maintenance |
| EXP.08 | Use TIMESTAMP() function in auto-update rules for Date-Timestamp properties | Data quality |
| EXP.09 | Be aware of max expression length — break up if needed | Maintenance |
| EXP.10 | Choose wisely: IF (simple), CASE (multi-condition), CASEX (single-expression multi-value) | Readability |
| EXP.11 | Enhanced validation rule error messages — be specific about what's wrong and how to fix it | UX |
| EXP.12 | Remove embedded carriage returns with REPLACE([Prop], CRLF(), " ") | Data quality |
| EXP.13 | Convert dates to calendar quarters: `"Q" + TOSTRING(CEILING(MONTH([Date]) / 3))` | Reporting |
| EXP.15 | Avoid [MyRoles] and [MyTeams] in property expressions — they evaluate per user, causing inconsistent stored values | Data quality |
| EXP.16 | Use TOSTRING with format strings to control date/number display in calculated text | Data quality |
| EXP.17 | Comparing dates to datetimes: be aware of time component — use TODATE() to strip time for date-only comparison | Data quality |
| EXP.18 | Avoid `[Square Brackets]` in expression string literals — they're interpreted as property references | Data quality |

---

## TPRM and Assessments

| # | Best Practice | Impact |
|---|--------------|--------|
| TPRM.01 | Create assessment properties for questionnaire scores (aggregate from responses) | Reporting |
| TPRM.02 | Swap Yes/No question types for Yes/No pick lists — more flexibility for scoring and follow-up | Flexibility |
| TPRM.03 | Use "Custom Scoring Expression" for advanced scoring logic beyond simple point values | Flexibility |
| TPRM.04 | Use versioning and numbering conventions for questionnaire templates | Maintenance |
| TPRM.05 | Use hidden questionnaire linked properties for dynamic scope control | Workflow |
| TPRM.06 | Questionnaire linked properties should often be "In Scope" to appear in assessment detail | Data quality |
| TPRM.07 | Test questionnaire templates thoroughly before activating (Draft → preview → activate) | Data quality |
| TPRM.08 | Thoroughly test portal tasks and permissions from a vendor's perspective | UX |
| TPRM.09 | Pre-populate questionnaire responses to reduce vendor fatigue (reuse prior responses) | UX |
| TPRM.10 | Use expression filtering instead of "Individual Type" for more flexible contact filtering | Flexibility |
| TPRM.13 | Activate extended Vendor Portal tasks for richer vendor self-service | UX |
| TPRM.15 | Use Question Alternate Name for shorter/clearer question labels in reports | Reporting |
| TPRM.16 | Design follow-up workflow with conditional questions for targeted deep-dives | Workflow |

---

## General Administration

| # | Best Practice | Impact |
|---|--------------|--------|
| GEN.01 | Plan roles carefully before creating them — consider all workflows and access needs | Architecture |
| GEN.02 | Limit task areas and tasks by role — simpler UI = better adoption | User adoption |
| GEN.03 | Establish ownership properties early — needed for Owner View/Owner Edit | Security |
| GEN.04 | For bulk deletes: use export + confirmation + import with state changes rather than mass delete | Data quality |
| GEN.05 | Be careful with "Deep Delete" on hierarchies — it's recursive and irreversible | Data quality |
| GEN.06 | Use custom colors matching your organization's brand for better adoption | User adoption |
| GEN.07 | Use Excel Connector to increase admin productivity (faster than CSV round-trips) | Productivity |
