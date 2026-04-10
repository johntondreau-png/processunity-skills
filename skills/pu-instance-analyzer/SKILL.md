---
name: pu-instance-analyzer
description: >
  Analyze a ProcessUnity instance to understand what's configured, detect which solution is active,
  inventory reports and import templates, and compare desired state against actual. Use this skill
  when the user wants to understand an instance before making changes, detect gaps, plan incremental
  configuration, or audit what's deployed. Triggers for: "what's configured", "analyze this instance",
  "what's already there", "inventory", "fingerprint", "what solution is this", "gap analysis",
  "what's missing", "compare", "delta". This skill uses the ProcessUnity MCP server for live API
  queries and can also parse metadata CSV exports. Always use alongside pu-app-guide for platform
  knowledge.
depends_on:
  - pu-app-guide
---

# ProcessUnity Instance Analyzer

Understand what's configured in a ProcessUnity instance before making changes. Detect the active solution, inventory reports and templates, identify connectors, and generate delta plans.

## Before Starting

### Required Context
1. **Instance access** — either a live ProcessUnity MCP connection OR a metadata CSV export
2. **Purpose** — what are you trying to understand? (general audit, pre-DORA readiness, connector inventory, gap analysis vs a target config)

### Available Data Sources

| Source | What It Provides | Tool |
|--------|-----------------|------|
| **list_reports** | All exportable report names and IDs | MCP: `mcp__processunity__list_reports` |
| **list_import_templates** | All import templates with column schemas | MCP: `mcp__processunity__list_import_templates` |
| **get_columns** | Column metadata for a specific import template | MCP: `mcp__processunity__get_columns` |
| **export_report** | Actual data from any exportable report | MCP: `mcp__processunity__export_report` |
| **Metadata CSV export** | Full property/report metadata (admin export) | File read: `cwiedersheim_Metadata_Properties.csv` etc. |

## Analysis Procedures

### Procedure 1: Instance Fingerprint

Determine which "solution" is running by examining what's configured.

**Step 1**: List all reports and import templates
```
→ list_reports
→ list_import_templates
```

**Step 2**: Classify by naming patterns

| Pattern | Indicates |
|---------|-----------|
| `{Connector} BitSight *` | BitSight connector enabled |
| `{Connector} GRX *` | GRX Exchange connector enabled |
| `{Connector} riskrecon *` | RiskRecon connector enabled |
| `{Connector} Security Scorecard *` | SecurityScorecard connector enabled |
| `{Connector} EcoVadis *` | EcoVadis connector enabled |
| `{Connector} Dun & Bradstreet *` | D&B connector enabled |
| `{Connector} Rapid Rating *` | RapidRatings connector enabled |
| `{Connector} Interos *` | Interos connector enabled |
| `{Connector} WC1 *` | World-Check One (Refinitiv) enabled |
| `DORA IMPORT *` / `EXCEL_DORA_*` | DORA solution configured |
| `BTN: *` | Custom button workflow reports |
| `DASH: *` | Dashboard source reports |
| `skillz_*` / `*BYOAI*` | AI/agentic pipeline configured |
| `MS WORD: *` | Word template integration active |
| `QUICK START: *` | Quick Start templates (standard VRM) |
| `VendorShield - *` | VendorShield configuration present |
| `[External API] *` | External API connections configured |

**Step 3**: Match to solution fingerprint (from pu-app-guide references/objects.md)

| Solution | Key Indicators |
|----------|---------------|
| **VRM** | Vendor reports + GRX/BitSight/RiskRecon connectors + Quick Start templates |
| **DORA** | DORA IMPORT/EXCEL reports + Legal Entity/CIF templates + Agreement reports |
| **CSRM** | Asset/Threat reports + Incident templates |
| **GRC** | Risk/Control/Policy reports + Regulation templates |
| **Custom** | Mixed indicators from multiple solutions |

### Procedure 2: Connector Inventory

Identify which third-party data connectors are configured and active.

**Step 1**: From `list_import_templates`, filter for `{Connector}` prefix
**Step 2**: For each connector template, use `get_columns` to see what fields it imports
**Step 3**: Cross-reference with reports to see if connector data feed reports exist

**Known Connectors and Their Template Patterns:**

| Connector | Import Template Pattern | Column Count | Key Fields |
|-----------|----------------------|:---:|------------|
| **BitSight** | `{Connector} BitSight Continuous Monitoring` | 35 | Rating, 20 security domain grades, Profile, Industry |
| **BitSight** | `{Connector} BitSight On-Demand Details` | 25 | Detailed assessment data |
| **BitSight** | `{Connector} BitSight On-Demand Rating` | 7 | Quick rating summary |
| **BitSight** | `BitSight My Organization Import` | 25 | Internal org rating |
| **GRX Exchange** | `{Connector} GRX Connector Import - Update Third Party` | 48/138 (v1/v3) | GRX assessment data, Risk Index |
| **GRX Exchange** | `{Connector} GRX Connector Import - Get Responses` | 9 | Framework control responses |
| **GRX Exchange** | `{Connector} GRX Connector Import - Update Recorded Future` | 7 | RF threat intelligence |
| **SecurityScorecard** | `{Connector} Security Scorecard Import` | 24 | SSC security grades |
| **RiskRecon** | `{Connector} riskrecon Vendor Import` | 29 | RR domain scores |
| **EcoVadis** | `{Connector} EcoVadis Vendor Import` | 29 | ESG/sustainability ratings |
| **D&B** | `{Connector} Dun & Bradstreet Import` | 12 | Financial/corporate data |
| **RapidRatings** | `{Connector} Rapid Rating Import` | 20 | Financial health ratings |
| **Interos** | `{Connector} Interos Vendor Import` | 25 | Supply chain risk data |
| **WC1** | `{Connector} WC1 - Create/Update *` | 17-44 | Sanctions screening results |

### Procedure 3: Report Inventory and Classification

Categorize all reports by function.

**Step 1**: `list_reports` to get full list
**Step 2**: Classify each report by prefix/pattern:

| Category | Pattern | Purpose |
|----------|---------|---------|
| **Connector** | `{Connector}*` | Data feed from external connector |
| **Button/WFA** | `BTN:*` | Workflow Action context reports |
| **Dashboard** | `DASH:*` | Chart source for dashboards |
| **Admin** | `ADM:*` | Administrative/setup reports |
| **Import** | `*IMPORT*` | Data loading sequence reports |
| **Export** | `EXCEL_*` | Formatted export reports |
| **MS Word** | `MS WORD:*` | Document template reports |
| **AI/Agent** | `skillz_*`, `*BYOAI*`, `*OpenAI*`, `ai_*` | Agentic pipeline reports |
| **Integration** | `[External API]*`, `[Workato*]`, `{Integration*}` | External system integration |
| **Context** | `CONTEXT:*` | Reference data / pick list reports |
| **Operational** | No prefix | Standard business reports |

**Step 3**: Count by category and flag any unusual patterns.

### Procedure 4: Import Template Schema Analysis

Understand what data can be imported and how.

**Step 1**: `list_import_templates` to get all templates
**Step 2**: For key templates, `get_columns` to see schema
**Step 3**: Identify:
- Which templates support **inserts** vs **updates** vs both
- What the **key column** is (Id, External Id, Name)
- Column count (complexity indicator)
- Parent key column (for hierarchical imports)

### Procedure 5: Gap Analysis (Desired vs Actual)

Compare what SHOULD be configured against what IS configured.

**Step 1**: Define desired state (e.g., from pu-dora skill checklist, or user requirements)
**Step 2**: Run Procedures 1-4 to understand current state
**Step 3**: For each desired element, check:

| Desired Element | How to Check | Present? |
|----------------|-------------|:---:|
| Report exists | Search `list_reports` by name pattern | ✓/✗ |
| Import template exists | Search `list_import_templates` by name pattern | ✓/✗ |
| Connector active | Check for `{Connector}` templates | ✓/✗ |
| Data populated | `export_report` on a key report, check row count | ✓/✗ |
| Reference data loaded | Export a reference data report, check values | ✓/✗ |

**Step 4**: Output a delta plan listing only missing elements, ordered by dependency.

### Procedure 6: Data Health Check

Assess data quality and completeness.

**Step 1**: Export a comprehensive vendor report (e.g., `*API - VENDOR DATA`)
**Step 2**: For each record, check:
- Populated vs empty fields (completeness %)
- Risk rating distribution (should follow a curve, not all one value)
- Connector data freshness (timestamp fields)
- Inherent Risk populated? (critical for TPRM)

**Step 3**: Summarize findings as a health report.

## Output Format

### Fingerprint Report
```markdown
## Instance Fingerprint: [Instance Name]

**Solution**: VRM with DORA overlay
**Connectors**: BitSight (active), GRX (active), SecurityScorecard (active)
**Reports**: 30 total (12 connector, 5 BTN, 4 DASH, 3 BYOAI, 6 operational)
**Import Templates**: 52 total (12 connector, 5 VendorShield, 8 External API)
**AI/Agent**: BYOAI pipeline configured (6 reports, 5 templates)
**Vendor Count**: ~100 active vendors
**Risk Coverage**: 92% have Inherent Risk assigned
```

### Gap Analysis Report
```markdown
## Gap Analysis: DORA Readiness

### Present ✓
- [ ] Vendor object configured
- [ ] Vendor Services enabled
- [ ] BitSight connector active

### Missing ✗
- [ ] Legal Entity (Custom Object One) — not found
- [ ] CIF (Custom Object Three) — not found
- [ ] DORA reference data types — 0 of 20 loaded
- [ ] DORA import reports — 0 of 8 found
- [ ] DORA export reports — 0 of 14 found
- [ ] Agreement object — no agreement templates found

### Delta Plan (dependency order)
1. Enable Custom Objects (Legal Entity, CIF) — system setting
2. Enable Agreements — system setting
3. Load DORA reference data (20 types, ~1,200 values)
4. Configure Legal Entity properties (RT.01)
...
```

## Metadata CSV Export Analysis

When a metadata CSV export is available (like the cwiedersheim format), additional analysis is possible:

### Properties CSV Columns of Interest
- `ObjectType` — which object the property belongs to
- `CustomPropertyType` — property type (Text, Number, Date, Calculated, Aggregate, etc.)
- `ConditionalDisplayProperty` / `ConditionalDisplayValue` — conditional display rules
- `ConditionalEditProperty` / `ConditionalEditValue` — conditional edit rules
- `AutoUpdateEventType` / `AutoUpdateExpression` / `AutoUpdateValue` — auto-update rules
- `ValidationExpression` — validation rules
- `AggregateType` / `AggregateItemType` / `AggregateProperty` — aggregate configuration
- `BackgroundColor` / `FontColor` — color expressions

### Reports CSV Columns of Interest
- `Level1` / `Level2` / `Level2Relationship` — multi-level join configuration
- `EnableWFAContext` / `EnableWFAOther` — workflow action enablement
- `EnableForAutomatedExport` — web services / automated export
- `ChartDisplayType` — chart configuration
- `Category` — report category/folder

### Analysis Queries
- **Properties by object**: Group by `ObjectType`, count custom properties per object
- **Calculated vs simple**: Count `CustomPropertyType` to understand configuration complexity
- **Automation density**: Count properties with auto-update rules per object
- **Conditional display coverage**: What % of properties use conditional display
- **Aggregate usage**: Count aggregates per object vs 50-limit ceiling
- **Color coding**: Which objects use expression-based colors

## Reference Skills
- **pu-app-guide** — Object types, property types, relationships, aggregate codes, platform limits, solution fingerprints
- **pu-dora** — DORA implementation checklist for gap analysis
- **pu-config-designer** — Configuration patterns and generic capability requirements
