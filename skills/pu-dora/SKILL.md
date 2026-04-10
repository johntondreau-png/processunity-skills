---
name: pu-dora
description: >
  Implement DORA (Digital Operational Resilience Act) compliance in a ProcessUnity instance.
  Use this skill when the user wants to add DORA regulatory reporting capability, configure
  the Register of Information (RTS templates RT.01 through RT.07), set up DORA reference data
  with EBA taxonomy codes, build DORA-specific properties on objects, create DORA import/export
  report pipelines, or design DORA compliance dashboards. Triggers for: "add DORA", "implement DORA",
  "DORA compliance", "Register of Information", "RTS reporting", "EBA taxonomy", "DORA configuration",
  "RT.01", "RT.02", "RT.05", "RT.06", "RT.07". This skill builds on pu-app-guide, pu-config-designer,
  pu-admin-navigator, and pu-import — always load those for platform knowledge.
depends_on:
  - pu-app-guide
  - pu-config-designer
  - pu-admin-navigator
  - pu-import
---

# ProcessUnity DORA Implementation

Implement EU DORA (Digital Operational Resilience Act) compliance in any ProcessUnity instance.
DORA requires financial entities to maintain a Register of Information on ICT third-party
arrangements, reported via 7 RTS (Regulatory Technical Standard) templates defined by the EBA.

## Before Starting

### Prerequisites
1. **VRM base solution active** — Vendors, Vendor Services, Assessments, Issues must be enabled
2. **Custom Objects available** — DORA needs at least 2 Custom Objects (for Legal Entity and CIF)
3. **Agreements enabled** — System setting for Agreements must be active
4. **Fourth Parties enabled** — System setting for Fourth Parties must be active
5. **Instance URL and admin access** confirmed
6. **Reference data import templates** available (or API access for bulk loading)

### DORA Solution Fingerprint
Check these system settings to confirm DORA readiness:

| Setting | Required State |
|---------|---------------|
| Vendors | Enabled |
| Vendor Services | Enabled |
| Agreements | Enabled |
| Fourth Parties | Enabled |
| Custom Object One (Legal Entity) | Enabled |
| Custom Object Three (CIF) | Enabled |
| Vendor Requests | Enabled (recommended) |
| Assessments & Questionnaires | Enabled |

## DORA Architecture Overview

### The 7 RTS Templates

DORA's Register of Information is reported across 7 template groups:

| Template | Subject | PU Object(s) | Key Fields |
|----------|---------|-------------|------------|
| **RT.01.01** | Entity maintaining the register | Legal Entity | Entity name, LEI, reporting date |
| **RT.01.02** | Entity identification | Legal Entity | LEI, country, entity type, hierarchy, total assets |
| **RT.01.03** | Branch information | Legal Entity (where Branch? = Yes) | Branch country, nature of entity |
| **RT.02.01** | Contractual arrangement - general | Agreement | Contract type, dates, annual cost, currency |
| **RT.02.02** | Contractual arrangement - ICT services | Agreement + Vendor Service + Service Add On | Function ID, service type, data locations |
| **RT.02.03** | Contractual arrangement - entities | Legal Entity Contract | Reference numbers, linked arrangements |
| **RT.03.01** | Intragroup arrangement - general | Agreement (intragroup type) | Same as RT.02.01 for intragroup |
| **RT.03.02** | Intragroup arrangement - ICT services | Agreement + Vendor Service | Same as RT.02.02 for intragroup |
| **RT.03.03** | Intragroup arrangement - entities | Agreement + Legal Entity | LEI of providing entity |
| **RT.04.01** | Third-party/intragroup overview | Agreement + Legal Entity | Entity-to-arrangement mapping |
| **RT.05.01** | ICT third-party service provider | Vendor | Provider ID, type, country, total spend |
| **RT.05.02** | ICT subcontractor chain | Fourth Party (via Vendor) + Vendor Service | Subcontractor details, service chain |
| **RT.06.01** | Critical/important functions | CIF | Function ID, licensed activity, criticality assessment |
| **RT.07.01** | Assessment details | Vendor Service | Substitutability, exit plans, reintegration |

### PU Object Mapping

DORA uses these PU objects (some renamed via Custom Object):

| DORA Concept | PU Object | Notes |
|-------------|-----------|-------|
| **Financial Entity** | Legal Entity (Custom Object One) | Stores entity identification, hierarchy, branch info |
| **Critical Important Function** | CIF (Custom Object Three) | Functions assessed for criticality |
| **ICT Third-Party Provider** | Vendor | Standard vendor object with DORA overlay |
| **ICT Service** | Vendor Service | Child of Vendor; stores ICT service details |
| **Service Detail** | Service Add On (Vendor Custom Object) | Child of Vendor Service; data location, sensitivity |
| **Contractual Arrangement** | Agreement | Stores contract terms, dates, costs |
| **Entity-Contract Link** | Legal Entity Contract | Junction between Legal Entity and Agreement |
| **ICT Subcontractor** | Fourth Party | Stores sub-contracting chain |

### Key Relationships Required

These relationships MUST exist for multi-level reports to work:

| From | To | Relationship Name | Used By |
|------|----|-------------------|---------|
| Agreement | Legal Entity | Legal Entities Making Use of This Agreement | RT.01, RT.04.01 |
| Agreement | Legal Entity | (DORA_03.03.0020) - LEI of entity providing ICT services | RT.03.03 |
| Agreement | Vendor Service | DORA Linked Service(s) | RT.02.02, RT.05.02, RT.07.01 |
| Agreement | Legal Entity Contract | (DORA_02.03.0010) - Contractual arrangement reference number | RT.02.03 |
| Vendor | Fourth Party | Vendor Fourth Party | RT.05.02 |
| Vendor | Legal Entity | Action Item / Legal Entities (Legal Entity) | RT.05.01 |
| CIF | Legal Entity | (DORA_06.01.0040) - LEI of financial entity | RT.06.01 |
| CIF | Service Add On | (DORA_02.02.0050) - Function Identifier | RT.02.02 |
| Service Add On | Legal Entity | (DORA_02.02.0020) - LEI of entity making use of ICT service(s) | RT.02.02 |
| Vendor Service | Service Add On | Service Add Ons (Related) | Detail breakdown |
| Legal Entity Contract | Agreement | Contractual arrangement reference/linked | RT.02.03 |

## Implementation Steps

### Phase 1: Reference Data Setup

Load all DORA reference data types with EBA taxonomy codes. Each value's **External ID** must store the EBA code for regulatory export.

#### Reference Data Types to Create

| Type Name | Count | EBA Code Prefix | Example Values |
|-----------|-------|-----------------|----------------|
| **DORA - Country** | ~251 | `eba_GA:XX` | ALBANIA (eba_GA:AL), AUSTRIA (eba_GA:AT), UNITED STATES (eba_GA:US) |
| **DORA - Currency** | ~166 | `eba_CU:XXX` | EUR (eba_CU:EUR), USD (eba_CU:USD), GBP (eba_CU:GBP) |
| **DORA - Licensed Activity** | ~128 | `eba_TA:xxxx` | Credit institutions, Investment firms, Payment services |
| **DORA - Type of Entity** | ~24 | `eba_CT:xxxx` | Credit institutions, Insurance undertakings, Payment institutions |
| **DORA - ICT Service Type** | ~19 | `eba_TA:xxxx` | ICT Development (S02), Cloud IaaS (S17), Cloud PaaS (S18), Cloud SaaS (S19) |
| **DORA - Group Hierarchy** | ~5 | `eba_RP:xxxx` | Ultimate parent (x53), Subsidiary (x56) |
| **DORA - Binary** | 3 | `eba_BT:xxxx` | Yes (x28), No (x29), Assessment not performed (x21) |
| **DORA - Type of Person** | 2 | `eba_CT:xxxx` | Legal person, Individual acting in business capacity |
| **DORA - Level of Reliance** | 4 | `eba_ZZ:xxxx` | Not significant (x794), Low (x795), Material (x796), Full (x797) |
| **DORA - Data Storage Sensitivity** | 3 | `eba_ZZ:xxxx` | Low (x791), Medium (x792), High (x793) |
| **DORA - Impact of Discontinuing** | 4 | `eba_ZZ:xxxx` | Low, Medium, High, Assessment not performed |
| **DORA - Substitutability** | 4 | `eba_ZZ:xxxx` | Not substitutable (x959), Easily (x962), Medium (x961), Highly complex (x960) |
| **DORA - Inability to Substitute Reason** | 3 | `eba_ZZ:xxxx` | Lack of alternatives (x963), Migration difficulties (x964), Both (x965) |
| **DORA - Reintegration Possibility** | 3 | `eba_ZZ:xxxx` | Easy (x798), Difficult (x966), Highly complex (x967) |
| **DORA - Termination Reason** | 6 | `eba_CO:xxxx` | Expired (x4), Provider breach (x5), Impediments (x6), Data security (x7) |
| **DORA - Type of Contractual Arrangement** | 3 | `eba_CO:xxxx` | Standalone (x1), Overarching (x2), Subsequent/associated (x3) |
| **DORA - Nature of Entity** | 2 | `eba_ZZ:xxxx` | Branch of financial entity (x838), Not a branch (x839) |
| **DORA - Criticality Assessment** | 3 | `eba_BT:xxxx` | Yes, No, Assessment not performed |
| **DORA - Fourth Party** | varies | — | Instance-specific fourth party names for pick list |
| **DORA - Exit Plan Existence** | 3 | `eba_BT:xxxx` | Yes, No, Assessment not performed |
| **DORA - Alternative Providers** | 3 | `eba_BT:xxxx` | Yes, No, Assessment not performed |
| **DORA - Data Storage Location** | varies | `eba_GA:XX` | Uses Country codes for storage/processing locations |

**Loading approach:** Use the pu-import skill's Reference Data import template. Each row needs: Name (display value), Type (e.g., "DORA - Country"), External ID (EBA code). Load in bulk via API or CSV import.

### Phase 2: Object Configuration

Configure properties on each DORA object. Use the patterns from pu-config-designer — especially **conditional display** (gated by `DORA?` flag), **Section Headers** (organized by RTS template), and **External ID shadow** (hidden aggregates for EBA codes).

#### Pattern: DORA Flag + Section Gating

On every DORA-participating object, add:
1. **`DORA?`** — Pick List (Reference Data type "DORA - Binary"). Values: Yes, No, Assessment not performed.
2. **Section Headers** named by RTS template (e.g., `DORA (RT.05.01)`) — conditional display on `[DORA?] = "Yes"`
3. All DORA properties placed below their respective Section Header

This keeps DORA fields hidden on non-DORA records.

#### Legal Entity Properties (RT.01.01, RT.01.02, RT.01.03)

**Section: DORA (RT.01.01) — Entity Maintaining Register**
| Property | Type | Notes |
|----------|------|-------|
| (DORA_01.01.0010) - Date of the reporting | Date - Calendar | Reporting date |

**Section: DORA (RT.01.02) — Entity Identification**
| Property | Type | Notes |
|----------|------|-------|
| (DORA_01.02.0010) - LEI of the financial entity | Text - Short | Legal Entity Identifier (20-char) |
| (DORA_01.02.0020) - Name of the financial entity | Text - Short | May map to [Name] |
| (DORA_01.02.0030) - Country of the entity | Reference Data (DORA - Country) | + External ID shadow aggregate |
| (DORA_01.02.0040) - Type of entity | Reference Data (DORA - Type of Entity) | + External ID shadow |
| (DORA_01.02.0050) - Hierarchy within group | Reference Data (DORA - Group Hierarchy) | + External ID shadow |
| (DORA_01.02.0060) - LEI of the direct parent | Text - Short | |
| (DORA_01.02.0070) - Date of last update | Date - Calendar | |
| (DORA_01.02.0080) - Total assets | Number - Decimal | |
| (DORA_01.02.0090) - Total assets date | Date - Calendar | |
| (DORA_01.02.0100) - Currency | Reference Data (DORA - Currency) | + External ID shadow |

**Section: DORA (RT.01.03) — Branch Information** (conditional: `[Branch?] = "Yes"`)
| Property | Type | Notes |
|----------|------|-------|
| Branch? | Pick List - Yes/No | Controls section visibility |
| (DORA_01.03.0010) - Identification code of the branch | Text - Short | |
| (DORA_01.03.0020) - Branch? LEI | Text - Short | |
| (DORA_01.03.0030) - Name of the branch | Text - Short | |
| (DORA_01.03.0040) - Country of the branch | Reference Data (DORA - Country) | + External ID shadow |
| (DORA_01.03.0050) - Nature of the entity | Reference Data (DORA - Nature of Entity) | |

#### Vendor Properties (RT.05.01)

**Section: DORA (RT.05.01) — ICT Third-Party Service Provider** (conditional: `[DORA?] = "Yes"`)
| Property | Type | Notes |
|----------|------|-------|
| DORA? | Pick List (DORA - Binary) | Master flag |
| (DORA_05.01.0010) - Identification code | Text - Short | Provider ID code |
| (DORA_05.01.0020) - Type of code | Pick List - Select One | LEI, National code, etc. |
| (DORA_05.01.0020) - Type of code - External ID | Text - Calculated | Shadow: maps code type to EBA code |
| (DORA_05.01.0030) - Name of the ICT third-party provider | Text - Short | May map to [Name] |
| (DORA_05.01.0040) - Additional identification code | Text - Short | Optional secondary code |
| (DORA_05.01.0050) - Additional code type | Pick List - Select One | |
| (DORA_05.01.0050) - Additional code type - External ID | Text - Calculated | Shadow |
| (DORA_05.01.0060) - Registration country | Text - Short | |
| (DORA_05.01.0070) - Type of person | Reference Data (DORA - Type of Person) | Legal/Individual |
| (DORA_05.01.0070) - Type of person - External ID | Text - Aggregate (Lookup) | Shadow: reads External ID |
| (DORA_05.01.0080) - Country of HQ | Reference Data (DORA - Country) | |
| (DORA_05.01.0080) - Country of HQ - External ID | Text - Aggregate (Lookup) | Shadow |
| (DORA_05.01.0090) - Currency of total annual spend | Reference Data (DORA - Currency) | |
| (DORA_05.01.0090) - Currency - External ID | Text - Aggregate (Lookup) | Shadow |
| (DORA_05.01.0100) - Total annual expense or cost | Number - Decimal | |
| (DORA_05.01.0110) - Ultimate parent undertaking ID | Text - Short | Self-referencing Vendor |
| (DORA_05.01.0110) - Ultimate parent ID - Agg | Text - Aggregate (Lookup) | Aggregates from parent vendor record |
| VALIDATOR - DORA | Text - Calculated | Optional: validates required fields |

#### CIF Properties (RT.06.01)

**Section: DORA (RT.06.01) — Critical Important Functions** (conditional: `[DORA?] = "Yes"`)
| Property | Type | Notes |
|----------|------|-------|
| DORA? | Pick List (DORA - Binary) | |
| (DORA_06.01.0010) - Function identifier | Text - Short | Unique CIF code |
| (DORA_06.01.0020) - Licensed activity | Reference Data (DORA - Licensed Activity) | + External ID shadow |
| (DORA_06.01.0030) - Function name | Text - Short | |
| (DORA_06.01.0040) - LEI of the financial entity | Object - Select One (Legal Entity) | Relationship link |
| (DORA_06.01.0050) - Criticality/importance assessment | Reference Data (DORA - Criticality Assessment) | + External ID shadow |
| (DORA_06.01.0060) - Reasons for criticality | Text - Long | |
| (DORA_06.01.0070) - Date of last assessment | Date - Calendar | |
| (DORA_06.01.0080) - Recovery time objective | Number - Integer | Hours |
| (DORA_06.01.0090) - Recovery point objective | Number - Integer | Hours |
| (DORA_06.01.0100) - Impact of discontinuing | Reference Data (DORA - Impact of Discontinuing) | + External ID shadow |

#### Agreement Properties (RT.02.01, RT.02.02, RT.03.03)

**Section: DORA (RT.02.01) — Contractual Arrangement General**
| Property | Type | Notes |
|----------|------|-------|
| DORA? | Pick List (DORA - Binary) | |
| (DORA_02.01.0010) - Contractual arrangement ID | Text - Short | Unique contract reference |
| (DORA_02.01.0020) - Type of contractual arrangement | Reference Data (DORA - Type of Contractual Arrangement) | Standalone/Overarching/Subsequent |
| (DORA_02.01.0030) - Overarching reference number | Text - Short | Only for subsequent type |
| (DORA_02.01.0040) - Currency | Reference Data (DORA - Currency) | |
| (DORA_02.01.0050) - Annual expense or cost | Number - Decimal | |
| (DORA_02.01.0060) - Start date | Date - Calendar | |
| (DORA_02.01.0070) - End date | Date - Calendar | |
| (DORA_02.01.0080) - Termination notice period | Number - Integer | Days |
| (DORA_02.02.0090) - Reason for termination | Reference Data (DORA - Termination Reason) | |

**Section: DORA (RT.03.03) — Intragroup Entity Link**
| Property | Type | Notes |
|----------|------|-------|
| (DORA_03.03.0020) - LEI of entity providing ICT services | Object - Select One (Legal Entity) | Relationship link |

#### Vendor Service Properties (RT.02.02, RT.07.01)

**Section: DORA (RT.02.02) — ICT Service Details**
| Property | Type | Notes |
|----------|------|-------|
| DORA? | Pick List (DORA - Binary) | |
| (DORA_02.02.0060) - Type of ICT services | Reference Data (DORA - ICT Service Type) | + External ID shadow |
| (DORA) - Third Party Name | Text - Aggregate (Lookup) | Reads vendor name from parent |

**Section: DORA (RT.07.01) — Assessment Details** (conditional: `CONTAINS([Criticality],"Yes")`)
| Property | Type | Notes |
|----------|------|-------|
| (DORA_07.01.0050) - Substitutability | Reference Data (DORA - Substitutability) | |
| (DORA_07.01.0060) - Reason not substitutable | Reference Data (DORA - Inability to Substitute Reason) | |
| (DORA_07.01.0070) - Date of last audit | Date - Calendar | |
| (DORA_07.01.0070) - Date of last audit - BLANK DATE | Text - Calculated | Sentinel: `IF([date]="","9999-12-31",[date])` |
| (DORA_07.01.0080) - Exit plan existence | Reference Data (DORA - Exit Plan Existence) | |
| (DORA_07.01.0090) - Reintegration possibility | Reference Data (DORA - Reintegration Possibility) | |
| (DORA_07.01.0100) - Impact of discontinuing | Reference Data (DORA - Impact of Discontinuing) | |
| (DORA_07.01.0110) - Alternative providers identified | Reference Data (DORA - Alternative Providers) | |

#### Service Add On Properties (RT.02.02 Detail)

**Section: DORA (RT.02.02) — Service Detail**
| Property | Type | Notes |
|----------|------|-------|
| (DORA_02.02.0020) - LEI of entity using service | Object - Select One (Legal Entity) | Relationship link |
| (DORA_02.02.0050) - Function identifier | Object - Select One (CIF) | Links to CIF record |
| (DORA_02.02.0060) - Type of ICT services | Text - Aggregate (Lookup) | From parent Vendor Service |
| (DORA_02.02.0120) - Country of governing law | Reference Data (DORA - Country) | |
| (DORA_02.02.0130) - Country of provision | Reference Data (DORA - Country) | |
| (DORA_02.02.0140) - Storage of data | Reference Data (DORA - Binary) | |
| (DORA_02.02.0150) - Data location at rest | Reference Data (DORA - Data Storage Location) | |
| (DORA_02.02.0160) - Data processing location | Reference Data (DORA - Data Storage Location) | |
| (DORA_02.02.0170) - Data sensitivity | Reference Data (DORA - Data Storage Sensitivity) | |
| (DORA_02.02.0180) - Level of reliance | Reference Data (DORA - Level of Reliance) | |

#### Fourth Party Properties (RT.05.02)

**Section: DORA (RT.05.02) — ICT Subcontractor Chain**
| Property | Type | Notes |
|----------|------|-------|
| DORA? | Pick List (DORA - Binary) | |
| (DORA_05.02.0010) - Service provider identification | Text - Short | |
| (DORA_05.02.0020) - Type of identification code | Pick List - Select One | |
| (DORA_05.02.0030) - Rank of the subcontractor | Number - Integer | Position in chain |
| (DORA_05.02.0040) - Directly subcontracted service | Text - Long | |
| (DORA_05.02.0050) - ICT services subcontracted | Reference Data (DORA - ICT Service Type) | |
| (DORA_05.02.0060) - Recipient identification code | Text - Short | |

#### Legal Entity Contract Properties (RT.02.03)

**Section: DORA (RT.02.03) — Entity-Contract Junction**
| Property | Type | Notes |
|----------|------|-------|
| (DORA_02.03.0010) - Contractual arrangement reference | Object - Select One (Agreement) | Links to agreement |
| (DORA_02.03.0020) - Linked arrangement | Object - Select One (Agreement) | For subsequent/associated contracts |

### Phase 3: Report Pipeline

Build reports in this order — import reports first, then operational, then export.

#### Import Reports (Data Loading Sequence)

**CRITICAL: Load reference data FIRST, then load records in dependency order.**

| Order | Report Name | Object | RTS Coverage | Notes |
|-------|-------------|--------|-------------|-------|
| 0 | DORA IMPORT 7: FOURTH PARTIES - REF DATA | Reference Data | — | Load Fourth Party names as reference data FIRST |
| 1 | DORA IMPORT 1: LEGAL ENTITY | Legal Entity | RT.01.01, 01.02, 01.03 | Entities must exist before linking |
| 2 | DORA IMPORT 2: CIF | CIF | RT.06.01 | Functions need Legal Entity references |
| 3 | DORA IMPORT 3: VENDOR | Vendor | RT.05.01 | Providers need reference data loaded |
| 4 | DORA IMPORT 4: VENDOR SERVICE | Vendor Service | RT.02.02, 07.01 | Child of Vendor |
| 5 | DORA IMPORT 5: SERVICE ADD ON | Service Add On | RT.02.02 detail | Child of Vendor Service |
| 6 | DORA IMPORT 6: AGREEMENT | Agreement | RT.02.01, 02.02, 03.03 | Needs Vendor + Legal Entity to exist |
| 7 | DORA IMPORT 8: FOURTH PARTIES | Fourth Party | RT.05.02 | Child of Vendor; needs ref data from step 0 |

#### Excel Export Reports (Regulatory Submission)

One report per RTS template section. Column names match EBA field codes for direct submission.

| Report Name | Level 1 | Level 2 | Relationship | RTS |
|-------------|---------|---------|-------------|-----|
| EXCEL_DORA_RT.01.01 | Legal Entity | — | — | Entity maintaining register |
| EXCEL_DORA_RT.01.02 | Legal Entity | — | — | Entity identification |
| EXCEL_DORA_RT.01.03 | Legal Entity | — | — | Branch information |
| EXCEL_DORA_RT.02.01 | Agreement | Legal Entity | Legal Entities Making Use of This Agreement | Contract general |
| EXCEL_DORA_RT.02.02 | Agreement | Vendor Service | DORA Linked Service(s) | Contract ICT services |
| EXCEL_DORA_RT.02.03 | Legal Entity Contract | — | — | Contract entities |
| EXCEL_DORA_RT.03.01 | Agreement | Legal Entity | Legal Entities Making Use of This Agreement | Intragroup general |
| EXCEL_DORA_RT.03.02 | Agreement | Legal Entity | Legal Entities Making Use of This Agreement | Intragroup ICT |
| EXCEL_DORA_RT.03.03 | Agreement | Legal Entity | (DORA_03.03.0020) - LEI of entity providing ICT services | Intragroup entities |
| EXCEL_DORA_RT.04.01 | Agreement | Legal Entity | Legal Entities Making Use of This Agreement | Overview |
| EXCEL_DORA_RT.05.01 | Vendor | Legal Entity | Legal Entities (Legal Entity) | Provider details |
| EXCEL_DORA_RT.05.02 | Agreement | Vendor Service | DORA Linked Service(s) | Subcontractor chain |
| EXCEL_DORA_RT.06.01 | CIF | — | — | Critical functions |
| EXCEL_DORA_RT.07.01 | Agreement | Vendor Service | DORA Linked Service(s) | Assessment details |

**Key insight:** The External ID shadow properties are critical here — export report columns reference the hidden aggregate properties that store EBA codes, not the human-readable Reference Data display names.

#### Dashboard Reports

| Report Name | Chart Type | Story |
|-------------|-----------|-------|
| DASH: DORA Vendors | Doughnut/Bar | DORA vendor distribution by type/country |
| DASH: DORA Vendor Services | Stacked Column | ICT services by type and provider |
| DASH: DORA Agreements | Bar | Contract arrangements by type and status |
| DASH: DORA Fourth Parties | Pie | Subcontractor distribution |
| DASH: DATA: Legal Entities | Number Box/Gauge | Data completion tracking |

### Phase 4: Validation (Optional)

Optionally add VALIDATOR properties — calculated text fields that check DORA-required fields and output error messages for missing data:

```
IF([(DORA_05.01.0010) - Identification code]="",
   "❌ 05.01.0010 is required for DORA compliance." + CRLF(),
   "") +
IF([(DORA_05.01.0030) - Name]="",
   "❌ 05.01.0030 is required for DORA compliance." + CRLF(),
   "")
```

This is ONE approach to validation. Alternatively, use PU's built-in Validation Rules on individual properties (prevents save if rule fails), or use workflow notifications to alert on incomplete records.

## Design Principles

### External ID Shadow Pattern
For every Reference Data property that maps to an EBA taxonomy code:
1. Create the Reference Data pick list property (user sees display name)
2. Create a hidden Text - Aggregate (Lookup, Type 5) companion property
3. Aggregate reads `External Id` from the same relationship
4. Export reports reference the shadow property for the EBA code

### Section Header Organization
Group DORA properties by RTS template section using Section Header properties:
- `DORA (RT.01.02)` — groups entity identification fields
- `DORA (RT.05.01)` — groups provider fields
- `DORA (RT.07.01)` — groups assessment fields
Apply conditional display on Section Headers to hide entire groups when not applicable.

### Blank Date Sentinel
For date fields that may be empty but must sort/filter correctly in reports:
```
IF([(DORA_07.01.0070) - Date of last audit]="","9999-12-31",[(DORA_07.01.0070) - Date of last audit])
```

### DORA Flag Cascade
The `DORA?` flag on a Vendor record should conditionally show the DORA sections on that vendor AND influence whether child records (Vendor Services, Fourth Parties) show their DORA sections. Consider an aggregate on child objects that reads the parent's `DORA?` value.

## Naming Conventions

| Element | Convention | Example |
|---------|-----------|---------|
| Properties | `(DORA_XX.XX.XXXX) - EBA field description` | (DORA_05.01.0010) - Identification code |
| Shadow properties | Same + ` - External ID` or ` - Agg` suffix | (DORA_05.01.0070) - Type of person - External ID |
| Helper properties | Same + ` - BLANK DATE` suffix | (DORA_07.01.0070) - Date... - BLANK DATE |
| Section Headers | `DORA (RT.XX.XX)` | DORA (RT.05.01) |
| Reference Data types | `DORA - {Description}` | DORA - Country, DORA - Currency |
| Import reports | `DORA IMPORT {N}: {OBJECT}` | DORA IMPORT 3: VENDOR |
| Export reports | `EXCEL_DORA_RT.XX.XX` | EXCEL_DORA_RT.05.01 |
| Dashboard reports | `DASH: DORA {Subject}` | DASH: DORA Vendors |
| Validators | `VALIDATOR - DORA` | On each DORA object |

## Phase 5: Buttons and Workflow Actions

Build 9 buttons that power the DORA data entry workflow. Each uses ProcessUnity's Workflow Action (WFA) system — paired reports that gather context data and create/update records on target objects.

**See `references/buttons-and-workflows.md` for detailed WFA report chains.**

### Button Build Order

Build buttons AFTER properties and reports are in place (buttons reference WF reports + properties).

| # | Object | Button Name | Gated By | What It Does |
|---|--------|-------------|----------|-------------|
| 1 | Agreement | Update and Relate Service | DORA? + VALIDATOR | Links Vendor Service to Agreement via "DORA Linked Service(s)" |
| 2 | Agreement | Relate Legal Entity to Agreement | DORA? | Links Legal Entity to Agreement |
| 3 | Legal Entity | Create Legal Entity Contract | — (system) | Creates Legal Entity Contract child record |
| 4 | Questionnaire Response | Complete Fourth Party Review | Question ID + VALIDATOR-FP | Creates Fourth Party + Ref Data from questionnaire |
| 5 | Vendor | Create New Fourth Party | — | Creates new Fourth Party + Reference Data |
| 6 | Vendor | Relate Existing Fourth Party to Vendor | — | Links existing Fourth Party to Vendor |
| 7 | Vendor | Relate Vendor to Legal Entity | DORA? | Links Legal Entity to Vendor |
| 8 | Vendor Service | Create Service Add On | — | Creates Service Add On child record |
| 9 | Vendor Service | Relate Fourth Party to Vendor Service | — | Links Fourth Party to Vendor Service |

### WFA Technical Pattern

Each button requires:
1. **Data-gather WF report** — `EnableWFAContext=Yes`, role restricted to "Only Me", defines columns to collect
2. **Import target WF report** — no WFA flags, no role restrictions, defines target object for record creation
3. **Button property** — Custom Button type, with conditional display (DORA?) and conditional enable (VALIDATOR)

Reports come in **paired oids** — same name appears twice with different configs. Buttons do NOT use standalone import templates; the 8 "DORA IMPORT" templates are separate bulk-load utilities.

### Workflow Reports Required (11 total)

| Report Name | Object | Serves Button |
|-------------|--------|--------------|
| BTN: AGREEMENT: 01. Link Service to Agreement | Agreement / Vendor Service | #1 |
| BTN: AGREEMENT: 01. Relate Agreement to Legal Entity | Agreement | #2 |
| BTN: AGREEMENT: 02. Legal Entity Information | Agreement | #2 |
| BTN: AGREEMENT: SERVICE: 03. Relate Service to Agreement | Agreement | #1 |
| BTN: QR: Create Fourth Party Record | QR / Fourth Party | #4 |
| BTN: QR: Create Ref data | QR / Ref Data | #4 |
| BTN: SERVICE: SAO: 1. Create Service Add On | Service Add On | #8 |
| BTN: VENDOR: Create Fourth Party Record | Vendor / Fourth Party | #5 |
| BTN: VENDOR: Create Fourth Party Reference Data | Vendor / Ref Data | #5 |
| BTN: VENDOR: Relate Existing Fourth Party to Vendor | Vendor / Fourth Party | #6 |
| BTN: VENDOR SERVICE: 01. Relate Fourth Party to Vendor Service | VS / Fourth Party | #9 |

## Property Count Reconciliation

Counts from the cwiedersheim reference implementation vs STAR sizing document:

| Object | Reference Impl | STAR Target | Delta | Notes |
|--------|---------------|-------------|-------|-------|
| Vendor | 32 | 41 | -9 | Gap: additional workflow helpers |
| Vendor Service | 27 | 30 | -3 | Gap: RT.05.02 aggregates |
| Service Add On | 23 | 30 | -7 | Gap: additional RT.02.02 variants |
| Agreement | 36 | 45 | -9 | Gap: RT.03/RT.04 export calcs |
| Fourth Party | 10 | 12 | -2 | Gap: RT.05.01 mirror fields |
| Legal Entity | **30** | **30** | **0** | MATCH |
| Legal Entity Contract | 6 | 7 | -1 | 1 additional helper |
| CIF | 19 | 18 | +1 | Exceeds target |
| Reference Data | 3 | 2 | +1 | Exceeds target |
| Questionnaire Response | 8 | 9 | -1 | 1 additional workflow field |
| **TOTAL** | **194** | **224** | **-30** | Gaps are mostly export-only calcs |

**See `references/property-inventory.md` for the complete per-object property listing.**

The -30 delta represents properties the STAR scoped but the reference instance omitted — many are export-only calculated fields that exist as report column formulas rather than stored properties, or planned properties for future regulatory updates.

## Implementation Checklist

- [ ] System settings verified (Agreements, Fourth Parties, Custom Objects enabled)
- [ ] Custom Object One renamed to "Legal Entity"
- [ ] Custom Object Three renamed to "CIF"
- [ ] All DORA reference data types loaded with EBA codes in External ID
- [ ] Legal Entity properties configured (RT.01.01, 01.02, 01.03) — 30 props
- [ ] CIF properties configured (RT.06.01) — 19 props
- [ ] Vendor properties configured (RT.05.01, RT.02.02, RT.05.02) — 32 props
- [ ] Vendor Service properties configured (RT.02.02, RT.05.02, RT.07.01) — 27 props
- [ ] Service Add On properties configured (RT.02.02 detail) — 23 props
- [ ] Agreement properties configured (RT.02.01, RT.02.02, RT.03.02, RT.03.03) — 36 props
- [ ] Legal Entity Contract properties configured (RT.02.03) — 6 props
- [ ] Fourth Party properties configured (RT.05.02, RT.05.01 mirror) — 10 props
- [ ] Questionnaire Response Fourth Party workflow configured — 8 props
- [ ] Reference Data concentration risk properties configured — 3 props
- [ ] All object relationships verified (see Key Relationships table)
- [ ] External ID shadow aggregates created and hidden
- [ ] DORA? flag with conditional display on all Section Headers
- [ ] VALIDATOR - DORA calculated fields created on all objects
- [ ] Workflow reports built (11 BTN: reports)
- [ ] Buttons created and wired (9 buttons)
- [ ] Import templates built and tested (8 DORA IMPORT reports, numbered sequence)
- [ ] EXCEL export reports built (14 EXCEL_DORA_RT reports)
- [ ] Operational/navigation reports built (DORA - A through G)
- [ ] Dashboard reports and dashboard created
- [ ] Sample data loaded and validated
- [ ] Export reports produce correct EBA-coded output

## Reference Files

### In this skill
- **`references/property-inventory.md`** — Complete per-object property listing with types and notes
- **`references/buttons-and-workflows.md`** — Detailed WFA report chains for all 9 buttons
- **`manifests/dora-formulas.json`** — 75 calculated/aggregate field expressions (VALIDATOR patterns, External ID shadows, date sentinels)

### Supporting skills
- **pu-app-guide** — Object types, property types, relationships, aggregate codes, platform limits, report design, chart types, multi-level report joins, dashboard design
- **pu-config-designer** — Configuration patterns, conditional display, auto-update rules, color coding
- **pu-admin-navigator** — Browser automation for creating properties, reports, and navigating admin UI
- **pu-import** — Import API, column positional mapping, bulk data loading
