---
name: pu-word-templates
description: >
  Build and maintain VBA-enabled Word templates (.dotm) for ProcessUnity's Word Connector.
  Use this skill when the user wants to create a new Word template, add SVG visualizations
  to a template, write VBA modules for score gauges or risk badges, modify the design system
  (colors, fonts, layout), work with content control tags, or debug macro-enabled documents.
  Triggers for: "create a Word template", "add a visualization", "VBA module", "Risk Index",
  "score gauge", "donut chart", "SVG badge", "Word Connector", ".dotm", "macro-enabled",
  "design system", "content control tags", "risk pill", "vendor report template".
depends_on:
  - pu-app-guide
---

# PU Word Templates Skill

Build VBA-enabled Word templates that transform ProcessUnity Word Connector output into polished, data-driven vendor reports with inline SVG visualizations.

## Architecture

```
PU Word Connector (generates .docx with Content Controls)
  |
  v
VBA Modules (auto-run on Document_Open)
  |
  ├── ModConstants    — colors, bookmark names, CC tags, score definitions
  ├── ModHelpers      — CC lookup, SVG insertion, color mapping utilities
  ├── ModController   — orchestrator, calls each module's entry point
  ├── ModProfile      — inherent/residual risk chips, criticality, location
  ├── ModRiskIndex    — PU Risk Index composite donut gauge (0-100)
  ├── ModRiskRecon    — overall donut + 9 domain pills
  ├── ModSecurityScorecard — overall + factor grades
  ├── ModBlackKite    — technical grade + sub-grades
  ├── ModCyberGRX     — residual risk + dimensions
  ├── ModDnB          — global rating card + 7 financial metrics
  ├── ModRapidRatings — FHR gauge + CHS indicator
  ├── ModRecordedFuture — RF score donut + criticality + bubble matrix
  ├── ModInteros      — overall donut + 6 supply chain dimensions
  ├── ModEcoVadis     — ESG sustainability medal
  └── ModWorldCheck   — sanctions screening status badge
```

## Source Locations

| What | Path |
|------|------|
| V2 VBA modules (production) | `/Users/johntondreau/Projects/pu-templates/vba-modules/v2/` |
| V1 VBA modules (legacy) | `/Users/johntondreau/Projects/pu-templates/vba-modules/` |
| Word templates (.docx/.dotx/.dotm) | `/Users/johntondreau/Projects/pu-templates/word-templates/` |
| Design system spec | `/Users/johntondreau/Projects/pu-templates/word-templates/design-system.md` |
| README (import instructions) | `/Users/johntondreau/Projects/pu-templates/vba-modules/README.md` |

## Template Inventory

| Template | Object Context | Sections | Has .dotm |
|----------|---------------|----------|-----------|
| Third-Party Executive Summary | Third Party | 9 | Yes |
| Engagement Service Review | Engagement | 7 | Yes |
| Issue Remediation Report | Issue | 7 | Yes |
| Assessment Closeout Summary | Assessment | 6 | Yes |
| Portfolio Risk Summary | My Organization | 7 | Yes |
| RF Threat Briefing | Third Party | 5 | Yes |

## Design System

### Color Palette

**Primary**: Deep Navy `#1B2A4A`, Steel Blue `#2C5F8A`, Warm Amber `#E87722`, Cool Gray `#F5F7FA`

**RAG**: Critical `#DC2626`, High `#EA580C`, Medium `#F59E0B`, Low `#16A34A`

**Risk Index**: Strong `#059669`, Fair `#D97706`, Weak `#DC2626`

**Vendor-specific palettes**: Each data source (RiskRecon, D&B, RF, Interos, SSC, BlackKite, CyberGRX, RapidRatings, EcoVadis, WorldCheck) has its own branded color constants in `ModConstants.bas`.

### Typography

- **Font**: Calibri throughout
- **Title**: 24pt bold Deep Navy
- **Section Header**: 14pt bold Steel Blue
- **Body**: 11pt regular `#374151`
- **Table Header**: 10pt bold white on Steel Blue

### Page Layout

- US Letter, 0.75" margins all sides
- Header: "ProcessUnity" left, template title right
- Footer: "Confidential" left, page number right

## How VBA Modules Work

### Document Open Flow

```
ThisDocument.Document_Open()
  └── Application.OnTime (3-second delay)
        └── ModController.RunAllVisuals()
              ├── InsertProfileVisuals()       — risk chips, domain flags, location
              ├── InsertRiskIndexBadge()        — PU composite score donut
              ├── InsertAllRiskReconBadges()    — overall + 9 domains
              ├── InsertAllSSCBadges()          — SecurityScorecard
              ├── InsertAllBlackKiteBadges()    — Black Kite
              ├── InsertAllCyberGRXBadges()     — CyberGRX
              ├── InsertAllDnbBadges()          — D&B financial
              ├── InsertAllRapidRatingsBadges() — Rapid Ratings
              ├── InsertAllRFBadges()           — Recorded Future
              ├── InsertAllInterosBadges()      — Interos supply chain
              ├── InsertEcoVadisBadge()         — EcoVadis ESG
              ├── InsertWorldCheckBadge()       — WorldCheck screening
              └── CollapsePuHeadings()          — cleanup
```

### Key Patterns

**Content Control Lookup**: `GetCC("[Tag Name]")` reads values from PU Word Connector content controls by tag.

**SVG Insertion**: `InsertSvgAtBookmark(bookmarkName, altText, svgString, fileName, widthPx)` writes SVG to temp file and inserts as inline image at a named bookmark.

**Data-Driven Metrics**: D&B, RiskRecon, and Interos use array-of-arrays definitions in `ModConstants` so adding a new metric is one line — no copy-paste wrappers.

**Color Mapping Functions**:
- `RatingToHex(grade)` — letter grade (A-F) to color
- `GoodnessToHex(pct)` — 0-100 percentage to color
- `RiskTextToHex(text)` — risk label to color
- `TierToHex(tier)` — criticality tier to color
- `RFScoreToHex(score)` — RF 0-99 score to color

### Content Control Tag Format

Direct properties: `[Third-Party Name]`, `[Inherent Risk]`, `[ProcessUnity Risk Index Score]`

Report-sourced fields: `[208336] [Service Type]` (report ID + field name)

### Bookmark Naming Convention

All bookmarks are defined as constants in `ModConstants.bas`:
- `BM_RI_OVERALL` — Risk Index main
- `BM_RI_OVERALL_COVER` — Risk Index on cover page
- `BM_RR_OVERALL` — RiskRecon overall
- `BM_DNB_GLOBAL` — D&B global rating
- Pattern: `BM_{SOURCE}_{METRIC}`

## Risk Index Details

The Risk Index is PU's internal composite score (0-100) aggregating multiple data sources.

**CC Tags**: `[ProcessUnity Risk Index Score]`, `[ProcessUnity Risk Index Rating]`

**Rating Scale**:
| Score | Rating | Color |
|-------|--------|-------|
| 80-100 | Very Strong | `#059669` |
| 60-79 | Strong | `#10B981` |
| 40-59 | Fair | `#D97706` |
| 20-39 | Weak | `#F97316` |
| 0-19 | Very Weak | `#DC2626` |

**Visualization**: Donut gauge with progress ring, centered score number, "Risk Index" label, and rating text below.

## Creating a New Template

### Step 1: Design the Template

1. Identify the PU object context (Third Party, Engagement, Issue, etc.)
2. List the properties and reports needed (use `pu-app-guide` skill)
3. Define sections and layout using design system components
4. Map CC tags to PU property names

### Step 2: Build the .docx

1. Create document with Word styles matching the design system
2. Insert content controls with correct tags
3. Add bookmarks where SVG visualizations will be inserted
4. Set up repeating section content controls for report data tables

### Step 3: Add VBA

1. Save as .dotm (macro-enabled template)
2. Import v2 modules in order: ModConstants, ModHelpers, ThisDocument, ModController, then feature modules
3. Add bookmark constants to ModConstants for new visualization targets
4. Create new module if needed for source-specific visualizations
5. Register the new module's entry point in ModController.RunAllVisuals()

### Step 4: Test

1. Generate a .docx from PU Word Connector with real vendor data
2. Open in the .dotm template context
3. Verify all visualizations render and scores map to correct colors
4. Check SVG sizing and positioning at bookmarks

## Adding a New Visualization Module

Follow the pattern established by existing modules:

```vba
Attribute VB_Name = "ModNewSource"
Option Explicit

Public Sub InsertAllNewSourceBadges()
    On Error GoTo ErrOut
    
    ' Read CC values
    Dim scoreText As String: scoreText = GetCC("[New Source Score]")
    If scoreText = "" Then Exit Sub
    
    Dim score As Double: score = Clamp(CDbl(scoreText), 0, 100)
    
    ' Build SVG
    Dim svg As String
    svg = "..."  ' SVG markup using constants from ModConstants
    
    ' Insert at bookmark
    InsertSvgAtBookmark BM_NEW_OVERALL, "new_source_svg", svg, "new_source.svg", 120
    
    Exit Sub
ErrOut:
    Debug.Print "InsertAllNewSourceBadges Error: " & Err.Description
End Sub
```

Then register in ModController:
```vba
On Error Resume Next
InsertAllNewSourceBadges
On Error GoTo 0
```

And add constants to ModConstants:
```vba
Public Const BM_NEW_OVERALL As String = "NewSourceOverallPlaceholder"
Public Const CLR_NEW_PRIMARY As String = "#hexvalue"
```
