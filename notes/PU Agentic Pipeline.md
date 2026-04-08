---
tags:
  - processunity
  - ai
  - automation
  - pipeline
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Report Builder]]"
  - "[[PU Data Model]]"
---

# PU Agentic Pipeline

> Build AI-powered workflows using PU's native Report + Import infrastructure as the data pipeline. The pattern: **Read** (Custom Report API) → **Reason** (Claude/AI) → **Write** (Import API).

## Core Architecture

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  PU Custom   │     │   Claude /   │     │  PU Import   │
│   Report     │────▶│     AI      │────▶│   Template   │
│  (READ)      │     │  (REASON)   │     │  (WRITE)     │
└─────────────┘     └─────────────┘     └─────────────┘
     Export API          Analysis          Import API
   /api/reports/       Skills + Logic    /api/imports/
```

## Pipeline Patterns

### 1. Risk-Based Assessment Scoping

**Trigger**: New Third-Party Request submitted
**Read**: `skillz_irq.auto.classify` report
**Reason**: AI analyzes inherent risk score, service type, data access, geography → determines questionnaire scope
**Write**: Update Third-Party Request with scoping decisions, create Assessment

Decision logic example:
- Inherent Risk = High AND Data Access = Sensitive → Full CCQ + Privacy Module
- Inherent Risk = Medium AND No Data Access → Standard CCQ only
- Criticality = Critical → Add Business Continuity module

### 2. Finding-to-Issue Conversion

**Trigger**: New GRX Findings detected
**Read**: GRX Finding report with control details, severity, vendor context
**Reason**: AI evaluates severity, control classification (Essential vs Comprehensive), existing issues → decides whether to create an Issue
**Write**: Import new Issue records with AI-drafted fields

Output fields: Issue Title (`[Framework] - [Control Name] - [Severity]`), AI-generated description, proposed remediation, risk scoring, issue source = "GRX Finding"

### 3. Threat-Driven Assessment Creation

**Trigger**: New threat detected (Recorded Future alert, CVE, breach)
**Read**: Threat report + Third Party report (affected vendors)
**Reason**: AI maps threat → MITRE ATT&CK → PU controls → assessment questions
**Write**: Create targeted assessments for affected vendors

### 4. Portfolio Risk Monitor

**Trigger**: Scheduled (daily/weekly)
**Read**: Full portfolio with Risk Index, RF, RiskRecon, BitSight, assessment dates
**Reason**: Statistical analysis + threshold checks + trend detection
**Write**: Alert Issues for anomalies, executive summary

### 5. Duplicate Detection & Merge

**Trigger**: New Third-Party Request or periodic cleanup
**Read**: `skillz_irq.detect_duplicates` report
**Reason**: AI compares names, domains, addresses → identifies duplicates
**Write**: Flag duplicates with merge recommendations

### 6. Vendor Risk Narrative Generation

**Trigger**: On-demand or pre-meeting
**Read**: Single vendor's full risk profile (all intelligence sources)
**Reason**: AI synthesizes into human-readable narrative with recommendations
**Write**: Update vendor record or generate standalone report

### 7. Remediation Plan Generation

**Trigger**: Issue created with AI Proposed Remediation
**Read**: Issue details + related GRX Finding + vendor context
**Reason**: AI generates detailed remediation plan with timeline
**Write**: Update Issue with steps, create sub-tasks if needed

## Designing Agent-Ready Reports

Reports feeding AI pipelines should follow these conventions:

**Naming**: Prefix with `skillz_` or `ai_`. Format: `skillz_{lifecycle_area}.{step}_{name}`

**Columns**: Include system Names (stable identifiers), IDs (for Import write-back), ALL decision-relevant fields. Avoid visual-only columns.

**Filters**: Design-time only — AI can't interact with run-time filters.

**Options**: Enable Automated Export, disable Automatic Refresh for large datasets, set Display Detail Rows to expanded.

**Instructions field**: Describe the AI use case:
```
AI PIPELINE: This report feeds the [pipeline name] workflow.
INPUT: [what AI reads]  |  DECISION: [what AI decides]  |  OUTPUT: [what AI writes back]
```

## Import Template Reference

| Object | Template Purpose | Key Columns |
|--------|-----------------|-------------|
| Issue | Create issues from findings/threats | Title, Description, Severity, Source, Related Third Party |
| Third-Party Request | Update scoping decisions | Request Name, Scoping fields, Risk fields |
| Regulation | Import regulatory frameworks | Name, Description, Category |
| Provision | Import regulatory provisions | Name, Description, Regulation reference |

**API Pattern**: `listImportTemplates()` → find template → read `.Columns` array → format records as strings in column order → `importData(templateId, records)`

> **Critical**: All values must be strings. Column order matters.

## Existing Agent Reports in Sandbox

| Report | Object | Purpose |
|--------|--------|---------|
| `skillz_dd.01_01_dd.generate_questionnaire` | Third-Party Request | DD questionnaire generation |
| `skillz_irq.auto.classify` | Third-Party Request | Inherent risk auto-classification |
| `skillz_irq.detect_duplicates` | Third-Party Request | Duplicate vendor detection |

## SDK Integration

```typescript
import { ProcessUnityClient } from './client';

const pu = new ProcessUnityClient({ baseUrl, apiKey });

// READ
const reportData = await pu.reports.run(reportId);
// REASON
const analysis = await analyzeWithClaude(reportData);
// WRITE
const template = await pu.imports.getTemplate(templateId);
const records = formatForImport(analysis.actions, template.Columns);
await pu.imports.importData(templateId, records);
```

---

*See also: [[PU Report Builder]] for designing the input reports, [[PU Data Model]] for available objects and properties, [[PU Config Designer]] for property configurations.*
