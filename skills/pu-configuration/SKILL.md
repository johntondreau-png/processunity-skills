---
name: pu-configuration
description: Use this skill when configuring ProcessUnity (PU) objects for third-party risk management. Covers regulation tree setup (Regulation > Category > Subcategory > Provision), question templates, threat catalogs, reference data, import template generation, and SCF crosswalk configuration. Trigger when user mentions PU configuration, regulation imports, framework setup, questionnaire mapping, or ProcessUnity integration.
---

# ProcessUnity Configuration Skill

## Purpose
Configure ProcessUnity instances with regulation trees, assessment questions, threat catalogs, and crosswalk mappings. Generate import templates, validate field definitions, and enforce naming conventions. Data originates from VendorShield and is pushed to PU via API or import files.

## Architecture Context
- **VendorShield** = intelligence layer (source of truth for frameworks, crosswalks, ATT&CK, CWE, AI scoring)
- **ProcessUnity** = workflow engine (assessments, vendor responses, compliance reporting)
- **SCF** (Secure Controls Framework) = crosswalk backbone connecting questions to provisions across frameworks
- Data flow: VendorShield --> PU Integration Service --> ProcessUnity instance

---

## Object Definitions

### Object 1: Regulation (Tree Level 1)
The top-level node representing a complete framework, law, standard, or directive.

| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| system_id | String (unique, indexed) | Yes | Immutable upsert key. Never changes after creation. | CSF20 |
| display_id | String | Yes | Human-readable identifier shown in UI. | NIST CSF 2.0 |
| name | String | Yes | Tree node label. Format: "{Display Name} - {Full Title}" | NIST CSF 2.0 - Cybersecurity Framework |
| description | Multi-line text | No | Full description of the regulation/framework. | The NIST Cybersecurity Framework 2.0 provides... |
| type | Single-select dropdown | Yes | Values from Reference Data: Regulation Type. | Framework |
| jurisdiction | Reference data lookup | Yes | Shared jurisdiction list. Lookup to Jurisdiction reference table. | US |
| issuing_body | Reference data lookup | No | Organization that published this. Lookup to Issuing Body reference table. | NIST |
| effective_date | Date | No | When the regulation took effect or was published. | 2024-02-26 |
| version | String | No | Free text. Versioning conventions vary across frameworks. | 2.0 |
| source_url | String (URL) | No | Link to official source document. | https://nvlpubs.nist.gov/nistpubs/CSWP/NIST.CSWP.29.pdf |
| status | Single-select dropdown | Yes | Values from Reference Data: Regulation Status. | Active |
| scf_mapped | Boolean (checkbox) | No | Whether SCF STRM crosswalk data exists for this regulation. | true |
| scf_version | String | No | Which SCF version the crosswalk is based on. | 2026.1 |
| provision_count | Integer (computed) | No | Total provisions under this regulation. Can be auto-calculated. | 106 |
| last_synced_at | DateTime | No | When VendorShield last pushed/updated this record. | 2026-04-03T12:00:00Z |
| sync_source | String | No | Origin system identifier. | VendorShield |

**SystemID format:** Short uppercase prefix, 2-6 characters. Examples: CSF20, N53, DORA, SOC2, PCIDSS, HIPAA, GDPR, NYDFS, NIS2, CMMC, ISO27002, CCPA

---

### Object 2: Regulation Category (Tree Level 2)
Groupings within a regulation. Functions in CSF, Chapters in DORA, Control Families in 800-53.

| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| system_id | String (unique, indexed) | Yes | Upsert key. Format: "{RegPrefix}-{CategoryCode}" | CSF20-PR |
| display_id | String | Yes | Human-readable category identifier. | PR |
| parent_system_id | Relationship (lookup to Regulation) | Yes | Links to parent Regulation by system_id. | CSF20 |
| name | String | Yes | Tree label. Format: "{DisplayID} - {Category Name}" | PR - Protect |
| description | Multi-line text | No | Category description. | Safeguards to manage the organization's cybersecurity risks are used. |
| sort_order | Integer | No | Display sequence within parent. Siblings should have unique sort_order. | 3 |
| provision_count | Integer (computed) | No | Total provisions under this category (all subcategories). | 28 |

**SystemID format:** "{RegPrefix}-{CategoryCode}" where CategoryCode is the native framework identifier. Examples: CSF20-GV, CSF20-PR, DORA-ChII, DORA-ChV, N53-AC, N53-SC

---

### Object 3: Regulation Subcategory (Tree Level 3)
Sub-groupings. Categories in CSF, Articles in DORA, Base Controls in 800-53.

| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| system_id | String (unique, indexed) | Yes | Upsert key. Format: "{RegPrefix}-{SubcategoryCode}" | CSF20-PR.AA |
| display_id | String | Yes | Human-readable subcategory identifier. | PR.AA |
| parent_system_id | Relationship (lookup to Category) | Yes | Links to parent Category by system_id. | CSF20-PR |
| name | String | Yes | Tree label. Format: "{DisplayID} - {Subcategory Name}" | PR.AA - Identity Management, Authentication & Access Control |
| description | Multi-line text | No | Subcategory description. | Access to physical and logical assets is limited to authorized users, services, and hardware. |
| sort_order | Integer | No | Display sequence within parent. | 1 |
| provision_count | Integer (computed) | No | Provisions under this subcategory. | 6 |

**SystemID format:** "{RegPrefix}-{SubcategoryCode}". Examples: CSF20-PR.AA, CSF20-DE.CM, DORA-Art28, DORA-Art9, N53-AC-02, NYDFS-500_11

---

### Object 4: Provision (Tree Level 4)
The atomic requirement. This is where crosswalk linkages and question mappings attach.

| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| system_id | String (unique, indexed) | Yes | Upsert key. Format: "{RegPrefix}-{ProvisionCode}" | CSF20-PR.AA-01 |
| display_id | String | Yes | Human-readable provision identifier. | PR.AA-01 |
| parent_system_id | Relationship (lookup to Subcategory) | Yes | Links to parent Subcategory by system_id. | CSF20-PR.AA |
| name | String | Yes | Tree label. Format: "{DisplayID} - {Short Description}" | PR.AA-01 - Identities and credentials are managed |
| description | Multi-line text | No | Full provision description. | Identities and credentials for authorized users, services, and hardware are managed by the organization. |
| requirement_text | Multi-line text | No | The actual regulatory language verbatim. Used for compliance evidence mapping. | (Full text from the regulation) |
| sort_order | Integer | No | Display sequence within parent. | 1 |
| scf_control_ids | String (pipe-delimited) | No | SCF control IDs that map to this provision via STRM crosswalk. This is the universal join key for question-to-provision mapping. | IAC-06\|IAC-01 |
| assessment_guidance | Multi-line text | No | Guidance for assessors on how to evaluate this provision. | Review MFA configuration, check for exceptions, verify coverage of privileged accounts. |
| criticality | Single-select dropdown | No | Values from Reference Data: Criticality. How important this provision is. | High |

**SystemID format for provisions varies by framework:**
- CSF: CSF20-PR.AA-01
- 800-53: N53-AC-02(01)
- ISO: ISO27002-A8.24
- SOC 2: SOC2-CC6.1
- PCI: PCIDSS-8.4.2
- HIPAA: HIPAA-164_312_a_1
- GDPR: GDPR-Article32_1_a
- DORA: DORA-Article28_1_a
- NYDFS: NYDFS-500_11_a_1
- NIS2: NIS2-Article21_2_j

**Note on scf_control_ids:** This field is the crosswalk anchor. When a Question also has scf_control_ids, the match between Questions and Provisions happens through the shared SCF control ID. No manual question-to-provision linking is required.

---

### Object 5: Question (Separate object, not part of regulation tree)
Assessment questions from the GRX control library. Linked to provisions via SCF crosswalk.

| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| system_id | String (unique, indexed) | Yes | GRX control ID. Immutable. | FpjRT |
| display_id | String | Yes | Same as system_id for GRX questions. | FpjRT |
| question_text | Multi-line text | Yes | The assessment question prompt. | Is MFA actively used within your enterprise? |
| control_name | String | Yes | Short name for the control. | Multi-Factor Authentication |
| control_group | Reference data lookup | Yes | Domain/group. Lookup to Control Group reference table. | Identity & Access Management |
| scf_control_ids | String (pipe-delimited) | Yes | SCF controls this question maps to. This creates the bridge to Provisions. | IAC-06 |
| weight | Integer (1-3) | No | Criticality weighting. 3 = critical, 2 = important, 1 = standard. | 3 |
| ai_answerability | Single-select dropdown | No | Values from Reference Data: AI Answerability. | High |
| evidence_types | Multi-line text | No | Expected evidence artifacts for this question. | SOC 2 report, MFA configuration screenshots, IdP settings |
| threat_ids | String (pipe-delimited) | No | ATT&CK tactic IDs this question mitigates. | TA0001\|TA0006 |
| response_type | Single-select dropdown | Yes | PU response type. | Pick List - Select One |
| pick_list_answers | Multi-line text | No | Newline-separated key=value pairs. For scored: value is score. For unscored: key=value are same. | Yes=10\nNo=0\nN/A=N/A |
| max_score | Integer | No | Maximum score for this question. Standard scored = 10. | 10 |
| issue_default_name | Multi-line text | No | Auto-created issue text when vendor fails the control. | No application and services security plan |
| question_sub_text | Multi-line text | No | Instructions/context shown to respondent below the question. | (blank for most) |
| tooltip | Multi-line text | No | Evidence examples organized by type (Administrative, Logical, Technical). | Administrative: SOC 2 report... |
| exchange_mitigating_strategy | Multi-line text | No | Remediation guidance text for when vendor fails. | Establish an application security standard... |
| parent_question_id | String | No | For sub-questions: parent question's systemId. Sub-questions use dot notation: GI.06.1 is sub of GI.06. | FpjRT |
| source | Single-select dropdown | No | Origin of the question. Values: GRX, Expanded, Custom. | GRX |

---

### Object 5a: PU Questionnaire Tree (Questionnaire > Section > Question)
The questionnaire tree is how questions are organized and delivered to vendors in PU.

#### Questionnaire (Tree Root)
| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| external_id | String | Yes | PU External Id. Used for import/API operations. | GRX225 |
| name | String | Yes | Display name. | GRX Cyber Risk Assessment |
| description | Multi-line text | No | Questionnaire description. | (blank) |
| instructions | Multi-line text | No | Instructions shown to respondent. | Please answer all questions... |
| status | Dropdown | Yes | Draft, In Use, Retired. Lifecycle: Draft -> Activate -> In Use -> Retire. | In Use |
| total_scored_questions | Integer (computed) | Auto | Auto-calculated from child questions. | 247 |
| total_questions | Integer (computed) | Auto | Auto-calculated. | 253 |
| enable_delegation | Boolean | No | Allow questionnaire delegation to other respondents. | Yes |
| enable_evidence_evaluator | Boolean | No | Enable AI evidence evaluation. | Yes |
| enable_autofill | Boolean | No | Enable AI autofill from uploaded documents. | Yes |

#### Questionnaire Section (Tree Level 2)
| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| external_id | String | Yes | Convention: {questionnaire_ext_id}.{section_code}. | GRX.IA |
| name | String | Yes | Section display name. 2-letter code prefix + full name. | IA. Identity & Access Management |
| instructions | Multi-line text | No | Section-level instructions. | (blank) |
| parent_external_id | String (auto) | Auto | Links to parent questionnaire external_id. | GRX225 |

#### Questionnaire Question (Tree Level 3)
| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| external_id | String | Yes | Convention: {section_ext_id}.{question_number}. | GRX.IA.01 |
| question_serial_no | String | Yes | Short unique key. For GRX: same as external_id. For cyber: random 5-char. | GRX.IA.01 |
| framework_control_number | String | No | Usually matches question_serial_no. | GRX.IA.01 |
| question_level | Integer | Yes | Always 1 (sub-questions distinguished by external_id dot notation only). | 1 |
| question | Multi-line text | Yes | Full question text with section prefix. | IA.01 - Is MFA actively used within your enterprise? |
| issue_default_name | String | No | Auto-created issue when vendor fails. | No MFA policy in place |
| response_type | Dropdown | Yes | Pick List - Select One, Pick List - Select Many, Text - Short, Text - Long. | Pick List - Select One |
| pick_list_answers | Multi-line text | Conditional | Required for Pick List types. Newline-separated key=value. | Yes=10\nNo=0\nN/A=N/A |
| maximum_score | Integer | Conditional | Required for scored questions. Standard = 10. | 10 |
| response_required | Boolean | No | Whether response is mandatory. Default: No. | No |
| question_sub_text | Multi-line text | No | Respondent instructions. | (blank) |
| tooltip | Multi-line text | No | Evidence examples. | Administrative: SOC 2 report... |
| exchange_mitigating_strategy | Multi-line text | No | Remediation guidance. | Establish MFA policy... |

#### PU Response Types
| Type | When to use | Pick List Format |
|---|---|---|
| Pick List - Select One | Binary or single-choice scored questions | Yes=10\nNo=0\nN/A=N/A |
| Pick List - Select Many | Multi-select questions (e.g., AI types) | Option1=Option1\nOption2=Option2 |
| Text - Short | Brief free-text answers (1-2 sentences) | N/A |
| Text - Long | Detailed narrative responses | N/A |

#### PU Section Codes (2-letter, from live TPQ v1.0)
GI=General Information, AS=Application Security, DP=Data Protection & Privacy, ED=Endpoint & Device Security, HR=Human Resource Security, IA=Identity & Access Management, IB=Incident Response & Business Continuity, NS=Network Security, PE=Physical & Environmental Security, TM=Threat Management, VM=Vulnerability Management, AI=Artificial Intelligence Technology, EN=Environmental Social Governance, AB=Anti-Bribery and Corruption, GP=Geopolitical

---

### Object 6: Threat (Separate object)
ATT&CK tactics and optionally CWE weaknesses, linked to questions.

| Field Name | Field Type | Required | Description | Example |
|---|---|---|---|---|
| system_id | String (unique, indexed) | Yes | Unique threat identifier. | ATT-TA0006 |
| display_id | String | Yes | Framework-native ID. | TA0006 |
| name | String | Yes | Threat name. | Credential Access |
| catalog | Single-select dropdown | Yes | Values: MITRE_ATTACK, CWE. | MITRE_ATTACK |
| category | String | No | Grouping within catalog. For ATT&CK: "Tactic". For CWE: "Injection", "Memory", "Access". | Tactic |
| description | Multi-line text | No | Full description. | Adversary attempts to steal account credentials such as passwords and tokens. |
| severity | Single-select dropdown | No | Values from Reference Data: Criticality. | High |
| mitre_url | String (URL) | No | Link to MITRE page. | https://attack.mitre.org/tactics/TA0006/ |
| mitigating_control_groups | String (pipe-delimited) | No | Which control groups defend against this threat. | Identity & Access Management\|Human Resource Security\|Data Protection & Privacy |
| cwe_rank | Integer | No | CWE Top 25 ranking (only for CWE catalog entries). | 14 |

---

## Reference Data Tables

Reference data provides shared value lists for dropdown and lookup fields. These must be created before importing objects that reference them.

### Jurisdiction
US, US-NY, US-CA, US-MA, EU, UK, International, APAC, Canada, Australia, Brazil, India, Singapore, UAE, South Africa, Japan, South Korea

### Issuing Body
NIST, AICPA, ISO/IEC, PCI SSC, HHS/OCR, European Parliament, European Commission, European Council, NYDFS, FFIEC, OCC, FRB, FDIC, CISA, MITRE, ENISA, ICO

### Regulation Type
Law, Regulation, Framework, Standard, Directive, Guideline

### Regulation Status
Active, Draft, Superseded, Pending, Under Review

### Criticality (shared across objects)
Critical, High, Medium, Low, Informational

### AI Answerability
High - Auto-answer from evidence vault (binary/factual questions)
Medium - AI drafts response, SME reviews (narrative questions)
Low - Requires human judgment (complex/investigative questions)

### Control Group
Identity & Access Management, Data Protection & Privacy, Network Security, Endpoint & Device Security, Vulnerability Management, Application Security, Incident Response & BCP, Threat Management, Human Resource Security, Artificial Intelligence, Physical & Environmental, ESG & Sustainability, Financial Viability, Geopolitical & Concentration, Nth-Party & Supply Chain, Regulatory & Legal

### Response Type (PU native values)
Pick List - Select One, Pick List - Select Many, Text - Short, Text - Long

### Question Source
GRX (from CyberGRX 225-control library), Expanded (45 new domain controls), Custom (customer-specific)

### Threat Catalog
MITRE_ATTACK, CWE

---

## Import Sequence

Objects must be created in this order due to parent-child dependencies:

```
Step 1: Reference Data
  Create all reference data tables (Jurisdiction, Issuing Body, Regulation Type, etc.)
  These must exist before any object import.

Step 2: Regulations (Level 1)
  No parent dependency. Can be imported in any order.
  Creates top-level framework nodes.

Step 3: Categories (Level 2)
  Depends on: Regulations exist (parent_system_id references Regulation)
  Import after all target Regulations are created.

Step 4: Subcategories (Level 3)
  Depends on: Categories exist (parent_system_id references Category)
  Import after all target Categories are created.

Step 5: Provisions (Level 4)
  Depends on: Subcategories exist (parent_system_id references Subcategory)
  Import after all target Subcategories are created.

Step 6: Threats
  No parent dependency in the tree.
  Can be imported anytime, but should exist before Questions
  if you want threat links on questions.

Step 7: Questions
  No tree parent dependency, but should be imported after:
  - Provisions exist (so scf_control_ids can be validated)
  - Threats exist (so threat_ids can be validated)
  - Reference data exists (for dropdown fields)
```

---

## Validation Rules

Before generating or executing an import, validate:

### All Objects
- system_id must be unique within its object type
- system_id must not contain spaces, quotes, or path separators
- system_id should use only: alphanumeric, hyphens, underscores, periods
- No em-dashes (--) in any text field
- All dropdown/select field values must exist in the corresponding reference data table
- parent_system_id must reference an existing record at the correct parent level
- sort_order should be unique among siblings (records with same parent_system_id)

### Regulation Tree Specific
- Every Category must have a valid parent Regulation
- Every Subcategory must have a valid parent Category
- Every Provision must have a valid parent Subcategory
- display_id should be unique within its parent context
- name format should follow the naming convention: "{DisplayID} - {Description}"

### Provision Specific
- scf_control_ids values should match known SCF control IDs (from SCF 2026.1)
- If scf_control_ids is populated, scf_mapped on the parent Regulation should be true

### Question Specific
- scf_control_ids is required (this is how questions link to provisions)
- weight must be 1, 2, or 3
- threat_ids values should match known ATT&CK tactic IDs (TA0001 through TA0043)
- control_group must be a value in the Control Group reference data

---

## Naming Conventions

### Regulation (Level 1)
Pattern: "{Short Name} - {Full Title}"
Examples:
- NIST CSF 2.0 - Cybersecurity Framework
- EU DORA - Digital Operational Resilience Act
- AICPA SOC 2 - Trust Services Criteria
- NY DFS 23 NYCRR Part 500 - Cybersecurity Requirements for Financial Services

### Category (Level 2)
Pattern: "{DisplayID} - {Category Name}"
Examples:
- GV - Govern
- PR - Protect
- Chapter II - ICT Risk Management Framework
- Chapter V - Managing ICT Third-Party Risk
- AC - Access Control
- SC - System and Communications Protection

### Subcategory (Level 3)
Pattern: "{DisplayID} - {Subcategory Name}"
Examples:
- PR.AA - Identity Management, Authentication & Access Control
- DE.CM - Continuous Monitoring
- Article 28 - General principles for third-party risk
- Article 9 - Protection and prevention
- AC-02 (base control, no description suffix for 800-53)

### Provision (Level 4)
Pattern: "{DisplayID} - {Short Description (max ~80 chars)}"
Examples:
- PR.AA-01 - Identities and credentials are managed
- DE.CM-01 - Networks are monitored for adverse events
- Article 28.1(a)
- Article 9.3(b)
- 164.312(a)(1)
- 500.11(a)(1)

### SystemID Conventions
Pattern: "{RegPrefix}-{NativeID with special chars replaced}"
- Parentheses become underscores: 164.312(a)(1) -> HIPAA-164_312_a_1
- Periods in section numbers become underscores: 500.11 -> NYDFS-500_11
- Spaces removed: Article 28 -> DORA-Art28
- Framework-native IDs preserved where possible: PR.AA-01 -> CSF20-PR.AA-01

---

## Supported Frameworks (Current)

| RegPrefix | Framework | Categories | Subcategories | Provisions | SCF Mapped |
|---|---|---|---|---|---|
| CSF20 | NIST CSF 2.0 | 6 | 22 | 106 | Yes |
| N53 | NIST SP 800-53 Rev 5 | 20 | 292 | 810 | Yes |
| ISO27002 | ISO/IEC 27002:2022 | 4 | 4 | 89 | Yes |
| SOC2 | AICPA SOC 2 TSC | 5 | 20 | 69 | Yes |
| PCIDSS | PCI DSS 4.0.1 | 7 | 12 | 351 | Yes |
| HIPAA | HIPAA Security Rule | 6 | 6 | 87 | Yes |
| GDPR | EU GDPR | 4 | 30 | 213 | Yes |
| DORA | EU DORA | 4 | 26 | 241 | Yes |
| NYDFS | NY DFS 23 NYCRR 500 | 1 | 18 | 145 | Yes |
| NIS2 | EU NIS2 Directive | 1 | 2 | 30 | Yes |
| CMMC | CMMC 2.0 | 14 | 14 | 110 | Yes |
| CCPA | CCPA/CPRA | 3 | 20 | 304 | Yes |

Total: 12 frameworks, 2,489+ provisions, all SCF-mapped via STRM 2026.1

---

## SCF Crosswalk Reference

The Secure Controls Framework (SCF) serves as the intermediary connecting assessment questions to regulation provisions. The crosswalk uses NIST IR 8477 Set Theory Relationship Mapping (STRM).

**How the crosswalk works:**
1. Each GRX assessment question is tagged with one or more SCF control IDs (e.g., IAC-06)
2. Each regulation provision is also tagged with SCF control IDs
3. When a question and provision share an SCF control ID, they are linked
4. This eliminates manual question-to-provision mapping

**SCF domains referenced by GRX questions:**
AAT (AI & Autonomous Technologies), AST (Asset Management), BCD (Business Continuity & Disaster Recovery), CFG (Configuration Management), CHG (Change Management), CLD (Cloud Security), CPL (Compliance), CRY (Cryptographic Protections), DCH (Data Classification & Handling), END (Endpoint Security), GOV (Governance), HRS (Human Resources Security), IAC (Identification & Authentication), IRO (Incident Response), MDM (Mobile Device Management), MON (Monitoring), NET (Network Security), PES (Physical & Environmental Security), PRI (Privacy), RSK (Risk Management), SAP/TDA (Secure Acquisition & Processing / Technology Development), SEA (Security Awareness & Training), THR (Threat Management), TPM (Third-Party Management)

**Current coverage:** 106 unique SCF controls serve as intermediaries for 270 GRX assessment questions mapped to 2,489 regulation provisions across 12 frameworks.

**Data source:** SCF 2026.1 Excel spreadsheet, specifically the STRM mapping columns for each target framework.

---

## Version History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2026-04-03 | Initial skill definition. 12 frameworks, 6 object types, SCF 2026.1 crosswalk. |
