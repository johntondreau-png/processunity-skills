---
tags:
  - processunity
  - dora
  - compliance
  - regulatory
created: 2026-04-07
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
  - "[[PU Config Designer]]"
  - "[[PU Report Builder]]"
  - "[[PU Uplift Designer]]"
  - "[[PU Admin Navigator]]"
---

# PU DORA

> Implement EU DORA (Digital Operational Resilience Act) compliance in any ProcessUnity instance. DORA requires financial entities to maintain a Register of Information on ICT third-party arrangements, reported via 7 RTS templates defined by the EBA.

## When to Use

Consult this when you need to:
- Add DORA regulatory reporting to an existing PU instance
- Configure the Register of Information (RTS templates RT.01-RT.07)
- Set up DORA reference data with EBA taxonomy codes
- Build DORA import/export report pipelines
- Design DORA compliance dashboards

## Prerequisites

- **VRM base solution active** — Vendors, Vendor Services, Assessments enabled
- **Agreements** and **Fourth Parties** enabled in system settings
- **Custom Object One** (Legal Entity) and **Custom Object Three** (CIF) available
- Admin access + import capability

## The 7 RTS Templates

| Template | Subject | PU Object(s) |
|----------|---------|-------------|
| **RT.01** | Entity maintaining register + identification + branches | Legal Entity |
| **RT.02** | Contractual arrangements — general, ICT services, entities | Agreement + Vendor Service + Service Add On + Legal Entity Contract |
| **RT.03** | Intragroup arrangements | Agreement + Legal Entity |
| **RT.04** | Third-party/intragroup overview | Agreement + Legal Entity |
| **RT.05** | ICT providers + subcontractor chain | Vendor + Fourth Party |
| **RT.06** | Critical/important functions | CIF |
| **RT.07** | Assessment details | Vendor Service |

## PU Object Mapping

| DORA Concept | PU Object | Notes |
|-------------|-----------|-------|
| Financial Entity | Legal Entity (Custom Object One) | Identification, hierarchy, branches |
| Critical Function | CIF (Custom Object Three) | Functions assessed for criticality |
| ICT Provider | Vendor | Standard vendor with DORA overlay |
| ICT Service | Vendor Service | Child of Vendor |
| Service Detail | Service Add On (Vendor Custom) | Child of Vendor Service; data locations |
| Contract | Agreement | Terms, dates, costs |
| Entity-Contract Link | Legal Entity Contract | Junction object |
| Subcontractor | Fourth Party | Sub-contracting chain |

## Key Patterns

### DORA Flag + Section Gating
Every DORA object gets a `DORA?` pick list flag. Section Headers named by RTS template (e.g., `DORA (RT.05.01)`) are conditional on `[DORA?] = "Yes"`. Non-DORA records show clean forms; DORA records show additional compliance sections.

### External ID Shadow
For every Reference Data pick list mapping to an EBA code:
1. Create the Reference Data pick list (user sees display name)
2. Create a hidden Text - Aggregate (Lookup, Type 5) companion
3. Aggregate reads `External Id` from the same relationship
4. Export reports reference the shadow for EBA code output

### Blank Date Sentinel
`IF([date field]="","9999-12-31",[date field])` — empty dates sort to end for reporting.

### Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Properties | `(DORA_XX.XX.XXXX) - description` | (DORA_05.01.0010) - Identification code |
| Shadows | Same + ` - External ID` | (DORA_05.01.0070) - Type of person - External ID |
| Section Headers | `DORA (RT.XX.XX)` | DORA (RT.05.01) |
| Ref Data types | `DORA - {Description}` | DORA - Country |
| Import reports | `DORA IMPORT N: OBJECT` | DORA IMPORT 3: VENDOR |
| Export reports | `EXCEL_DORA_RT.XX.XX` | EXCEL_DORA_RT.05.01 |

## Reference Data Types (~20 types)

All values have EBA taxonomy codes stored in External ID:

| Type | Count | EBA Prefix | Examples |
|------|-------|-----------|----------|
| DORA - Country | ~251 | `eba_GA` | ALBANIA (eba_GA:AL), AUSTRIA (eba_GA:AT) |
| DORA - Currency | ~166 | `eba_CU` | EUR (eba_CU:EUR), USD (eba_CU:USD) |
| DORA - Licensed Activity | ~128 | `eba_TA` | Credit institutions, Investment firms |
| DORA - Type of Entity | ~24 | `eba_CT` | Credit institutions, Insurance undertakings |
| DORA - ICT Service Type | ~19 | `eba_TA` | Cloud SaaS (S19), Cloud IaaS (S17) |
| DORA - Binary | 3 | `eba_BT` | Yes (x28), No (x29), Not performed (x21) |
| DORA - Type of Person | 2 | `eba_CT` | Legal person, Individual |
| DORA - Level of Reliance | 4 | `eba_ZZ` | Not significant, Low, Material, Full |
| DORA - Substitutability | 4 | `eba_ZZ` | Not substitutable, Easily, Medium, Complex |

Plus: Group Hierarchy, Data Sensitivity, Impact of Discontinuing, Termination Reason, Contractual Arrangement Type, Nature of Entity, Reintegration Possibility, Inability to Substitute Reason.

## Report Pipeline

### Import Sequence (dependency order)
0. **DORA IMPORT 7**: Fourth Party ref data (MUST RUN FIRST)
1. **DORA IMPORT 1**: Legal Entity (RT.01)
2. **DORA IMPORT 2**: CIF (RT.06)
3. **DORA IMPORT 3**: Vendor (RT.05)
4. **DORA IMPORT 4**: Vendor Service (RT.02, RT.07)
5. **DORA IMPORT 5**: Service Add On (RT.02 detail)
6. **DORA IMPORT 6**: Agreement (RT.02, RT.03)
7. **DORA IMPORT 8**: Fourth Party (RT.05.02)

### Excel Export Reports (one per RTS template)

| Report | Level 1 | Level 2 | Relationship |
|--------|---------|---------|-------------|
| EXCEL_DORA_RT.01.01-03 | Legal Entity | — | — |
| EXCEL_DORA_RT.02.01 | Agreement | Legal Entity | Making Use of Agreement |
| EXCEL_DORA_RT.02.02 | Agreement | Vendor Service | DORA Linked Service(s) |
| EXCEL_DORA_RT.02.03 | Legal Entity Contract | — | — |
| EXCEL_DORA_RT.03.01-03 | Agreement | Legal Entity | Various relationships |
| EXCEL_DORA_RT.05.01 | Vendor | Legal Entity | Legal Entities |
| EXCEL_DORA_RT.05.02 | Agreement | Vendor Service | DORA Linked Service(s) |
| EXCEL_DORA_RT.06.01 | CIF | — | — |
| EXCEL_DORA_RT.07.01 | Agreement | Vendor Service | DORA Linked Service(s) |

### Dashboard Reports
- DASH: DORA Vendors / Vendor Services / Agreements / Fourth Parties
- DASH: DATA: Legal Entities (data completion tracking)

## Key Relationships Required

| From | To | Relationship | Used By |
|------|----|-------------|---------|
| Agreement | Legal Entity | Making Use of This Agreement | RT.01, RT.04 |
| Agreement | Legal Entity | LEI of entity providing ICT services | RT.03.03 |
| Agreement | Vendor Service | DORA Linked Service(s) | RT.02.02, RT.05.02, RT.07.01 |
| Vendor | Fourth Party | Vendor Fourth Party | RT.05.02 |
| CIF | Legal Entity | LEI of financial entity | RT.06.01 |
| CIF | Service Add On | Function Identifier | RT.02.02 |

## Button Workflows (9)

| Object | Button | Purpose |
|--------|--------|---------|
| Agreement | Update and Relate Service | Link vendor service to agreement |
| Agreement | Relate Legal Entity | Associate entity with agreement |
| Legal Entity | Create Legal Entity Contract | Create junction record |
| Vendor | Create New Fourth Party | Add subcontractor |
| Vendor | Relate Existing Fourth Party | Link existing subcontractor |
| Vendor | Relate to Legal Entity | Associate with entity |
| Vendor Service | Create Service Add On | Add service detail record |
| Vendor Service | Relate Fourth Party | Link subcontractor to service |
| Questionnaire Response | Complete Fourth Party Review | Process fourth party assessment |

---

*See also: [[PU Data Model]] for platform foundation, [[PU Config Designer]] for configuration patterns, [[PU Report Builder]] for report design, [[PU Ref - Objects]] for complete object catalog.*
