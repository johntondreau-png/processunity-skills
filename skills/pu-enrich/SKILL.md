---
name: pu-enrich
description: >
  Enrich vendor data in ProcessUnity by pulling intelligence from external APIs and pushing it back
  via PU's Import API. Supports 9 data sources: sanctions screening, cyber risk scores, vulnerability
  intelligence, beneficial ownership, financial intelligence, ESG/climate, geopolitical, country risk,
  and trust center documents. Use when the user wants to enrich vendors, pull external intelligence,
  or set up enrichment pipelines. Triggers for: "enrich vendors", "sanctions screening", "cyber risk",
  "pull intelligence", "external API", "vendor enrichment".
---

# ProcessUnity Data Enrichment Skill

Enrich vendor data in ProcessUnity by pulling intelligence from external APIs and pushing it back via PU's Import API. This skill supports TWO approaches:

1. **PU-Native External API Connections** — configure directly in PU Settings, no middleware needed.
2. **SDK Middleware** — use a ProcessUnity SDK to export, enrich externally, and import back. Better for complex logic (fuzzy matching, XBRL parsing, composite scoring).

When the user invokes this skill, ask which approach they want. For PU-native setup, reference the enrichment guide. For SDK middleware, follow the phases below.

## Prerequisites

Before running enrichment, confirm these are available:

1. **ProcessUnity SDK** — A TypeScript SDK with `ProcessUnityClient` class
   - Resources: `client.reports`, `client.imports`, `client.files`
   - Auth: OAuth 2.0 dual-credential flow (service_name, service_password, pu_username, pu_password, base_url)

2. **Environment variables** — The user must have PU credentials configured. Check for:
   - `PU_BASE_URL` (e.g., `https://app.processunity.net/tenant`)
   - `PU_SERVICE_NAME`, `PU_SERVICE_PASSWORD`
   - `PU_USERNAME`, `PU_PASSWORD`
   - Plus any API keys for external sources (see Source Reference below)

3. **Working directory** — Run scripts from a project that has a ProcessUnity SDK as a dependency.

---

## Phase 1: Connect & Discover

First, establish a connection and discover the PU instance's available reports and import templates. This is critical because PU is **report-oriented, not CRUD** — all data flows through pre-configured reports and templates.

```typescript
import { ProcessUnityClient } from 'processunity-sdk';

const client = new ProcessUnityClient({
  baseUrl: process.env.PU_BASE_URL!,
  serviceName: process.env.PU_SERVICE_NAME!,
  servicePassword: process.env.PU_SERVICE_PASSWORD!,
  username: process.env.PU_USERNAME!,
  password: process.env.PU_PASSWORD!,
});

// Discover what's available
const reports = await client.reports.listExportable();
const templates = await client.reports.listImportable();

console.log('Export Reports:', reports.map(r => `${r.Id}: ${r.Name}`));
console.log('Import Templates:', templates.map(t => `${t.Id}: ${t.Name} [Key: ${t.KeyColumn}] Cols: ${t.Columns.join(', ')}`));
```

**Ask the user** which reports contain vendors/assessments/findings, and which import templates should receive enriched data. Template `Columns` arrays define the exact field names to use.

### PU API Gotchas (CRITICAL)
- **Import API uses column position**: Map values by exact column names from `template.Columns`
- **All values must be strings**: Wrap everything with `String()` — integers cause "General error"
- **Response shape varies**: Check `result.Data ?? result` for import results
- **Token TTL is 20 minutes**: SDK handles refresh automatically
- **Error responses may be HTML**: Check content-type on 401/404

---

## Phase 2: Export Vendor Data from PU

Export the vendor roster to identify which vendors need enrichment.

```typescript
// Export all vendors (no filter)
const vendors = await client.imports.export(VENDOR_REPORT_ID);

// Or filter by status
const activeVendors = await client.imports.export(VENDOR_REPORT_ID, [
  { ColumnName: 'Status', Values: ['Active'] }
]);

// Each record is a dynamic key-value object based on report columns
// e.g., { Id: "226704", "Third-Party": "Acme Corp", "Country": "US", "Website": "acme.com" }
```

Build a vendor enrichment queue from the exported data, extracting: name, country, website/domain, industry, and PU object ID.

---

## Phase 3: Enrich from External Sources

For each vendor, run applicable enrichment sources. Source applicability depends on vendor attributes (country, domain availability, industry). Execute sources **in parallel** where possible, respecting rate limits.

### Source Reference — All Available Enrichment APIs

#### 1. SANCTIONS SCREENING (All vendors)
**Sources**: OFAC SDN, OFAC CSL, EU Sanctions, UN Sanctions, UK OFSI
**Method**: Download sanctions lists, fuzzy-match vendor names using Jaro-Winkler (threshold ≥ 0.85)
**Data produced**: Match/no-match, matched entity details, list source, match score
**PU fields to populate**: Sanctions Status, Sanctions Match Details, Last Screened Date

```typescript
// OFAC SDN — free, public, updated daily
const sdnUrl = 'https://sanctionslist.ofac.treas.gov/';
// Download SDN XML/CSV, parse entries, fuzzy-match against vendor name + aliases

// OFAC Consolidated Screening List — free, updated weekly
const cslUrl = 'https://api.trade.gov/consolidated_screening_list/v1/search';
// Query: ?q={vendorName}&api_key={key}

// EU Sanctions — free, updated per Council decision
const euUrl = 'https://data.europa.eu/api/hub/search/datasets/consolidated-list-of-persons-groups-and-entities-subject-to-eu-financial-sanctions';

// UN Sanctions — free
const unUrl = 'https://scsanctions.un.org/resources/xml/en/consolidated.xml';
```

**Enrichment output**: `{ sanctionsStatus: 'CLEAR' | 'POTENTIAL_MATCH' | 'CONFIRMED_MATCH', matches: [...], screenedDate: ISO8601 }`

---

#### 2. CYBER RISK SCORES (Vendors with domains)
**Source A: SecurityScorecard** — `https://api.securityscorecard.io`
- Auth: `Authorization: Token {SECURITYSCORECARD_API_KEY}`
- `GET /companies/{domain}/scorecard` → overall score + 10 factor scores
- `GET /companies/{domain}/issues` → active security issues
- Factor scores: network_security, dns_health, patching_cadence, endpoint_security, ip_reputation, application_security, cubit_score, hacker_chatter, leaked_credentials, social_engineering
- Rate limit: 429-aware with backoff

**Source B: CyberGRX** — `https://api.cybergrx.com/v2`
- Auth: OAuth 2.0 (client_id, client_secret)
- `GET /v2/portfolio/third-parties` → portfolio lookup by name/domain
- `GET /v2/portfolio/third-parties/{id}/risk-profile` → inherent/residual risk scores
- `GET /v2/company/companies/{id}` → firmographics (revenue, employees, NAICS/SIC)

**PU fields**: Cyber Risk Score, SecurityScorecard Grade, Risk Factors, Last Cyber Scan Date, Open Vulnerabilities Count

---

#### 3. VULNERABILITY INTELLIGENCE (All vendors)
**Source: CISA KEV** — `https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json`
- Free, no auth required
- Cache: 24-hour TTL (catalog updates ~weekly)
- Cross-reference vendor's technology stack against CVE vendor/product fields
- Data: CVE ID, vendor project, product, vulnerability name, due date, ransomware use flag

**PU fields**: Known Vulnerabilities Count, Critical CVEs, Ransomware-Associated CVEs

---

#### 4. BENEFICIAL OWNERSHIP (UK vendors only — country = GB/UK)
**Source: Companies House** — `https://api.companieshouse.gov.uk`
- Auth: HTTP Basic (API key as username, empty password)
- Rate limit: 600 requests / 5 minutes (token bucket)
- `GET /search/companies?q={name}` → company number lookup
- `GET /company/{number}` → company profile (status, SIC codes, registered address)
- `GET /company/{number}/persons-with-significant-control` → beneficial owners (PSCs)
- `GET /company/{number}/officers` → directors and officers

**Analysis to perform**:
- PSC ownership concentration (single owner vs. distributed)
- Beneficial owner nationality diversity
- Jurisdiction risk (residency in sanctioned/high-risk countries)
- Control structure complexity scoring
- Political exposure detection

**PU fields**: Beneficial Owners, Ownership Structure, UK Company Number, Company Status, Incorporation Date

---

#### 5. FINANCIAL INTELLIGENCE (US vendors or those with SEC filings)
**Source: SEC EDGAR** — `https://data.sec.gov/api/xbrl`
- Free, no auth (but include User-Agent header with contact email)
- Company lookup: `https://efts.sec.gov/LATEST/search-index?q={name}&dateRange=custom&startdt=...`
- Filing search: 10-K (annual), 10-Q (quarterly), 8-K (current events)
- XBRL metric extraction: Revenue, Net Income, Total Assets, financial ratios

**PU fields**: Annual Revenue, Financial Health Score, Last Filing Date, SEC CIK Number

---

#### 6. ESG & CLIMATE INTELLIGENCE (All vendors with industry data)

**Source A: Climatiq** — `https://api.climatiq.io/data/v1`
- Auth: `Authorization: Bearer {CLIMATIQ_API_KEY}`
- Rate limit: 5 req/sec, free tier 250/month
- Emission factors by industry/region → CO2e estimates
- Query by activity type + region

**Source B: World Bank ESG** — `https://api.worldbank.org/v2`
- Free, no auth, 10 req/sec
- Indicators: CO2 per capita (`EN.ATM.CO2E.PC`), renewable energy % (`EG.FEC.RNEW.ZS`)
- Query: `/country/{iso2}/indicator/{indicator}?format=json&date=2018:2023`

**Source C: SBTi** — `https://sciencebasedtargets.org/companies-taking-action`
- CSV download of companies with science-based targets
- Match vendor name → target status, validation date, target classification
- Cache: 24-hour TTL

**PU fields**: ESG Risk Score, Carbon Intensity, Climate Target Status, Environmental Risk Rating

---

#### 7. GEOPOLITICAL INTELLIGENCE (Vendors in high-risk regions)
**Source: GDELT** — `https://api.gdeltproject.org/api/v2/doc/doc`
- Free, no auth, updates every 15 minutes
- 100+ languages, real-time global news monitoring
- Query: `?query={country} {vendorName}&mode=artlist&format=json&maxrecords=50`
- FIPS country code mapping required (US→US, GB→UK, etc.)

**PU fields**: Geopolitical Risk Score, Recent News Events, Country Stability Index

---

#### 8. COUNTRY RISK (All vendors with country data)
**Source: World Bank Governance Indicators** — `https://api.worldbank.org/v2`
- Free indicators: Political Stability, Rule of Law, Regulatory Quality, Control of Corruption
- Indicator codes: `PV.EST`, `RL.EST`, `RQ.EST`, `CC.EST`
- Compose into a weighted country risk score

**PU fields**: Country Risk Score, Political Stability, Regulatory Risk, Corruption Index

---

#### 9. TRUST CENTER DOCUMENTS (Vendors with trust center URLs)
**Source**: Vendor-provided trust center pages
- Scrape for: SOC 2 reports, ISO 27001 certs, GDPR compliance statements, penetration test summaries
- Extract certification types, validity dates, audit firm names

**PU fields**: Certifications Held, Last Audit Date, Compliance Attestations

---

## Phase 4: Map Enriched Data to PU Import Format

**CRITICAL**: PU Import API requires records keyed by the **exact column names** from the import template's `Columns` array. All values must be **strings**.

```typescript
// 1. Get the target import template
const templates = await client.reports.listImportable();
const vendorTemplate = templates.find(t => t.Name === 'VendorImport'); // or user-selected
console.log('Available columns:', vendorTemplate.Columns);

// 2. Build the mapping
function mapEnrichmentToPuRecord(
  vendorId: string,
  enrichment: EnrichmentResult,
  columnNames: string[]
): Record<string, string> {
  const record: Record<string, string> = {};

  // Always include the key column for upsert matching
  record['Id'] = String(vendorId);

  // Map enrichment fields to PU columns (these names must match template.Columns exactly)
  // The exact column names depend on the PU instance's configuration
  if (enrichment.sanctionsStatus && columnNames.includes('Sanctions Status')) {
    record['Sanctions Status'] = String(enrichment.sanctionsStatus);
  }
  if (enrichment.cyberScore && columnNames.includes('Cyber Risk Score')) {
    record['Cyber Risk Score'] = String(enrichment.cyberScore);
  }
  if (enrichment.countryRisk && columnNames.includes('Country Risk Score')) {
    record['Country Risk Score'] = String(enrichment.countryRisk);
  }
  // ... map all enrichment fields to matching PU columns

  return record;
}

// 3. Import enriched records back to PU
const records = vendors.map(v => mapEnrichmentToPuRecord(v.Id, enrichmentResults[v.Id], vendorTemplate.Columns));
const result = await client.imports.import(vendorTemplate.Id, records, { includeLog: true });

// Handle response (shape may vary)
const data = result.Data ?? result;
console.log(`Imported: ${data.TotalInsertRecords} inserted, ${data.TotalUpdateRecords} updated, ${data.TotalErrorRecords} errors`);
```

---

## Phase 5: Attach Evidence Documents

For enrichment sources that produce documents (SEC filings, certificates, reports), attach them to the PU vendor record.

```typescript
// Upload a document to a vendor record
await client.files.upload(vendorObjectId, {
  Content: base64EncodedContent,
  FileName: 'SecurityScorecard_Report_2026-04.pdf',
  Description: 'Auto-generated SecurityScorecard report from enrichment pipeline',
  ContentLength: contentBuffer.length,
});
```

---

## Phase 6: Workato Integration (Alternative Push Path)

For customers using Workato, enrichment can flow through Workato recipes instead of direct API calls.

### Available Workato Actions
| Action | What it does |
|--------|-------------|
| `list_exportable_reports` | Discover available export reports |
| `list_importable_templates` | Discover available import templates |
| `export_data` | Export records from a report (with filters) |
| `import_data` | Import records via template |
| `import_data_with_results` | Import with per-row error detail |
| `update_record_status` | Update a single record's status |
| `get_columns` / `get_report_columns` | Dynamic field discovery |
| `attach_files` | Upload file attachments |
| `list_file_names` / `get_files` | Download attachments |
| `copy_files` | Server-side file copy between objects |

### Workato Trigger
- `new_exported_records` — Polling trigger that watches a report for new/changed records

### Workato Recipe Pattern: Enrichment Pipeline
```
Trigger: new_exported_records (poll vendor report every 5 min)
  → For each vendor record:
    → HTTP action: call SecurityScorecard API
    → HTTP action: call OFAC screening API
    → HTTP action: call Companies House API (if UK)
    → Transform: map enrichment to PU column names
    → import_data: push enriched record back to PU
    → attach_files: upload any generated reports
```

---

## Enrichment Execution Modes

When the user invokes this skill, ask which mode they want:

### Mode 1: Script Generator
Generate a standalone TypeScript/Node.js script that runs the full enrichment pipeline. Good for one-time enrichment or testing.

### Mode 2: Workato Recipe Designer
Design Workato recipe configurations that wire up the enrichment sources as automations. Uses the Workato SDK connector actions.

### Mode 3: Interactive Enrichment
Walk through enrichment step-by-step in the conversation:
1. Connect to PU instance
2. Export vendor list
3. User selects which sources to run
4. Execute enrichment calls
5. Review results before pushing to PU
6. Push approved enrichments

### Mode 4: Import Template Builder
Help the user create/modify PU import templates to accept enrichment fields. Discovers existing templates, identifies gaps, and suggests new columns.

---

## Rate Limits & Cost Reference

| Source | Auth | Rate Limit | Cost | Update Freq |
|--------|------|-----------|------|-------------|
| OFAC SDN | None | None | Free | Daily |
| OFAC CSL | API Key | None | Free | Weekly |
| EU Sanctions | None | None | Free | Per decision |
| UN Sanctions | None | None | Free | Per resolution |
| SecurityScorecard | Token | 429-aware | Paid | Real-time |
| CyberGRX | OAuth 2.0 | None | Paid | Real-time |
| Companies House | HTTP Basic | 600/5min | Free | Real-time |
| SEC EDGAR | None (User-Agent) | Implicit | Free | Per filing |
| Climatiq | Bearer | 5/sec, 250/mo free | Freemium | Quarterly |
| World Bank | None | 10/sec | Free | Annual |
| SBTi | None | None | Free | Monthly |
| GDELT | None | None | Free | 15 min |
| CISA KEV | None | None | Free | Weekly |

---

## User Interaction Flow

When this skill is invoked:

1. **Ask**: Which PU instance are you targeting? (credentials / env vars)
2. **Discover**: List reports and import templates, show them to the user
3. **Ask**: Which enrichment sources do you want to run? (show the 9 categories above)
4. **Ask**: Which execution mode? (Script / Workato / Interactive / Template Builder)
5. **Execute**: Run the selected enrichment pipeline
6. **Report**: Show enrichment results with match counts, scores, and any errors
7. **Confirm**: Before pushing to PU, show a preview of what will be imported
8. **Push**: Import enriched data and report results

Always validate that:
- Import template columns match the enrichment data fields
- All values are stringified before import
- Rate limits are respected (especially Companies House 600/5min, Climatiq 5/sec)
- Sanctions matches are flagged for human review before auto-importing
