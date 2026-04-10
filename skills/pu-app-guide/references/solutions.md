# Solutions & Subject Areas Reference

## Table of Contents
1. [Subject Areas Overview](#subject-areas-overview)
2. [Vendor Risk Management (VRM)](#vendor-risk-management)
3. [Vendor Portal](#vendor-portal)
4. [Issue & Incident Management](#issue-and-incident-management)
5. [Certifications](#certifications)
6. [Contract Management](#contract-management)
7. [Policy & Procedure Management (PPM)](#policy-and-procedure-management)
8. [Offer Management](#offer-management)
9. [Other Subject Areas](#other-subject-areas)
10. [Custom Subject Areas](#custom-subject-areas)

---

## Subject Areas Overview

Subject areas are the building blocks of ProcessUnity solutions — configurable object types that hold records and support workflow, properties, relationships, and reporting.

### Key Concepts
- Subject areas are enabled per-instance based on subscription
- Must be enabled by a ProcessUnity System Administrator before use
- Access controlled per-role via Visible Task Areas and Permissions
- Each subject area supports custom properties, notifications, workflow, reports
- Objects are either **Grids** (flat lists) or **Hierarchies** (tree structures)
- Terms "Subject Area" and "Object" are used interchangeably

### Risk Suite Subject Areas
Core subject areas for GRC solutions:

| Subject Area | Description | Grid/Hierarchy |
|-------------|-------------|:--------------:|
| **Vendors (Third Parties)** | Vendor/supplier records with risk profiles, contacts, services | Grid |
| **Vendor Services** | Services provided by vendors | Hierarchy (under Vendor) |
| **Assessments** | Point-in-time evaluations (see assessments reference) | Hierarchy |
| **Issues** | Concerns/problems with tracking and resolution workflow | Grid |
| **Incidents** | Events violating policies/regulations | Grid |
| **Controls** | Control objectives, activities, test procedures | Hierarchy (versioned) |
| **Risks** | Risk register entries | Hierarchy |
| **Business Elements** | Organizational units, processes, functions | Hierarchy |
| **Documents / Managed Documents** | Document management with version control | Hierarchy (versioned) |
| **Regulations & Standards** | Regulatory requirements and provisions | Hierarchy (versioned) |
| **Financial Accounts** | Financial account structures | Hierarchy |
| **Reference Data** | Dynamic pick list values | Grid |
| **Projects** | Formal activities with dates, deliverables, status | Grid |
| **Work Items** | Informal task tracking | Grid |
| **Document Requests** | Document fulfillment workflow | Grid |
| **Notices** | Posted information with dialog | Grid |
| **Clients** | Client/customer records | Grid |
| **Individuals (People)** | User accounts and contacts | Grid |
| **Certifications** | Compliance attestation tracking | Grid |
| **Metrics** | KPI tracking with version control | Hierarchy (versioned) |

### My Organization
Special object (Workspace/Home) providing: consolidated program-level aggregates, workflow buttons/automated actions, custom report publication to MyOrg Reports tab, MS Word Template generation, optional BitSight self-screening. Similar to Application object but accessible by end-users (vs. admin-only Application).

---

## Vendor Risk Management

### Vendor Lifecycle
1. **Add Vendors**: manually, via import, or via Vendor Request workflow
2. **Define Properties**: risk profile, contacts, services, categories, ownership
3. **Assess**: send questionnaires, conduct assessments, review responses
4. **Monitor**: track issues, incidents, certifications, ongoing risk indicators
5. **Report**: custom reports, dashboards, trend analysis

### Vendor Contacts
Each vendor has contacts (Individual records related to the vendor). The **Primary Contact** receives questionnaires and portal notifications.

### Vendor Request Workflow
Optional process for business users to request new vendors. Goes through approval before vendor is created in the system.

### Fourth Party Management
Track vendor's sub-contractors and their risk impact. Fourth Parties are related to Vendors via relationship properties.

---

## Vendor Portal

External-facing portal for vendor contacts to complete questionnaires, submit documents, and collaborate.

### Portal URL
Typically: `https://app.processunity.net/instance/portal/`

### Configuring Portal Access
1. **Create Portal Role**: Settings → People & Permissions → Roles → New, select **Portal** type, check **Portal User** permission
2. **Create Vendor Contact accounts**: Individual records with email, assigned to Portal role, activated
3. **Send credentials**: activate account → send initial password
4. **Configure Portal permissions**: questionnaire response, document requests, optionally report viewing

### Portal User Experience
- **Active Questionnaire** task: view and complete assigned questionnaires
- **Document Requests**: view and fulfill document requests
- **Reports** (if configured): view published reports
- **Response Dialog**: communicate with internal users on questionnaire questions
- **Delegation**: assign questions to other vendor contacts
- **Import/Export**: download questionnaire to Excel, complete offline, re-import

### Portal Customization
- Application branding applies to portal login page
- Broadcast messaging supports separate portal messages
- Custom properties on portal-facing objects
- Invalid questionnaire login message configurable in Application Settings

---

## Issue and Incident Management

### Issues
Path: **Workspace → Issues** (or via subject area navigation)

Built-in workflow: Open → Closed (with reopen option). Key attributes: Originator, Owner, Due Date, Severity, Description, Dialog.

Use cases: vendor risk findings, control deficiencies, audit observations, compliance gaps.

### Incidents
Similar to Issues but focused on events that violate policies/regulations. Built-in workflow: Open → Closed (with reopen).

Key difference: Incidents document events that have occurred; Issues document concerns or potential problems.

### Common Features
Both support: response dialog, notifications, related items (link to vendors, controls, assessments), custom properties, custom workflow extensions.

---

## Certifications

Track compliance attestations and certification responses.

### Key Features
- Create certification templates with conditions/requirements
- Send certification requests to individuals
- Track responses (attestations)
- Monitor compliance status
- Report on certification completion rates

### Permissions
**Respond** permission (per role) controls who can respond to certification requests.

---

## Contract Management

### Vendor Contract Management
Track agreements between organization and vendors. Subject area: **Agreements** (or **Contracts** depending on configuration).

Key properties: contract name, type, start/end dates, value, status, related vendor, related services.

Supports: version tracking, renewal management, custom workflow for approval.

---

## Policy and Procedure Management

### PPM Subject Area
Manage organizational policies and procedures with full version control.

Features:
- Hierarchical organization (policy → procedure → sub-procedure)
- Version control (Draft → In Review → In Use → Retired)
- Review and Approval patterns
- Publication and attestation
- Link to controls, regulations, business elements

---

## Offer Management

### Purpose
Manage product/service offerings, client inventories, and service variations. Used by organizations that need to track what services they offer to which clients and how those services are mapped to vendor capabilities.

### Key Objects
- **Services**: service definitions and variations
- **Client Inventories**: client-specific service configurations
- **Mapping**: service variation ↔ client inventory mapping with history tracking
- **Background Processing**: automated mapping and reconciliation

### Health Ratings
Service Variation health ratings use configurable scales (Settings → Application Settings → Service Variation Health Rating).

---

## Other Subject Areas

| Subject Area | Purpose |
|-------------|---------|
| **Reference Controls** | Library of standard control frameworks (versioned) |
| **Test Procedures** | Procedures for testing control effectiveness |
| **Losses** | Financial loss tracking |
| **Processes** | Business process documentation |
| **Beneficial Owners** | Ultimate beneficial ownership tracking |
| **Findings** | Assessment findings and recommendations |

---

## Custom Subject Areas

Up to 10 custom subject areas can be added per instance. These are add-on features enabled and named by ProcessUnity.

Once configured, a custom subject area supports:
- Custom properties
- Relationships to other subject areas
- Custom reports
- Notifications and workflow
- Import/export

Use cases: parallel programs, custom tracking needs, industry-specific requirements that don't fit existing subject areas.

Custom subject areas can be linked to many other areas in the system, providing maximum flexibility for unique implementation requirements.
