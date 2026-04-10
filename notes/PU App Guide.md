---
tags:
  - processunity
  - app-guide
  - help-system
  - configuration
  - data-model
  - reports
created: 2026-04-10
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Admin Navigator]]"
  - "[[PU Config Designer]]"
  - "[[PU Configuration]]"
---

# PU App Guide

> The comprehensive ProcessUnity platform reference — the single source of truth for PU application knowledge. Consolidates the former PU Data Model and PU Report Builder skills alongside 9 help-system reference guides covering administration, properties, expressions, workflow, assessments, reports, integrations, solutions, and best practices.

## When to Use

Consult this when you need to:
- Understand what objects exist and how they relate (data model)
- Configure users, roles, teams, or permissions
- Understand property types and their configuration options
- Write expressions (PU's Excel-like formula engine)
- Set up workflow, notifications, auto-update rules, or review patterns
- Configure assessments, questionnaires, or the vendor portal
- Design reports, charts, dashboards, or multi-level relationship joins
- Set up connectors, import/export, SSO, or web services API
- Understand VRM lifecycle, issue tracking, certifications, or contracts
- Follow best practices for performance and configuration

## Reference Files

Read the appropriate reference based on what you need:

### Platform & Data Model
| Domain | Reference |
|--------|-----------|
| **[[PU Ref - Objects]]** | Complete object catalog (52+ types), traits, standard properties, named relationships |
| **[[PU Ref - App Solutions]]** | 20+ configurable object types, VRM lifecycle, issue tracking, certifications, contracts |
| **[[PU Ref - Exchange Intelligence]]** | GRX risk data: Risk Index, Findings, Recorded Future alerts |

### Configuration & Design
| Domain | Reference |
|--------|-----------|
| **[[PU Ref - App Properties]]** | 15 property types, calculated/aggregate, pick lists, cascading, auto-update rules, validation |
| **[[PU Ref - App Expressions]]** | 50+ functions, operators, date/data formatting, 8 common patterns |
| **[[PU Ref - App Administration]]** | Users, roles, teams, permissions, branding, app settings, instance types |
| **[[PU Ref - App Workflow]]** | Built-in state machines, custom workflow, notifications, review patterns, version control |
| **Regulation Configuration** | Regulation tree schemas, SCF crosswalks, naming conventions, supported frameworks |

### Reports & Dashboards
| Domain | Reference |
|--------|-----------|
| **[[PU Ref - App Reports]]** | Custom reports, columns, filters, charting, dashboards, caching, history |
| **Report Builder** | Multi-level joins, relationship patterns, 14 chart types, design patterns, report pipelines |

### Assessments & Integrations
| Domain | Reference |
|--------|-----------|
| **[[PU Ref - App Assessments]]** | Questionnaire templates, scoring, assessment lifecycle, bulk ops, vendor portal |
| **[[PU Ref - App Integrations]]** | Import/export, connectors (BitSight, D&B, Excel, Word), web services API, SSO |
| **[[PU Ref - App Best Practices]]** | 61 recommendations across performance, properties, reports, workflow, TPRM |

## Key Platform Concepts

- **Semantic Data Model**: EAV architecture — all data in unified tables. Schema changes happen live. Custom Reports are the ONLY way to query data flat. Property IDs (not names) used in expressions.
- **Grids vs. Hierarchies**: Objects are either flat grids or tree hierarchies with parent-child placement
- **Standard vs. Custom Properties**: Standard (locked) can be hidden/renamed but not deleted; custom are fully configurable
- **Global Expression Variables**: App-level properties marked as global become available in any Expression dialog
- **Nightly Processing**: Auto-deactivation, nightly auto-update rules, date-dependent calculations, history snapshots
- **Instance Types**: Production, Sandbox (Check-Out/Check-In testing), Archive (read-only snapshots)

*See also: [[PU Admin Navigator]] for browser automation, [[PU Config Designer]] for requirement mapping, [[PU Configuration]] for regulation tree schemas*
