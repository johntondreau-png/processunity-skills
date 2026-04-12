/**
 * DORA Pre-Flight Validation
 * Run BEFORE starting the DORA uplift to verify the instance is ready.
 *
 * Usage: Load via browser_run_code, navigate to the PU instance first.
 * Returns a report of what's ready and what needs attention.
 */
async function preFlightCheck(page) {
  const results = { pass: [], fail: [], warn: [] };
  const p = (msg) => results.pass.push(msg);
  const f = (msg) => results.fail.push(msg);
  const w = (msg) => results.warn.push(msg);

  // 1. Navigate to System Settings
  await page.goto(page.url().split('/Default')[0] + '/Default.aspx?nav=%2Farea%2F8%2Fgroup%2F262%2Ftask%2F423%2Ftab%2F48%2FactiveObject%2F2%2FactiveObjectType%2F1%2Fshow');
  await page.waitForTimeout(3000);

  // 2. Check system settings checkboxes
  const settings = await page.evaluate(() => {
    const checks = {
      'Vendors': 'paneDetail_systemView_cbxVendors',
      'Vendor Services': 'paneDetail_systemView_cbxVendorServices',
      'Agreements': 'paneDetail_systemView_cbxAgreements',
      'Fourth Parties': 'paneDetail_systemView_cbxFourthParties',
      'Custom Object One': 'paneDetail_systemView_cbxCustomObjectOne',
      'Custom Object Three': 'paneDetail_systemView_cbxCustomObjectThree',
      'Vendor Custom Object One': 'paneDetail_systemView_cbxVendorCustomObjectOne',
      'Custom Object One Child Objects': 'paneDetail_systemView_cbxCustomObjectOneChildObjects',
      'Properties': 'paneDetail_systemView_cbxProperties',
      'Buttons': 'paneDetail_systemView_cbxButtons',
      'Custom Reports': 'paneDetail_systemView_cbxCustomReports',
      'Import Templates': 'paneDetail_systemView_cbxImportTemplates',
      'Reference Data': 'paneDetail_systemView_cbxReferenceData',
      'Web Services': 'paneDetail_systemView_cbxWebServices',
    };
    const results = {};
    for (const [name, id] of Object.entries(checks)) {
      const cb = document.getElementById(id);
      results[name] = cb ? cb.checked : null;
    }
    return results;
  });

  for (const [name, enabled] of Object.entries(settings)) {
    if (enabled === true) p(`System Setting: ${name} ✓`);
    else if (enabled === false) f(`System Setting: ${name} ✗ — MUST ENABLE`);
    else w(`System Setting: ${name} — checkbox not found`);
  }

  // 3. Check Subject Area renames
  await page.evaluate(() => {
    const tabs = document.querySelectorAll('[role="tab"]');
    for (const t of tabs) { if (t.innerText?.trim() === 'Subject Areas') { t.click(); return; } }
  });
  await page.waitForTimeout(2000);

  const subjectAreas = await page.evaluate(() => {
    const lis = document.querySelectorAll('ul li');
    return Array.from(lis).map(li => li.innerText?.trim());
  });

  if (subjectAreas.some(s => s.includes('Legal Entities'))) p('Subject Area: Custom Object One renamed to Legal Entities ✓');
  else if (subjectAreas.some(s => s.includes('Custom Object Ones'))) f('Subject Area: Custom Object One NOT renamed — needs "Legal Entities"');
  else w('Subject Area: Custom Object One not found in list');

  if (subjectAreas.some(s => s.includes('CIFs'))) p('Subject Area: Custom Object Three renamed to CIFs ✓');
  else if (subjectAreas.some(s => s.includes('Custom Object Threes'))) f('Subject Area: Custom Object Three NOT renamed — needs "CIFs"');

  // 4. Check Reference Data Type pick list
  await page.goto(page.url().split('/Default')[0] + '/Default.aspx?nav=%2Farea%2F8%2Fgroup%2F417%2Ftask%2F265%2Ftab%2F109%2Fshow');
  await page.waitForTimeout(3000);
  await page.evaluate(() => {
    document.querySelectorAll('.MuiDataGrid-row').forEach(r => {
      if (r.innerText?.startsWith('Reference Data\n')) r.click();
    });
  });
  await page.waitForTimeout(1500);

  // Check if Type property has DORA values
  const typePickListCount = await page.evaluate(() => {
    // This would require opening the Type property to check its pick list
    // For now, just count existing properties
    const content = document.body.innerText;
    return content.split('\n').filter(l => l.trim().startsWith('DORA')).length;
  });

  if (typePickListCount > 0) w(`Reference Data: ${typePickListCount} DORA properties already exist — may need cleanup`);
  else p('Reference Data: Clean slate — no existing DORA properties ✓');

  // 5. Summary
  const summary = {
    status: results.fail.length === 0 ? 'READY' : 'NOT READY',
    passed: results.pass.length,
    failed: results.fail.length,
    warnings: results.warn.length,
    details: results
  };

  return JSON.stringify(summary, null, 2);
}
