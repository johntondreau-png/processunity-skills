---
tags:
  - processunity
  - configuration
  - regulation-tree
  - questionnaire
created: 2026-04-10
related:
  - "[[ProcessUnity MOC]]"
  - "[[PU Data Model]]"
  - "[[PU Import]]"
  - "[[PU Config Designer]]"
---

# PU Configuration

> Define and manage the data objects that make up a TPRM instance — regulation trees, questions, threats, reference data, and SCF crosswalks. This skill is the *what goes in*, while [[PU Import]] is the *how it gets there*.

## When to Use

Consult this when you need to:
- Understand the regulation tree structure (Regulation → Category → Subcategory → Provision)
- Define or validate object field schemas before import
- Set up assessment questions with SCF crosswalk linkages
- Configure threat catalogs (MITRE ATT&CK, CWE)
- Manage reference data tables (Jurisdiction, Issuing Body, Regulation Type, etc.)
- Understand SystemID naming conventions across frameworks

## Architecture

- **VendorShield** = intelligence layer (source of truth for frameworks, crosswalks, scoring)
- **ProcessUnity** = workflow engine (assessments, vendor responses, compliance reporting)
- **SCF** (Secure Controls Framework) = crosswalk backbone connecting questions to provisions
- Data flow: VendorShield → PU Integration Service → ProcessUnity instance

## Key Objects

| Object | Tree Level | SystemID Example | Parent |
|--------|-----------|-----------------|--------|
| Regulation | 1 (root) | `CSF20` | — |
| Regulation Category | 2 | `CSF20-PR` | Regulation |
| Regulation Subcategory | 3 | `CSF20-PR.AA` | Category |
| Provision | 4 (leaf) | `CSF20-PR.AA-01` | Subcategory |
| Question | Standalone | `FpjRT` | — (linked via SCF) |
| Threat | Standalone | `ATT-TA0006` | — |

## SCF Crosswalk

Questions and Provisions are linked through shared SCF control IDs — no manual mapping needed:
- Question tagged `IAC-06` ↔ Provision tagged `IAC-06` = linked
- 106 unique SCF controls bridge 270 questions to 2,489 provisions across 12 frameworks
- Based on NIST IR 8477 Set Theory Relationship Mapping (STRM)

## Import Sequence

Objects must be created in dependency order:
1. Reference Data (dropdowns must exist first)
2. Regulations → Categories → Subcategories → Provisions (top-down tree)
3. Threats (no tree dependency, but should exist before Questions)
4. Questions (last — references provisions via SCF, threats via IDs)

## Supported Frameworks

12 frameworks, 2,489+ provisions, all SCF-mapped: CSF 2.0, NIST 800-53, ISO 27002, SOC 2, PCI DSS, HIPAA, GDPR, DORA, NY DFS 500, NIS2, CMMC, CCPA.

## Questionnaire Structure

PU organizes questions in a 3-level tree: Questionnaire → Section → Question. Sections use 2-letter codes (IA, DP, NS, etc.) and questions support scored pick lists, multi-select, and free text response types.

*See also: [[PU Import]], [[PU Data Model]], [[PU Config Designer]], [[PU DORA]]*
