---
name: pu-agentic-pipeline
description: >
  BYOAI agentic workflows using ProcessUnity's Reports and Import APIs as the AI data pipeline.
  Use this skill when the user wants to: analyze PU data with AI, create AI-driven workflows
  that read from PU and write back, scope assessments based on risk data, auto-create issues
  from findings, generate remediation plans, build threat-driven assessment workflows, or
  design any "AI reads data → reasons → writes action" pipeline. Triggers for: "analyze my
  vendors", "scope questions based on risk", "create issues from findings", "auto-triage",
  "AI-driven workflow", "based on this data...", "use AI to...". This skill defines the
  patterns; use pu-report-builder to design the input reports and pu-data-model for object knowledge.
---

# ProcessUnity Agentic Pipeline

Build AI-powered workflows using PU's native Report + Import infrastructure as the data pipeline.

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

**Read**: Custom Reports export structured data via API or automated export
**Reason**: Claude analyzes the data, applies TPRM domain knowledge, makes decisions
**Write**: Import Templates push actions back into PU (create/update records)

## Available Pipeline Patterns

### 1. Risk-Based Assessment Scoping
**Trigger**: New Third-Party Request submitted
**Read**: `skillz_irq.auto.classify` report — Third-Party Request with risk profile data
**Reason**: AI analyzes inherent risk score, service type, data access, geography → determines which questionnaire sections and depth are appropriate
**Write**: Update Third-Party Request with scoping decisions, create Assessment with appropriate questionnaire scope

```
Input Report Columns:
- Request Name, Request Status, Inherent Risk Score/Rating
- Criticality Score/Rating, Service Location Flag, CPI Score
- Data Security fields, Service Details fields
- External Cyber Risk Profile fields (RiskRecon, RF, BitSight)

AI Decision Logic:
- IF Inherent Risk = High AND Data Access = Sensitive → Full CCQ + Privacy Module
- IF Inherent Risk = Medium AND No Data Access → Standard CCQ only
- IF Criticality = Critical → Add Business Continuity module
- IF Service Location Flag = High Risk → Add Geopolitical module

Output: Assessment scope recommendation, questionnaire selection
```

### 2. Finding-to-Issue Conversion
**Trigger**: New GRX Findings detected or finding severity changes
**Read**: GRX Finding report with control details, severity, and vendor context
**Reason**: AI evaluates finding severity, control classification (Essential vs Comprehensive), existing issues, and vendor risk profile → decides whether to create an Issue
**Write**: Import new Issue records with AI-drafted fields

```
Input Report Columns:
- Finding Type, Finding Severity, Maximum Impact
- Framework Name, Control Name, Control ID
- Question Score, Question Score Basis
- Exchange Profile (vendor name)
- Issue Created? (to avoid duplicates)
- Control Type (Essential/Comprehensive)

AI Decision Logic:
- IF Finding Severity = HIGH AND Essential Control → Create Issue (Critical)
- IF Finding Severity = MEDIUM AND Essential Control → Create Issue (High)
- IF Finding Severity = HIGH AND Comprehensive → Create Issue (Medium)
- Skip if Issue Created? = Yes (already handled)

Output Issue Fields:
- Issue Title: "[Framework] - [Control Name] - [Finding Severity]"
- Description: AI-generated explanation of the control gap
- Proposed Remediation (AI): AI-generated remediation steps
- Risk Likelihood, Risk Impact, Risk Score: Calculated from finding data
- Risk Severity: Mapped from finding severity + control classification
- Issue Source: "GRX Finding"
- Related Third Party: From Exchange Profile
```

### 3. Threat-Driven Assessment Creation
**Trigger**: New threat detected (Recorded Future alert, CVE, breach disclosure)
**Read**: Threat report + Third Party report (vendors affected by threat)
**Reason**: AI maps threat to relevant controls/frameworks, identifies affected vendors, determines assessment urgency
**Write**: Create targeted assessments for affected vendors

```
Input: Threat with CVE/type + Third Parties with matching exposure
AI: Maps threat → MITRE ATT&CK → PU controls → assessment questions
Output: Targeted assessment creation for affected vendors
```

### 4. Portfolio Risk Monitor
**Trigger**: Scheduled (daily/weekly)
**Read**: Third Party portfolio report with all risk scores
**Reason**: AI scans for anomalies — score drops, new threats, overdue assessments, concentration risk
**Write**: Create Issues for anomalies, generate executive summary

```
Input: Full portfolio with Risk Index, RF, RiskRecon, BitSight, assessment dates
AI: Statistical analysis + threshold checks + trend detection
Output: Alert Issues, executive summary report
```

### 5. Duplicate Detection & Merge Recommendation
**Trigger**: New Third-Party Request or periodic cleanup
**Read**: `skillz_irq.detect_duplicates` report
**Reason**: AI compares vendor names, domains, addresses → identifies likely duplicates
**Write**: Flag duplicates with merge recommendations

### 6. Vendor Risk Narrative Generation
**Trigger**: On-demand or pre-meeting
**Read**: Single vendor's full risk profile (all intelligence sources)
**Reason**: AI synthesizes risk data into human-readable narrative with recommendations
**Write**: Update vendor record with narrative, or generate standalone report

### 7. Remediation Plan Generation
**Trigger**: Issue created with AI Proposed Remediation
**Read**: Issue details + related GRX Finding + vendor context
**Reason**: AI generates detailed, actionable remediation plan with timeline
**Write**: Update Issue with detailed remediation steps, create sub-tasks if needed

## Designing Agent-Ready Reports

Reports that feed AI pipelines should follow these conventions:

### Naming
- Prefix: `skillz_` for agent-specific reports, `ai_` for AI data feeds
- Format: `skillz_{lifecycle_area}.{step_number}_{step_name}`
- Example: `skillz_dd.01_01_dd.generate_questionnaire`

### Column Selection
- Include **system Names** (not just Labels) — AI needs stable identifiers
- Include **IDs** needed for Import write-back (record IDs, linked IDs)
- Include **ALL decision-relevant fields** — more data is better for AI reasoning
- Avoid visual-only columns (color coding, section headers)

### Filters
- Use **design-time filters** only — AI can't interact with run-time filters
- Scope to relevant records (e.g., Status = Active, Score > 0)

### Options
- Enable **Automated Export** for API access
- Disable **Automatic Refresh** for large datasets
- Set **Display Detail Rows** to expanded

### Instructions Field
Include a clear description of the AI use case:
```
AI PIPELINE: This report feeds the [pipeline name] workflow.
INPUT: [describe what the AI reads]
DECISION: [describe what the AI decides]
OUTPUT: [describe what the AI writes back]
```

## Import Template Reference

Key import templates for write-back (template IDs are instance-specific):

| Object | Template Purpose | Key Columns |
|--------|-----------------|-------------|
| Issue | Create issues from findings/threats | Issue Title, Description, Severity, Source, Related Third Party |
| Third-Party Request | Update scoping decisions | Request Name, Scoping fields, Risk fields |
| Regulation | Import regulatory frameworks | Name, Description, Category, Sub-Category |
| Provision | Import regulatory provisions | Name, Description, Regulation reference |

**API Pattern**: Use the PU SDK's `imports` resource:
1. `listImportTemplates()` → find template by name
2. Template `.Columns` array → exact column names and order
3. Format records with string values in column order
4. `importData(templateId, records)` → upload

**Critical**: All values must be strings. Column order matters. See processunity-api.md memory for gotchas.

## Existing Agent Reports in Sandbox

| Report | Object | Purpose |
|--------|--------|---------|
| `skillz_dd.01_01_dd.generate_questionnaire` | Third-Party Request | Due diligence questionnaire generation |
| `skillz_dd.01_02_dd.generate_questionnaire` | Third-Party Request | DD questionnaire variant |
| `skillz_irq.auto.classify` | Third-Party Request | Inherent risk auto-classification |
| `skillz_irq.detect_duplicates` | Third-Party Request | Duplicate vendor detection |

## Integration with ProcessUnity SDK

The `processunity-sdk` project provides the TypeScript client for the Report + Import pipeline:

```typescript
import { ProcessUnityClient } from './client';

const pu = new ProcessUnityClient({ baseUrl, apiKey });

// READ: Run a report
const reportData = await pu.reports.run(reportId);

// REASON: Claude analyzes (via AI SDK or MCP)
const analysis = await analyzeWithClaude(reportData);

// WRITE: Import actions back
const template = await pu.imports.getTemplate(templateId);
const records = formatForImport(analysis.actions, template.Columns);
await pu.imports.importData(templateId, records);
```

## Related Skills
- **pu-report-builder** — Design and build the input reports
- **pu-data-model** — Understand available objects, properties, relationships
- **pu-admin-navigator** — Execute configuration changes in the PU UI
- **pu-config-designer** — Design property configurations
