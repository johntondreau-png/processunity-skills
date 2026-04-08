---
tags:
  - processunity
  - reference
  - admin
  - reports
  - how-to
created: 2026-04-07
parent: "[[PU Admin Navigator]]"
---

# PU Ref - Create Report

> Step-by-step browser automation guide for creating Custom Reports. Referenced by [[PU Admin Navigator]] and [[PU Report Builder]].

## Navigation Path

Reports → Administration → Custom Reports → +New

## Workflow

### Step 1: Create the Report Shell
+New → Name (brief) → optional Report Title → Instructions → Tooltip → Owner → Category

### Step 2: Set Level 1 (Primary Object)
Select Type — e.g., "Third Parties" for vendor reports, "Issues" for issue reports. Configure: Display Owned Items Only, Allow Creation, Historical Data Report.

### Step 3: Add Columns
Click Add Columns → select properties → OK. Always include "Name."

### Step 4: Run and Preview
Click Run/Refresh to see output. Iterate: edit in right panel, run in center panel.

### Steps 5-12: Configure
Add calculated columns, reorder, configure column attributes (display/totals/filters/drilldown), group, filter (design-time + run-time), sort, set report options, add chart, publish via Access tab.

## Add Columns Modal — Browser Automation Details

This is the trickiest UI interaction. The modal uses **MUI Dialog + jQuery DataTables + DTTT TableTools**.

### Two Search Boxes — Use the RIGHT One

- **Top**: DataTable native `Search:` box — searches an empty selected-items table (useless)
- **Bottom**: Custom textbox with magnifying glass icon — **this filters the property list**

Always use `form_input` on the bottom box, then click the magnifying glass.

### Row Selection

Simple `.click()` does NOT work with DataTables. Use proper MouseEvent dispatch:

```javascript
const rect = row.getBoundingClientRect();
const eventInit = {
  bubbles: true, cancelable: true, view: window,
  clientX: rect.left + rect.width/2,
  clientY: rect.top + rect.height/2,
  button: 0, buttons: 1
};
row.dispatchEvent(new MouseEvent('mousedown', eventInit));
row.dispatchEvent(new MouseEvent('mouseup', eventInit));
row.dispatchEvent(new MouseEvent('click', eventInit));
```

### Reliable Workflow

1. Add **one column at a time** (multi-select across search sessions doesn't persist)
2. Open modal → search bottom box → click magnifying glass → find row via JS → dispatch MouseEvent → verify `DTTT_selected` class → click OK → verify column appears
3. Retry if column didn't appear

### Common Pitfalls

| Symptom | Fix |
|---------|-----|
| Search doesn't filter | Use bottom textbox, not top |
| Row selected but column not added | Retry; DataTables state didn't register |
| Multi-select loses selections | Add one at a time |
| Clicking OK navigates away | Use `find` → `ref` click, not coordinates |
| Wrong row selected | Use exact `textContent.trim()` matching |

### Session Safety

Never operate two PU tabs in the same browser session — PU shares session state, causing collisions.

## Post-Creation Verification

- [ ] Report runs without errors
- [ ] All columns present
- [ ] Filters work (design-time and run-time)
- [ ] Groups display properly
- [ ] Totals calculate correctly
- [ ] Chart renders (if configured)
- [ ] Published to correct audience
