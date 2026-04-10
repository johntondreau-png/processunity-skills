---
name: processunity-app-guide
description: >
  Comprehensive ProcessUnity platform reference — the single source of truth for PU application knowledge.
  Covers: data model (objects, relationships, traits), administration (users, roles, teams, permissions),
  properties (all types, calculated, aggregate, pick lists, cascading, auto-update rules), expressions
  (function library, operators, formatting), workflow (notifications, review patterns), assessments
  (questionnaires, scoping, portal), reports/dashboards (columns, filters, charting, design patterns,
  relationship joins), integrations (connectors, web services, import/export, SSO), solutions (VRM,
  issues, certs, contracts), regulation configuration (regulation trees, SCF crosswalks, naming
  conventions), and best practices. Use whenever the user asks about ProcessUnity — objects, properties,
  expressions, reports, workflow, assessments, connectors, data model, regulation setup, or any PU how-to.
  Also trigger on: Review Patterns, Automated Actions, Detail Buttons, Grids, Reference Data, Vendor Portal,
  Broadcast Messaging, Subject Areas, Custom Reports, chart types, relationship joins, multi-level reports.
---

# ProcessUnity Application Guide

This skill provides condensed, actionable guidance for configuring and using the ProcessUnity GRC platform. It covers both administrator configuration and end-user workflows.

## Platform Overview

ProcessUnity is a SaaS GRC platform hosted on Microsoft Azure. The application is built on a flexible Entity-Attribute-Value (EAV) data model where:

- **Subject Areas** (Object Types) are the building blocks — configurable containers for records (e.g., Vendors, Assessments, Issues, Controls)
- **Properties** are fields/attributes configured per subject area — basic types (text, number, date, pick list), calculated, aggregate, relationship, and more
- **Relationships** link records across subject areas (e.g., Vendor → Assessment → Issue)
- **Roles** control UI entitlement and data permissions; **Teams** control horizontal data access restrictions
- **Expressions** power calculations, conditional logic, validation, notifications, coloring, and filtering — syntax is Excel-like
- **Custom Reports** present data with configurable columns, filters, charting, and access control
- **Workflow** combines built-in state machines (action items) with admin-configured auto-update rules, notifications, and conditional properties

### Key Navigation Paths

| Area | Path |
|------|------|
| Properties | Settings → General → Properties |
| Roles | Settings → People & Permissions → Roles |
| Teams | Settings → People & Permissions → Teams |
| People (Users) | Settings → People & Permissions → People |
| Notification Rules | Settings → Notifications & Workflow → Notification Rules |
| Application Settings | Settings → General → Application Settings |
| Import Templates | Settings → General → Import Templates |
| Reference Data | Settings → General → Reference Data |
| Custom Reports | Reports → Administration → Custom Reports |

## Reference File Dispatch

When a question falls into one of these domains, **read the corresponding reference file** before answering. Each file is a condensed, actionable guide derived from the full ProcessUnity help system.

| Domain | Reference File | When to Read |
|--------|---------------|--------------|
| Users, roles, teams, permissions, branding, app settings | `references/administration.md` | User account management, role/team setup, permissions, security, password policy, branding, lockout, broadcast messaging, archives |
| Property types, configuration, rules, access control | `references/properties.md` | Adding/editing properties, property types, calculated/aggregate, pick lists, cascading, auto-update rules, validation, view/edit access, section headers, display/layout, property history |
| Expression functions, operators, formatting | `references/expressions.md` | Writing expressions, function syntax/examples, operators, date/time formatting, data formatting, tips |
| Workflow, notifications, action items, review patterns | `references/workflow.md` | Built-in workflow (issues, doc requests, projects, etc.), custom workflow, notification rules, auto-update rules, response dialog, review patterns, version control |
| Assessments, questionnaires, portal | `references/assessments.md` | Questionnaire templates, questions, scoping, bulk assessments, assessment lifecycle, portal/vendor access, follow-up |
| Custom reports, dashboards, charting | `references/reports.md` | Report creation, columns, filters, calculated columns, conditional coloring, charting, dashboards, historical tracking, automated reports, report access/publishing |
| Connectors, web services, import/export, SSO | `references/integrations.md` | Import templates, data import/export, connectors (BitSight, Excel, Word, etc.), web services API, SSO, external components, automated actions |
| VRM, issue mgmt, certs, contracts, subject areas | `references/solutions.md` | Vendor management, vendor portal, issue/incident tracking, certifications, contract management, PPM, subject area inventory, custom subject areas |
| Configuration best practices and tips | `references/best-practices.md` | Performance tuning, property design, expression tips, workflow design, report optimization, notification best practices, TPRM program design |
| Object catalog, traits, relationships | `references/objects.md` | Complete object catalog (52+ types), traits (Grid/Tree, Renamable, Stateful), standard properties, named relationships, aggregate types |
| Regulation trees, SCF crosswalks, naming | `references/regulation-configuration.md` | Regulation → Category → Subcategory → Provision hierarchy, object schemas, SystemID conventions, SCF crosswalk mechanics, supported frameworks, questionnaire structure |
| Report design, charts, relationship joins | `references/report-builder.md` | Multi-level report joins, relationship patterns, chart types (14), color control, design patterns, report pipeline pattern, column styling |

## How to Use This Skill

1. **Identify the domain** from the user's question
2. **Read the relevant reference file(s)** — many questions span 2 domains (e.g., "how do I set up a calculated property that sends a notification" → properties + workflow)
3. **Answer with specific navigation paths, configuration steps, and gotchas** from the reference content
4. For browser automation (actually clicking through the PU UI), use the `pu-admin-navigator` skill

## Key Platform Concepts (Quick Reference)

**Semantic Data Model**: PU uses an EAV model — all data lives in unified internal tables (ObjectType, ObjectInstance, CustomProperty, PropertyInstanceValue). Schema changes happen live without downtime. Custom Reports are the ONLY way to query data in a flat/relational format. Property IDs (not names) are used in expressions, so renaming never breaks formulas.

**Grids vs. Hierarchies**: Objects are either flat grids (add via + button) or tree hierarchies (add via + or row-level ellipsis, specifying parent placement). Right-click support exists for hierarchical objects.

**Standard vs. Custom Properties**: Standard (locked, icon 🔒) cannot be deleted but can be hidden/renamed. Custom properties are fully configurable. Platform limits apply to custom property counts.

**Global Expression Variables**: Application-level properties marked as "Global Expression Variable" become available on the Globals tab in any Expression dialog — useful for system-wide thresholds, fiscal dates, etc.

**Item Ownership**: Properties with "Participates in Ownership" = Yes define who owns a record. Owner View/Owner Edit role permissions restrict access to owned items only.

**Nightly Processing**: Several features rely on nightly batch jobs — auto-deactivation of users, Nightly If True auto-update rules, calculated properties depending on dates (TODAY()/NOW()), property history snapshots.

**Instance Types**: Production, Sandbox (for testing config changes via Check-Out/Check-In), and Archive (read-only snapshots).

**Multi-Language Translation**: When enabled, a Translate tab appears on configurable items for managing translations.
