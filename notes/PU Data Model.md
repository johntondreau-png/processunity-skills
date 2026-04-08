---
tags:
  - processunity
  - data-model
  - platform
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Config Designer]]"
  - "[[PU Report Builder]]"
---

# PU Data Model

> The foundational skill — understand what objects exist in ProcessUnity and how they relate. The other PU skills reference this for platform knowledge.

## When to Use

Consult this when you need to:
- Understand what objects exist and their capabilities
- Know what property types are available and when to use each
- Understand how reports and dashboards work
- Validate whether a proposed configuration is feasible

## Reference Files

Read the appropriate reference based on what you need:

- **[[PU Ref - Objects]]** — Complete object catalog (Subject Areas, Settings, Reporting objects), traits (Grid/Tree, Renamable, Stateful), standard tabs, standard properties, and key relationships. Read when deciding WHICH object(s) to configure.
- **[[PU Ref - Property Types]]** — All property types (basic, advanced, calculated, aggregate, Reference Data, cascading pick lists), config options, and best practices. Read when deciding WHAT properties to add.
- **[[PU Ref - Reports and Dashboards]]** — Custom reports (levels, columns, groups, filters, sorts, charts, transpose), dashboards, column attributes, report options, and publishing. Read when designing reports or dashboards.
- **[[PU Ref - Exchange Intelligence]]** — GRX intelligence data: Risk Index methodology, Risk Monitoring & Alerting (Recorded Future), Findings methodology, Risk Navigator, and Advanced Reporting.

## Key Platform Concepts

ProcessUnity uses a **semantic, object-oriented data model** — not traditional SQL tables. All data lives in unified internal tables (`ObjectType`, `ObjectInstance`, `CustomProperty`, `PropertyInstanceValue`). This means:

1. Schema changes (adding properties, enabling objects) happen **live without downtime**
2. The **only way to query data** in a flat/relational format is through Custom Reports
3. Any object can be related to almost any other object via **Related Items**
4. **Property IDs** (not names) are used in expressions, so renaming properties never breaks formulas

**Navigation structure**: The PU UI has main tabs — WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP. Configuration happens primarily in SETTINGS (for properties, reference data, roles, teams) and REPORTS (for custom reports and dashboards).

## Sandbox Object Inventory

The sandbox instance has **52 object types** with **1,500+ custom properties**. The most data-rich:

| Object | Custom Props | Key Sections |
|--------|-------------|-------------|
| Third Party | 321 | Risk Index, Inherent/Residual Risk, Recorded Future (15+), RiskRecon, BitSight (20+) |
| Third-Party Request | 187 | Request workflow, Risk Profile, Service IRQ, Data Security, Risk Domains (21) |
| Engagement Intake | 141 | Initial engagement capture |
| Third-Party Engagement | 135 | Service Record, Risk Profile, Location, Data Security (24) |
| My Organization | 131 | Internal org profile |
| Relationship | 79 | Entity info, Hierarchy (42), Sub-Contractor |
| Issue | 74 | Core fields, Risk Scoring, Key Dates (18), AI Issue Analysis (2) |
| GRX Finding | 51 | Finding details, Control info, Question data, GRX Metrics |
| Threat | 24 | Threat fields, CVE fields, Watch List Rule |

The instance has **338 Custom Reports** including integration reports, NIST AI RCF response reports, SLA reports, and agent-ready `skillz_` reports.

## Configuration Approach

When designing a configuration:

1. **Start with the object model** — which Subject Areas will hold the data?
2. **Design properties** on each object — what fields define a record?
3. **Set up Reference Data** for shared/dynamic pick lists
4. **Build relationships** between objects via Related Items
5. **Create Custom Reports** to surface data
6. **Build Dashboards** from report charts
7. **Configure workflow** (buttons, automated actions, notifications)

---

*See also: [[PU Config Designer]] for turning requirements into configuration plans, [[PU Report Builder]] for building reports on this data model.*
