---
name: pu-admin-navigator
description: >
  Drive the ProcessUnity admin UI via browser automation to create properties, build reports,
  configure dashboards, and perform other admin tasks. Use this skill when the user wants to
  actually execute configuration changes in ProcessUnity — not just design them, but DO them.
  Triggers for: "create this property in PU", "add these fields", "go build the report",
  "execute this config plan", "set up the properties", "implement the configuration",
  or any request to make actual changes in the ProcessUnity web interface. This skill works
  with browser automation tools (Claude in Chrome, OpenAI Agent Mode, Google Mariner, etc.)
  to navigate the PU admin UI and perform configuration steps safely. Always use this skill
  alongside pu-data-model for platform knowledge.
---

# ProcessUnity Admin Navigator

Safely execute configuration changes in ProcessUnity's admin UI via browser automation.

## Before Starting ANY Configuration Work

### Required Context (Hard Stops)

Do NOT proceed without all of these. Ask the user if any are missing:

1. **Instance URL** — e.g., `https://app.processunity.net/ocean`
2. **Environment** — Prod (default) / Sandbox / Training
3. **Target Object** — which object you're configuring
4. **Change Policy** — Are we allowed to create new properties? Modify existing? What's the remediation plan for mistakes?

### Required UI Posture

Before performing any browser actions, standardize the UI:
- Browser zoom: **100%**
- Window: **maximized**
- Navigation panel: choose Expanded or Collapsed and keep consistent
- Density/theme: keep consistent

### Authentication

The user must be logged into the PU instance in the browser. Verify you can see the main navigation tabs (WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP).

## Execution Plan Format

Configuration work should be driven by a structured execution plan (JSON). The pu-config-designer skill produces these plans, or the user can provide one directly. Each step looks like:

```json
{
  "step": "create_property",
  "name": "IRQS_Privacy_DataClassification_Score",
  "property_type": "Number - Calcs & Aggs",
  "details_tab": {
    "Name": "IRQS_Privacy_DataClassification_Score",
    "Property Type": "Number - Calcs & Aggs",
    "Required": false,
    "Hidden": false,
    "Read Only": true,
    "Track Changes": false
  },
  "display_tab": {
    "Label": "Privacy – Data Classification Score",
    "Report Label": "Privacy – Data Classification Score",
    "Tooltip": "(leave blank)"
  },
  "rules_tab": {
    "Validation Expression": "CASEX([source_field], \"Value1\", 5, \"Value2\", 0, 0)"
  }
}
```

## Reference Data Dependency Chain

When creating `Reference Data – Select One` or `Reference Data – Select Multiple` properties, you MUST ensure the Reference Data Type and its values exist BEFORE creating the property. The workflow is:

1. **Navigate to Settings → General → Reference Data**
2. **Check if the Type exists** (e.g., "Jurisdiction", "Regulation Type"). Filter or scroll the Type column.
3. **If the Type does NOT exist**: Create the new Type first.
4. **Create the Reference Data records** (values) under that Type. Each value is a separate record. You can:
   - Create records manually through the GUI (one by one)
   - Use the PU import API to bulk-create records (preferred for large value sets)
   - Use a PU import template to load values via file upload
5. **THEN create the property** on the target object that references this Type.

This means when processing an execution plan, you must:
- Scan all steps for `Reference Data – Select One` or `Reference Data – Select Multiple` properties
- Group them by their Reference Data Type
- Ensure all Types and values exist BEFORE creating any properties that reference them
- The execution_plan_reference_data.json file lists all required Types and values

### API for Reference Data Records

PU has data APIs (not config APIs). Reference Data records can be created via:
- `POST /api/importexport/Import/{importTemplateId}` — requires an import template to exist
- `POST /api/importexport/ImportWithResults/{templateExternalId}` — same, with detailed results
- Manual GUI entry for small sets

Auth: OAuth token from `POST /ocean/token` (see config.json for credentials).

## Reference Files

Read these before performing specific tasks:

- **`references/create-property.md`** — Step-by-step guide for creating properties in the admin UI, including the canonical UI workflow, type-ahead strategy, expression entry, and post-save verification.
- **`references/create-report.md`** — Step-by-step guide for creating custom reports.
- **`references/ui-navigation.md`** — UI targeting strategy (3-tier), element anchors, focus recovery, and common pitfalls.
- **`references/expression-standards.md`** — How to write expressions correctly (syntax rules, preferred patterns, functions).

## Safe Operating Rules (ALWAYS follow)

1. **Never assume** tenant, environment, module, or object type
2. **Never guess** the correct property type — if multiple similar types exist, ask
3. Prefer **type-ahead** over scrolling for property types and other dropdowns
4. Use **system Name** for uniqueness and references
5. Use **Label** for UI readability
6. Always verify the property exists after save (Post-Save Verification)
7. If the modal reopens blank after save, **do not assume failure** — check the property list first
8. **Single-click Edit** and wait for postback; never double-click
9. Produce a **Change Log** after every session

## Change Log Template (Required Output)

After completing work, always produce:

```
## Change Log
- **Tenant / Env**: [URL] / [Prod/Sandbox/Training]
- **Object type**: [Object name]
- **Properties created**:
  - Name: [name] | Label: [label] | Type: [type] | Notes: [any notes]
- **Properties modified**:
  - Name: [name] | Change: [what changed]
- **Verification performed**: [Yes/No + details]
- **Open questions / risks**: [any unresolved items]
```

## Rollback / Remediation

If a mistake is made:
- Prefer **disable/hide** over delete
- If a property is already referenced by workflows/reports, do not rename without confirming impact
- If uncertain, **stop and escalate** to the user
