---
tags:
  - processunity
  - vba
  - word-templates
  - visualization
  - design-system
created: 2026-04-09
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
  - "[[PU Config Designer]]"
---

# PU Word Templates

Build VBA-enabled Word templates (.dotm) for ProcessUnity's Word Connector — transforming raw content-control data into polished vendor reports with inline SVG visualizations.

## What It Does

- Provides a **design system** (colors, typography, layout) for consistent report styling
- Generates **inline SVG visualizations** (donut gauges, risk pills, score strips, badge rows) inserted at bookmarks on Document_Open
- Supports **12 data source modules** with vendor-branded color palettes: RiskRecon, D&B, Recorded Future, Interos, SecurityScorecard, Black Kite, CyberGRX, Rapid Ratings, EcoVadis, WorldCheck, Risk Index, and Profile
- Covers **6 template types**: Executive Summary, Engagement Review, Issue Remediation, Assessment Closeout, Portfolio Risk Summary, RF Threat Briefing

## Key Concepts

- **Content Controls** — PU Word Connector populates `[Tag Name]` controls; VBA reads them via `GetCC()`
- **Bookmarks** — named locations where SVG images get inserted; defined as constants in `ModConstants`
- **Data-driven definitions** — D&B, RiskRecon, and Interos use array configs so adding a metric is one line
- **ModController** — master orchestrator calling each module's entry point in sequence

## Connector Modules (v2)

Each data source has its own `.bas` module with branded colors and visualizations. Connectors will be enhanced one at a time with richer visualizations centered on the **Risk Index** composite score.

## Source Files

All code lives in `/Users/johntondreau/Projects/pu-templates/`:
- `vba-modules/v2/` — production VBA modules (16 files)
- `word-templates/` — .docx, .dotx, .dotm files (6 templates x 3 formats)
- `word-templates/design-system.md` — canonical style guide

## Related Skills

*See also:* [[PU Data Model]] for object/property reference, [[PU Config Designer]] for mapping requirements to PU config, [[PU Report Builder]] for the reports that feed Word Connector fields.
