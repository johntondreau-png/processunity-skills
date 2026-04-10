---
name: pu-data-model
description: >
  ProcessUnity platform knowledge base — the object model, property types, reports, dashboards,
  and how they all fit together. Use this skill whenever the user mentions ProcessUnity objects,
  subject areas, properties, fields, reports, dashboards, or asks about PU's data model.
  Also use when someone asks "what objects does ProcessUnity have", "what property types are available",
  "how do reports work in PU", "can I create a calculated field", or anything about the PU platform's
  configuration capabilities. This skill is foundational — the other PU skills (pu-config-designer and
  pu-admin-navigator) reference it for platform knowledge.
---

# ProcessUnity Data Model Knowledge Base

This skill contains comprehensive reference material about ProcessUnity's platform architecture.

## When to Use

Consult this skill when you need to:
- Understand what objects exist in ProcessUnity and their capabilities
- Know what property types are available and when to use each one
- Understand how reports and dashboards work
- Answer questions about PU's semantic data model
- Validate whether a proposed configuration is feasible

## Reference Files

Read the appropriate reference file based on what you need:

- **`references/objects.md`** — Complete object catalog (Subject Areas, Settings objects, Reporting objects), their traits (Grid/Tree, Renamable, Stateful, etc.), standard tabs, standard properties, and key relationships. Read this when you need to decide WHICH object(s) to configure.

For property types, reports, and dashboards reference, use the **pu-app-guide** skill which has comprehensive, up-to-date coverage:
- Property types → `pu-app-guide/references/properties.md`
- Reports & dashboards → `pu-app-guide/references/reports.md`

## Key Platform Concepts

ProcessUnity uses a **semantic, object-oriented data model** — not traditional SQL tables. All data lives in unified internal tables (ObjectType, ObjectInstance, CustomProperty, PropertyInstanceValue). This means:

1. Schema changes (adding properties, enabling objects) happen live without downtime
2. The ONLY way to query data in a flat/relational format is through Custom Reports
3. Any object can be related to almost any other object via Related Items
4. Property IDs (not names) are used in expressions, so renaming properties never breaks formulas

**Navigation structure**: The PU UI has main tabs — WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP. Configuration happens primarily in SETTINGS (for properties, reference data, roles, teams) and REPORTS (for custom reports and dashboards).

## Configuration Approach

When designing a configuration:
1. Start with the object model — which Subject Areas will hold the data?
2. Design properties on each object — what fields define a record?
3. Set up Reference Data for shared/dynamic pick lists
4. Build relationships between objects via Related Items
5. Create Custom Reports to surface data
6. Build Dashboards from report charts
7. Configure workflow (buttons, automated actions, notifications)
