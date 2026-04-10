---
tags:
  - processunity
  - app-guide
  - help-system
  - configuration
created: 2026-04-10
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
  - "[[PU Admin Navigator]]"
  - "[[PU Config Designer]]"
  - "[[PU Report Builder]]"
---

# PU App Guide

> Comprehensive guide to the ProcessUnity application layer — derived from the full PU help system. Covers administration, properties, expressions, workflow, assessments, reports, integrations, solutions, and best practices. This is the "how to use PU" companion to [[PU Data Model]]'s "how PU works underneath."

## When to Use

Consult this when you need to:
- Configure users, roles, teams, or permissions
- Understand property types and their configuration options
- Write expressions (PU's Excel-like formula engine)
- Set up workflow, notifications, auto-update rules, or review patterns
- Configure assessments, questionnaires, or the vendor portal
- Build custom reports, dashboards, or charts
- Set up connectors, import/export, SSO, or web services API
- Understand VRM lifecycle, issue tracking, certifications, or contracts
- Follow best practices for performance and configuration

## Reference Files

Read the appropriate reference based on what you need:

| Domain | Reference | Coverage |
|--------|-----------|----------|
| **[[PU Ref - App Administration]]** | Users, roles, teams, permissions, branding, app settings, instance types |
| **[[PU Ref - App Properties]]** | 15 property types, calculated/aggregate, pick lists, cascading, auto-update rules, validation |
| **[[PU Ref - App Expressions]]** | 50+ functions, operators, date/data formatting, 8 common patterns |
| **[[PU Ref - App Workflow]]** | Built-in state machines, custom workflow, notifications, review patterns, version control |
| **[[PU Ref - App Assessments]]** | Questionnaire templates, scoring, assessment lifecycle, bulk ops, vendor portal |
| **[[PU Ref - App Reports]]** | Custom reports, columns, filters, charting, dashboards, caching, history |
| **[[PU Ref - App Integrations]]** | Import/export, connectors (BitSight, D&B, Excel, Word), web services API, SSO |
| **[[PU Ref - App Solutions]]** | 20+ object types, VRM lifecycle, issue tracking, certifications, contracts, custom subject areas |
| **[[PU Ref - App Best Practices]]** | 61 recommendations across performance, properties, reports, workflow, TPRM |

## Relationship to Existing Skills

This skill provides **application-layer** knowledge from the PU help system. It complements:
- [[PU Data Model]] — the underlying EAV schema and semantic model
- [[PU Admin Navigator]] — browser automation for executing configuration changes
- [[PU Config Designer]] — translating requirements into configuration plans
- [[PU Report Builder]] — report design patterns and dashboard publishing

## Key Platform Concepts

- **Grids vs. Hierarchies**: Objects are either flat grids or tree hierarchies with parent-child placement
- **Standard vs. Custom Properties**: Standard (locked) can be hidden/renamed but not deleted; custom are fully configurable
- **Global Expression Variables**: App-level properties marked as global become available in any Expression dialog
- **Nightly Processing**: Auto-deactivation, nightly auto-update rules, date-dependent calculations, history snapshots
- **Instance Types**: Production, Sandbox (Check-Out/Check-In testing), Archive (read-only snapshots)

*See also: [[PU Data Model]], [[PU Admin Navigator]], [[PU Config Designer]], [[PU Report Builder]]*
