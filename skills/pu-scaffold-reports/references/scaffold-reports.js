/**
 * ProcessUnity MCP Report Scaffolding — Playwright Automation
 *
 * Creates one Custom Report per object type with all columns, scoped to a
 * service role. Uses the two-pass algorithm required by PU's Level 1 persistence
 * behavior.
 *
 * Usage: Run individual functions via browser_run_code, or compose them
 * in a batch script. See examples at bottom.
 *
 * Tested on PU instances: ocean, desert (2026-04)
 */

// ═══════════════════════════════════════════════════════════════════════
// CONFIGURATION
// ═══════════════════════════════════════════════════════════════════════

const CONFIG = {
  reportPrefix: '[MCP - ',
  reportSuffix: ']',
  roleName: 'MCP - Model Context Protocol',
  waitShort: 1000,
  waitMedium: 2000,
  waitLong: 3000,
  waitDialog: 5000,
  dialogRetries: 12,
};

// ═══════════════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════

/**
 * Login to a PU instance.
 */
async function login(page, url, username, password) {
  await page.goto(url + '/Login.aspx');
  await page.waitForTimeout(2000);

  // Check if already logged in (redirected to default.aspx)
  if (page.url().includes('default.aspx')) return 'already logged in';

  await page.fill('[id*="tbxUsername"]', username);
  await page.fill('[id*="tbxPassword"]', password);
  await page.click('button:has-text("Login"), [id*="btnLogin"]');
  await page.waitForTimeout(5000);
  return 'logged in';
}

/**
 * Navigate to Custom Reports page.
 */
async function navigateToCustomReports(page) {
  // Click REPORTS tab
  await page.evaluate(() => {
    document.querySelector('[data-testid="area-Reports"]')?.click();
  });
  await page.waitForTimeout(CONFIG.waitMedium);

  // Click Custom Reports in sidebar
  await page.evaluate(() => {
    document.querySelectorAll('div').forEach(d => {
      if (d.textContent?.trim() === 'Custom Reports' && d.children.length === 0) d.click();
    });
  });
  await page.waitForTimeout(CONFIG.waitLong);
}

/**
 * Discover all available Level 1 object types from the dropdown.
 * Opens a new report temporarily, reads the dropdown, then cancels.
 */
async function discoverObjectTypes(page) {
  // Click New
  await page.evaluate(() => document.getElementById('paneMaster_mtb_New')?.click());
  await page.waitForTimeout(CONFIG.waitLong);

  // Open Level 1 dropdown
  await page.evaluate(() => {
    document.getElementById('paneDetail_customReportSetupView_ddlObjectType')?.click();
  });
  await page.waitForTimeout(CONFIG.waitMedium);

  // Read all items
  const types = await page.evaluate(() => {
    const container = document.getElementById('paneDetail_customReportSetupView_ddlObjectType');
    if (!container) return [];
    const items = container.querySelectorAll('[class*="listItem"]');
    return Array.from(items).map(i => i.textContent?.trim()).filter(Boolean);
  });

  // Cancel — don't create a report
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Cancel')?.click());
  await page.waitForTimeout(CONFIG.waitMedium);

  return types;
}

/**
 * Set the Level 1 dropdown value using PU's React dropdown widget.
 */
async function setLevel1(page, level1Value) {
  // Open dropdown container
  await page.evaluate(() => {
    document.getElementById('paneDetail_customReportSetupView_ddlObjectType')?.click();
  });
  await page.waitForTimeout(CONFIG.waitShort);

  // Type to filter using native setter (required for React)
  await page.evaluate((val) => {
    const search = document.getElementById('paneDetail_customReportSetupView_ddlObjectType_search');
    if (!search) return;
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype, 'value'
    ).set;
    nativeSetter.call(search, val);
    search.dispatchEvent(new Event('input', { bubbles: true }));
  }, level1Value);
  await page.waitForTimeout(CONFIG.waitMedium);

  // Click exact match
  await page.evaluate((val) => {
    Array.from(document.querySelectorAll('div')).find(d =>
      d.textContent?.trim() === val &&
      d.children.length === 0 &&
      d.offsetHeight > 0
    )?.click();
  }, level1Value);
  await page.waitForTimeout(CONFIG.waitShort);
}

/**
 * Set report access to a specific role.
 */
async function setReportAccess(page, roleName) {
  // Go to Access tab
  await page.evaluate(() => {
    document.querySelectorAll('a').forEach(a => {
      if (a.textContent?.trim() === 'Access' && a.href?.endsWith('#')) a.click();
    });
  });
  await page.waitForTimeout(CONFIG.waitMedium);

  // Edit
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
  await page.waitForTimeout(CONFIG.waitMedium);

  // Select "Selected Roles"
  await page.evaluate(() => {
    const c = document.querySelector('#paneDetail_customReportAccessView_divAccessEdit');
    c?.querySelectorAll('div').forEach(d => {
      if (d.textContent?.trim() === 'Selected Roles' && d.children.length === 0) d.click();
    });
  });
  await page.waitForTimeout(CONFIG.waitMedium);

  // Pick role
  await page.evaluate((role) => {
    document.querySelectorAll('[class*="listItem"]').forEach(item => {
      if (item.textContent?.trim() === role) item.click();
    });
  }, roleName);
  await page.waitForTimeout(CONFIG.waitShort);

  // Save
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Save')?.click());
  await page.waitForTimeout(CONFIG.waitLong);
}

/**
 * Add all available columns to a report.
 * Assumes report is in edit mode on Details tab with Level 1 already set.
 * Returns number of columns added, or 0 if dialog didn't load.
 */
async function addAllColumns(page) {
  // Check Add Columns button exists
  const hasBtn = await page.evaluate(() =>
    Array.from(document.querySelectorAll('button')).some(b => b.textContent?.trim() === 'Add Columns')
  );
  if (!hasBtn) return 0;

  // Click Add Columns
  await page.evaluate(() => {
    document.querySelectorAll('button').forEach(btn => {
      if (btn.textContent?.trim() === 'Add Columns') btn.click();
    });
  });

  // Wait for dialog with retry
  let ready = false;
  for (let i = 0; i < CONFIG.dialogRetries; i++) {
    await page.waitForTimeout(CONFIG.waitShort);
    ready = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      if (!d) return false;
      const g = d.querySelectorAll('[role="grid"]');
      return g.length >= 2 && g[1].querySelectorAll('[role="row"]').length > 1;
    });
    if (ready) break;
  }

  if (!ready) return 0;

  // Select all columns
  const colCount = await page.evaluate(() => {
    const g = document.querySelector('[role="dialog"]').querySelectorAll('[role="grid"]');
    let c = 0;
    g[1].querySelectorAll('[role="row"]').forEach(r => {
      if (r.textContent?.trim() && r.textContent.trim() !== 'Column Name') {
        r.click();
        c++;
      }
    });
    return c;
  });

  // Click OK
  await page.evaluate(() => {
    document.querySelector('[role="dialog"]')?.querySelectorAll('button').forEach(b => {
      if (b.textContent?.trim() === 'OK') b.click();
    });
  });
  await page.waitForTimeout(CONFIG.waitDialog);

  return colCount;
}

/**
 * Create a single MCP report for an object type.
 * Full two-pass: create shell → save → re-edit → add columns → save.
 */
async function createMcpReport(page, objectType, roleName) {
  const reportName = `${CONFIG.reportPrefix}${objectType}${CONFIG.reportSuffix}`;
  let colCount = 0;

  // ── PASS 1: Create shell with Level 1 ──

  await page.evaluate(() => document.getElementById('paneMaster_mtb_New')?.click());
  await page.waitForTimeout(CONFIG.waitLong);

  // Set name
  await page.fill('#paneDetail_customReportSetupView_tbxName', reportName);
  await page.waitForTimeout(500);

  // Set Level 1
  await setLevel1(page, objectType);

  // Check "Enable for Automated Export"
  await page.evaluate(() => {
    document.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      if (cb.parentElement?.textContent?.includes('Enable for Automated Export') && !cb.checked) {
        cb.click();
      }
    });
  });

  // Save shell (persists Level 1)
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Done')?.click());
  await page.waitForTimeout(CONFIG.waitLong);

  // ── Set Access ──
  await setReportAccess(page, roleName);

  // ── PASS 2: Add Columns ──

  // Switch to Details tab
  await page.evaluate(() => {
    document.querySelectorAll('a').forEach(a => {
      if (a.textContent?.trim() === 'Details' && a.href?.endsWith('#')) a.click();
    });
  });
  await page.waitForTimeout(CONFIG.waitMedium);

  // Edit
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
  await page.waitForTimeout(CONFIG.waitMedium);

  // Add all columns
  colCount = await addAllColumns(page);

  // Save
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Done')?.click());
  await page.waitForTimeout(CONFIG.waitLong);

  return { reportName, objectType, columns: colCount };
}

/**
 * Fix an existing report that's missing Level 1 and/or columns.
 */
async function fixExistingReport(page, reportName, objectType) {
  // Select the report in the grid
  await page.evaluate((name) => {
    document.querySelectorAll('[role="row"]').forEach(row => {
      if (row.textContent?.includes(name)) row.click();
    });
  }, reportName);
  await page.waitForTimeout(CONFIG.waitMedium);

  // Details tab
  await page.evaluate(() => {
    document.querySelectorAll('a').forEach(a => {
      if (a.textContent?.trim() === 'Details' && a.href?.endsWith('#')) a.click();
    });
  });
  await page.waitForTimeout(CONFIG.waitMedium);

  // Edit
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
  await page.waitForTimeout(CONFIG.waitMedium);

  // Check if Level 1 needs setting (Add Columns absent = no Level 1)
  const needsLevel1 = !(await page.evaluate(() =>
    Array.from(document.querySelectorAll('button')).some(b => b.textContent?.trim() === 'Add Columns')
  ));

  if (needsLevel1) {
    await setLevel1(page, objectType);
    await page.evaluate(() => document.getElementById('paneDetail_dtb_Done')?.click());
    await page.waitForTimeout(CONFIG.waitLong);
    await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
    await page.waitForTimeout(CONFIG.waitMedium);
  }

  const colCount = await addAllColumns(page);

  await page.evaluate(() => document.getElementById('paneDetail_dtb_Done')?.click());
  await page.waitForTimeout(CONFIG.waitLong);

  return { reportName, objectType, columns: colCount, fixedLevel1: needsLevel1 };
}

// ═══════════════════════════════════════════════════════════════════════
// BATCH ORCHESTRATION
// ═══════════════════════════════════════════════════════════════════════

/**
 * Full scaffolding: discover types, check existing, create missing, fix broken.
 *
 * Usage via browser_run_code:
 *   async (page) => {
 *     // paste this entire file, then:
 *     return await scaffoldAll(page, {
 *       url: 'https://app.processunity.net/<your-tenant>',
 *       username: '<your-service-account>',
 *       password: '<your-password>',
 *       roleName: 'MCP - Model Context Protocol',
 *       existingReportNames: ['[MCP - Agreement]', '[MCP - Assessment]'], // from list_reports API
 *     });
 *   }
 */
async function scaffoldAll(page, options) {
  const {
    url,
    username,
    password,
    roleName = CONFIG.roleName,
    existingReportNames = [],
    objectTypes = null, // null = auto-discover
  } = options;

  const results = [];

  // Login
  await login(page, url, username, password);

  // Navigate
  await navigateToCustomReports(page);

  // Discover object types if not provided
  const types = objectTypes || await discoverObjectTypes(page);

  // Determine which reports need creating vs fixing
  for (const objType of types) {
    const reportName = `${CONFIG.reportPrefix}${objType}${CONFIG.reportSuffix}`;
    const exists = existingReportNames.some(n =>
      n.toLowerCase().includes(objType.toLowerCase())
    );

    try {
      if (!exists) {
        // Create new
        const result = await createMcpReport(page, objType, roleName);
        results.push({ ...result, action: 'created' });
      } else {
        // Fix existing (add columns if missing)
        const result = await fixExistingReport(page, reportName, objType);
        results.push({ ...result, action: 'fixed' });
      }
    } catch (err) {
      results.push({
        reportName,
        objectType: objType,
        action: 'error',
        error: err.message?.substring(0, 100),
      });
      // Recover
      await page.evaluate(() => {
        document.getElementById('paneDetail_dtb_Done')?.click();
        document.getElementById('paneDetail_dtb_Cancel')?.click();
      });
      await page.waitForTimeout(CONFIG.waitMedium);
    }
  }

  return results;
}
