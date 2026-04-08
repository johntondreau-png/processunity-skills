---
tags:
  - processunity
  - reference
  - admin
  - ui
  - browser-automation
created: 2026-04-07
parent: "[[PU Admin Navigator]]"
---

# PU Ref - UI Navigation

> UI targeting strategy, element anchors, focus recovery, and common patterns. Referenced by [[PU Admin Navigator]].

## Main Navigation Tabs

| Tab | Purpose |
|-----|---------|
| **WORKSPACE** | Home, personal dashboard, My Organization |
| **ASSESSMENTS** | Assessment Types, Questionnaires, Assessment Periods |
| **REPORTS** | Custom Reports, Dashboards, Task Groups, Categories |
| **SETTINGS** | Properties, Reference Data, Roles, Teams, People, App Settings |
| **HELP** | Help center articles |

## Key Admin Paths

| Task | Path |
|------|------|
| Configure properties | Settings → General → Properties → [Object] → Edit |
| Manage Reference Data | Settings → General → Reference Data |
| Create custom reports | Reports → Administration → Custom Reports → +New |
| Create dashboards | Reports → Administration → Custom Dashboards → +New |
| Manage roles/teams | Settings → General → Roles / Teams |
| Import/Export | Settings → General → Import & Export |

## 3-Tier Targeting Strategy

### Tier A (Preferred): Visual Anchor + Text Match
Locate controls by visible label, confirmed by context (page/panel/modal header).

### Tier B: Relative Geometry
Click relative to a known anchor when labels are hard to target directly.

### Tier C (Fallback): Coordinate Regions
Stored click regions (percent-of-viewport preferred over absolute pixels). Tenant-specific.

## Anchor Signatures

| Control | Text Anchor | Location |
|---------|-------------|----------|
| Edit button | `Edit` | Top-right action bar |
| Add Property | `Add Property` | Properties panel header (Edit mode) |
| Name field | `Name` | First input in modal |
| Details tab | `Details` | Leftmost tab in tab row |
| Save / OK | `OK` / `Save` | Bottom of modal |
| +New | `+New` | Middle panel toolbar |

## Focus Recovery Protocol

If typing doesn't appear in the expected field:
1. Click the field again
2. Ctrl+A then type/paste
3. Click modal title/header, then click field again
4. If stuck, stop and ask user to confirm page state

## Common UI States

- **Edit mode not active** — Add Property won't appear until Edit is clicked
- **Inactivity Warning** — Session timeout dialog, click to dismiss
- **Spinner** — Wait before interacting
- **3-panel layout** — Left (nav), Center (list/report), Right (details/config)
- **Modal open** — Background dimmed
- **Tab collision** — PU shares session across tabs. Use ONE PU tab for admin work.

## MUI Dialog + DataTables Modals

Several modals use MUI Dialog + jQuery DataTables + DTTT:

- Dialog: `document.querySelector('.MuiDialog-paper')`
- All rows: `dialog.querySelectorAll('tr')`
- Visible: without class `filteredOut`
- Selected: with classes `DTTT_selected selected`
- Group headers: class `groupInbox`

**Clicking**: Use `find` → `ref` for buttons. Use JS MouseEvent dispatch for DataTables rows (simple `.click()` doesn't work).

**Dual Search Boxes**: Top (DataTable native, usually useless) vs Bottom (custom with magnifying glass, filters the actual list).

## Report Builder Layout

Left panel: Nav tree. Center: Report output / MUI DataGrid (virtualized, ~56 visible rows, `aria-rowcount` for total). Right: Configuration tabs.

MUI DataGrid rows: `.MuiDataGrid-row`, use `.innerText` not `.textContent`. Scroll container: `.MuiDataGrid-virtualScroller`.

## Dashboard Builder

Dashboard Details → Add Chart → resize/arrange → per-chart filters → Save → Access tab to publish.

## URL Patterns

- Main: `https://app.processunity.net/ocean/Default.aspx?nav=...`
- Help: `https://processunity.my.site.com/support/apex/ExternalArticleViewer?urlName=...`
