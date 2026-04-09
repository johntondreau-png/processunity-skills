/**
 * ProcessUnity MCP Report Creator — Playwright Automation Script
 *
 * Creates a Custom Report with:
 * - Name: [MCP - {objectName}]
 * - Level 1: {level1Value}
 * - Enable for Automated Export: checked
 * - Access: Selected Roles → MCP - Model Context Protocol
 * - Columns: All available columns for the object type
 *
 * Usage via browser_run_code:
 *   Paste createMcpReport function, then call it with the object name and level 1 value.
 *
 * PU Element IDs (verified on desert instance 2026-04-09):
 * - Name field: #paneDetail_customReportSetupView_tbxName
 * - Level 1 dropdown: #paneDetail_customReportSetupView_ddlObjectType_search
 * - New button: #paneMaster_mtb_New
 * - Edit button: #paneDetail_dtb_Edit
 * - Save button: #paneDetail_dtb_Save
 * - Done button: #paneDetail_dtb_Done
 * - Access container: #paneDetail_customReportAccessView_divAccessEdit
 *
 * Available Level 1 Object Types (desert instance):
 * Agreement, Application, Assessment, Assessment Category, Assessment Period,
 * Assessment Phase, Assessment Test Execution, Assessment Test Procedure,
 * Assessment Type, Document, Document Category, Document Request, Facility,
 * Fourth Party, GRX Finding, Individual, Issue, Managed Document,
 * My Organization, Questionnaire, Questionnaire Question, Questionnaire Response,
 * Questionnaire Section, Reference Data, Report Category, Role, Team,
 * Third Party, Third-Party Request, Third-Party Service, Web Link
 *
 * Lessons Learned:
 * - The "busy shield" overlay blocks clicks during PU page transitions.
 *   Use page.evaluate() to bypass it, or increase wait times.
 * - The Add Columns dialog grid uses [role="grid"] with [role="row"] children.
 *   The first grid is the header, the second grid has the selectable columns.
 * - Column count varies per object type (Assessment had 429, others will differ).
 * - The dialog needs 3+ seconds to load all columns before selecting.
 * - Clicking all rows selects all columns — each click toggles selection.
 * - For the Access tab, "Selected Roles" is a div, not a radio button.
 *   The MCP role appears in a listItem dropdown after clicking "Selected Roles".
 */

async function createMcpReport(page, objectName, level1Value) {
  const reportName = `[MCP - ${objectName}]`;
  const WAIT_SHORT = 1000;
  const WAIT_MEDIUM = 2000;
  const WAIT_LONG = 3000;
  const WAIT_DIALOG = 4000;

  // --- Phase 1: Create report shell ---

  // Click New
  await page.evaluate(() => document.getElementById('paneMaster_mtb_New')?.click());
  await page.waitForTimeout(WAIT_LONG);

  // Fill name
  await page.fill('#paneDetail_customReportSetupView_tbxName', reportName);
  await page.waitForTimeout(WAIT_SHORT);

  // Select Level 1 type
  await page.click('#paneDetail_customReportSetupView_ddlObjectType_search');
  await page.waitForTimeout(WAIT_SHORT);
  await page.evaluate((val) => {
    document.querySelectorAll('[class*="listItem"]').forEach(item => {
      if (item.textContent?.trim() === val) item.click();
    });
  }, level1Value);
  await page.waitForTimeout(WAIT_SHORT);

  // Check "Enable for Automated Export"
  await page.evaluate(() => {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb.parentElement?.textContent?.includes('Enable for Automated Export') && !cb.checked) cb.click();
    });
  });

  // --- Phase 2: Set Access ---

  await page.evaluate(() => {
    document.querySelectorAll('a').forEach(a => {
      if (a.textContent?.trim() === 'Access' && a.href?.endsWith('#')) a.click();
    });
  });
  await page.waitForTimeout(WAIT_MEDIUM);

  await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
  await page.waitForTimeout(WAIT_MEDIUM);

  await page.evaluate(() => {
    const c = document.querySelector('#paneDetail_customReportAccessView_divAccessEdit');
    c?.querySelectorAll('div').forEach(d => {
      if (d.textContent?.trim() === 'Selected Roles' && d.children.length === 0) d.click();
    });
  });
  await page.waitForTimeout(WAIT_MEDIUM);

  await page.evaluate(() => {
    document.querySelectorAll('[class*="listItem"]').forEach(item => {
      if (item.textContent?.trim() === 'MCP - Model Context Protocol') item.click();
    });
  });
  await page.waitForTimeout(WAIT_SHORT);

  await page.evaluate(() => document.getElementById('paneDetail_dtb_Save')?.click());
  await page.waitForTimeout(WAIT_LONG);

  // --- Phase 3: Add All Columns ---

  await page.evaluate(() => {
    document.querySelectorAll('a').forEach(a => {
      if (a.textContent?.trim() === 'Details' && a.href?.endsWith('#')) a.click();
    });
  });
  await page.waitForTimeout(WAIT_MEDIUM);

  await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
  await page.waitForTimeout(WAIT_MEDIUM);

  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.textContent?.trim() === 'Add Columns') btn.click();
    });
  });
  await page.waitForTimeout(WAIT_DIALOG);

  // Select all columns in the dialog
  const colCount = await page.evaluate(() => {
    const dialog = document.querySelector('[role="dialog"]');
    if (!dialog) return 0;
    const grids = dialog.querySelectorAll('[role="grid"]');
    if (grids.length < 2) return 0;
    let count = 0;
    grids[1].querySelectorAll('[role="row"]').forEach(row => {
      if (row.textContent?.trim() && row.textContent.trim() !== 'Column Name') {
        row.click();
        count++;
      }
    });
    return count;
  });

  // Click OK to confirm
  await page.evaluate(() => {
    document.querySelector('[role="dialog"]')?.querySelectorAll('button').forEach(btn => {
      if (btn.textContent?.trim() === 'OK') btn.click();
    });
  });
  await page.waitForTimeout(WAIT_LONG);

  // --- Phase 4: Save ---
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Done')?.click());
  await page.waitForTimeout(WAIT_LONG);

  return { reportName, level1Value, columns: colCount };
}

// --- Batch creation ---
// Call from browser_run_code like:
// const reports = [
//   { name: 'Fourth Party', level1: 'Fourth Party' },
//   { name: 'Issue', level1: 'Issue' },
//   ...
// ];
// for (const r of reports) {
//   await createMcpReport(page, r.name, r.level1);
// }
