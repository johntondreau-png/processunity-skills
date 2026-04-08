---
tags:
  - processunity
  - reference
  - admin
  - how-to
created: 2026-04-07
parent: "[[PU Admin Navigator]]"
---

# PU Ref - Create Property

> Step-by-step guide for creating properties in the ProcessUnity admin UI. Referenced by [[PU Admin Navigator]].

## Navigation Path

Settings → General → Properties → [Select Object]

## Canonical Workflow

### Step 1: Navigate to Properties
Click **SETTINGS** → left panel **General** → **Properties**. Center panel shows object types with property counts.

### Step 2: Select the Target Object
Find and click the target object. Right panel shows its current properties.

### Step 3: Enter Edit Mode
Click **Edit** (single click, wait for postback — never double-click). Confirm **Add Property** button is visible.

### Step 4: Add Property
Click **Add Property** and fill in:

- **Name** — System name (unique, used in expressions)
- **Property Type** — Use type-ahead search with canonical strings (see [[PU Ref - Property Types]])
- **Pick List values** (if applicable) — one per line
- **Flags**: Required, Hidden, Read Only, Hide in Edit Mode, Track Changes, Capture History

### Step 5: Display Tab
Label, Report Label, Tooltip, Layout, Colors (expression-based), Display Format, Bold

### Step 6: Rules Tab
Copy/Paste behavior, Validation Expression (calculated properties put their expression here), Auto Update Rule (event + condition)

### Step 7: View/Edit Access (if needed)
Restrict by condition or role/team

### Step 8: Save
Click OK/Save. If modal reopens blank, check the property list — it may have saved.

### Step 9: Post-Save Verification (REQUIRED)

- [ ] Property appears in the list
- [ ] Name matches spec
- [ ] Label matches spec
- [ ] Type matches spec
- [ ] Flags match spec
- [ ] If calculated: expression saved correctly, references resolve, output is sane

## Bulk Property Creation

Stay in Edit mode, create in dependency order (base before calculated), verify each one, produce Change Log at end.

## Common Pitfalls

| Symptom | Cause | Fix |
|---------|-------|-----|
| Add Property button missing | Not in Edit mode | Click Edit |
| Property type list is huge | — | Use type-ahead |
| Modal reopens blank after save | May have saved | Check property list |
| Expression field missing | Wrong property type | Hard stop — check type |
| Type not in dropdown | Tenant doesn't support it | Hard stop — report to user |
| Expression won't save | Syntax error | No spaces before parentheses |
