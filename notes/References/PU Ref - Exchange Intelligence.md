---
tags:
  - processunity
  - reference
  - risk
  - grx
  - intelligence
created: 2026-04-07
parent: "[[PU Data Model]]"
---

# PU Ref - Exchange Intelligence

> ProcessUnity Global Risk Exchange (GRX) intelligence data reference. Essential for building risk reports and understanding the data that flows into the Workflow platform.

## Risk Index

The **ProcessUnity Risk Index** is a dynamic 0-100 score unifying Exchange data into a single cybersecurity risk posture rating.

### Components & Weights

| Component | Weight | Type | Source |
|-----------|--------|------|--------|
| Security Controls | 50% | Inside-Out | Exchange predictive & attested controls |
| Vulnerability Resiliency | 30% | Inside-Out | CWEs mapped to Exchange controls |
| Perimeter Scanning | 10% | Outside-In | RiskRecon automated scanning |
| Threat Intelligence | 10% | Outside-In | Recorded Future intelligence |

### Risk Index Ratings

| Rating | Score Range | Interpretation |
|--------|-----------|----------------|
| Very Strong | 80-100 | Exceptional practices, robust controls |
| Strong | 70-79 | Proficient, mature controls with limited gaps |
| Fair | 60-69 | Fundamental but inconsistently applied |
| Weak | 50-59 | Key controls missing or failing |
| Very Weak | 0-49 | Widespread control gaps |
| Awaiting | N/A | Not yet calculated |

### Control Index Blending

- Attested Metrics + Predictive: 90% / 10%
- Attested Control + Predictive: 70% / 30%
- Predictive only: 100% (threshold 60 for pass/fail)

Recalculation runs every 30 minutes after trigger (attestation, predictive regeneration, or model update).

## Risk Monitoring & Alerting (Recorded Future)

### 11 Risk Categories

Breach/Incident Reporting, Dark Web, Domain, Hygiene, IP Address, Leaked Credentials, Other, Security Incidents, Technology, Threat Research, Trend

### Severity Scale

| Severity | Score Range | Description |
|----------|-----------|-------------|
| Very High | 90-99 | Very high severity threats observed |
| High | 65-89 | Elevated cyber-risk indicators |
| Moderate | 25-64 | Moderate threats over time |
| Informational | 5-24 | General awareness |

### Key High/Very High Rules

- Recent Security Breach Disclosure (Very High)
- Recent Validated Cyber Attack (Very High)
- Recent Reported Cyber Attack (High)
- Ransomware Extortion Websites (High)
- C&C Server Communication (High)
- Domain hygiene issues (High/Moderate)

## Findings Methodology

Score-based approach with control classification:

- **Essential Controls** = MITRE ATT&CK relevant + PU Critical Controls (60 controls) → Higher severity
- **Comprehensive Controls** = All others → Lower severity

### Finding Severity Matrix

| Score Range | Essential | Comprehensive |
|------------|-----------|---------------|
| < 50 | HIGH | MEDIUM |
| 50-69.99 | MEDIUM | LOW |
| 70-84.99 | LOW | NOMINAL |
| ≥ 85 | NOMINAL | NOMINAL |

## Risk Navigator

Framework-based control assessment with rankings: Very Poor (0-49), Poor (50-69), Fair (70-79), Good (80-89), Very Good (90-100).

Score basis types: Attested Metrics, Attested Control, Attested NA, Predictive Control, Unavailable.

Maximum Impact Levels: Significant, Moderate, Minimal, Least.

## Assessment Questionnaire Scopes

- **Essential** — Most essential controls for standard hygiene
- **Core** — Full cybersecurity control questions
- **Complete** — Core + performance metrics

## Key Third Party Properties for Reporting

Risk Index Score/Rating/Last Updated, Inherent/Residual Risk, Interos scores (Cyber, ESG, Finance, Catastrophic), BitSight fields, Assessment counts/statuses, Active Agreements/Services/Issues counts, Recorded Future triggers.

## Help System Articles

| Article | URL Name |
|---------|----------|
| Risk Index Methodology | `risk-index-methodology` |
| Risk Monitoring & Alerting | `risk-monitoring-and-alerting-overview` |
| Findings Methodology | `findings-methodology` |
| Risk Navigator | `risk-navigator-methodology` |
| Advanced Reporting | `advanced-reporting` |
| Portfolio Insights | `portfolio-insights-methodology` |
| API V2 Guide | `api-v2-user-guide` |

Base URL: `https://processunity.my.site.com/support/s/article/{url-name}`
