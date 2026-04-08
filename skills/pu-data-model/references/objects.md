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

### Relationships and Multi-Level Reports

**Critical rule**: Multi-level reports can ONLY join two objects that have an **existing relationship** configured between them. If no relationship exists in the data model, a multi-level report across those objects will return zero rows.

Each relationship has a **name** (e.g., "Fourth Parties (Vendor Fourth Party)", "Assessments (Assessment Scope)", "Vendor Services (Child)"). When building a multi-level report, you select the relationship name — not just the object type. The same pair of objects can have **multiple distinct relationships** (e.g., Agreement → Legal Entity via "Legal Entities Making Use of This Agreement" vs "LEI of the entity providing ICT services").

**Common multi-level report joins in practice:**

| Level 1 | Level 2 | Relationship Name Pattern | Use Case |
|---------|---------|--------------------------|----------|
| Vendor | Vendor Service | Vendor Services (Child) | Service portfolio per vendor |
| Vendor | Assessment | Assessments (Assessment Scope) | Assessment history per vendor |
| Vendor | Fourth Party | Fourth Parties (Vendor Fourth Party) | Subcontractor chain |
| Vendor | Individual | Individuals (Vendor) | Contacts per vendor |
| Vendor | Issue | Issues (Issue) | Issues per vendor |
| Vendor | Metric | Metrics (Related Metric) | KPIs per vendor |
| Vendor | Legal Entity | Legal Entities (Legal Entity) | Entity hierarchy |
| Agreement | Legal Entity | Legal Entities (Legal Entity) | Entities on a contract |
| Agreement | Vendor Service | DORA Linked Service(s) | Services under agreement |
| Issue | Assessment | Assessments (Issue) | Assessment context for issues |
| Issue | Vendor | Vendors (Issue) | Vendor context for issues |
| Assessment | Vendor | Vendors (Assessment Scope) | Vendor being assessed |
| Assessment | Vendor Service | Related Vendor Service | Service being assessed |
| Questionnaire Question | Questionnaire Response | Questionnaire Responses (...) | Response data per question |
| Vendor Service | Service Add On | Service Add Ons (Related...) | Service detail breakdown |
| Vendor Service | Fourth Party | Fourth Parties (Vendor Fourth Party) | Fourth parties per service |
| Role | Individual | Individuals (Person Assigned to Role) | People in a role |
| Team | Individual | Individuals (Person Assigned to Team) | People on a team |

**3+ level reports** are possible (up to 4 levels) — each level adds another hop through a relationship. Example: Agreement → Vendor Service → Service Add On → Fourth Party.

## Aggregate Property Types

Aggregate properties pull summarized data from related records. PU uses numeric codes internally:

| Code | Name | Returns | Description |
|------|------|---------|-------------|
| 1 | **Count** | Number | Count of related records matching a filter. AggregateProperty is typically `Id`. |
| 2 | **Sum** | Number | Sum of a numeric property across related records. |
| 3 | **Average** | Number | Average of a numeric property across related records. |
| 4 | **Min / First** | Text or Number | Minimum or first value from related records. |
| 5 | **Lookup** | Text | Reads a single property value from a parent/related record. Most common type — denormalizes a field from a related object. |
| 6 | **List** | Text | Concatenates a property from ALL related records into a delimited list. |
| 7 | **Max / Last** | Text, Number, or Date | Maximum or most recent value from related records. Supports complex filter expressions. |

**Aggregate configuration fields:**
- **AggregateItemType** — The relationship to aggregate through (e.g., "Vendors (Assessment Scope)", "Vendor Services (Child)")
- **AggregateProperty** — The property to read/count/sum from the related object
- **AggregateFilterProperty** / **AggregateFilterValue** — Optional filter expression to limit which related records are included
- **AggregateDateProperty** — For periodic snapshot tracking (weekly/monthly)
- **AggregateObjectType** — The target object type being aggregated

**Common aggregate patterns:**
- **Count with filter**: `Count of Issues where [State] = "Open"` on Vendor
- **Lookup (denormalize)**: `Vendor Name from Vendors (Assessment Scope)` on Assessment
- **List (concatenate)**: `All Fourth Party Names from Fourth Parties (Vendor Fourth Party)` on Vendor
- **Last with filter**: `Last Completed Assessment Date from Assessments where [Completion Date] != ""` on Vendor
- **Sum**: `Total Scored Questions from Questionnaire Sections (Child)` on Questionnaire

## Platform License Limits (Typical)

These limits govern what can be configured per instance. Actual values vary by license tier.

| Limit | Typical Value | Notes |
|-------|--------------|-------|
| Max Active Users | 15-500+ | Per license tier |
| Max Active Vendor Records | 1,000-50,000+ | Per license tier |
| Max Custom Properties | 1,000 | Global across all objects |
| Max Custom Properties Per Object | 400 | Hard ceiling per object type |
| Max Calculated Properties Per Object | 150 | Text/Number/Date - Calculated |
| Max Aggregated Properties Per Object | 50 | Aggregate fields are expensive |
| Max Track Changes Per Object | 50 | Audit trail fields |
| Max Import Rows | 20,000 | Per import API call |
| Max Import/Upload File Size | 20 MB | Per import or attachment |
| Max Report Rows | 500,000 | Backend limit |
| Max Report Cells Onscreen | 20,000 | Browser rendering limit |
| Max Calculated Report Columns | 20 per type | 20 Text + 20 Number + 20 Date per report |
| Max Export Size | ~50 MB | CSV/Excel export |
| Web Service Rate Limit | 360 / 3,600 sec | 6 requests/minute for API |
| Custom Report Cache | 5 days | Reports are cached, not real-time |
| Max Notifications Per Object | 20 | Email/workflow notifications |
| Max Notifications Per Instance | 200 | Total across all objects |
| Max Automated Actions | 200 total, 20/object | Workflow automations |

## Solution Fingerprints (System Settings)

Which features are enabled tells you what "solution" an instance is running. Key feature flags:

| Feature Flag | VRM | CSRM | DORA | GRC |
|-------------|-----|------|------|-----|
| Vendors | Yes | Yes | Yes | — |
| Vendor Services | Yes | — | Yes | — |
| Vendor Requests | Yes | — | Yes | — |
| Assessments | Yes | Yes | Yes | Yes |
| Questionnaires | Yes | Yes | Yes | Yes |
| Issues | Yes | Yes | Yes | Yes |
| Agreements | — | — | Yes | — |
| Fourth Parties | — | — | Yes | — |
| Facilities | — | — | Yes | — |
| Legal Entity (Custom Object) | — | — | Yes | — |
| CIF (Custom Object) | — | — | Yes | — |
| Risks | — | — | — | Yes |
| Controls | — | — | — | Yes |
| Assets | — | Yes | — | — |
| Threats | — | Yes | — | — |
| Incidents | — | Yes | — | — |
| Policies & Procedures | — | — | — | Yes |
| Regulations & Standards | — | — | — | Yes |
| GRX Connector | Yes | — | — | — |
| BitSight Connector | Yes | — | — | — |
| RiskRecon Connector | Yes | — | — | — |

This is useful for scoping configuration work — check system settings first to understand what solution modules are active before designing properties or reports.
