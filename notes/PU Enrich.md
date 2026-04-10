---
tags:
  - processunity
  - enrichment
  - external-api
  - vendor-intelligence
created: 2026-04-10
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Import]]"
  - "[[PU Agentic Pipeline]]"
  - "[[PU Vendor Lookup]]"
---

# PU Enrich

> Enrich vendor data in ProcessUnity by pulling intelligence from external APIs and pushing it back via PU's Import API. Supports 9 data source categories across sanctions, cyber risk, financial, ESG, and geopolitical domains.

## When to Use

Consult this when you need to:
- Set up vendor enrichment pipelines (external API → PU)
- Screen vendors against sanctions lists (OFAC, EU, UN, UK)
- Pull cyber risk scores (SecurityScorecard, CyberGRX)
- Add financial intelligence (SEC EDGAR), ESG data (Climatiq, SBTi), or beneficial ownership (Companies House)
- Choose between PU-native External API Connections vs. SDK middleware

## Two Approaches

1. **PU-Native External API Connections** — configured directly in PU Settings, no middleware needed. Best for simple GET/response mapping.
2. **SDK Middleware** — export vendors → enrich externally → import back. Better for complex logic (fuzzy matching, XBRL parsing, composite scoring).

## 9 Enrichment Source Categories

| # | Source | Auth | Cost | Best For |
|---|--------|------|------|----------|
| 1 | Sanctions (OFAC, EU, UN, UK) | Varies | Free | All vendors |
| 2 | Cyber Risk (SecurityScorecard, CyberGRX) | Token/OAuth | Paid | Vendors with domains |
| 3 | Vulnerability (CISA KEV) | None | Free | All vendors |
| 4 | Beneficial Ownership (Companies House) | HTTP Basic | Free | UK vendors only |
| 5 | Financial (SEC EDGAR) | None | Free | US/SEC-filing vendors |
| 6 | ESG & Climate (Climatiq, World Bank, SBTi) | Varies | Freemium | All vendors |
| 7 | Geopolitical (GDELT) | None | Free | High-risk regions |
| 8 | Country Risk (World Bank Governance) | None | Free | All vendors |
| 9 | Trust Center Documents | Scraping | Free | Vendors with trust centers |

## Execution Modes

- **Script Generator** — standalone TypeScript enrichment pipeline
- **Workato Recipe Designer** — Workato automation recipes using PU connector
- **Interactive Enrichment** — step-by-step in conversation with approval before push
- **Import Template Builder** — create/modify PU templates to accept enrichment fields

## Pipeline Pattern

```
Export vendors from PU → Filter by enrichment criteria →
Call external APIs (parallel, rate-limited) → Map to PU column names →
Preview results → Import back to PU → Attach evidence documents
```

## Key Gotchas

- All PU import values must be **strings** — integers cause errors
- Import template column names must match **exactly**
- Sanctions matches should be flagged for **human review** before auto-importing
- Rate limits: Companies House 600/5min, Climatiq 5/sec

*See also: [[PU Import]], [[PU Agentic Pipeline]], [[PU Vendor Lookup]]*
