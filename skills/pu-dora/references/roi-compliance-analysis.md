# DORA Register of Information — Compliance Gap Analysis

Independent verification of the ProcessUnity DORA configuration against the official EBA ITS
(Commission Implementing Regulation (EU) 2024/2956) requirements.

**Analysis date:** April 2026
**ITS version:** Final (adopted), Taxonomy v2.0 (March 2025)
**Reference implementation:** cwiedersheim (ProcessUnity)
**Submission format:** xBRL-CSV (structured ZIP with JSON metadata + CSV per template)

## Template ID Mapping

The EBA ITS uses `B_XX.XX` template IDs. The PU DORA configuration uses `RT.XX.XX` naming. They map 1:1:

| EBA Template | PU RT Code | Name | PU Object |
|-------------|-----------|------|-----------|
| **B_01.01** | RT.01.01 | Entity maintaining the register | Legal Entity |
| **B_01.02** | RT.01.02 | Entities within scope | Legal Entity |
| **B_01.03** | RT.01.03 | Branch information | Legal Entity (Branch? = Yes) |
| **B_02.01** | RT.02.01 | Contractual arrangements — general | Agreement |
| **B_02.02** | RT.02.02 | Contractual arrangements — specific | Agreement + Vendor Service + Service Add On |
| **B_02.03** | RT.02.03 | Entity-contract link | Legal Entity Contract |
| **B_03.01** | RT.03.01 | Entities signing (receipt side) | Agreement + Legal Entity |
| **B_03.02** | RT.03.02 | ICT providers signing | Agreement + Vendor |
| **B_03.03** | RT.03.03 | Intragroup service-providing entity | Agreement + Legal Entity |
| **B_04.01** | RT.04.01 | Entities using ICT services | Agreement + Legal Entity |
| **B_05.01** | RT.05.01 | ICT third-party service providers | Vendor |
| **B_05.02** | RT.05.02 | ICT service supply chain | Fourth Party + Vendor Service |
| **B_06.01** | RT.06.01 | Functions identification | CIF |
| **B_07.01** | RT.07.01 | Assessment details | Vendor Service |
| **B_99.01** | — | Entity-defined definitions | (not mapped) |

## Field-by-Field Compliance Check

### B_01.01 — Entity Maintaining the Register ✅ COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| LEI of financial entity | B_01.01.0010 | Yes | (DORA_01.01.0020) - Name of the entity / LEI from RT.01.02 | ⚠️ See note |
| Name of financial entity | B_01.01.0020 | Yes | (DORA_01.01.0020) - Name of the entity | ✅ |
| Country | B_01.01.0030 | Yes | Via RT.01.02 country field | ✅ |
| Type of financial entity | B_01.01.0040 | Yes | Via RT.01.02 entity type | ✅ |
| Competent authority | B_01.01.0050 | Conditional | (DORA_01.01.0050) - Competent Authority | ✅ |
| Date of reporting | B_01.01.0060 | Conditional | (DORA_01.01.0060) - Date of the reporting | ✅ |

**Note:** B_01.01 is a single-row template identifying WHO maintains the register. The PU implementation captures this via the `(DORA_01.01.0010) - Entity maintains register?` flag on Legal Entity records. The LEI for the maintaining entity comes from RT.01.02 fields on the same record.

### B_01.02 — Entities Within Scope ✅ COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| LEI | B_01.02.0010 | Yes | (DORA_01.02.0010) - LEI of the financial entity | ✅ |
| Name | B_01.02.0020 | Yes | (DORA_01.02.0020) - Name of the financial entity | ✅ |
| Country | B_01.02.0030 | Yes | (DORA_01.02.0030) - Country of the entity + External ID shadow | ✅ |
| Type of entity | B_01.02.0040 | Yes | (DORA_01.02.0040) - Type of entity + External ID shadow | ✅ |
| Hierarchy within group | B_01.02.0050 | Yes | (DORA_01.02.0050) - Hierarchy within group + External ID shadow | ✅ |
| LEI of direct parent | B_01.02.0060 | Yes | (DORA_01.02.0060) - LEI of the direct parent | ✅ |
| Date of last update | B_01.02.0070 | Yes | (DORA_01.02.0070) - Date of last update | ✅ |
| Date of integration | B_01.02.0080 | Yes | (DORA_01.02.0080) - Date of integration into the group | ✅ |
| Date of deletion | B_01.02.0090 | Yes | (DORA_01.02.0090) - Date of deletion from the group | ✅ |
| Currency | B_01.02.0100 | Conditional | (DORA_01.02.0100) - Currency + External ID shadow | ✅ |
| Total assets | B_01.02.0110 | Conditional | (DORA_01.02.0110) - Value of total assets | ✅ |

**Assessment:** Complete coverage. All 11 fields mapped with EBA taxonomy shadows where needed.

### B_01.03 — Branch Information ✅ COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Branch identification code | B_01.03.0010 | Yes | (DORA_01.03.0010) - Identification code of the branch | ✅ |
| LEI of head office | B_01.03.0020 | Yes | (DORA_01.03.0020) - LEI of head office of branch | ✅ (Calculated) |
| Name of branch | B_01.03.0030 | Yes | (DORA_01.03.0030) - Name of the branch | ✅ |
| Country of branch | B_01.03.0040 | Yes | (DORA_01.03.0040) - Country of the branch + External ID shadow | ✅ |

**Note:** The EBA template has only 4 fields. PU adds `(DORA_01.03.0050) - Nature of the entity` which maps to B_04.01.0030 (Nature of entity — Branch vs Non-branch). Good practice to have it on the Legal Entity record.

### B_02.01 — Contractual Arrangements General ✅ COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Arrangement reference | B_02.01.0010 | Yes | (DORA_02.01.0010) - Contractual arrangement reference number | ✅ |
| Type of arrangement | B_02.01.0020 | Yes | (DORA_02.01.0020) - Type of contractual arrangement + External ID | ✅ |
| Overarching reference | B_02.01.0030 | Conditional | (DORA_02.01.0030) - Overarching reference number + External ID | ✅ |
| Currency | B_02.01.0040 | Yes | (DORA_02.01.0040) - Currency + External ID | ✅ |
| Annual cost | B_02.01.0050 | Yes | (DORA_02.01.0050) - Annual expense or estimated cost | ✅ |

**Assessment:** Full coverage.

### B_02.02 — Contractual Arrangements Specific ✅ MOSTLY COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Arrangement reference | B_02.02.0010 | Yes | Via Agreement link from Service Add On | ✅ |
| LEI of entity using service | B_02.02.0020 | Yes | (DORA_02.02.0020) - LEI of entity using service (on Service Add On) | ✅ |
| Provider identification code | B_02.02.0030 | Yes | (DORA_02.02.0030) - Identification code (Vendor calc on Vendor) | ✅ |
| Type of provider code | B_02.22.0040 | Yes | (DORA_02.02.0040) - Type of code (Vendor calc) | ✅ |
| Function identifier | B_02.02.0050 | Yes | (DORA_02.02.0050) - Function identifier (CIF link on SAO) | ✅ |
| Type of ICT service | B_02.02.0060 | Yes | (DORA_02.02.0060) - Type of ICT services + External ID | ✅ |
| Start date | B_02.02.0070 | Yes | (DORA_02.02.0070) - Start date (on Agreement) | ✅ |
| End date | B_02.02.0080 | Yes | (DORA_02.02.0080) - End date + BLANK DATE sentinel | ✅ |
| Reason for termination | B_02.02.0090 | Conditional | (DORA_02.02.0090) - Reason for termination + External ID | ✅ |
| Notice period (entity) | B_02.02.0100 | Conditional | (DORA_02.02.0100) - Notice period for the financial entity | ✅ |
| Notice period (provider) | B_02.02.0110 | Conditional | (DORA_02.02.0110) - Notice period for the ICT third-party | ✅ |
| Governing law country | B_02.02.0120 | Conditional | (DORA_02.02.0120) - Country of governing law + External ID (on SAO) | ✅ |
| Country of provision | B_02.02.0130 | Conditional | (DORA_02.02.0130) - Country of provision + External ID (on SAO) | ✅ |
| Data storage | B_02.02.0140 | Conditional | (DORA_02.02.0140) - Storage of data (on SAO) | ✅ |
| Data location at rest | B_02.02.0150 | Conditional | (DORA_02.02.0150) - Data location at rest + External ID (on SAO) | ✅ |
| Data processing location | B_02.02.0160 | Conditional | (DORA_02.02.0160) - Data processing location + External ID (on SAO) | ✅ |
| Data sensitivity | B_02.02.0170 | Conditional | (DORA_02.02.0170) - Data sensitivity (on SAO) | ✅ |
| Level of reliance | B_02.02.0180 | Conditional | (DORA_02.02.0180) - Level of reliance (on SAO) | ✅ |

**Assessment:** All 18 fields covered. The PU implementation splits B_02.02 data across Agreement (dates, costs), Vendor Service (service type), and Service Add On (entity link, function, data locations) — which is architecturally sound since one agreement can cover multiple services.

### B_02.03 — Entity-Contract Link ✅ COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Arrangement reference | B_02.03.0010 | Yes | (DORA_02.03.0010) - Contractual arrangement reference number + Agg | ✅ |
| Linked arrangement | B_02.03.0020 | Yes | (DORA_02.03.0020) - Linked contractual arrangement reference + Agg | ✅ |

### B_03.01 — Entities Signing (Receipt Side) ⚠️ PARTIALLY COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Arrangement reference | B_03.01.0010 | Yes | Agreement link | ✅ |
| LEI of signing entity | B_03.01.0020 | Yes | Legal Entity LEI via relationship | ⚠️ Implicit |

**Gap:** B_03.01 requires explicit identification of which entity **signed** the agreement. The PU configuration tracks which entities **use** the agreement (via "Legal Entities Making Use of This Agreement" relationship) but does not explicitly distinguish between signing entity and consuming entity. In group structures, these can differ — Entity A signs but entities A, B, C all consume.

**Recommendation:** Add a `(DORA_03.01.0020) - LEI of signing entity` relationship field on Agreement pointing to Legal Entity, OR add a signatory flag/role to the existing Legal Entity-Agreement relationship. The existing EXCEL_DORA_RT.03.01 export report may handle this via the relationship data, but the distinction should be explicit.

### B_03.02 — ICT Providers Signing ⚠️ PARTIALLY COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Arrangement reference | B_03.02.0010 | Yes | Agreement link | ✅ |
| Provider identification code | B_03.02.0020 | Yes | Via Vendor link | ⚠️ Implicit |
| Type of provider code | B_03.02.0030 | Yes | Via Vendor RT.05.01 fields | ⚠️ Implicit |

**Gap:** Similar to B_03.01 — the PU configuration links Agreement → Vendor but doesn't explicitly record which provider entity was the **signatory**. In complex arrangements where a group's subsidiary signs but the parent is the actual provider, this distinction matters.

**Note:** The PU configuration has `(DORA_03.02.0020) - ID code of the ICT intragroup service provider` and `(DORA_03.02.0030) - Type of code for intragroup provider` as aggregates on Agreement from linked Vendor. This covers the intragroup case. For general (non-intragroup) arrangements, the signing provider is typically assumed to be the linked Vendor.

### B_03.03 — Intragroup Service-Providing Entity ✅ COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Arrangement reference | B_03.03.0010 | Yes | Agreement reference | ✅ |
| LEI of providing entity | B_03.33.0020 | Yes | (DORA_03.03.0020) - LEI of entity providing ICT services | ✅ |

### B_04.01 — Entities Using ICT Services ⚠️ PARTIALLY COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Arrangement reference | B_04.01.0010 | Yes | Agreement reference | ✅ |
| LEI of entity using service | B_04.01.0020 | Yes | Legal Entity LEI via relationship | ✅ |
| Nature of entity | B_04.01.0030 | Yes | (DORA_01.03.0050) - Nature of entity (on Legal Entity) | ⚠️ Indirect |
| Branch identification code | B_04.01.0040 | Conditional | (DORA_01.03.0010) - Branch identification code (on Legal Entity) | ⚠️ Indirect |

**Gap:** B_04.01 maps entities to arrangements with nature (branch vs non-branch). The PU configuration captures nature and branch code on the Legal Entity record itself (via RT.01.03 section), which can be pulled into the export report via multi-level joins. The data is there but the export report `EXCEL_DORA_RT.04.01` needs to pull these fields from the related Legal Entity.

**Assessment:** Data is captured; export report design must include the right columns.

### B_05.01 — ICT Third-Party Service Providers ⚠️ MOSTLY COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Provider identification code | B_05.01.0010 | Yes | (DORA_05.01.0010) - Identification code | ✅ |
| Type of identification code | B_05.01.0020 | Yes | (DORA_05.01.0020) - Type of code + External ID | ✅ |
| Additional identification code | B_05.01.0030 | Optional | (DORA_05.01.0030) - Additional identification code | ✅ |
| Type of additional code | B_05.01.0040 | Conditional | (DORA_05.01.0040) - Type of additional identification code + External ID | ✅ |
| Legal name | B_05.01.0050 | Yes | (DORA_05.01.0050) - Legal name (Calculated from [Name]) | ✅ |
| Trade name | — | — | (DORA_05.01.0060) - Name of the ICT third-party service provider | ✅ (PU extra) |
| Country of registration | B_05.01.0060 | Yes | (DORA_05.01.0060) - Registration country | ⚠️ Text field |
| Type of person | B_05.01.0070 | Yes | (DORA_05.01.0070) - Type of person + External ID | ✅ |
| Country of HQ | B_05.01.0080 | — | (DORA_05.01.0080) - Country of HQ + External ID | ✅ (PU extra) |
| Currency of spend | B_05.01.0090 | — | (DORA_05.01.0090) - Currency + External ID | ✅ (PU extra) |
| Total annual spend | B_05.01.0100 | — | (DORA_05.01.0100) - Total annual expense or cost | ✅ (PU extra) |
| Ultimate parent ID | B_05.01.0090 | Conditional | (DORA_05.01.0110) - Ultimate parent undertaking ID + Agg | ✅ |
| Type of parent code | — | Conditional | (DORA_05.01.0120) - Type of code of ultimate parent + External IDs | ✅ |
| Parent undertaking indicator | B_05.01.0080 | Yes | ❌ Missing | 🔴 |
| Date of integration | B_05.01.0110 | Yes | ❌ Missing | 🔴 |
| Date of deletion | B_05.01.0120 | Yes | ❌ Missing | 🔴 |

**Gaps Found:**
1. **Parent undertaking indicator** (B_05.01.0080) — Yes/No field indicating whether the provider has a parent undertaking. Not present as a stored property. Could be derived from whether Ultimate Parent ID is populated.
2. **Date of integration** (B_05.01.0110) — Date the provider was added to the register. No property found.
3. **Date of deletion** (B_05.01.0120) — Date the provider was removed from the register. Should default to `9999-12-31` if active. No property found.
4. **Country of registration** (B_05.01.0060) is a free text field rather than Reference Data with EBA country code. Should use DORA - Country with External ID shadow.

**Note:** PU adds fields not in the EBA spec (HQ country, currency, annual spend, trade name). These are valuable for operational management but the EBA template doesn't require them. Having extra fields is fine — missing required fields is the problem.

### B_05.02 — ICT Service Supply Chain ⚠️ PARTIALLY COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Arrangement reference | B_05.02.0010 | Yes | (DORA_05.02.0010) - Identification code | ⚠️ Mismatch |
| Type of ICT service | B_05.02.0020 | Yes | (DORA_05.02.0050) - ICT services subcontracted | ✅ |
| Provider identification code | B_05.02.0030 | Yes | (DORA_05.02.0010) - Identification code | ⚠️ |
| Type of provider code | B_05.02.0040 | Yes | (DORA_05.02.0020) - Type of identification code | ✅ |
| Rank in supply chain | B_05.02.0050 | Yes | (DORA_05.02.0030) - Rank of subcontractor | ✅ |

**Gap:** The EBA B_05.02 requires a **contractual arrangement reference** linking the supply chain entry back to B_02.01. The PU Fourth Party object stores the subcontractor's own identification but may not have a direct link back to the specific agreement. The Vendor Service has `(DORA_05.02.0010) - Contractual arrangement reference number` as an aggregate, which can bridge this, but the Fourth Party itself needs the arrangement reference for export.

Also missing: **Recipient identification code** (B_05.02.0060 in PU numbering) — who receives the subcontracted service. Present in PU as `(DORA_05.02.0060) - Recipient identification code` on Fourth Party. ✅

### B_06.01 — Functions Identification ⚠️ MOSTLY COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Function identifier | B_06.01.0010 | Yes | (DORA_06.01.0010) - Function Identifier | ✅ |
| LEI of financial entity | B_06.01.0020 | Yes | (DORA_06.01.0040) - LEI of the financial entity + LEI Agg | ✅ |
| Licensed activity | B_06.01.0030 | Yes | (DORA_06.01.0020) - Licensed Activity + External ID | ✅ |
| Function name | B_06.01.0040 | Yes | (DORA_06.01.0030) - Function name | ✅ |
| Description | B_06.01.0050 | Optional | ❌ Missing | ⚠️ (Optional) |
| Criticality assessment | — | — | (DORA_06.01.0050) - Criticality/importance assessment + External ID | ✅ (PU extra) |
| Reasons for criticality | — | — | (DORA_06.01.0060) - Reasons for criticality | ✅ (PU extra) |
| Date of last assessment | — | — | (DORA_06.01.0070) - Date of last assessment + BLANK DATE | ✅ (PU extra) |
| RTO | — | — | (DORA_06.01.0080) - Recovery time objective | ✅ (PU extra) |
| RPO | — | — | (DORA_06.01.0090) - Recovery point objective | ✅ (PU extra) |
| Impact of discontinuing | — | — | (DORA_06.01.0100) - Impact of discontinuing | ✅ (PU extra) |

**Note:** The EBA B_06.01 is a lean template (5 fields). The PU configuration adds criticality assessment, RTO/RPO, and impact fields that are operationally important and feed into B_07.01 assessment reporting. The only formally missing field is the optional Description (B_06.01.0050) — CIF objects have a standard Description field in PU that could serve this purpose.

### B_07.01 — Assessment Details ✅ MOSTLY COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Function identifier | B_07.01.0010 | Yes | Via CIF relationship on Service Add On → export | ✅ |
| Arrangement reference | B_07.01.0020 | Yes | Via Agreement link | ✅ |
| Type of ICT service | B_07.01.0030 | Yes | (DORA_02.02.0060) - Type of ICT services | ✅ |
| Provider identification code | B_07.01.0040 | Yes | Via Vendor link | ✅ |
| Substitutability | B_07.01.0050 | Yes | (DORA_07.01.0050) - Substitutability + External ID | ✅ |
| Reason not substitutable | — | Conditional | (DORA_07.01.0060) - Reason not substitutable + External ID | ✅ (PU extra) |
| Date of last audit | B_07.01.0060 | Optional | (DORA_07.01.0070) - Date of last audit + BLANK DATE | ✅ |
| Impact of discontinuing | B_07.01.0070 | Yes | (DORA_07.01.0100) - Impact of discontinuing + External ID | ✅ |
| Exit plan existence | — | — | (DORA_07.01.0080) - Exit plan existence + External ID | ✅ (PU extra) |
| Reintegration possibility | — | — | (DORA_07.01.0090) - Reintegration possibility + External ID | ✅ (PU extra) |
| Alternative providers | — | — | (DORA_07.01.0110) - Alternative ICT TPP + External ID | ✅ (PU extra) |
| Identification of alternatives | — | — | (DORA_07.01.0120) - Identification of alternative ICT TPP | ✅ (PU extra) |

**Assessment:** The EBA B_07.01 has ~7 fields. PU adds exit plan, reintegration, alternative providers, and reason fields that go beyond the minimum. Strong coverage.

### B_99.01 — Entity-Defined Definitions 🔴 NOT COVERED

| EBA Field | EBA ID | Required | PU Property | Status |
|-----------|--------|----------|-------------|--------|
| Indicator code | B_99.01.0010 | Yes | ❌ Not mapped | 🔴 |
| Entity definition | B_99.01.0020 | Yes | ❌ Not mapped | 🔴 |

**Gap:** B_99.01 is a glossary template where entities define their internal terminology (e.g., what "low sensitivity" means in their context). This is NOT captured in the PU DORA configuration. However, this template is typically a static document maintained outside the TPRM system — it doesn't require ongoing data management. It could be stored as a simple reference data table or exported from a separate document.

**Recommendation:** Create a Reference Data type "DORA - Entity Definitions" or store as a simple report. Low priority since it's static content.

## Summary of Gaps

### 🔴 Missing (Required by EBA, not in PU config)

| # | Template | Field | Severity | Recommendation |
|---|----------|-------|----------|----------------|
| 1 | B_05.01 | Parent undertaking indicator (Yes/No) | Medium | Add Pick List (DORA - Binary) on Vendor |
| 2 | B_05.01 | Date of integration into register | Medium | Add Date - Calendar on Vendor |
| 3 | B_05.01 | Date of deletion from register | Medium | Add Date - Calendar on Vendor (default 9999-12-31) |
| 4 | B_05.01 | Country of registration (as coded value) | Low | Change from Text-Short to DORA - Country ref data |
| 5 | B_99.01 | Entity-defined definitions template | Low | Create ref data type or static export |

### ⚠️ Implicit / Indirect (Data exists but not explicitly modeled)

| # | Template | Field | Issue | Recommendation |
|---|----------|-------|-------|----------------|
| 6 | B_03.01 | Signing entity distinction | PU tracks "using" not "signing" | Add signatory role or separate relationship |
| 7 | B_03.02 | Signing provider distinction | Same as above for provider side | Add signatory flag on Vendor-Agreement link |
| 8 | B_04.01 | Nature of entity per arrangement | Nature is on Legal Entity, not on the arrangement link | Export report can join; verify report design |
| 9 | B_05.02 | Arrangement reference on Fourth Party | Arrangement link is via Vendor Service, not direct | Verify export report joins correctly |

### ✅ Exceeds Requirements (PU has more than EBA requires)

The PU configuration adds these operationally valuable fields beyond EBA minimums:
- **Vendor:** HQ country, currency, annual spend, trade name
- **CIF:** Criticality assessment, RTO, RPO, impact of discontinuing, reasons for criticality, date of last assessment
- **Vendor Service:** Exit plan, reintegration possibility, alternative providers, reason for non-substitutability
- **All objects:** VALIDATOR calculated fields for data quality monitoring
- **All objects:** Section Header organization for UI grouping

## EBA Reference Data / Taxonomy Coverage

### Taxonomy Code Categories

| Category | EBA Prefix | PU Ref Data Type | Values | Status |
|----------|-----------|-----------------|--------|--------|
| Country codes | `eba_GA:XX` | DORA - Country | 236 | ✅ |
| Currency codes | `eba_CU:XXX` | DORA - Currency | 165 | ✅ |
| Entity types | `eba_CT:xxxx` | DORA - Type of Entity | 23 | ✅ |
| Licensed activities | `eba_TA:xxxx` | DORA - Licensed Activity | 100 | ✅ |
| ICT service types | `eba_TA:Sxx` | DORA - ICT Service Type | 18 | ⚠️ Missing S07 |
| Group hierarchy | `eba_RP:xxxx` | DORA - Group Hierarchy | 5 | ✅ |
| Binary (Yes/No/NA) | `eba_BT:xxxx` | DORA - Binary | 3 | ✅ |
| Type of person | `eba_CT:xxxx` | DORA - Type of Person | 2 | ✅ |
| Level of reliance | `eba_ZZ:xxxx` | DORA - Level of Reliance | 4 | ✅ |
| Data sensitivity | `eba_ZZ:xxxx` | DORA - Data Storage Sensitivity | 3 | ✅ |
| Impact of discontinuing | `eba_ZZ:xxxx` | DORA - Impact of Discontinuing | 4 | ✅ |
| Substitutability | `eba_ZZ:xxxx` | DORA - Substitutability | 4 | ✅ |
| Inability to substitute | `eba_ZZ:xxxx` | DORA - Inability to Substitute Reason | 3 | ✅ |
| Reintegration possibility | `eba_ZZ:xxxx` | DORA - Reintegration Possibility | 3 | ✅ |
| Termination reason | `eba_CO:xxxx` | DORA - Termination Reason | 5 | ⚠️ EBA has 6 |
| Contract type | `eba_CO:xxxx` | DORA - Type of Contractual Arrangement | 3 | ✅ |
| Nature of entity | `eba_ZZ:xxxx` | DORA - Nature of Entity | 2 | ✅ |
| Criticality assessment | `eba_BT:xxxx` | DORA - Criticality Assessment | 3 | ✅ |
| Exit plan existence | `eba_BT:xxxx` | DORA - Exit Plan Existence | 3 | ✅ |
| Alternative providers | `eba_BT:xxxx` | DORA - Alternative Providers | 3 | ✅ |
| Provider type | — | ❌ Not in PU | — | 🔴 See below |
| Identification code type | Pattern | Via Pick List | — | ✅ (Custom) |

### Reference Data Gaps

1. **ICT Service Type S07 missing** — The EBA taxonomy has S01-S19. PU has 18 values but skips S07 ("Data warehouse" or similar). Verify against latest EBA list of possible values.
2. **Termination Reason** — PU has 5 values; EBA specifies 6. Check if "Other reason" (`eba_CO:x8`) is missing.
3. **Provider Type** — EBA B_05.01.0100 requires classifying providers as Direct / Intragroup / Subcontractor. No DORA - Provider Type reference data exists in PU. This is needed.
4. **Nature of Entity for B_04.01** — Already covered by DORA - Nature of Entity (Branch / Non-branch).

## Submission Format Readiness

The EBA requires xBRL-CSV format: a ZIP file containing:
- `parameters.csv` (report metadata)
- `filing-indicators.csv` (which templates are populated)
- One CSV per template (e.g., `B_01.01.csv`, `B_02.01.csv`, etc.)
- `report.json` (metadata)

**PU generates Excel exports** via EXCEL_DORA_RT.XX.XX reports. These would need post-processing to convert to xBRL-CSV format. The "last mile" conversion (Excel → xBRL-CSV ZIP) is acknowledged in the DORA Roles & Responsibilities document as still under deliberation.

**Key requirement:** Export report column headers must match the EBA taxonomy data point codes exactly, and External ID shadow values must produce the correct `eba_XX:xxxx` codes.

## Validation Rules Readiness

The EBA applies 116+ validation checks in three layers:
1. **Technical** — file format, encoding, structure
2. **DPM validation** — field types, mandatory fields, foreign key integrity
3. **Business checks** — logical consistency across templates

Common failures from the 2025 dry run (235,000 errors across 1,000+ institutions):
- Foreign key violations (cross-template references don't match)
- Missing mandatory fields
- Invalid LEI format (not 20 chars or failed checksum)
- Wrong date format (must be ISO 8601: `yyyy-mm-dd`)
- `9999-12-31` sentinel missing for ongoing/active records

**PU VALIDATOR fields** partially address this — they check for missing required fields on individual objects. But they don't check **cross-template referential integrity** (e.g., every arrangement in B_02.01 must have at least one entry in B_03.01, every provider in B_05.01 must be referenced by at least one B_02.02 row).

**Recommendation:** Add cross-object validation reports that check:
- Every Agreement has at least one Legal Entity link (B_03.01 coverage)
- Every Vendor referenced by an Agreement has RT.05.01 fields populated
- Every Service Add On has both a CIF and Legal Entity linked
- Every Fourth Party has a valid arrangement reference chain

## Overall Compliance Score

| Category | Score | Notes |
|----------|-------|-------|
| **Template coverage** | 13/15 (87%) | B_99.01 not mapped; B_03.01/B_03.02 signatory distinction implicit |
| **Field coverage** | ~95% of mandatory fields | 3 missing on B_05.01, signatory fields implicit |
| **Reference data** | 19/21 categories (90%) | Missing Provider Type, ICT Service S07, 1 Termination Reason |
| **EBA code shadows** | Strong | All major ref data types have External ID shadows |
| **Export reports** | 14/15 (93%) | B_99.01 not covered |
| **Validation** | Partial | Object-level validation good; cross-template validation missing |
| **Submission format** | ❌ Excel only | Needs xBRL-CSV conversion layer |

**Bottom line:** The PU DORA configuration covers ~90-95% of the EBA Register of Information requirements. The gaps are addressable — the 5 missing fields and 3 missing reference data values are straightforward additions. The signatory distinction (B_03.01/B_03.02) is the most architecturally significant gap. The submission format gap (Excel → xBRL-CSV) is a known industry-wide challenge.

## Sources

- [EBA DORA RoI Preparation Page](https://www.eba.europa.eu/activities/direct-supervision-and-oversight/digital-operational-resilience-act/preparation-dora-application)
- [EBA RoI Reporting FAQ (March 2025)](https://www.eba.europa.eu/sites/default/files/2025-03/31bb6e60-7d10-4405-a8c5-9f04934630ac/20250328%20-%20DORA%20RoI%20reporting%20FAQ%20(updated).pdf)
- [EBA Common Issues from RoI Testing (April 2025)](https://www.eba.europa.eu/sites/default/files/2025-04/717e7e5f-14ac-45c6-b336-b0aac6a9062a/Observations%20from%20RoI%20reporting%20testing%20-%20common%20issues%20-%20April%202025%20(1).pdf)
- [ITS on Register of Information — Annex I Instructions (Springlex)](https://www.springlex.eu/en/packages/dora/its-roi-regulation/annex-1/)
- [DORA Register Guide — All 15 Tables (DORA Toolkit)](https://dora-toolkit.eu/blog/dora-register-of-information-guide)
- [DORA Register Template Reference (fromCISO)](https://roi.fromciso.com/docs/templates)
- Commission Implementing Regulation (EU) 2024/2956
