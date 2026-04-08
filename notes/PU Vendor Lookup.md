---
tags:
  - processunity
  - vendor
  - risk
  - lookup
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
---

# PU Vendor Lookup

> Look up vendor risk information from your ProcessUnity instance. A practical, working example of querying PU data.

## How It Works

The PU instance contains a vendor risk report (export ID 258276) with these fields per vendor:

- **Third-Party Name** — the vendor/company name
- **ProcessUnity Risk Index Rating** — qualitative rating (e.g., "Very Strong", "Strong", "Moderate")
- **ProcessUnity Risk Index Score** — numeric score (0-100)
- **Residual Risk** — risk level after controls (e.g., "1. Very High", "2. High", "3. Medium", "4. Low")
- **Global Risk Exchange Information** — external risk exchange data

> Note: The source system field is spelled "Globabl Risk Exchange Information" (known typo).

## Workflow

### Look Up a Vendor

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/query-processunity.py "<vendor_name>" "${CLAUDE_PLUGIN_ROOT}/config.json"
```

The script handles authentication, querying the report, and finding matches automatically.

### Parse the Output

JSON output contains:
- `matches_found` — number of vendors matched
- `total_vendors_in_report` — total vendors in the portfolio
- `vendors` — array of matching vendor records

### Present Results

- **One match**: Summarize conversationally — *"Accenture PLC has a Very Strong risk index rating with a score of 88 out of 100. Their residual risk is rated as Medium."*
- **Multiple matches**: List them and ask which one
- **No matches**: Suggest checking spelling, offer to list all vendors

### List All Vendors

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/query-processunity.py " " "${CLAUDE_PLUGIN_ROOT}/config.json"
```

Present the full list sorted by risk score or alphabetically.

## Error Handling

- **Authentication fails** → credentials may need updating in `config.json`
- **Report query fails** → check if report ID (258276) is still valid
- **Vendor not found** → check spelling or list all vendors

---

*See also: [[PU Data Model]] for understanding the underlying data, [[PU Agentic Pipeline]] for building automated workflows on top of vendor data.*
