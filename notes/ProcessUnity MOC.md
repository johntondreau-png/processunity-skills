---
tags:
  - processunity
  - moc
  - tprm
created: 2026-04-07
---

# ProcessUnity — Map of Content

This is your entry point for all ProcessUnity platform knowledge. Each note covers a distinct skill area — start with **Data Model** if you're new, then branch out based on what you need to do.

## Core Skills

| Skill | What It Does |
|-------|-------------|
| [[PU Data Model]] | Foundation — objects, properties, reports, and how they fit together |
| [[PU Config Designer]] | Translate requirements into a configuration plan |
| [[PU Admin Navigator]] | Execute configuration changes in the admin UI via browser automation |
| [[PU Report Builder]] | Design and build custom reports, charts, and dashboards |
| [[PU Agentic Pipeline]] | Build AI-powered read → reason → write-back workflows |
| [[PU Vendor Lookup]] | Look up a vendor's risk profile from the PU instance |
| [[PU Instance Analyzer]] | Analyze an instance — fingerprint, connector inventory, gap analysis, data health |
| [[PU Environment Setup]] | Connect a new PU instance — roles, service accounts, MCP config, report scaffolding |
| [[PU Scaffold Reports]] | Auto-create one report per object type for full MCP read access |
| [[PU Word Templates]] | Build VBA-enabled Word templates with SVG visualizations for Word Connector reports |
| [[PU Configuration]] | Define regulation trees, questions, threats, reference data, and SCF crosswalks |
| [[PU Import]] | Bulk create/update records in any PU object via the Import API |
| [[PU Enrich]] | Enrich vendor data from 9 external API sources (sanctions, cyber, ESG, financial) |
| [[PU App Guide]] | Comprehensive help-system reference — administration, properties, expressions, workflow, assessments, reports, integrations, solutions, best practices |
| [[PU DORA]] | Implement EU DORA compliance — Register of Information, RTS templates, EBA taxonomy |

## Learning Path

If you're getting oriented with the platform, a good order is:

1. **[[PU Environment Setup]]** — connect a new instance (roles, credentials, MCP, reports)
2. **[[PU Data Model]]** — understand what objects exist and the semantic data model
3. **[[PU App Guide]]** — comprehensive reference for properties, expressions, workflow, assessments, reports, integrations
4. **[[PU Report Builder]]** — reports are the primary way to surface and query data
4. **[[PU Config Designer]]** — learn how requirements map to PU configuration
5. **[[PU Configuration]]** — the object schemas, naming conventions, and SCF crosswalk details
6. **[[PU Instance Analyzer]]** — analyze what's already configured before making changes
7. **[[PU Admin Navigator]]** — the mechanics of actually making changes in the UI
8. **[[PU Import]]** — push data into PU programmatically via the Import API
9. **[[PU Enrich]]** — pull external intelligence and push it back into PU
10. **[[PU Agentic Pipeline]]** — the advanced pattern for AI-driven workflows
11. **[[PU Vendor Lookup]]** — a concrete, working example of querying PU data
12. **[[PU DORA]]** — full DORA implementation guide (builds on all the above)

## Key Concepts

ProcessUnity uses a **semantic, object-oriented data model** — not SQL tables. All data lives in unified internal tables (ObjectType, ObjectInstance, CustomProperty, PropertyInstanceValue). This means schema changes happen live without downtime, and **Custom Reports are the only way to query data in a flat/relational format**.

The UI is organized around main tabs: **WORKSPACE**, **ASSESSMENTS**, **REPORTS**, **SETTINGS**, **HELP**. Configuration happens in SETTINGS (properties, reference data, roles) and REPORTS (custom reports, dashboards).

## Reference Documents

### App Guide References (from PU help system)

The [[PU App Guide]] skill contains 9 comprehensive reference files:

- [[PU Ref - App Administration]] — Users, roles, teams, permissions, branding, security, instance types
- [[PU Ref - App Properties]] — 15 property types, calculated/aggregate, pick lists, auto-update rules
- [[PU Ref - App Expressions]] — 50+ functions, operators, formatting, common patterns
- [[PU Ref - App Workflow]] — State machines, notifications, review patterns, version control
- [[PU Ref - App Assessments]] — Questionnaire templates, scoring, lifecycle, vendor portal
- [[PU Ref - App Reports]] — Reports, columns, filters, charting, dashboards, caching
- [[PU Ref - App Integrations]] — Import/export, connectors, web services API, SSO
- [[PU Ref - App Solutions]] — 20+ object types, VRM, issues, certs, contracts
- [[PU Ref - App Best Practices]] — 61 recommendations for performance and configuration

### Technical References

- [[PU Ref - Objects]] — Complete object catalog with traits, tabs, and relationships
- [[PU Ref - Exchange Intelligence]] — GRX risk data: Risk Index, Findings, RF alerts

### Browser Automation References

- [[PU Ref - Create Property]] — Step-by-step UI guide for creating properties
- [[PU Ref - Create Report]] — Step-by-step UI guide for creating reports
- [[PU Ref - UI Navigation]] — UI targeting strategy and common pitfalls

## Quick Links

- PU Support Portal: `https://processunity.my.site.com/support/s/`
- Risk Index Methodology: `https://processunity.my.site.com/support/s/article/risk-index-methodology`
- Custom Reports Guide: `https://processunity.my.site.com/support/s/article/getting-started-with-custom-reports`
