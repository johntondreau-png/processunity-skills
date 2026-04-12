# Procedure: create_delete_report

Create a Custom Report with a Bulk Delete report action for targeted record cleanup. ProcessUnity does not have a standalone bulk delete API — the only way to delete records in bulk is through a report with a Bulk Delete action.

## Inputs (required)

| Parameter | Type | Description |
|-----------|------|-------------|
| object_name | string | Target object type (e.g., "Reference Data", "Third Party", "Issue") |
| report_name | string | Report name (e.g., "ADM: Delete Typeless Reference Data") |
| columns | string[] | Column names to include (e.g., ["Name", "Type", "External ID"]) |

## Inputs (optional)

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| design_time_filter | object | — | Pre-filter to scope records: `{ column: "Type", operator: "Is equal to", value: "" }` |
| require_confirmation | boolean | true | Show confirmation dialog before deleting |
| action_name | string | "Delete Selected Records" | Display name of the delete button |

## Prerequisites

- Logged into the target PU instance in the browser
- Browser at 100% zoom, window maximized
- Can see main navigation tabs (WORKSPACE, ASSESSMENTS, REPORTS, SETTINGS, HELP)

## Navigation

REPORTS > Custom Reports > New

## Steps

### Phase 1: Create Report Shell

1. **Navigate to Custom Reports**
   - Click **REPORTS** tab in main navigation
   - Click **Custom Reports** in the left panel
   - Click **New** in the master toolbar (id: `paneMaster_mtb_New`)

2. **Configure report basics**
   - Enter **Name**: `report_name`
   - Set **Type (Level 1)**: `object_name` (from dropdown `paneDetail_customReportSetupView_ddlObjectType`)
   - Click **Done** (id: `paneDetail_dtb_Done`)

### Phase 2: Add Columns

3. **Edit the report**
   - Click **Edit** (id: `paneDetail_dtb_Edit`)

4. **Add columns**
   - Click **Add Columns** button (id: `paneDetail$customReportSetupView$addColumnMenu`)
   - A dialog appears with DataTable (`dtReportColSelection`)
   - Click each target column row to select (rows use `DTTT_selectable` class — clicking toggles selection)
   - Click **OK** to add selected columns

### Phase 3: Configure Design Time Filter (optional)

5. **Open column filter**
   - Click the column name link to open its detail dialog (id: `paneDetail_customReportSetupView_lbEdit_{columnOid}`)
   - Click the **Filters** tab in the dialog

6. **Set Design Time Filter**
   - Select operator from dropdown (id: `customReportColumnPropertiesDialog_ddlCriteria`):
     - `210`: Is equal to
     - `215`: Is not equal to
     - `212`: Is included in
     - `216`: Is not included in
     - `211`: Is greater than
     - `213`: Is less than
     - `209`: Is between
   - Enter value (for empty/blank, leave value empty with "Is equal to")
   - Click **OK** to close column dialog

### Phase 4: Add Bulk Delete Action

7. **Navigate to Actions tab**
   - Click the **Actions** link/tab in the report detail pane

8. **Add Report Action**
   - Click **Add Action** (id: `paneDetail_reportActionsView_btnAddItem`)
   - A dialog appears: "Add Report Action"

9. **Configure the action**
   - Enter **Name**: `action_name` (id: `addReportActionDialog_tbxName`)
   - Set **Report Action Type** to **Bulk Delete** (value `2` on hidden select `addReportActionDialog_ddlReportActionType`)
     - The select is hidden behind a search combobox — set the value directly via JavaScript, or use the search input to type "Bulk Delete"
   - Check **Require Confirmation** (id: `addReportActionDialog_RequireConfirmation`)
   - Click **OK** to save the action

10. **Save the report**
    - Click **Done** (id: `paneDetail_dtb_Done`)

### Phase 5: Execute Deletion

11. **Run the report**
    - Click **Run Report** in the toolbar
    - Verify the filtered records are correct

12. **Delete records**
    - Click the **Delete Selected Records** button (id: `paneMaster_mtb_RunAction_{actionOid}`)
    - A dialog appears with all filtered records and checkboxes
    - Click **select-all** checkbox (id: `runActionFormDialog_cbxAction_select-all`)
    - Review the record list
    - Click **OK** to confirm deletion

## Report Action Types Reference

| Value | Type | Description |
|-------|------|-------------|
| 1 | Form / Steps | Multi-step WFA-style actions |
| **2** | **Bulk Delete** | Delete selected records |
| 4 | New Item (Unrelated) - Details Tab | Create new record via details tab |
| 5 | New Item (Unrelated) - Form | Create new record via form |
| 6 | New Item (Related) - Details Tab | Create related child record via details tab |
| 7 | New Item (Related) - Form | Create related child record via form |

## Design Time Filter Operators Reference

| Value | Operator |
|-------|----------|
| None | No filter |
| 210 | Is equal to |
| 215 | Is not equal to |
| 212 | Is included in |
| 216 | Is not included in |
| 211 | Is greater than |
| 213 | Is less than |
| 209 | Is between |
| 214 | Is not between |

## Verification

- [ ] Report appears in Custom Reports list
- [ ] Report columns show the specified fields
- [ ] Design time filter correctly scopes records (verify record count)
- [ ] "Delete Selected Records" button appears when running the report
- [ ] Select-all checkbox selects all filtered records
- [ ] Confirmation dialog shows before deletion (if enabled)
- [ ] After deletion, re-running the report shows 0 records

## Common Errors

| Symptom | Cause | Fix |
|---------|-------|-----|
| "More than 1 column needs to be selected for Bulk Delete" | Bulk Delete/Update checkboxes on columns need to be set | Enable the `chkBulk_` checkboxes on at least 2 column rows |
| Delete dialog shows all records, not filtered | Design Time Filter may not have saved | Re-edit the column, verify Filters tab, re-save |
| "Delete Selected Records" button not visible | Report Action not saved properly | Re-edit Actions tab, verify action exists with type "Bulk Delete" |
| No checkboxes in delete dialog | Report Action type is wrong | Verify Report Action Type = 2 (Bulk Delete) |
| Delete fails silently | Records may be referenced by other objects | Check for relationship dependencies |

## Notes

- **Bulk Delete is the only way to delete records in PU** — there is no delete API endpoint
- The design time filter scopes the delete dialog — only filtered records appear for selection
- Deletion is **permanent and irreversible** — always verify the filter before executing
- The select-all checkbox includes ALL filtered records, not just the visible page
- For large deletions (1000+), PU may process in batches — wait for completion before re-running
