# MCP Report Scaffolding Checklist — Desert Instance

## How To (Repeat for Each Object)
1. REPORTS > Custom Reports > **+ New**
2. Name: `[MCP - {Object Name}]`
3. Level 1: Select the object type from dropdown
4. **Details tab** > **Add Columns** > Select All > OK
5. **Access tab** > Edit > Selected Roles > **MCP - Model Context Protocol** > Save
6. Click **Done**

## Checklist

| # | Object | Report Name | Level 1 | Created? |
|---|--------|-------------|---------|----------|
| 1 | Agreements | `[MCP - Agreement]` | Agreement | YES (ID: 255019) — fix closing bracket |
| 2 | Assessments | `[MCP - Assessment]` | Assessment | |
| 3 | Custom Object 1 | `[MCP - Custom Object 1]` | Custom Object 1 | (if enabled) |
| 4 | Custom Object 3 | `[MCP - Custom Object 3]` | Custom Object 3 | (if enabled) |
| 5 | Documents | `[MCP - Document]` | Document | |
| 6 | Fourth Parties | `[MCP - Fourth Party]` | Fourth Party | |
| 7 | GRX Findings | `[MCP - GRX Finding]` | GRX Finding | |
| 8 | Issues | `[MCP - Issue]` | Issue | |
| 9 | My Organization | `[MCP - My Organization]` | My Organization | |
| 10 | People | `[MCP - People]` | Individual | |
| 11 | Questionnaires | `[MCP - Questionnaire]` | Questionnaire | |
| 12 | Reference Data | `[MCP - Reference Data]` | Reference Data | |
| 13 | Third Parties | `[MCP - Third Party]` | Third Party | |
| 14 | Third-Party Requests | `[MCP - Third-Party Request]` | Third-Party Request | |
| 15 | Third-Party Services | `[MCP - Third-Party Service]` | Third-Party Service | |

## Notes
- Agreement report has a typo: closing `}` instead of `]` — fix if desired
- Custom Objects 1 & 3 are for DORA (Legal Entity, CIF) — only create if DORA features are enabled in System Settings
- People Level 1 is "Individual" not "People" in PU's dropdown
- The report creation API does NOT exist — this must be done through the GUI
- After creating all reports, restart Claude Code to pick up fresh `list_reports` data

## Verification
After all reports are created, run:
```
mcp__processunity-desert__list_reports
```
Should return 15+ reports (7 default + your MCP reports).
