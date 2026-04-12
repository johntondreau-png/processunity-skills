/**
 * DORA Post-Flight Validation
 * Run AFTER completing the DORA uplift to verify everything was configured correctly.
 *
 * Usage: Load via browser_run_code, must be logged into the PU instance.
 * Uses the MCP API (processunity-desert or processunity) to check reports and data.
 * Also checks properties via browser automation.
 */
async function postFlightCheck(page) {
  const results = { pass: [], fail: [], warn: [] };
  const p = (msg) => results.pass.push(msg);
  const f = (msg) => results.fail.push(msg);
  const w = (msg) => results.warn.push(msg);

  const baseUrl = page.url().split('/Default')[0];

  // ─── 1. Property Counts ────────────────────────────────────────────
  await page.goto(`${baseUrl}/Default.aspx?nav=%2Farea%2F8%2Fgroup%2F417%2Ftask%2F265%2Ftab%2F109%2Fshow`);
  await page.waitForTimeout(3000);

  const expectedCounts = {
    'Custom Object One': 30,      // Legal Entity
    'Custom Object Three': 19,    // CIF
    'Third Party': 32,            // Vendor
    'Third-Party Service': 27,    // Vendor Service
    'Service Add On': 23,         // Service Add On
    'Agreement': 32,              // Agreement
    'Fourth Party': 10,           // Fourth Party
    'Custom Object One Child Object': 6, // Legal Entity Contract
    'Questionnaire Response': 8,  // QR
    'Reference Data': 3,          // Reference Data
  };

  const actualCounts = await page.evaluate(() => {
    const rows = document.querySelectorAll('.MuiDataGrid-row');
    const counts = {};
    rows.forEach(r => {
      const parts = r.innerText?.split('\n');
      if (parts?.length >= 2) {
        const name = parts[0]?.trim();
        const count = parseInt(parts[1]?.trim());
        if (!isNaN(count)) counts[name] = count;
      }
    });
    return counts;
  });

  for (const [obj, expected] of Object.entries(expectedCounts)) {
    const actual = actualCounts[obj];
    if (actual === undefined) w(`Properties: ${obj} not found in grid`);
    else if (actual >= expected) p(`Properties: ${obj} — ${actual} (expected ${expected}) ✓`);
    else f(`Properties: ${obj} — ${actual} (expected ${expected}) ✗ MISSING ${expected - actual}`);
  }

  // ─── 2. Reference Data Counts ──────────────────────────────────────
  // This requires the MCP API — skip if not available, check via browser instead
  await page.goto(`${baseUrl}/Default.aspx?nav=%2Farea%2F8%2Fgroup%2F417%2Ftask%2F432%2Ftab%2F9%2Fshow`);
  await page.waitForTimeout(3000);

  const refDataInfo = await page.evaluate(() => {
    const content = document.body.innerText;
    const doraMatches = content.match(/DORA/g);
    return { doraReferences: doraMatches?.length || 0 };
  });

  if (refDataInfo.doraReferences > 0) p(`Reference Data: ${refDataInfo.doraReferences} DORA references found ✓`);
  else f('Reference Data: No DORA references found ✗');

  // ─── 3. Report Counts ──────────────────────────────────────────────
  await page.goto(`${baseUrl}/Default.aspx?nav=%2Farea%2F12%2Fgroup%2F421%2Ftask%2F257%2Ftab%2F9%2Fshow`);
  await page.waitForTimeout(3000);

  // Count DORA reports by scrolling through the grid
  const reportCounts = { excel: 0, dash: 0, btn: 0 };
  for (let pct = 0; pct <= 100; pct += 10) {
    await page.evaluate((p) => {
      const s = document.querySelector('.MuiDataGrid-virtualScroller');
      if (s) s.scrollTop = s.scrollHeight * p / 100;
    }, pct);
    await page.waitForTimeout(300);
    const counts = await page.evaluate(() => {
      const rows = document.querySelectorAll('.MuiDataGrid-row');
      let e = 0, d = 0, b = 0;
      rows.forEach(r => {
        const t = r.innerText;
        if (t?.includes('EXCEL_DORA')) e++;
        if (t?.includes('DASH: DORA') || t?.includes('DASH: DATA: Legal')) d++;
        if (t?.includes('BTN: AGREEMENT:') || t?.includes('BTN: QR:') || t?.includes('BTN: VENDOR:') || t?.includes('BTN: SERVICE:')) b++;
      });
      return { e, d, b };
    });
    reportCounts.excel = Math.max(reportCounts.excel, counts.e);
    reportCounts.dash = Math.max(reportCounts.dash, counts.d);
    reportCounts.btn = Math.max(reportCounts.btn, counts.b);
  }

  if (reportCounts.excel >= 14) p(`Reports: ${reportCounts.excel} EXCEL export reports ✓`);
  else f(`Reports: ${reportCounts.excel} EXCEL export reports (expected 14) ✗`);

  if (reportCounts.dash >= 5) p(`Reports: ${reportCounts.dash} Dashboard reports ✓`);
  else f(`Reports: ${reportCounts.dash} Dashboard reports (expected 5) ✗`);

  if (reportCounts.btn >= 11) p(`Reports: ${reportCounts.btn} WFA/BTN reports ✓`);
  else w(`Reports: ${reportCounts.btn} WFA/BTN reports (expected 11) — may overlap with existing`);

  // ─── 4. Button Counts ──────────────────────────────────────────────
  await page.goto(`${baseUrl}/Default.aspx?nav=%2Farea%2F8%2Fgroup%2F483%2Ftask%2F461%2Ftab%2F122%2Fshow`);
  await page.waitForTimeout(3000);

  const buttonObjects = ['Agreement', 'Third Party', 'Third-Party Service', 'Custom Object One', 'Questionnaire Response'];
  const expectedButtons = {
    'Agreement': ['Update and Relate Service', 'Relate Legal Entity to Agreement'],
    'Third Party': ['Create New Fourth Party', 'Relate Existing Fourth Party to Vendor', 'Relate Vendor to Legal Entity'],
    'Third-Party Service': ['Create Service Add On', 'Relate Fourth Party to Vendor Service'],
    'Custom Object One': ['Create Legal Entity Contract'],
    'Questionnaire Response': ['Complete Fourth Party Review']
  };

  for (const obj of buttonObjects) {
    await page.evaluate((n) => {
      document.querySelectorAll('.MuiDataGrid-row').forEach(r => {
        if (r.innerText?.startsWith(n + '\n')) r.click();
      });
    }, obj);
    await page.waitForTimeout(1500);

    const buttons = await page.evaluate((expected) => {
      const content = document.body.innerText;
      return expected.filter(name => content.includes(name));
    }, expectedButtons[obj]);

    if (buttons.length === expectedButtons[obj].length) {
      p(`Buttons: ${obj} — all ${buttons.length} DORA buttons found ✓`);
    } else {
      const missing = expectedButtons[obj].filter(b => !buttons.includes(b));
      f(`Buttons: ${obj} — missing: ${missing.join(', ')} ✗`);
    }
  }

  // ─── 5. Import Templates ───────────────────────────────────────────
  await page.goto(`${baseUrl}/Default.aspx?nav=%2Farea%2F8%2Fgroup%2F417%2Ftask%2F429%2Ftab%2F9%2Fshow`);
  await page.waitForTimeout(3000);

  const importTemplates = await page.evaluate(() => {
    const content = document.body.innerText;
    const doraImports = ['DORA IMPORT 1', 'DORA IMPORT 2', 'DORA IMPORT 3', 'DORA IMPORT 4',
                          'DORA IMPORT 5', 'DORA IMPORT 6', 'DORA IMPORT 8', 'DORA: Reference Data Import'];
    return doraImports.filter(name => content.includes(name));
  });

  if (importTemplates.length >= 8) p(`Import Templates: all ${importTemplates.length} DORA templates found ✓`);
  else f(`Import Templates: ${importTemplates.length}/8 found ✗ — missing: ${8 - importTemplates.length}`);

  // ─── Summary ───────────────────────────────────────────────────────
  const summary = {
    status: results.fail.length === 0 ? 'ALL CHECKS PASSED' : `${results.fail.length} ISSUES FOUND`,
    passed: results.pass.length,
    failed: results.fail.length,
    warnings: results.warn.length,
    details: results
  };

  return JSON.stringify(summary, null, 2);
}
