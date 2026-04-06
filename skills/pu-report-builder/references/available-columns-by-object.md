# Available Report Columns by Object Type

This reference lists the key properties available on each PU object type that can be used as report columns. Properties are grouped by section as they appear in the admin UI.

## Third Party (321 custom properties)

### Risk Intelligence
- **ProcessUnity Risk Index**: Score (0-100), Rating (Very Strong/Strong/Fair/Weak/Very Weak), Last Updated, Domain Impact Ratings
- **Inherent Risk**: Score, Rating, Inherent Risk
- **Residual Risk**: Score, Rating, Residual Risk
- **Recorded Future**: Overall Score, Overall Rating, Company Criticality, Triggered Rules, Evidence, CMA Alert Count (15+ properties)
- **RiskRecon**: Overall Score, Overall Rating, plus domain-specific scores (Application Security, DNS, Email, Network, etc.)
- **BitSight**: 20+ grade properties across security domains
- **Interos**: Multiple risk score properties
- **SecurityScorecard**: Grade properties

### Vendor Profile
- Name, Company Type, HQ Country, HQ Region, Industry, Category, Criticality
- CPI Score (Corruption Perceptions Index)
- Status, Active/Inactive

### Flags & Classifications
- AI Flag, ESG Flag, ABAC Flag, Geopolitical Flag, Privacy Flag
- Third-Party Location Flag, Service Location Flag

### Assessment & GRX
- Attestation dates, Validation dates, Questionnaire progress
- Request status, Assessment counts
- # of Active Agreements, Services, Issues

## Third-Party Request (187 custom properties)

### Request Workflow
- Request Name, Request Date, Request Status, Request ID, Requester, Requested By
- Line of Business Owner, Internal Business Unit, Third-Party Manager

### Risk Profile
- Inherent Risk (Score), Inherent Risk Rating, Criticality Score/Rating
- Service Location Flag/Helper, CPI Score

### External Cyber Risk Profile (23 properties)
- RiskRecon Overall Score/Rating, Recorded Future Overall Rating/Criticality/Triggered Rules
- GRX RiskRecon Breach Events, BitSight scores, Interos scores, SecurityScorecard scores

### Service Details
- Service Details (11), Service Contact Details (5), Service Inherent Risk Questionnaire (13)
- Data Security and Management (19), Additional Questions (15)
- Service Criticality Questionnaire (8), Performance Review (8)

### AI & Integrations
- **Powered by Google Gemini** (5 properties)
- **Slack Integration** (3 properties)
- **ProcessUnity Risk Index** (4 properties)
- **ProcessUnity Risk Domains** (21 properties)

### KPI Tracking
- Days in Status tracking (10 properties)
- Request Audit Log (17 properties)

## Third-Party Engagement (135 custom properties)

### Service Record (17)
- Core engagement details, service identification

### Service Risk Profile (13)
- Risk classification of the engaged service

### Service Review (10)
- Periodic service review data

### Service Location (8)
- Geographic risk indicators

### Inherent Risk Questionnaire (10)
- Risk scoping questions

### Data Security and Management (24)
- Data handling, classification, security controls

### Issue Category Analysis (11)
- Issue breakdown by category for this engagement

### Resiliency Metrics (5)
- Business continuity / resilience indicators

### Offboarding (12)
- Termination process tracking

## Issue (74 custom properties)

### Core Issue Fields
- Name, Issue Title, Issue Seq, Issue Status, Issue Stage
- Issue Source, Root Cause Category, Description
- Owner, IM Analyst, Third-Party Contact

### Risk Scoring
- Risk Likelihood, Risk Impact, Risk Score, Risk Severity
- Parent Issue Risk fields (for linked issues)
- Severity Override, Override Comments

### Relationships
- Related Third Party, Linked Finding, Parent Issue
- Third-Party Acknowledgment Required

### AI Features
- **Proposed Remediation (AI)** — AI-generated remediation suggestions
- Risk Impact Description

### Key Dates (18)
- Full lifecycle date tracking: created, acknowledged, treatment planned, remediated, closed

### KPI Tracking
- Days in Status tracking (10 properties)

## GRX Finding (51 custom properties)

### Finding Details
- Name, Finding Type, Framework Name, Finding Severity
- Maximum Impact, Mitigation Strategy, Review Status
- Assessment Status, Exchange Profile

### Control Information
- Control ID, Framework Control Group, Framework Control Name, Control Name
- Control Type, Question Prompt, Question Response
- Question Score, Question Score Basis, Question Type
- Question Validation Status, Question Evidence Type

### Issue Linkage
- Issue Created?, Issue Name, Issue TPM Owner
- Issue Risk Impact Description, Issue Likelihood, Issue Impact
- Third-Party Acknowledgment Required

### Last Review Comparison
- Last Review versions of: Finding Type, Severity, Review Status, Question Score, Response, Completed By, Timestamp, Comments

### GRX Metrics
- Strength Question/Prompt/Response
- Coverage Question/Prompt/Response
- Timeliness Question/Prompt/Response

## Threat (24 custom properties)

### Core Threat Fields
- Name, Description, State, Threat Severity, Threat Name, Threat Type
- Threat External ID, Threat Intelligence Source, Threat Description API
- Watch List Rule

### Ad Hoc Threats
- Ad Hoc Threat Name, Type, Severity, First Seen Date, Last Observed Date
- Ad Hoc Next Threat Type Number, External ID

### CVE Fields
- CVE Name, CVE ID, CVE Version, CVE Severity

## Relationship (79 custom properties)

### Entity Information
- Service Provider, Material Service Entity, Benefitting Legal Entity
- Contracting Legal Entity, Sub-Contractor
- Chain Details, Parent Info

### Hierarchy (42 properties)
- Multi-level hierarchy tracking for complex vendor relationships

## Multi-Level Report Combinations

These object pairs support multi-level reports:

| Level 1 | Level 2 | Use Case |
|---------|---------|----------|
| Third Party | Issue | Vendor issue tracking |
| Third Party | Third-Party Engagement | Service portfolio view |
| Third Party | GRX Finding | Control gap analysis by vendor |
| Third Party | Threat | Threat exposure by vendor |
| Third Party | Relationship | Supply chain mapping |
| Third-Party Engagement | Issue | Service-level issue tracking |
| GRX Finding | Issue | Finding-to-issue conversion tracking |

Note: Available multi-level combinations depend on object relationships configured in the instance.
