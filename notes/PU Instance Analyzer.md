---
tags:
  - processunity
  - analysis
  - instance
  - fingerprint
  - gap-analysis
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
  - "[[PU Config Designer]]"
  - "[[PU DORA]]"
  - "[[PU Report Builder]]"
---

# PU Instance Analyzer

> Understand what's configured in a ProcessUnity instance before making changes. Detect the active solution, inventory reports and templates, identify connectors, and generate delta plans.

## When to Use

- "What's configured in this instance?"
- "What solution is running?"
- "What connectors are active?"
- "What's missing for DORA?"
- "Inventory all reports and templates"
- Pre-change audit or gap analysis

## Data Sources

Uses live API queries via the ProcessUnity MCP server:
- `list_reports` — all exportable report names and IDs
- `list_import_templates` — all import templates with column schemas
- `get_columns` — column metadata for a specific import template
- `export_report` — actual data from any exportable report

Can also parse offline metadata CSV exports (admin export format).

## 6 Analysis Procedures

### 1. Instance Fingerprint
Classify reports/templates by naming patterns (`{Connector}`, `BTN:`, `DASH:`, `EXCEL_`, `skillz_`, etc.) to detect which solution and connectors are active.

### 2. Connector Inventory
Filter import templates for `{Connector}` prefix, inspect column schemas, cross-reference with feed reports. Known connectors: BitSight (35 cols), GRX (48-138 cols), SecurityScorecard (24 cols), RiskRecon (29 cols), EcoVadis (29 cols), D&B (12 cols), RapidRatings (20 cols), Interos (25 cols), WC1 (17-44 cols).

### 3. Report Inventory & Classification
Categorize all reports by prefix/pattern: Connector, Button/WFA, Dashboard, Admin, Import, Export, MS Word, AI/Agent, Integration, Context, Operational.

### 4. Import Template Schema Analysis
Examine templates for insert vs update support, key columns, column counts, and parent key relationships.

### 5. Gap Analysis (Desired vs Actual)
Compare desired state (e.g., DORA checklist from [[PU DORA]]) against current state. Output a delta plan with missing elements ordered by dependency.

### 6. Data Health Check
Export a comprehensive vendor report and assess: field completeness %, risk rating distribution, connector data freshness, inherent risk coverage.

## Output Formats

- **Fingerprint Report**: Solution type, active connectors, report/template counts by category, vendor count, risk coverage %
- **Gap Analysis Report**: Present/Missing checklists with dependency-ordered delta plan

## Solution Fingerprints

| Solution | Key Indicators |
|----------|---------------|
| **VRM** | Vendor reports + GRX/BitSight/RiskRecon connectors + Quick Start templates |
| **DORA** | DORA IMPORT/EXCEL reports + Legal Entity/CIF templates + Agreement reports |
| **CSRM** | Asset/Threat reports + Incident templates |
| **GRC** | Risk/Control/Policy reports + Regulation templates |
| **Custom** | Mixed indicators from multiple solutions |

---

*See also: [[PU Data Model]] for object types and platform limits, [[PU Config Designer]] for designing plans from gap analysis results, [[PU DORA]] for DORA-specific gap analysis checklist, [[PU Report Builder]] for understanding report classification.*
