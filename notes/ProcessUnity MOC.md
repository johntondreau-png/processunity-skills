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
| [[PU DORA]] | Implement EU DORA compliance — Register of Information, RTS templates, EBA taxonomy |

## Learning Path

If you're getting oriented with the platform, a good order is:

1. **[[PU Data Model]]** — understand what objects exist and the semantic data model
2. **[[PU Report Builder]]** — reports are the primary way to surface and query data
3. **[[PU Config Designer]]** — learn how requirements map to PU configuration
4. **[[PU Admin Navigator]]** — the mechanics of actually making changes in the UI
5. **[[PU Agentic Pipeline]]** — the advanced pattern for AI-driven workflows
6. **[[PU Vendor Lookup]]** — a concrete, working example of querying PU data
7. **[[PU DORA]]** — full DORA implementation guide (builds on all the above)

## Key Concepts

ProcessUnity uses a **semantic, object-oriented data model** — not SQL tables. All data lives in unified internal tables (ObjectType, ObjectInstance, CustomProperty, PropertyInstanceValue). This means schema changes happen live without downtime, and **Custom Reports are the only way to query data in a flat/relational format**.

The UI is organized around main tabs: **WORKSPACE**, **ASSESSMENTS**, **REPORTS**, **SETTINGS**, **HELP**. Configuration happens in SETTINGS (properties, reference data, roles) and REPORTS (custom reports, dashboards).

## Reference Documents

Deeper reference material lives in the `References` subfolder:

- [[PU Ref - Objects]] — Complete object catalog with traits, tabs, and relationships
- [[PU Ref - Property Types]] — All property types and configuration options
- [[PU Ref - Reports and Dashboards]] — Report creation, charts, and dashboard publishing
- [[PU Ref - Exchange Intelligence]] — GRX risk data: Risk Index, Findings, RF alerts
- [[PU Ref - Create Property]] — Step-by-step UI guide for creating properties
- [[PU Ref - Create Report]] — Step-by-step UI guide for creating reports
- [[PU Ref - Expression Standards]] — Syntax rules and patterns for PU expressions
- [[PU Ref - UI Navigation]] — UI targeting strategy and common pitfalls

## Quick Links

- PU Support Portal: `https://processunity.my.site.com/support/s/`
- Risk Index Methodology: `https://processunity.my.site.com/support/s/article/risk-index-methodology`
- Custom Reports Guide: `https://processunity.my.site.com/support/s/article/getting-started-with-custom-reports`
