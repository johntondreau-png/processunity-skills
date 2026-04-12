---
tags:
  - processunity
  - moc
  - tprm
created: 2026-04-07
---

# ProcessUnity — Map of Content

This is your entry point for all ProcessUnity platform knowledge. Start with **App Guide** for platform reference, then branch into the action skills based on what you need to do.

## Skills

### Platform Reference
| Skill | What It Does |
|-------|-------------|
| [[PU App Guide]] | **Single source of truth** — objects, properties, expressions, reports, workflow, assessments, integrations, solutions, best practices (12 reference files) |

### Configuration & Design
| Skill | What It Does |
|-------|-------------|
| [[PU Config Designer]] | Translate requirements into a configuration plan |
| [[PU Configuration]] | Define regulation trees, questions, threats, reference data, and SCF crosswalks |
| [[PU Admin Navigator]] | Execute configuration changes in the admin UI via browser automation |

### Data Pipeline
| Skill | What It Does |
|-------|-------------|
| [[PU Import]] | Bulk create/update records in any PU object via the Import API |
| [[PU Enrich]] | Enrich vendor data from 9 external API sources (sanctions, cyber, ESG, financial) |
| [[PU Agentic Pipeline]] | Build AI-powered read → reason → write-back workflows |

### Instance Management
| Skill | What It Does |
|-------|-------------|
| [[PU Environment Setup]] | Connect a new PU instance — roles, service accounts, MCP config, report scaffolding |
| [[PU Instance Analyzer]] | Analyze an instance — fingerprint, connector inventory, gap analysis, data health |
| [[PU Scaffold Reports]] | Auto-create one report per object type for full MCP read access |

### Regulatory Uplift
| Skill | What It Does |
|-------|-------------|
| [[PU Uplift Designer]] | **NEW** — Generate automation manifests from STAR docs for any regulatory framework |
| [[PU DORA]] | DORA compliance data package — 194 properties, 39 reports, 9 buttons, 643 reference data records |

### Specialized
| Skill | What It Does |
|-------|-------------|
| [[PU Word Templates]] | Build VBA-enabled Word templates with SVG visualizations for Word Connector reports |

## Learning Path

1. **[[PU Environment Setup]]** — connect a new instance (roles, credentials, MCP, reports)
2. **[[PU App Guide]]** — the platform reference: objects, properties, expressions, reports, workflow
3. **[[PU Config Designer]]** — learn how requirements map to PU configuration
4. **[[PU Configuration]]** — regulation tree schemas, naming conventions, SCF crosswalk details
5. **[[PU Instance Analyzer]]** — analyze what's already configured before making changes
6. **[[PU Admin Navigator]]** — the mechanics of actually making changes in the UI
7. **[[PU Import]]** — push data into PU programmatically via the Import API
8. **[[PU Enrich]]** — pull external intelligence and push it back into PU
9. **[[PU Agentic Pipeline]]** — the advanced pattern for AI-driven workflows
10. **[[PU Uplift Designer]]** — generate manifests from STAR docs for any regulatory framework
11. **[[PU DORA]]** — full DORA implementation (the reference implementation for uplift automation)

## Key Concepts

ProcessUnity uses a **semantic, object-oriented data model** — not SQL tables. All data lives in unified internal tables (ObjectType, ObjectInstance, CustomProperty, PropertyInstanceValue). This means schema changes happen live without downtime, and **Custom Reports are the only way to query data in a flat/relational format**.

The UI is organized around main tabs: **WORKSPACE**, **ASSESSMENTS**, **REPORTS**, **SETTINGS**, **HELP**. Configuration happens in SETTINGS (properties, reference data, roles) and REPORTS (custom reports, dashboards).

## Reference Documents

### App Guide References (12 files)

The [[PU App Guide]] skill is the single reference dispatcher:

**From PU help system:**
- [[PU Ref - App Administration]] — Users, roles, teams, permissions, branding, security, instance types
- [[PU Ref - App Properties]] — 15 property types, calculated/aggregate, pick lists, auto-update rules
- [[PU Ref - App Expressions]] — 50+ functions, operators, formatting, common patterns
- [[PU Ref - App Workflow]] — State machines, notifications, review patterns, version control
- [[PU Ref - App Assessments]] — Questionnaire templates, scoring, lifecycle, vendor portal
- [[PU Ref - App Reports]] — Reports, columns, filters, charting, dashboards, caching
- [[PU Ref - App Integrations]] — Import/export, connectors, web services API, SSO
- [[PU Ref - App Solutions]] — 20+ object types, VRM, issues, certs, contracts
- [[PU Ref - App Best Practices]] — 61 recommendations for performance and configuration
- [[PU Ref - App MCP Tools]] — 13 MCP data tools, composition patterns, CLI commands

**Technical references:**
- [[PU Ref - Objects]] — Complete object catalog with traits, tabs, and relationships
- **Regulation Configuration** — Regulation trees, SCF crosswalks, naming conventions
- **Report Builder** — Multi-level joins, chart types, design patterns, report pipelines

### Other References
- [[PU Ref - Exchange Intelligence]] — GRX risk data: Risk Index, Findings, RF alerts
- [[PU Ref - Create Property]] — Step-by-step browser automation for creating properties
- [[PU Ref - Create Report]] — Step-by-step browser automation for creating reports
- [[PU Ref - UI Navigation]] — UI targeting strategy and common pitfalls

## MCP Data Tools

Vendor lookup and all data operations are handled by the **ProcessUnity MCP server** (separate repo: [processunity-mcp](https://github.com/johntondreau-png/processunity-mcp)). See `pu-app-guide/references/mcp-tools.md` for the 13 available tools.

## Merged / Moved Skills

- ~~PU Data Model~~ → merged into [[PU App Guide]] (`references/objects.md`)
- ~~PU Report Builder~~ → merged into [[PU App Guide]] (`references/report-builder.md`)
- ~~PU Vendor Lookup~~ → moved to MCP server (CLI: `processunity lookup <name>`)

## Quick Links

- PU Support Portal: `https://processunity.my.site.com/support/s/`
- Risk Index Methodology: `https://processunity.my.site.com/support/s/article/risk-index-methodology`
- Custom Reports Guide: `https://processunity.my.site.com/support/s/article/getting-started-with-custom-reports`
