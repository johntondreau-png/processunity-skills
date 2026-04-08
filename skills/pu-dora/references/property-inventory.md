# DORA Property Inventory

Complete inventory of DORA properties per object, extracted from the cwiedersheim reference implementation.
Counts reconciled against the STAR sizing document (224 target).

## Count Reconciliation

| Object | DORA Props (metadata) | STAR Target | Delta | Notes |
|--------|----------------------|-------------|-------|-------|
| Vendor | 32 | 41 | -9 | Gap: likely additional workflow helper fields, Fourth Party helper aggregates |
| Vendor Service | 27 | 30 | -3 | Gap: likely additional RT.05.02 aggregates |
| Service Add On | 23 | 30 | -7 | Gap: additional RT.02.02 field variants, admin/branch fields |
| Agreement | 36 | 45 | -9 | Gap: additional RT.02.02/RT.03/RT.04 calculated export fields |
| Fourth Party | 10 | 12 | -2 | Gap: likely additional RT.05.01 mirror fields |
| Legal Entity | 30 | 30 | **0** | MATCH |
| Legal Entity Contract | 6 | 7 | -1 | Gap: 1 additional helper field |
| CIF | 19 | 18 | +1 | Exceeds target by 1 |
| Reference Data | 3 | 2 | +1 | Exceeds target by 1 |
| Questionnaire Response | 8 | 9 | -1 | Gap: 1 additional workflow field |
| **TOTAL** | **194** | **224** | **-30** | See notes below |

**Gap Analysis:** The -30 delta represents properties that STAR scoped but the cwiedersheim instance hasn't fully implemented. Many are likely export-only calculated fields that exist as report column formulas rather than stored properties. The STAR counts may also include planned properties for future regulatory updates.

## Vendor (32 DORA Properties)

### Section: DORA (05.01) — ICT Third-Party Service Provider

| Property Name | Type | Notes |
|--------------|------|-------|
| DORA? | Pick List - Select One | Master flag (Ref Data: DORA - Binary) |
| (DORA_05.01.0010) - Identification code of third-party service provider | Text - Short | Provider ID code |
| (DORA_05.01.0020) - Type of code of the third-party service provider | Pick List - Select One | LEI/National/etc |
| (DORA_05.01.0020) - Type of code of the third-party service provider - External ID | Text - Calculated | Shadow: maps to EBA code |
| (DORA_05.01.0030) - Additional identification code of the third-party | Text - Short | Secondary code |
| (DORA_05.01.0040) - Type of additional identification code | Pick List - Select One | |
| (DORA_05.01.0040) - Type of additional identification code - External ID | Text - Calculated | Shadow |
| (DORA_05.01.0050) - Legal name of the third-party service provider | Text - Calculated | Derived from [Name] |
| (DORA_05.01.0060) - Name of the ICT third-party service provider | Text - Short | Trade name |
| (DORA_05.01.0070) - Type of person | Relationship | Ref Data: DORA - Type of Person |
| (DORA_05.01.0070) - Type of person - External ID | Text - Aggregate | Shadow: Lookup type 5 |
| (DORA_05.01.0080) - Country of the ICT third-party service provider HQ | Relationship | Ref Data: DORA - Country |
| (DORA_05.01.0080) - Country - External ID | Text - Aggregate | Shadow: Lookup type 5 |
| (DORA_05.01.0090) - Currency of total annual spend | Relationship | Ref Data: DORA - Currency |
| (DORA_05.01.0090) - Currency - External ID | Text - Aggregate | Shadow: Lookup type 5 |
| (DORA_05.01.0100) - Total annual expense or estimated cost | Number - Decimal | |
| (DORA_05.01.0110) - Ultimate parent undertaking ID | Text - Short | Self-referencing vendor |
| (DORA_05.01.0110) - Ultimate parent ID - Agg | Text - Aggregate | From parent vendor record |
| (DORA_05.01.0110) - Ultimate parent undertaking - link | Relationship | Vendor self-relationship |
| (DORA_05.01.0120) - Type of code of ultimate parent | Pick List - Select One | |
| (DORA_05.01.0120) - Type of code (Agg from parent) | Text - Aggregate | From parent vendor |
| (DORA_05.01.0120) - Type of code (Agg from parent) - External ID | Text - Aggregate | Shadow |
| (DORA_05.01.0120) - Type of code - External ID | Text - Calculated | Shadow |
| VALIDATOR - DORA | Text - Calculated | Validates required RT.05.01 fields |

### Section: DORA (RT.02.02) & DORA (RT.05.02) — Fourth Party Helpers

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_02.02.0030) - Identification code of the third-party | Text - Calculated | Derived for export |
| (DORA_02.02.0040) - Type of code for third-party | Text - Calculated | Derived for export |
| (DORA_05.02.0050) - Rank | Number - Integer | Position in subcontractor chain |
| DORA (05.01) | Section Header | Section group |
| DORA (RT.02.02) & DORA (RT.05.02) | Section Header | Section group |
| Check if the Fourth Party Exists | Relationship | Ref Data: DORA - Fourth Party |
| Existing Fourth Parties Ref Data List | Relationship | Ref Data: DORA - Fourth Party |
| Legal Entities | Text - Calculated | Conditional on DORA? |

## Vendor Service (27 DORA Properties)

### Section: DORA (RT.02.02) — ICT Service Details

| Property Name | Type | Notes |
|--------------|------|-------|
| DORA? | Pick List - Select One | Master flag |
| (DORA_02.02.0060) - Type of ICT services | Relationship | Ref Data: DORA - ICT Service Type |
| (DORA_02.02.0060) - Type of ICT services - External ID | Text - Aggregate | Shadow |
| (DORA) - Third Party Name | Text - Aggregate | Reads vendor name from parent |
| (DORA_02.02.0020) - LEI of entity making use | Relationship | Object: Legal Entity |
| (DORA_05.02.0010) - Contractual arrangement reference number | Text - Aggregate | From Agreement |
| DORA (RT.02.02) | Section Header | Section group |

### Section: DORA (RT.05.02) — Subcontractor Chain

| Property Name | Type | Notes |
|--------------|------|-------|
| Check if the Fourth Party Exists | Relationship | Ref Data: DORA - Fourth Party |
| Select Fourth Party | Relationship | Conditional on DORA? |
| DORA (RT.05.02) | Section Header | Section group |

### Section: DORA (RT.07.01) — Assessment Details

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_07.01.0050) - Substitutability | Relationship | Ref Data: DORA - Substitutability |
| (DORA_07.01.0050) - Substitutability - External ID | Text - Aggregate | Shadow |
| (DORA_07.01.0060) - Reason not substitutable | Relationship | Ref Data: DORA - Inability to Substitute Reason |
| (DORA_07.01.0060) - Reason - External ID | Text - Aggregate | Shadow |
| (DORA_07.01.0070) - Date of last audit | Date - Calendar | |
| (DORA_07.01.0070) - Date of last audit - BLANK DATE | Date - Calculated | Sentinel: 9999-12-31 if empty |
| (DORA_07.01.0080) - Existence of an exit plan | Relationship | Ref Data: DORA - Exit Plan Existence |
| (DORA_07.01.0080) - Exit plan - External ID | Text - Aggregate | Shadow |
| (DORA_07.01.0090) - Possibility of reintegration | Relationship | Ref Data: DORA - Reintegration Possibility |
| (DORA_07.01.0090) - Reintegration - External ID | Text - Aggregate | Shadow |
| (DORA_07.01.0100) - Impact of discontinuing | Relationship | Ref Data: DORA - Impact of Discontinuing |
| (DORA_07.01.0100) - Impact - External ID | Text - Aggregate | Shadow |
| (DORA_07.01.0110) - Alternative ICT third-party service providers | Relationship | Ref Data: DORA - Alternative Providers |
| (DORA_07.01.0110) - Alternative providers - External ID | Text - Aggregate | Shadow |
| (DORA_07.01.0120) - Identification of alternative ICT TPP | Text - Short | Free text |
| DORA (RT.07.01) | Section Header | Section group |
| VALIDATOR - DORA | Text - Calculated | Validates required fields |

## Service Add On (23 DORA Properties)

### Section: DORA (RT.02.02) — Service Detail

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_02.02.0020) - LEI of entity using service | Relationship | Object: Legal Entity |
| (DORA_02.02.0020) - LEI Agg | Text - Aggregate | Reads LEI from linked LE |
| (DORA_02.02.0050) - Function identifier | Relationship | Object: CIF |
| (DORA_02.02.0050) - Function identifier Agg | Text - Aggregate | Reads function ID from CIF |
| (DORA_02.02.0050) - Function Name Agg | Text - Aggregate | Reads function name from CIF |
| (DORA_02.02.0060) - Type of ICT services | Text - Aggregate | From parent Vendor Service |
| (DORA_02.02.0060) - Type of ICT services - External ID | Text - Aggregate | Shadow from parent VS |
| (DORA_02.02.0120) - Country of governing law | Relationship | Ref Data: DORA - Country |
| (DORA_02.02.0120) - Country of governing law - External ID | Text - Aggregate | Shadow |
| (DORA_02.02.0130) - Country of provision | Relationship | Ref Data: DORA - Country |
| (DORA_02.02.0130) - Country of provision - External ID | Text - Aggregate | Shadow |
| (DORA_02.02.0140) - Storage of data | Relationship | Ref Data: DORA - Binary |
| (DORA_02.02.0150) - Data location at rest | Relationship | Ref Data: DORA - Data Storage Location |
| (DORA_02.02.0150) - Data location at rest - External ID | Text - Aggregate | Shadow |
| (DORA_02.02.0160) - Data processing location | Relationship | Ref Data: DORA - Data Storage Location |
| (DORA_02.02.0160) - Data processing location - External ID | Text - Aggregate | Shadow |
| (DORA_02.02.0170) - Data sensitivity | Relationship | Ref Data: DORA - Data Storage Sensitivity |
| (DORA_02.02.0180) - Level of reliance | Relationship | Ref Data: DORA - Level of Reliance |
| DORA (RT.02.02) | Section Header | Section group |
| DORA Branch fields | Section Header | Admin section |
| (DORA) Branch - LEI Agg | Text - Aggregate | Branch LEI from linked LE |
| (DORA) Branch - Country Agg | Text - Aggregate | Branch country from LE |
| VALIDATOR - DORA | Text - Calculated | Validates required fields |

## Agreement (36 DORA Properties)

### Section: DORA (RT.02.01) — Contractual Arrangement General

| Property Name | Type | Notes |
|--------------|------|-------|
| DORA? | Pick List - Select One | Master flag |
| (DORA_02.01.0010) - Contractual arrangement reference number | Text - Short | Unique contract ID |
| (DORA_02.01.0020) - Type of contractual arrangement | Relationship | Ref Data: DORA - Type of Contractual Arrangement |
| (DORA_02.01.0020) - Type - ExternalId | Text - Aggregate | Shadow |
| (DORA_02.01.0030) - Overarching reference number | Text - Short | For subsequent type |
| (DORA_02.01.0030) - Overarching reference - External ID | Text - Aggregate | Shadow |
| (DORA_02.01.0040) - Currency | Relationship | Ref Data: DORA - Currency |
| (DORA_02.01.0040) - Currency - External ID | Text - Aggregate | Shadow |
| (DORA_02.01.0050) - Annual expense or estimated cost | Number - Decimal | |
| DORA (RT.02.01) | Section Header | Section group |

### Section: DORA (RT.02.02) — ICT Service Link

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_02.02.0070) - Start date of the contractual arrangement | Date - Calendar | |
| (DORA_02.02.0080) - End date of the contractual arrangement | Date - Calendar | |
| (DORA_02.02.0080) - End date - BLANK DATE | Date - Calculated | Sentinel |
| (DORA_02.02.0090) - Reason for the termination or ending | Relationship | Ref Data: DORA - Termination Reason |
| (DORA_02.02.0090) - Termination reason - External ID | Text - Aggregate | Shadow |
| (DORA_02.02.0100) - Notice period for the financial entity | Number - Integer | Days |
| (DORA_02.02.0110) - Notice period for the ICT third-party | Number - Integer | Days |
| DORA (RT.02.02) | Section Header | Section group |
| Linked service ID | | Text - Aggregate | From linked Vendor Service |
| Linked Service Id | Text - Short | Helper for button workflow |
| DORA Linked Service(s) | Relationship | Multi-select Vendor Service link |

### Section: DORA (RT.03.02) — Intragroup Details

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_03.02.0020) - ID code of the ICT intragroup service provider | Text - Aggregate | From linked Vendor |
| (DORA_03.02.0030) - Type of code for intragroup provider | Text - Aggregate | From linked Vendor |
| (DORA_03.02.0030) - Type of code - External ID | Text - Calculated | Shadow |
| DORA (RT.03.02) | Section Header | Section group |

### Section: DORA (RT.03.03) — Intragroup Entity Link

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_03.03.0020) - LEI of entity providing ICT services | Relationship | Object: Legal Entity |
| DORA (RT.03.03) | Section Header | Section group |

### Admin/Helper Properties

| Property Name | Type | Notes |
|--------------|------|-------|
| Legal Entities ID | Text - Aggregate | For button workflow |
| Legal Entities using Agreement + Branch | | Text - Calculated | For export reports |
| Legal Entities Name (Agg) | Text - Aggregate | Display helper |
| Vendor ID | Text - Aggregate | For button workflow |
| VALIDATOR - DORA | Text - Calculated | Validates required fields |

## Fourth Party (10 DORA Properties)

### Section: DORA (RT.05.02) — Subcontractor Chain

| Property Name | Type | Notes |
|--------------|------|-------|
| DORA? | Pick List - Select One | Master flag |
| (DORA_05.02.0010) - Identification code | Text - Short | |
| (DORA_05.02.0020) - Type of identification code | Pick List - Select One | |
| (DORA_05.02.0030) - Rank of subcontractor | Number - Integer | Chain position |
| (DORA_05.02.0060) - Recipient identification code | Text - Short | |
| DORA (RT.05.02) | Section Header | Section group |

### Section: DORA (RT.05.01) — Provider Mirror Fields

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_05.01.0010) - FP Identification code | Text - Short | Mirrors Vendor RT.05.01 |
| (DORA_05.01.0020) - FP Type of code | Text - Calculated | Mirrors Vendor |
| VALIDATOR - DORA | Text - Calculated | Validates required fields |
| (DORA) Fourth Party subcontractor section | Section Header | Section group |

## Legal Entity (30 DORA Properties) — MATCHES STAR TARGET

### Section: DORA (RT.01.01) — Entity Maintaining Register

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_01.01.0010) - Entity maintains register? | Pick List | Yes/No |
| (DORA_01.01.0020) - Name of the entity | Text - Short | |
| (DORA_01.01.0050) - Competent Authority | Text - Short | |
| (DORA_01.01.0060) - Date of the reporting | Date - Calendar | |
| DORA (RT.01.01) | Section Header | Section group |

### Section: DORA (RT.01.02) — Entity Identification

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_01.02.0010) - LEI of the financial entity | Text - Short | 20-char LEI |
| (DORA_01.02.0020) - Name of the financial entity | Text - Short | |
| (DORA_01.02.0030) - Country of the entity | Relationship | Ref Data: DORA - Country |
| (DORA_01.02.0030) - Country - External ID | Text - Aggregate | Shadow |
| (DORA_01.02.0040) - Type of entity | Relationship | Ref Data: DORA - Type of Entity |
| (DORA_01.02.0040) - Type of entity - External ID | Text - Aggregate | Shadow |
| (DORA_01.02.0050) - Hierarchy within group | Relationship | Ref Data: DORA - Group Hierarchy |
| (DORA_01.02.0050) - Hierarchy - External ID | Text - Aggregate | Shadow |
| (DORA_01.02.0060) - LEI of the direct parent | Text - Short | |
| (DORA_01.02.0070) - Date of last update | Date - Calendar | |
| (DORA_01.02.0080) - Date of integration into the group | Date - Calendar | |
| (DORA_01.02.0090) - Date of deletion from the group | Date - Calendar | |
| (DORA_01.02.0100) - Currency | Relationship | Ref Data: DORA - Currency |
| (DORA_01.02.0100) - Currency - External ID | Text - Aggregate | Shadow |
| (DORA_01.02.0110) - Value of total assets | Number - Integer | |
| DORA (RT.01.02) | Section Header | Section group |

### Section: DORA (RT.01.03) — Branch Information

| Property Name | Type | Notes |
|--------------|------|-------|
| Branch? | Pick List - Yes/No | Controls section visibility |
| (DORA_01.03.0010) - Identification code of the branch | Text - Short | |
| (DORA_01.03.0020) - LEI of head office of branch | Text - Calculated | Derived |
| (DORA_01.03.0030) - Name of the branch | Text - Short | |
| (DORA_01.03.0040) - Country of the branch | Relationship | Ref Data: DORA - Country |
| (DORA_01.03.0040) - Country - External ID | Text - Aggregate | Shadow |
| (DORA_01.03.0050) - Nature of the branch | Relationship | Ref Data: DORA - Nature of Entity |
| DORA (RT.01.03) | Section Header | Section group |
| VALIDATOR - DORA | Text - Calculated | Validates required fields |

## Legal Entity Contract (6 DORA Properties)

| Property Name | Type | Notes |
|--------------|------|-------|
| (DORA_02.03.0010) - Contractual arrangement reference number | Relationship | Object: Agreement |
| (DORA_02.03.0010) - Reference number Agg | Text - Aggregate | From linked Agreement |
| (DORA_02.03.0020) - Linked contractual arrangement reference | Relationship | Object: Agreement |
| (DORA_02.03.0020) - Linked reference Agg | Text - Aggregate | From linked Agreement |
| DORA (RT.02.03) | Section Header | Section group |
| VALIDATOR - DORA | Text - Calculated | Validates required fields |

## CIF (19 DORA Properties)

### Section: DORA (RT.06.01) — Critical Important Functions

| Property Name | Type | Notes |
|--------------|------|-------|
| DORA? | Pick List - Select One | Master flag |
| (DORA_06.01.0010) - Function identifier | Text - Short | Unique CIF code |
| (DORA_06.01.0020) - Licensed activity | Relationship | Ref Data: DORA - Licensed Activity |
| (DORA_06.01.0020) - Licensed activity - External ID | Text - Aggregate | Shadow |
| (DORA_06.01.0020) - Licensed activity - Name Agg | Text - Aggregate | Display helper |
| (DORA_06.01.0030) - Function name | Text - Short | |
| (DORA_06.01.0040) - LEI of the financial entity | Relationship | Object: Legal Entity |
| (DORA_06.01.0040) - LEI Agg | Text - Aggregate | From linked LE |
| (DORA_06.01.0050) - Criticality/importance assessment | Relationship | Ref Data: DORA - Criticality Assessment |
| (DORA_06.01.0050) - Criticality - External ID | Text - Aggregate | Shadow |
| (DORA_06.01.0060) - Reasons for criticality | Text - Long | |
| (DORA_06.01.0070) - Date of last assessment | Date - Calendar | |
| (DORA_06.01.0070) - Date of last assessment - BLANK DATE | Date - Calculated | Sentinel |
| (DORA_06.01.0080) - Recovery time objective (RTO) | Number - Integer | Hours |
| (DORA_06.01.0090) - Recovery point objective (RPO) | Number - Integer | Hours |
| (DORA_06.01.0100) - Impact of discontinuing the function | Relationship | Ref Data: DORA - Impact of Discontinuing |
| (DORA_06.01.0100) - Impact - External ID | Text - Aggregate | Shadow |
| DORA (RT.06.01) | Section Header | Section group |
| VALIDATOR - DORA | Text - Calculated | Validates required fields |

## Reference Data (3 DORA Properties)

| Property Name | Type | Notes |
|--------------|------|-------|
| Fourth Party Vendor Name Agg | Text - Aggregate | Concentration risk: vendor name |
| Fourth Party Vendor Count | Number - Aggregate | Concentration risk: count |
| DORA Reference Data Helper | Text - Calculated | Conditional logic |

## Questionnaire Response (8 DORA Properties)

### Fourth Party Review Workflow

| Property Name | Type | Notes |
|--------------|------|-------|
| Created Vendor Fourth Party Id | Text - Short | Stores ID from button action |
| Fourth Party Disposition | Pick List - Select One | Action to take |
| Fourth Party Action | Section Header | Workflow section |
| Parent Vendor ID | Text - Aggregate | From parent assessment |
| Please enter the standardized name of the Fourth Party | Text - Short | Form prompt field |
| Selected Vendor Fourth Party Id | Text - Aggregate | Current selection |
| VALIDATOR - Fourth Party Review | Text - Calculated | Validates FP workflow fields |
| Question SUB identifier | Text - Calculated | Triggers FP workflow on matching questions |
