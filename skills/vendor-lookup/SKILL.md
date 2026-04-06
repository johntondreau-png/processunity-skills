---
name: vendor-lookup
description: >
  This skill should be used when the user asks about a "vendor", "third party",
  "supplier", "risk profile", "risk rating", "risk score", "portfolio",
  "ProcessUnity", or asks to "look up" or "check on" a company in their
  vendor management system. Also triggers for questions like "tell me about
  [company name]" in a vendor risk context, or "what's the risk on [company]".
version: 0.1.0
---

# ProcessUnity Vendor Lookup

Look up vendor risk information from the user's ProcessUnity instance.

## How It Works

The user's ProcessUnity instance contains a vendor risk report (export ID 258276) with these fields per vendor:

- **Third-Party Name** — the vendor/company name
- **ProcessUnity Risk Index Rating** — qualitative rating (e.g., "Very Strong", "Strong", "Moderate")
- **ProcessUnity Risk Index Score** — numeric score (0-100)
- **Residual Risk** — risk level after controls (e.g., "1. Very High", "2. High", "3. Medium", "4. Low")
- **Globabl Risk Exchange Information** — external risk exchange data (note: field name has a typo in the source system, this is expected)

## Workflow

When the user asks about a vendor:

1. Run the lookup script to query ProcessUnity:

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/query-processunity.py "<vendor_name>" "${CLAUDE_PLUGIN_ROOT}/config.json"
```

Replace `<vendor_name>` with the company name the user mentioned. The script handles authentication, querying the report, and finding matches automatically.

2. Parse the JSON output. It will contain:
   - `matches_found` — number of vendors matched
   - `total_vendors_in_report` — total vendors in the portfolio
   - `vendors` — array of matching vendor records

3. Present the results conversationally:
   - If one match: summarize the vendor's risk profile in plain language
   - If multiple matches: list them and ask which one the user meant
   - If no matches: let the user know and suggest they check the spelling, or offer to list all vendors in the portfolio

## Presenting Results

When summarizing a vendor, use natural language. Example:

"Accenture PLC has a **Very Strong** risk index rating with a score of 88 out of 100. Their residual risk is rated as Medium."

Do not just dump raw JSON. Translate the data into a clear, conversational summary.

## Listing All Vendors

If the user asks to "list all vendors", "show my portfolio", or "what vendors do I have", run the script with an empty search to get all results:

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/query-processunity.py " " "${CLAUDE_PLUGIN_ROOT}/config.json"
```

Then present the full list in a readable format, sorted by risk score or alphabetically as appropriate.

## Error Handling

- If authentication fails, tell the user their ProcessUnity credentials may need updating and point them to the `config.json` file in the plugin directory.
- If the report query fails, suggest checking if the report ID (258276) is still valid in their ProcessUnity instance.
- If the vendor is not found, suggest checking the spelling or listing all vendors to find the right name.
