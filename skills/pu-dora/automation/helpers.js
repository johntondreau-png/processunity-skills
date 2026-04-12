/**
 * DORA ProcessUnity Automation Helpers
 * Reusable Playwright functions for configuring DORA in any PU instance.
 *
 * Usage: Load via browser_run_code filename parameter, or copy functions into scripts.
 * All functions take (page) as first argument + config parameters.
 */

// ─── Core Helpers ────────────────────────────────────────────────────────────

/** Scroll all detail pane containers to bottom, wait for render */
async function scrollToBottom(page, waitMs = 800) {
  await page.evaluate(() => {
    document.querySelectorAll('.pane-detail,.content-area,[class*="scroll"]').forEach(c => {
      if (c.scrollHeight > c.clientHeight) c.scrollTop = c.scrollHeight;
    });
    window.scrollTo(0, document.body.scrollHeight);
  });
  await page.waitForTimeout(waitMs);
}

/** Find a link by exact text, scrollIntoView, then click in a separate evaluate */
async function scrollAndClick(page, linkText) {
  await scrollToBottom(page);
  const found = await page.evaluate((n) => {
    const ls = document.querySelectorAll('a');
    for (const l of ls) {
      if (l.innerText?.trim() === n) {
        l.scrollIntoView({ block: 'center', behavior: 'instant' });
        return true;
      }
    }
    return false;
  }, linkText);
  if (!found) return false;
  await page.waitForTimeout(300);
  await page.evaluate((n) => {
    document.querySelectorAll('a').forEach(l => { if (l.innerText?.trim() === n) l.click(); });
  }, linkText);
  return true;
}

/** Wait for dialog to close, with retry OK click at halfway point */
async function waitDialogClose(page, maxIterations = 20) {
  for (let i = 0; i < maxIterations; i++) {
    await page.waitForTimeout(500);
    const open = await page.evaluate(() => {
      const d = document.querySelector('[role="dialog"]');
      return d && d.offsetWidth > 0;
    });
    if (!open) return true;
    if (i === Math.floor(maxIterations / 2)) {
      await page.evaluate(() => {
        document.querySelector('[role="dialog"]')?.querySelectorAll('button').forEach(b => {
          if (b.innerText?.trim() === 'OK') b.click();
        });
      });
    }
  }
  return false;
}

/** Click OK on dialog via evaluate (bypasses busy shield) */
async function clickDialogOK(page) {
  await page.evaluate(() => {
    document.querySelector('[role="dialog"]')?.querySelectorAll('button').forEach(b => {
      if (b.innerText?.trim() === 'OK') b.click();
    });
  });
  return waitDialogClose(page);
}

/** Save properties/buttons via Done, waiting for busy shield to clear */
async function saveDone(page) {
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Done')?.click());
  for (let i = 0; i < 30; i++) {
    await page.waitForTimeout(500);
    const shield = await page.evaluate(() =>
      document.getElementById('divShield')?.classList.contains('active')
    );
    if (!shield) break;
  }
  await page.waitForTimeout(1000);
}

/** Switch to an object in the Properties/Buttons grid and enter edit mode */
async function switchObjectAndEdit(page, puObjectName) {
  await page.evaluate((n) => {
    document.querySelectorAll('.MuiDataGrid-row').forEach(r => {
      if (r.innerText?.startsWith(n + '\n')) r.click();
    });
  }, puObjectName);
  await page.waitForTimeout(1500);
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
  await page.waitForTimeout(2000);
}

// ─── Property Creation ───────────────────────────────────────────────────────

/**
 * Create a property (non-Pick-List types).
 * Uses hidden select change — no postback needed.
 */
async function createSimpleProperty(page, name, typeId) {
  await page.click('#paneDetail_customPropertiesView_btnAddItem');
  await page.waitForTimeout(2000);
  await page.fill('#addCustomPropertyDialog_tbxName', name);
  await page.evaluate((t) => {
    const s = document.getElementById('addCustomPropertyDialog_ddlType');
    s.value = t;
    s.dispatchEvent(new Event('change', { bubbles: true }));
  }, String(typeId));
  await page.waitForTimeout(800);
  await clickDialogOK(page);
}

/**
 * Create a Pick List property.
 * Uses search combobox + Enter to trigger ASP.NET postback.
 * @param {string} values - Newline-separated pick list values
 */
async function createPickListProperty(page, name, values) {
  await page.click('#paneDetail_customPropertiesView_btnAddItem');
  await page.waitForTimeout(2000);
  await page.fill('#addCustomPropertyDialog_tbxName', name);
  await page.click('#addCustomPropertyDialog_ddlType_search');
  await page.waitForTimeout(300);
  await page.fill('#addCustomPropertyDialog_ddlType_search', '');
  await page.type('#addCustomPropertyDialog_ddlType_search', 'Pick List - Select One');
  await page.waitForTimeout(500);
  await page.keyboard.press('Enter');
  await page.waitForTimeout(5000); // Wait for ASP.NET postback
  await page.fill('#addCustomPropertyDialog_tbxList', values);
  await page.waitForTimeout(300);
  await clickDialogOK(page);
}

// ─── Formula Configuration ──────────────────────────────────────────────────

/** Configure a Text-Calculated or Date-Calculated property with an expression */
async function configCalcFormula(page, propName, expression) {
  if (!await scrollAndClick(page, propName)) return false;
  await page.waitForTimeout(2000);
  // Click Rules tab
  await page.evaluate(() => {
    document.querySelector('[role="dialog"]')?.querySelectorAll('a').forEach(l => {
      if (l.innerText?.trim() === 'Rules') l.click();
    });
  });
  await page.waitForTimeout(1000);
  // Fill expression
  await page.evaluate((e) => {
    const i = document.getElementById('addCustomPropertyDialog_txtValidationExpression');
    if (i) {
      Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set.call(i, e);
      i.dispatchEvent(new Event('input', { bubbles: true }));
      i.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, expression);
  await page.waitForTimeout(400);
  return clickDialogOK(page);
}

/** Configure a Text-Aggregate property: set source to External Id + mark hidden */
async function configAggExternalId(page, propName) {
  if (!await scrollAndClick(page, propName)) return false;
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const a = document.getElementById('addCustomPropertyDialog_ddlAggregateCustomProperty');
    if (a) {
      for (const o of a.options) {
        if (o.text === 'External Id') { a.value = o.value; break; }
      }
      a.dispatchEvent(new Event('change', { bubbles: true }));
    }
    const h = document.getElementById('addCustomPropertyDialog_HiddenCtrl');
    if (h && !h.checked) h.click();
  });
  await page.waitForTimeout(400);
  return clickDialogOK(page);
}

/** Mark a property as hidden */
async function configHidden(page, propName) {
  if (!await scrollAndClick(page, propName)) return false;
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const h = document.getElementById('addCustomPropertyDialog_HiddenCtrl');
    if (h && !h.checked) h.click();
  });
  await page.waitForTimeout(300);
  return clickDialogOK(page);
}

// ─── Ref Data Filter Configuration ─────────────────────────────────────────

/**
 * Configure a Reference Data type filter on a property.
 * Three-step postback sequence: open filter dropdown → select Type → select DORA type value.
 */
async function configRefDataFilter(page, propName, doraTypeName) {
  if (!await scrollAndClick(page, propName)) return false;
  await page.waitForTimeout(2500);
  // Step 1: Open filter property dropdown wrapper and click "Type"
  await page.evaluate(() => {
    const sel = document.getElementById('addCustomPropertyDialog_ddlFilterProperty');
    sel?.closest('.ui.dropdown')?.click();
  });
  await page.waitForTimeout(500);
  await page.evaluate(() => {
    document.querySelectorAll('.menu .item').forEach(i => {
      if (i.innerText?.trim() === 'Type' && i.offsetWidth > 0) i.click();
    });
  });
  await page.waitForTimeout(4000); // postback
  // Step 2: Open filter values multi-select and select DORA type
  await page.evaluate(() => {
    document.getElementById('suiDropdown_addCustomPropertyDialog_cboFilterValues')?.click();
  });
  await page.waitForTimeout(500);
  const si = await page.$('#addCustomPropertyDialog_cboFilterValues_search');
  if (si) {
    await si.fill('');
    await si.type(doraTypeName);
    await page.waitForTimeout(500);
  }
  await page.evaluate((dt) => {
    document.querySelectorAll('.menu .item').forEach(i => {
      if (i.innerText?.trim() === dt && i.offsetWidth > 0) i.click();
    });
  }, doraTypeName);
  await page.waitForTimeout(500);
  return clickDialogOK(page);
}

// ─── Conditional Display ────────────────────────────────────────────────────

/** Set conditional display on a section header to DORA? property */
async function configConditionalDisplay(page, propName) {
  if (!await scrollAndClick(page, propName)) return false;
  await page.waitForTimeout(2000);
  await page.evaluate(() => {
    const sel = document.getElementById('addCustomPropertyDialog_ddlConditionalDisplayProperty');
    if (sel) {
      for (const o of sel.options) {
        if (o.text === 'DORA?') { sel.value = o.value; break; }
      }
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  });
  await page.waitForTimeout(400);
  return clickDialogOK(page);
}

// ─── Report Creation ────────────────────────────────────────────────────────

/** Create a Custom Report shell with object type */
async function createReportShell(page, name, objectTypeId) {
  await page.click('#paneMaster_mtb_New');
  await page.waitForTimeout(2000);
  await page.fill('#paneDetail_customReportSetupView_tbxName', name);
  await page.evaluate((id) => {
    const sel = document.getElementById('paneDetail_customReportSetupView_ddlObjectType');
    sel.value = id;
    sel.dispatchEvent(new Event('change', { bubbles: true }));
  }, String(objectTypeId));
  await page.waitForTimeout(500);
  await saveDone(page);
}

/** Add columns to an existing report (find by scrolling grid) */
async function addReportColumns(page, reportName, columnNames, scrollPct) {
  // Scroll grid to find report
  await page.evaluate((p) => {
    const s = document.querySelector('.MuiDataGrid-virtualScroller');
    if (s) s.scrollTop = s.scrollHeight * p / 100;
  }, scrollPct);
  await page.waitForTimeout(800);
  const found = await page.evaluate((n) => {
    const rows = document.querySelectorAll('.MuiDataGrid-row');
    for (const row of rows) { if (row.innerText?.includes(n)) { row.click(); return true; } }
    return false;
  }, reportName);
  if (!found) return false;
  await page.waitForTimeout(1500);
  // Edit
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
  await page.waitForTimeout(2000);
  // Add Columns
  await page.evaluate(() => document.querySelector('[id*="addColumnMenu"]')?.click());
  await page.waitForTimeout(2000);
  // Select columns
  await page.evaluate((cols) => {
    const t = document.getElementById('dtReportColSelection');
    if (!t) return;
    t.querySelectorAll('tbody tr').forEach(r => {
      if (cols.includes(r.innerText?.trim())) r.click();
    });
  }, columnNames);
  await clickDialogOK(page);
  await page.waitForTimeout(1000);
  await saveDone(page);
  return true;
}

// ─── Button Creation ────────────────────────────────────────────────────────

/** Create a button on the current object (must be in Buttons admin, edit mode) */
async function createButton(page, name) {
  await page.evaluate(() =>
    document.getElementById('paneDetail_CustomButtonsView_btnAddItem')?.click()
  );
  await page.waitForTimeout(2500);
  // Fill name via evaluate (dialog ID changes between postbacks)
  await page.evaluate((n) => {
    const d = document.querySelector('[role="dialog"]');
    if (!d) return;
    const inputs = d.querySelectorAll('input[type="text"]');
    for (const inp of inputs) {
      if (inp.offsetWidth > 0) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(inp, n);
        inp.dispatchEvent(new Event('input', { bubbles: true }));
        inp.dispatchEvent(new Event('change', { bubbles: true }));
        return;
      }
    }
  }, name);
  await page.waitForTimeout(300);
  await clickDialogOK(page);
}

/** Set conditional display on a button via View Access tab */
async function setButtonConditionalDisplay(page, buttonName, condPropertyName) {
  if (!await scrollAndClick(page, buttonName)) return false;
  await page.waitForTimeout(2500);
  // Click View Access tab
  await page.evaluate(() => {
    document.querySelector('[role="dialog"]')?.querySelectorAll('a').forEach(a => {
      if (a.innerText?.trim() === 'View Access') a.click();
    });
  });
  await page.waitForTimeout(1000);
  // Set conditional display
  await page.evaluate((prop) => {
    const sel = document.getElementById('addCustomButtonsDialog_ddlConditionalDisplayProperty');
    if (sel) {
      for (const o of sel.options) { if (o.text === prop) { sel.value = o.value; break; } }
      sel.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, condPropertyName);
  await page.waitForTimeout(400);
  return clickDialogOK(page);
}

/** Wire a button to a WFA report via Export/Import step */
async function wireButtonToWFA(page, buttonName, wfaReportSubstring) {
  if (!await scrollAndClick(page, buttonName)) return false;
  await page.waitForTimeout(2500);
  // Steps tab
  await page.evaluate(() => {
    document.querySelector('[role="dialog"]')?.querySelectorAll('a').forEach(a => {
      if (a.innerText?.trim() === 'Steps') a.click();
    });
  });
  await page.waitForTimeout(1000);
  // Add Step dropdown
  await page.click('[data-testid="addCustomButtonsDialog$addStepMenu"]');
  await page.waitForTimeout(1500);
  // Click Export/Import
  await page.evaluate(() => {
    document.querySelectorAll('.MuiPaper-root').forEach(p => {
      if (p.innerText?.includes('Export/Import') && p.offsetWidth > 0) {
        p.querySelectorAll('div, li, span').forEach(el => {
          if (el.innerText?.trim() === 'Export/Import' && el.children.length === 0) el.click();
        });
      }
    });
  });
  await page.waitForTimeout(3000);
  // Select WFA report
  await page.evaluate((sub) => {
    const sel = document.getElementById('addCustomButtonsDialog_stepDialog_ddlExportImportReport');
    if (!sel) return;
    for (const o of sel.options) {
      if (o.text.includes(sub)) { sel.value = o.value; sel.dispatchEvent(new Event('change', { bubbles: true })); return; }
    }
  }, wfaReportSubstring);
  await page.waitForTimeout(500);
  // Done step
  await page.evaluate(() => document.getElementById('addCustomButtonsDialog_stepDialog_btnDone')?.click());
  await page.waitForTimeout(2000);
  return clickDialogOK(page);
}

// ─── Reference Data Type Pick List ──────────────────────────────────────────

/**
 * Add DORA type names to the Reference Data Type pick list.
 * Must be on: Properties > Reference Data > Edit > Type property dialog
 * Uses btnAddItem postback pattern — each click creates one empty row.
 */
async function addTypePickListValues(page, typeNames) {
  const results = [];
  for (const typeName of typeNames) {
    await page.click('#addCustomPropertyDialog_btnAddItem');
    await page.waitForTimeout(1500);
    // Fill the new empty input
    const filled = await page.evaluate((name) => {
      const dialog = document.querySelector('[role="dialog"]');
      if (!dialog) return false;
      const inputs = dialog.querySelectorAll('input[type="text"]');
      const visible = Array.from(inputs).filter(i => i.offsetWidth > 0);
      const lastInput = visible[visible.length - 1];
      if (lastInput && !lastInput.value) {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        setter.call(lastInput, name);
        lastInput.dispatchEvent(new Event('input', { bubbles: true }));
        lastInput.dispatchEvent(new Event('change', { bubbles: true }));
        lastInput.dispatchEvent(new Event('blur', { bubbles: true }));
        return true;
      }
      return false;
    }, typeName);
    results.push(filled ? '+' : 'S');
  }
  return results;
}

// ─── Dashboard Chart Configuration ─────────────────────────────────────────

/** Set chart display type on a dashboard report */
async function setChartType(page, reportName, chartTypeName, scrollPct) {
  // Scroll to find report
  for (let pct = scrollPct - 5; pct <= scrollPct + 10; pct += 3) {
    await page.evaluate((p) => {
      const s = document.querySelector('.MuiDataGrid-virtualScroller');
      if (s) s.scrollTop = s.scrollHeight * p / 100;
    }, pct);
    await page.waitForTimeout(400);
    const found = await page.evaluate((n) => {
      const rows = document.querySelectorAll('.MuiDataGrid-row');
      for (const row of rows) { if (row.innerText?.includes(n)) { row.click(); return true; } }
      return false;
    }, reportName);
    if (found) break;
  }
  await page.waitForTimeout(1500);
  // Chart tab
  await page.evaluate(() => {
    document.querySelectorAll('a').forEach(a => {
      if (a.innerText?.trim() === 'Chart' && a.offsetWidth > 0) a.click();
    });
  });
  await page.waitForTimeout(1000);
  // Edit
  await page.evaluate(() => document.getElementById('paneDetail_dtb_Edit')?.click());
  await page.waitForTimeout(2000);
  // Set chart type via dropdown wrapper
  await page.evaluate(() => {
    const sel = document.getElementById('paneDetail_customReportSetupView_ddlChartDisplayType');
    sel?.closest('.ui.dropdown')?.click();
  });
  await page.waitForTimeout(500);
  await page.evaluate((ct) => {
    document.querySelectorAll('.menu .item').forEach(i => {
      if (i.innerText?.trim() === ct && i.offsetWidth > 0) i.click();
    });
  }, chartTypeName);
  await page.waitForTimeout(4000);
  await saveDone(page);
  return true;
}

// Export for use in browser_run_code
if (typeof module !== 'undefined') {
  module.exports = {
    scrollToBottom, scrollAndClick, waitDialogClose, clickDialogOK, saveDone,
    switchObjectAndEdit, createSimpleProperty, createPickListProperty,
    configCalcFormula, configAggExternalId, configHidden,
    configRefDataFilter, configConditionalDisplay,
    createReportShell, addReportColumns,
    createButton, setButtonConditionalDisplay, wireButtonToWFA,
    addTypePickListValues, setChartType
  };
}
