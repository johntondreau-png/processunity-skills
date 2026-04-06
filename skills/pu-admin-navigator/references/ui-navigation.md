# ProcessUnity UI Navigation & Targeting Guide

## Main Navigation Structure

The PU web UI has a top-level tab bar:

| Tab | Purpose |
|-----|---------|
| **WORKSPACE** | Home, personal dashboard, My Organization |
| **ASSESSMENTS** | Assessment Types, Questionnaires, Assessment Periods |
| **REPORTS** | Custom Reports, Custom Dashboards, Report Task Groups, Report Categories |
| **SETTINGS** | Properties, Reference Data, Roles, Teams, People, App Settings, Import/Export |
| **HELP** | Help center articles |

## Key Admin Navigation Paths

| Task | Path |
|------|------|
| Configure properties | Settings → General → Properties → [Select Object] → Edit |
| Manage Reference Data | Settings → General → Reference Data |
| Create custom reports | Reports → Administration → Custom Reports → +New |
| Create dashboards | Reports → Administration → Custom Dashboards → +New |
| Manage roles | Settings → General → Roles |
| Manage teams | Settings → General → Teams |
| User management | Settings → General → People |
| App settings | Settings → General → App Settings |
| Import/Export | Settings → General → Import & Export |

## 3-Tier UI Targeting Strategy

Always attempt targeting in this order:

### Tier A (Preferred): Visual Anchor + Text Match
Locate controls by visible label text, confirmed by nearby context (page header, panel header, modal title).

### Tier B: Relative Geometry
Click relative to a known anchor when labels are present but hard to target directly.
Example: "click the primary button in the top-right action bar" or "click the first textbox under Name"

### Tier C (Fallback): Coordinate Regions
Use stored click regions only when Tier A/B fail. Prefer percent-of-viewport regions over absolute pixels. These are tenant/posture-specific and must be maintained per environment.

## Anchor Signatures for Common Controls

| Control | Text Anchor | Typical Location | Tier B Fallback |
|---------|-------------|------------------|-----------------|
| **Edit button** | `Edit` | Top-right action bar | First primary button in top action bar |
| **Add Property** | `Add Property` | Properties panel header (Edit mode only) | Button row at top of Properties panel |
| **Name field** | `Name` | First input in modal/form | First textbox in modal body |
| **Label field** | `Label` | Second input in modal/form | Textbox immediately following Name |
| **Details tab** | `Details` | Tab strip under page header | Leftmost tab in the tab row |
| **Save / OK** | `OK` or `Save` | Bottom of modal/dialog | Primary button at bottom of modal |
| **+New** | `+New` or `+ New` | Middle panel toolbar | Button in toolbar area of center panel |

## Focus Recovery Micro-Protocol

If typing does not appear in the expected field:
1. Click the field again
2. `Ctrl+A` then type/paste
3. If still no input: click the modal title/header area once, then click the field again
4. If the UI appears stuck, stop and ask the user to confirm the page state

## Common UI States to Watch For

- **Edit mode not active** — Look for the Edit button; Add Property won't appear until Edit mode is enabled
- **Inactivity Warning** — PU shows a session timeout dialog after inactivity. Click to dismiss and continue.
- **Spinner visible** — Wait for it to complete before interacting with the page
- **3-panel layout** — Left panel (navigation), Center panel (list/report), Right panel (details/config)
- **Modal dialog open** — When Add Property or other dialogs are open, the background is dimmed

## ProcessUnity URL Patterns

- Main app: `https://app.processunity.net/ocean/Default.aspx?nav=...`
- Help articles: `https://processunity.my.site.com/support/apex/ExternalArticleViewer?urlName=...`
- The `nav` parameter encodes the current navigation position (area/group/task)

## Report Builder Navigation

When in the Custom Reports area:
- **Left panel**: Navigation tree
- **Center panel**: Report output / report list
- **Right panel**: Report configuration (when editing)
- Toggle between report view and chart view using the toolbar button
- Edit report details while the report is displayed in the center panel — click Run to see changes immediately

## Dashboard Builder Navigation

When editing a Custom Dashboard:
- **Dashboard Details** button in middle panel to enter edit mode
- **Add Chart** to add chart components from existing reports
- Charts can be dragged/resized on the canvas
- Each chart can have individual Run Time Filters applied
- **Save** to persist layout changes
- **Access tab** to publish to roles/teams
