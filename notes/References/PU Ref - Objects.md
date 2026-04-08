---
tags:
  - processunity
  - reference
  - data-model
  - objects
created: 2026-04-07
parent: "[[PU Data Model]]"
---

# PU Ref - Objects

> Complete object catalog for ProcessUnity's semantic data model. Referenced by [[PU Data Model]] and [[PU Config Designer]].

## Key Concepts

ProcessUnity uses a semantic, object-oriented data model — not traditional relational tables. All data lives in a unified structure where Object Types define "tables," Custom Properties define "fields," and Object Instances are individual records. Schema changes happen live without downtime.

**Traits** govern what an object can do:
- **GR** = Grid (flat list), **TR** = Tree (hierarchy)
- **RE** = Renamable (can be relabeled)
- **AE** = Auditable Entity (can be scoped into Assessments)
- **AI** = Action Item (enhanced relationship/state flexibility)
- **SR** = State Required (mandatory lifecycle: Draft → In Use → Retired)
- **SO** = State Optional (state workflow can be enabled)
- **VO** = Versioned Object (multiple versions of same record)

**Related Items**: Any object can be linked to almost any other via Roles on the Related Items tab.

## Subject Area Objects

| Object | Structure | Traits | Purpose |
|--------|-----------|--------|---------|
| **Vendors** | Grid | GR, RE, SO | Vendor/third-party database. Core of TPRM/VRM. Children: Services, Contacts, Agreements, Facilities, Fourth Parties |
| **Vendor Requests** | Grid | GR, RE, SO | Onboarding mechanism for LOB to request new vendors |
| **Issues** | Grid | GR, RE, AI, SO | Track and resolve risk/compliance concerns |
| **Risks** | Tree | TR, RE, AE | Hierarchical risk register with probability/impact |
| **Controls** | Tree | TR, RE, AE, SR, VO | Define, maintain, test internal/IT controls |
| **Assessment Types** | Grid | GR, SR | Configure assessment scope, phases, findings templates |
| **Questionnaires** | Tree | TR, AE, SR | Build templates: Questionnaires → Sections → Questions |
| **Incidents** | Grid | GR, RE, SO | Track governance-related events |
| **Policies & Procedures** | Tree | TR, RE, SR, VO | Centralized policy repository with review/approval |
| **Regulations & Standards** | Tree | TR, RE, AE, SR, VO | External frameworks and control standards |
| **Certifications** | Grid | GR, SR | Scheduled/ad-hoc certification requests |
| **Assets** | Grid | GR, RE, SO | Apps, systems, facilities inventory |
| **Business Elements** | Tree | TR, RE, AE | Generic hierarchical inventory for risk evaluation |
| **Documents** | Tree | TR, SO, VO | Document repository with version control |
| **Document Requests** | Grid | GR, RE, AI, SR | Formal documentation requests |
| **Financial Accounts** | Tree | TR, RE, AE | GL accounts for compliance |
| **Loss Events** | Grid | GR, RE, SO | Financial loss/gain tracking |
| **Metrics** | Grid | GR, RE, SR | SLAs with scheduled capture and thresholds |
| **Notices** | Grid | GR, RE, AI, SO | Bulletin-board postings |
| **Organization** | Tree | TR, RE | Org structure (departments, groups, units) |
| **Processes** | Tree | TR, RE, AE | Business process documentation |
| **Projects** | Grid | GR, RE, AI, SR | Corrective actions, BPM activities |
| **Reference Controls** | Tree | TR, RE, SR, VO | Recommended control templates |
| **Services** | Tree | TR, SR | Product/service catalog for Offer Management |
| **Threats** | Grid | GR, RE, AI, SO | Enterprise threat catalog |
| **Work Items** | Grid | GR, RE, AI, SO | Generic task tracking |
| **Clients** | Grid | GR, SR | Offer Management institutions |
| **CUSTOM (up to 10)** | Grid | GR, RE, AI, SO | Extensible add-on objects |
| **VENDOR CUSTOM (up to 3)** | Vendor Tabs | RE, SO | Extend Vendor with custom child objects |

## Settings Objects

| Object | Purpose |
|--------|---------|
| **Reference Data** | Dynamic pick list values, supports cascading |
| **Holidays** | Named holidays for business day calculations |
| **People (Individuals)** | User repository, populates user pick lists |
| **Roles** | Permission-based application security |
| **Teams** | Named collections of people |

## Standard Tabs on Every Object

1. **Details** — Properties + workflow buttons
2. **Attachments** — Files, URLs, Document Repository links
3. **Related Items** — Relationships to other records
4. **Approval** — Review/approval processing
5. **Change Log** — Audit trail (requires Track Changes)
6. **Access** — Admin-only record access restriction

## Standard Properties on Every Object

- `[Name]` — Primary identifier
- `[Description]` — Record description
- `[External ID]` — For integration (hidden by default, renamable)
- `[Search Keywords]` — Global search inclusion
- `[Item Last Modified]` — Datetime tracking (standard property changes only)

## Key Relationships

- Vendors → Services → Contacts, Agreements, Facilities, Fourth Parties
- Risks ↔ Controls (bidirectional for residual risk)
- Any Subject Area → Assessments (via AE trait)
- Any object ↔ Any other object (via Related Items + Roles)
- Custom Reports → Dashboards (reports with charts)

### Relationships and Multi-Level Reports

**Critical rule**: Multi-level reports can ONLY join two objects that have an **existing relationship** configured between them. No relationship = zero rows returned (no error, just empty).

Each relationship has a **name** (e.g., "Fourth Parties (Vendor Fourth Party)"). You select the relationship name when building a multi-level report — not just the object type. The same pair of objects can have **multiple distinct relationships** returning different data.

Common multi-level report joins:

| Level 1 | Level 2 | Relationship Pattern | Use Case |
|---------|---------|---------------------|----------|
| Vendor | Vendor Service | Child / Vendor Services | Service portfolio |
| Vendor | Assessment | Assessment Scope | Assessment history |
| Vendor | Fourth Party | Vendor Fourth Party | Subcontractor chain |
| Vendor | Legal Entity | Legal Entities (Legal Entity) | Entity hierarchy |
| Agreement | Legal Entity | Legal Entities Making Use of This Agreement | Entities on contract |
| Agreement | Vendor Service | DORA Linked Service(s) | Services under agreement |
| Questionnaire Question | Questionnaire Response | Questionnaire Responses | Response data |

3-4 level reports chain through multiple relationships.

## Aggregate Property Types

Aggregate properties pull data from related records. Internal codes:

| Code | Name | Returns | Description |
|------|------|---------|-------------|
| 1 | **Count** | Number | Count related records matching filter |
| 2 | **Sum** | Number | Sum a numeric property |
| 3 | **Average** | Number | Average a numeric property |
| 4 | **Min/First** | Text/Number | Minimum or first value |
| 5 | **Lookup** | Text | Read single value from parent/related (most common) |
| 6 | **List** | Text | Concatenate property from ALL related records |
| 7 | **Max/Last** | Text/Number/Date | Maximum or most recent value |

Config fields: AggregateItemType (relationship), AggregateProperty (field to read), AggregateFilterProperty/Value (optional filter).

## Platform License Limits

| Limit | Typical Value |
|-------|--------------|
| Custom Properties Per Object | 400 |
| Aggregated Properties Per Object | 50 |
| Track Changes Per Object | 50 |
| Import Rows Per Call | 20,000 |
| Report Rows | 500,000 |
| Web Service Rate Limit | 360/hour |
| Custom Report Cache | 5 days |
| Max Automated Actions | 200 total, 20/object |

## Solution Fingerprints

Which features are enabled indicates the "solution":

| Feature | VRM | CSRM | DORA | GRC |
|---------|-----|------|------|-----|
| Vendors/Services | Yes | Yes | Yes | — |
| Agreements | — | — | Yes | — |
| Fourth Parties | — | — | Yes | — |
| Legal Entity (Custom) | — | — | Yes | — |
| CIF (Custom) | — | — | Yes | — |
| Risks/Controls | — | — | — | Yes |
| Assets/Threats | — | Yes | — | — |
| GRX/BitSight/RiskRecon | Yes | — | — | — |
