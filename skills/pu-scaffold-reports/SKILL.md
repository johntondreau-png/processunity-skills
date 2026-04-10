---
name: pu-scaffold-reports
description: >
  Automatically create one MCP Custom Report per object type in a ProcessUnity instance,
  giving an MCP agent read access to every field on every object. Use this skill when
  connecting a new PU environment, setting up API read access for the first time, or
  rebuilding the report layer after a config change. Triggers for: "scaffold reports",
  "create MCP reports", "set up API read access", "build report layer",
  "connect me to all the data".
depends_on:
  - pu-environment-setup
  - pu-app-guide
---

# ProcessUnity MCP Report Scaffolding

Automate the creation of one Custom Report per object type, with all columns, scoped to
a service role — giving an MCP agent complete read access to the instance.

## Before Starting

### Prerequisites
1. **Service role exists** — e.g., `MCP - Model Context Protocol` (see pu-environment-setup)
2. **Web Services enabled** in System Settings
3. **Playwright browser automation** available (plugin:playwright MCP)
4. **Login credentials** for a user with report creation permissions (Admin or the service account itself if it has admin access)

### Required Inputs
| Input | Default | Description |
|-------|---------|-------------|
| Instance URL | *(required)* | e.g., `https://app.processunity.net/desert` |
| Username | `web.service` | PU login username |
| Password | *(required)* | PU login password |
| Role name | `MCP - Model Context Protocol` | Role to grant report access to |
| Report prefix | `[MCP - ` | Naming prefix (reports named `[MCP - {Object}]`) |

## How It Works

### The Two-Pass Algorithm

PU's Custom Report UI has a critical behavior: the **"Add Columns" button only appears
after the Level 1 (object type) is saved server-side**. Setting Level 1 in the form and
navigating away without saving loses the value. This requires a two-pass approach:

```
For each object type:
  PASS 1 — Create shell:
    1. Click New
    2. Set Name → [MCP - {Object}]
    3. Set Level 1 → {Object Type}
    4. Check "Enable for Automated Export"
    5. Click Done (SAVE — persists Level 1)

  PASS 1b — Set Access:
    6. Click Access tab → Edit
    7. Select "Selected Roles" → pick target role
    8. Save

  PASS 2 — Add Columns:
    9. Click Details tab → Edit
    10. Click "Add Columns" (now visible because Level 1 is persisted)
    11. Wait for dialog (retry loop, 12× 1 second)
    12. Click all rows in column grid (selects all)
    13. Click OK → Done
```

### Object Type Discovery

Rather than hardcoding object types, the script discovers available types by opening
the Level 1 dropdown on a new report and reading all `[class*="listItem"]` elements.
This ensures the script works on any instance regardless of which custom objects or
features are enabled.

### Idempotency

Before creating a report, check the existing report list via `list_reports` API.
Skip any object type that already has a `[MCP - {Object}]` report. This makes the
script safe to re-run after partial failures.

## PU Element Reference

These are the DOM element IDs used for automation (verified on PU instances as of 2026-04):

| Element | Selector | Notes |
|---------|----------|-------|
| New button | `#paneMaster_mtb_New` | Creates new report |
| Name field | `#paneDetail_customReportSetupView_tbxName` | Report name input |
| Level 1 dropdown | `#paneDetail_customReportSetupView_ddlObjectType_search` | Type-to-filter search |
| Level 1 container | `#paneDetail_customReportSetupView_ddlObjectType` | Click to open dropdown |
| Edit button | `#paneDetail_dtb_Edit` | Enter edit mode |
| Save button | `#paneDetail_dtb_Save` | Save and stay in edit |
| Done button | `#paneDetail_dtb_Done` | Save and exit edit |
| Cancel button | `#paneDetail_dtb_Cancel` | Discard changes |
| Access container | `#paneDetail_customReportAccessView_divAccessEdit` | Access radio buttons |
| Add Columns dialog | `[role="dialog"]` | Modal with column picker |
| Column grid | `[role="dialog"] [role="grid"]:nth-of-type(2)` | Second grid = data rows |
| Column rows | `[role="row"]` inside column grid | Click to select |

## PU Dropdown Widget Pattern

The Level 1 dropdown is a custom React/MUI widget. To set it programmatically:

```js
// 1. Open the dropdown
document.getElementById('paneDetail_customReportSetupView_ddlObjectType').click();

// 2. Type to filter (must use native setter for React)
const search = document.getElementById(
  'paneDetail_customReportSetupView_ddlObjectType_search'
);
const nativeSetter = Object.getOwnPropertyDescriptor(
  window.HTMLInputElement.prototype, 'value'
).set;
nativeSetter.call(search, 'Third Party');
search.dispatchEvent(new Event('input', { bubbles: true }));

// 3. Click the exact match (leaf div, visible, exact text)
Array.from(document.querySelectorAll('div')).find(d =>
  d.textContent?.trim() === 'Third Party' &&
  d.children.length === 0 &&
  d.offsetHeight > 0
)?.click();
```

## Busy Shield Workaround

PU renders `<div id="divShield" class="busy shield">` during page transitions, blocking
Playwright clicks. Use `page.evaluate()` for all click actions to bypass the shield:

```js
// Instead of: await page.click('#paneDetail_dtb_Done')
// Use:
await page.evaluate(() => document.getElementById('paneDetail_dtb_Done')?.click());
```

## Column Counts by Object Type

Column counts vary widely. Typical ranges (desert instance, 2026-04):
- **Smallest**: Application (4), Report Category (4), Document Category (13)
- **Medium**: Document (45), Facility (27), Role (21), Questionnaire (50)
- **Large**: Individual (120), Issue (118), Reference Data (118)
- **Very large**: Third Party (360), Assessment Phase (468), GRX Finding (516)

## Error Recovery

If a report creation fails mid-way:
1. The script should catch the error and click Done/Cancel to exit edit mode
2. The report may be partially created (shell without columns)
3. Re-running the script with idempotency will detect the shell and do Pass 2 only
4. If Level 1 is missing, the script detects this (no Add Columns button) and does Pass 1 first

## Verification

After scaffolding, verify via API:
```
list_reports → should show [MCP - *] reports for all object types
export_report(reportId) → returns [] (no data) or records
```

## Reference Files
- `references/scaffold-reports.js` — Complete Playwright automation script
- `references/automation-lessons-learned.md` — Detailed debugging notes from initial implementation
