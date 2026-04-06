# ProcessUnity Object Reference

ProcessUnity uses a semantic, object-oriented data model — not traditional relational tables. All data lives in a unified structure where Object Types define "tables," Custom Properties define "fields," and Object Instances are individual records. This means schema changes (adding properties, enabling objects) happen live without downtime.

## Key Concepts

- **Subject Areas** are the primary configurable objects (Vendors, Issues, Risks, etc.). They appear in the navigation panel and hold records.
- **Grids vs. Hierarchies**: Each object is either a flat Grid (list of records) or a Hierarchy/Tree (parent-child structure with multiple levels).
- **Traits** govern what an object can do. Key trait codes:
  - **GR** = Grid, **TR** = Tree
  - **RE** = Renamable (can be relabeled to match customer terminology)
  - **AE** = Auditable Entity (can be scoped into Assessments)
  - **AI** = Action Item (enhanced flexibility for relationships and state)
  - **SR** = State Required (has mandatory lifecycle states: Draft → In Use → Retired)
  - **SO** = State Optional (state workflow can be enabled but isn't required)
  - **VO** = Versioned Object (supports multiple versions of the same record)
- **Related Items**: Any object can be linked to almost any other object. Relationships are configured via Roles and managed on the Related Items tab.
- **My Organization**: A special program-level object accessible to end users for consolidated aggregates, global workflow, and published reports.
- **Application Object**: Similar to My Organization but admin-only. Supports Global Variables (properties whose values are accessible in expressions anywhere in the instance).

## Subject Area Objects

| Object | Structure | Traits | Purpose |
|--------|-----------|--------|---------|
| **Vendors** | Grid | GR, RE, SO | Vendor/third-party database. Core of TPRM/VRM. Hierarchical children: Services (Engagements), Contacts, Agreements (Terms), Facilities, Fourth Parties. Most child objects are renamable. |
| **Vendor Requests** | Grid | GR, RE, SO | Onboarding mechanism for LOB to request new vendors. Workflow typically creates Vendor records on approval. |
| **Issues** | Grid | GR, RE, AI, SO | Track and resolve concerns related to risk/compliance activities. |
| **Risks** | Tree | TR, RE, AE | Hierarchical risk register. Probability, impact, residual risk tied to Controls. |
| **Controls** | Tree | TR, RE, AE, SR, VO | Define, maintain, test, and evaluate internal and IT controls. Categorized by category/sub-category with test procedures. |
| **Assessments Types** | Grid | GR, SR | Configure assessment "types" that determine scope type, phases, findings templates, and default scope. |
| **Questionnaires** | Tree | TR, AE, SR | Build questionnaire templates: Questionnaires → Sections → Questions. Used for internal/external assessments. |
| **Incidents** | Grid | GR, RE, SO | Report, track, and resolve events related to governance requirements. |
| **Policies & Procedures** | Tree | TR, RE, SR, VO | Centralized policy repository with review/approval. Child objects for exceptions and violations. |
| **Regulations & Standards** | Tree | TR, RE, AE, SR, VO | Regulatory frameworks and control standards from external bodies or internal management. |
| **Certifications** | Grid | GR, SR | Issue and monitor scheduled/ad-hoc certification requests. |
| **Assets** | Grid | GR, RE, SO | Inventory of internal/external entities (apps, systems, facilities). Primarily for CSRM. |
| **Business Elements** | Tree | TR, RE, AE | Generic hierarchical inventory for risk evaluation of items not covered by other subject areas. |
| **Documents** | Tree | TR, SO, VO | Hierarchical document repository with version control. Files can be linked to any record with an Attachments tab. |
| **Document Requests** | Grid | GR, RE, AI, SR | Formal requests for documentation. Supports Bulk Document Upload. |
| **Financial Accounts** | Tree | TR, RE, AE | General ledger accounts for compliance support. |
| **Loss Events** | Grid | GR, RE, SO | Track events resulting in financial loss/gain. |
| **Metrics** | Grid | GR, RE, SR | Performance indicators (SLAs). Scheduled data capture with tolerance thresholds. |
| **Notices** | Grid | GR, RE, AI, SO | Bulletin-board postings and announcements. |
| **Organization** | Tree | TR, RE | Organizational structure (departments, groups, units). |
| **Processes** | Tree | TR, RE, AE | Document business processes and activities. |
| **Projects** | Grid | GR, RE, AI, SR | Corrective actions, BPM activities with assigned responsibility and dates. |
| **Reference Controls** | Tree | TR, RE, SR, VO | Repository of recommended controls that can be copied/modified. |
| **Services** | Tree | TR, SR | Product/service catalog for Offer Management (OM). |
| **Threats** | Grid | GR, RE, AI, SO | Catalog enterprise threats for periodic reviews. Primarily for CSRM. |
| **Work Items** | Grid | GR, RE, AI, SO | Generic task tracking for risk mitigation and compliance. |
| **Clients** | Grid | GR, SR | For Offer Management — institutions that use products/services. |
| **CUSTOM (up to 10)** | Grid | GR, RE, AI, SO | Add-on objects for extending implementations. Renamed and configured per customer. Can have custom children and link to any other object. |
| **VENDOR CUSTOM (up to 3)** | Vendor Tabs | RE, SO | Extend the Vendor subject area with configurable child objects. |

## Settings Objects

| Object | Structure | Purpose |
|--------|-----------|---------|
| **Reference Data** | Grid | Dynamic pick list values used across all objects. Supports cascading pick lists. |
| **Holidays** | Grid | Named holidays for business day calculations. |
| **People (Individuals)** | Grid (SR) | User repository. Populates user pick lists throughout the platform. |
| **Roles** | Grid | Permission-based constructs for application security and access levels. |
| **Teams** | Grid | Named collections of people used for permission-based features. |

## Reporting Objects

| Object | Structure | Purpose |
|--------|-----------|---------|
| **Report Task Groups** | Tree | Hierarchical task areas for publishing reports and dashboards. |
| **Report Categories** | Tree | Categories for organizing Custom Reports. |

## Standard Tabs on Every Object

Every record has these tabs (some may be hidden by role):

1. **Details Tab** — Properties that define the record, plus workflow buttons
2. **Attachments Tab** — File attachments, URL links, Document Repository links
3. **Related Items Tab** — Manage relationships to other records
4. **Approval Tab** — Review and approval processing (only on subject areas with review patterns)
5. **Change Log Tab** — Audit trail of property value changes (requires Track Changes enabled)
6. **Access Tab** — Admin-only; restrict record access to specific teams

## Standard Properties on Every Object

These exist on all objects automatically:

- **[Name]** — Primary identifier
- **[Description]** — Record description
- **[External ID]** — For external integration (hidden by default, renamable per object)
- **[Search Keywords]** — Included in global search; can be auto-populated via Auto Update Rules
- **[Item Last Modified]** — Datetime tracking (hidden by default); only updated for standard property changes

## Key Relationships

- Vendors → Services (Engagements) → Contacts, Agreements, Facilities, Fourth Parties
- Risks ↔ Controls (bidirectional for residual risk calculation)
- Any Subject Area → Assessments (via Auditable Entity trait)
- Any object → Any other object (via Related Items, configured through Roles)
- Custom Reports → Dashboards (reports with charts can be added to dashboards)
