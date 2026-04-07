# ProcessUnity Skills

A complete AI skill suite for [ProcessUnity](https://www.processunity.com/) -- configure instances, build reports, design data models, import data, enrich vendors, and run agentic TPRM workflows through guided AI-driven automation.

Built as a [Claude Code](https://claude.ai/code) plugin.

## What's Inside

### Skills (11)

| Skill | Purpose |
|-------|---------|
| **pu-data-model** | ProcessUnity platform knowledge base -- objects, property types, reports, dashboards |
| **pu-config-designer** | Translate requirements into configuration plans (human-readable + JSON execution plans) |
| **pu-admin-navigator** | Drive the PU admin UI via browser automation to execute configuration changes |
| **pu-import** | Bulk data import via the ProcessUnity Import API |
| **pu-report-builder** | Design and build Custom Reports, Charts, and Dashboards |
| **pu-agentic-pipeline** | BYOAI agentic workflows using PU's Reports + Import APIs as the AI data pipeline |
| **pu-enrich** | Enrich vendor data from 9 external intelligence sources (sanctions, cyber, ESG, financial, etc.) |
| **pu-configuration** | Configure regulation trees, assessment questions, threat catalogs, and SCF crosswalks |
| **pu-dora** | Implement EU DORA compliance -- Register of Information, 7 RTS templates, EBA taxonomy codes, full object/report pipeline |
| **vendor-lookup** | Query your ProcessUnity vendor portfolio for risk profiles by name |

### Commands (7)

| Command | Usage |
|---------|-------|
| `/pu-configure` | Design a configuration from requirements |
| `/pu-implement` | Execute a configuration plan via browser automation |
| `/pu-status` | Check current configuration state of a PU object |
| `/pu-import` | Import data into ProcessUnity via API |
| `/pu-enrich` | Run vendor data enrichment pipeline |
| `/pu-dora` | Implement DORA compliance in a ProcessUnity instance |
| `/vendor` | Look up a vendor's risk profile |

### Execution Plans (4)

Pre-built JSON execution plans for common configuration tasks:
- `execution_plan_regulations_tree.json` -- Full regulation hierarchy import
- `execution_plan_questions.json` -- Assessment question configuration
- `execution_plan_reference_data.json` -- Reference data setup
- `execution_plan_threats.json` -- Threat catalog configuration

## Installation

### Claude Code (Desktop or CLI)

1. Clone this repo:
   ```bash
   git clone https://github.com/jtondreau/processunity-skills.git
   ```

2. Register the plugin in Claude Code:
   - Open Claude Code settings
   - Add the cloned directory as a plugin source
   - The skills and commands will be available immediately

### Credentials Setup

1. Copy the example config:
   ```bash
   cp config.json.example config.json
   ```

2. Fill in your ProcessUnity credentials:
   - `token_url` -- Your PU instance OAuth endpoint
   - `processunityUserName` / `processunityPassword` -- Service account credentials
   - `password` -- API key GUID
   - `report_url` -- Vendor risk report export endpoint

> **Important**: `config.json` is gitignored and will never be committed. Never commit credentials.

## What It Knows

This plugin encodes deep ProcessUnity platform knowledge accumulated through hands-on configuration:

**Platform Architecture**
- 52 object types with custom property counts and section structures
- Every property type PU supports with canonical type strings
- Report/dashboard configuration patterns and chart types
- UI navigation paths and browser automation procedures

**API Expertise**
- Import API positional column mapping (values map by position, not key name)
- All values must be strings (integers cause "General error")
- Response shape variations between API versions
- OAuth 2.0 dual-credential authentication flow

**Compliance Frameworks**
- 12 regulatory frameworks fully structured (NIST CSF 2.0, 800-53, ISO 27002, SOC 2, PCI DSS, HIPAA, GDPR, DORA, DFS 500, NIS2, CMMC, CCPA)
- 2,489+ provisions, 770 categories, 3,444 subcategories
- 106 SCF crosswalk controls linking questions to provisions
- Proven 4-level hierarchy import pipeline

**Vendor Enrichment** (9 data sources)
- Sanctions: OFAC SDN/CSL, EU, UN, UK OFSI
- Cyber risk: SecurityScorecard, CyberGRX, CISA KEV
- Financial: SEC EDGAR/XBRL
- Ownership: UK Companies House
- ESG: Climatiq, World Bank, SBTi
- Geopolitical: GDELT
- Country risk: World Bank Governance Indicators

**Agentic Workflows**
- Read (Reports) -> Reason (AI) -> Write (Import) pipeline patterns
- 7 workflow templates: risk scoping, finding-to-issue, threat-driven assessment, portfolio monitoring, duplicate detection, narrative generation, remediation planning

## Requirements

- [Claude Code](https://claude.ai/code) (CLI, Desktop, or IDE extension)
- Access to a ProcessUnity instance (production or sandbox)
- For browser automation skills: a browser automation tool (Claude in Chrome, etc.)
- For enrichment: API keys for paid sources (SecurityScorecard, CyberGRX); free sources work out of the box

## Project Structure

```
processunity-skills/
├── .claude-plugin/
│   └── plugin.json              # Plugin manifest
├── commands/                    # Slash commands (/pu-configure, /vendor, etc.)
├── skills/
│   ├── pu-data-model/           # Platform knowledge base + references
│   ├── pu-config-designer/      # Requirements -> config plan translator
│   ├── pu-admin-navigator/      # Browser automation for PU admin UI
│   ├── pu-import/               # Bulk import via API
│   ├── pu-report-builder/       # Report & dashboard design
│   ├── pu-agentic-pipeline/     # AI-powered read/reason/write workflows
│   ├── pu-enrich/               # Vendor data enrichment from external APIs
│   ├── pu-configuration/        # Regulation trees, questions, threats, SCF
│   ├── pu-dora/                 # DORA compliance implementation
│   └── vendor-lookup/           # Vendor risk profile lookup
├── execution-plans/             # Pre-built JSON configuration plans
├── config.json.example          # Credential template (copy to config.json)
└── README.md
```

## License

MIT
