---
description: Look up a vendor's risk profile in ProcessUnity
allowed-tools: Bash, Read
argument-hint: <vendor name>
---

Look up the vendor "$ARGUMENTS" in ProcessUnity.

Run the following command to query the vendor:

```bash
python3 ${CLAUDE_PLUGIN_ROOT}/scripts/query-processunity.py "$ARGUMENTS" "${CLAUDE_PLUGIN_ROOT}/config.json"
```

Parse the JSON result and present a clear, conversational summary of the vendor's risk profile. Include:
- The vendor's full name
- Their ProcessUnity Risk Index Rating and Score
- Their Residual Risk level
- Any Global Risk Exchange information if available

If no match is found, let the user know and suggest checking the spelling. If multiple matches are found, list them and ask which one they meant.

Keep the response concise and conversational — do not show raw JSON.
