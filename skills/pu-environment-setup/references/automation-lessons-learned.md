# PU Report Automation — Lessons Learned

Documented during 2026-04-09 session automating 31 MCP reports on `/desert` instance
via Playwright browser automation (logged in as `web.service` service account).

## Root Cause of Column Failures

**Problem**: Reports created in a batch had 0 columns because "Add Columns" button
never appeared.

**Root Cause**: PU's "Add Columns" button only renders when Level 1 (object type) is
set AND saved server-side. Setting Level 1 in the dropdown during creation mode doesn't
persist until the form is saved. If you navigate to another tab (Access) before saving
the Details tab, the Level 1 value is lost.

**Fix**: Two-pass approach:
1. **Pass 1**: Create report → set Level 1 → save (Done)
2. **Pass 2**: Re-edit same report → Add Columns now appears → select all → save

## PU Custom Dropdown Widget

The Level 1 dropdown (`#paneDetail_customReportSetupView_ddlObjectType`) is a custom
React/MUI widget, NOT a native `<select>`. Key behaviors:

- **Open**: Click the container div or the search input
- **Filter**: Type into `#paneDetail_customReportSetupView_ddlObjectType_search`
  - Must use native value setter + `input` event for React to detect the change:
    ```js
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeSetter.call(search, 'Assessment');
    search.dispatchEvent(new Event('input', { bubbles: true }));
    ```
  - Regular `.value = 'x'` won't trigger React's synthetic event system
- **Select**: Click the `div` with exact text match (`d.textContent.trim() === val`)
  - Filter by `d.children.length === 0` (leaf text node) and `d.offsetHeight > 0` (visible)
- **Gotcha**: `[class*="listItem"]` selector sometimes doesn't match — fall back to plain `div` search

## Add Columns Dialog

**Element IDs**:
- Dialog: `[role="dialog"]`
- Column grid: Second `[role="grid"]` inside dialog (first is the header)
- Columns: `[role="row"]` elements inside the data grid
- OK button: `button` with text "OK" inside dialog

**Timing**:
- Dialog needs 3-12 seconds to load columns depending on object complexity
- Use retry loop checking `grids[1].querySelectorAll('[role="row"]').length > 3`
- Don't check for `> 0` — header rows exist even when empty

**Selection**: Each row click toggles selection. Clicking all rows = select all columns.

**Column counts per object type** (desert instance):
| Object | Columns |
|--------|---------|
| Agreement | ~45 (user-created) |
| Application | 4 |
| Assessment | 429 |
| Assessment Category | 360 |
| Assessment Period | 360 |
| Assessment Phase | 468 |
| Assessment Test Execution | 64 |
| Assessment Test Procedure | 36 |
| Assessment Type | 27 |
| Document | 45 |
| Document Category | 13 |
| Document Request | 44 |
| Facility | 27 |
| Fourth Party | 24 |
| GRX Finding | 516 |
| Individual | 120 |
| Issue | 118 |
| Managed Document | 51 |
| My Organization | 164 |
| Questionnaire | 50 |
| Questionnaire Question | 145 |
| Questionnaire Response | 95 |
| Questionnaire Section | 79 |
| Reference Data | 118 |
| Report Category | 4 |
| Role | 21 |
| Team | 66 |
| Third Party | 360 |
| Third-Party Request | 361 |
| Third-Party Service | 506 |
| Web Link | 360 |

## PU "Busy Shield" Overlay

PU renders a `<div id="divShield" class="busy shield">` overlay during page transitions.
This blocks Playwright's `click()` actions (they wait for the element to be unobstructed).

**Workaround**: Use `page.evaluate()` to click via JavaScript — bypasses the shield
because JS click events don't require visual unobstruction.

## Access Tab Automation

- "Selected Roles" is a `div` with text content, not a radio button or native input
- After clicking "Selected Roles", a dropdown appears with `[class*="listItem"]` elements
- The MCP role text is `MCP - Model Context Protocol`
- Save button ID: `paneDetail_dtb_Save`
- Must wait 2-3 seconds after clicking "Selected Roles" before the dropdown renders

## Reliable Two-Pass Script Pattern

```js
// PASS 1: Set Level 1
await selectReport(page, reportName);
await clickDetailsTab(page);
await clickEdit(page);
await setLevel1(page, level1Value);  // dropdown fill + click
await clickDone(page);  // SAVE first — this persists Level 1

// PASS 2: Add Columns (Level 1 now persisted)
await clickEdit(page);
await clickAddColumns(page);
await waitForDialog(page);  // retry loop, 12 attempts × 1 second
await selectAllColumns(page);
await clickDialogOK(page);
await clickDone(page);
```

## Performance

- Each report takes ~25-35 seconds in the two-pass approach
- 31 reports × 30 seconds = ~15 minutes total
- Batch of 10 reports runs in ~5 minutes
- Session timeout: PU sessions last 20+ minutes; Playwright page timeout is separate
- For large batches, split into groups of 10-12 to avoid browser memory issues
