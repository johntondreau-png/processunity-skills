---
tags:
  - processunity
  - admin
  - browser-automation
  - configuration
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Config Designer]]"
  - "[[PU Data Model]]"
---

# PU Admin Navigator

> Safely execute configuration changes in ProcessUnity's admin UI via browser automation. This is the "do it" skill — [[PU Config Designer]] designs the plan, this skill runs it.

## Before Starting ANY Configuration Work

### Required Context (Hard Stops)

Do NOT proceed without all of these:

1. **Instance URL** — e.g., `https://app.processunity.net/ocean`
2. **Environment** — Prod / Sandbox / Training
3. **Target Object** — which object you're configuring
4. **Change Policy** — allowed to create new properties? Modify existing? Remediation plan for mistakes?

### Required UI Posture

Before performing any browser actions:
- Browser zoom: **100%**
- Window: **maximized**
- Navigation panel: choose Expanded or Collapsed, keep consistent
- Density/theme: keep consistent

### Authentication

User must be logged into the PU instance. Verify the main navigation tabs are visible: WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP.

## Execution Plan Format

Configuration is driven by structured JSON execution plans (produced by [[PU Config Designer]]). Each step specifies the property name, type, and all tab configurations (details, display, rules).

## Reference Files

Read these before performing specific tasks:

- **[[PU Ref - Create Property]]** — Step-by-step guide for creating properties in the admin UI (canonical workflow, type-ahead strategy, expression entry, post-save verification)
- **[[PU Ref - Create Report]]** — Step-by-step guide for creating custom reports
- **[[PU Ref - UI Navigation]]** — UI targeting strategy (3-tier), element anchors, focus recovery, common pitfalls
- **[[PU Ref - Expression Standards]]** — How to write expressions correctly (syntax, patterns, functions)
- **[[PU Ref - Function Library]]** — Complete function reference: 63 functions with signatures, examples, and common patterns
- **[[PU Ref - Buttons and Workflow]]** — Buttons, 11 workflow step types, Report Actions, BALI pattern, External API connections
- **[[PU Ref - Automated Actions]]** — Automated actions, notification rules, nightly job sequence, event types

## Help System Research

PU Exchange help articles are at: `https://processunity.my.site.com/support/s/`

Key articles:
- `risk-index-methodology` — Risk Index scoring (0-100), components, ratings
- `risk-monitoring-and-alerting-overview` — Recorded Future rules and severity
- `findings-methodology` — Control findings and severity calculation
- `advanced-reporting` — Tableau-based standard report templates

> Open help articles in a **separate tab** from the PU admin tab to avoid session collisions.

## Safe Operating Rules

1. **Never assume** tenant, environment, module, or object type
2. **Never guess** the correct property type — ask if multiple similar types exist
3. Prefer **type-ahead** over scrolling for dropdowns
4. Use **system Name** for uniqueness and references
5. Use **Label** for UI readability
6. Always verify the property exists after save (**Post-Save Verification**)
7. If the modal reopens blank after save, **don't assume failure** — check the property list
8. **Single-click Edit** and wait for postback; never double-click
9. Produce a **Change Log** after every session

## Change Log Template (Required)

```
## Change Log
- **Tenant / Env**: [URL] / [Prod/Sandbox/Training]
- **Object type**: [Object name]
- **Properties created**:
  - Name: [name] | Label: [label] | Type: [type] | Notes: [notes]
- **Properties modified**:
  - Name: [name] | Change: [what changed]
- **Verification performed**: [Yes/No + details]
- **Open questions / risks**: [unresolved items]
```

## Rollback / Remediation

If a mistake is made:
- Prefer **disable/hide** over delete
- If a property is already referenced by workflows/reports, **do not rename** without confirming impact
- If uncertain, **stop and escalate** to the user

---

*See also: [[PU Config Designer]] for designing plans, [[PU Data Model]] for platform knowledge, [[PU Report Builder]] for building reports.*
