# DORA Buttons and Workflow Reports

9 custom buttons power the DORA data entry workflow. Each uses ProcessUnity's Workflow Action (WFA) system — paired reports that gather context data and then create/update records on target objects.

## Button Summary

| # | Object | Button Name | Gated By | What It Does |
|---|--------|-------------|----------|-------------|
| 1 | Agreement | Update and Relate Service | DORA? + VALIDATOR | Links a Vendor Service to Agreement via "DORA Linked Service(s)" relationship (bidirectional) |
| 2 | Agreement | Relate Legal Entity to Agreement | DORA? | Links a Legal Entity to Agreement via "Legal Entities (Legal Entity)" and populates LE info |
| 3 | Legal Entity | Create Legal Entity Contract | — (system create-child) | Creates a Legal Entity Contract child record for RT.02.03 data |
| 4 | Questionnaire Response | Complete Fourth Party Review | Question ID + VALIDATOR-FP | Creates Fourth Party record + Reference Data entry from questionnaire response |
| 5 | Vendor | Create New Fourth Party | — | Creates new Fourth Party + Reference Data record; presents name entry form |
| 6 | Vendor | Relate Existing Fourth Party to Vendor | — | Links existing Fourth Party (from ref data pick list) to Vendor |
| 7 | Vendor | Relate Vendor to Legal Entity | DORA? | Links Legal Entity to Vendor via "Legal Entities (Legal Entity)" |
| 8 | Vendor Service | Create Service Add On | — | Creates Service Add On child and relates to parent Vendor Service |
| 9 | Vendor Service | Relate Fourth Party to Vendor Service | — | Links Fourth Party to Vendor Service via "Fourth Parties (Vendor Fourth Party)" |

## Detailed Button Configurations

### 1. Agreement: "Update and Relate Service"

**Conditional Display:** `DORA?` property must be set
**Conditional Enable:** `VALIDATOR - DORA` must pass (empty/no errors)

**WF Report Chain (3 steps):**

| Step | Report Name | Object | Action |
|------|-------------|--------|--------|
| 1 | BTN: AGREEMENT: 01. Link Service to Agreement | Agreement | Gather agreement-level data (WFAContext=Yes) |
| 2 | BTN: AGREEMENT: 01. Link Service to Agreement | Vendor Service (Level2=Agreement via "Agreements") | Create relationship (WFAOther=Yes, WFAOtherTypes=256) |
| 3 | BTN: AGREEMENT: SERVICE: 03. Relate Service to Agreement | Agreement (Level2=Vendor Service via "DORA Linked Service(s)") | Reciprocal relation step |

**Properties consumed:** `Linked service ID |`, `Linked Service Id`

### 2. Agreement: "Relate Legal Entity to Agreement"

**Conditional Display:** `DORA?` property must be set

**WF Report Chain (3 steps):**

| Step | Report Name | Object | Action |
|------|-------------|--------|--------|
| 1 | BTN: AGREEMENT: 01. Relate Agreement to Legal Entity | Agreement | Gather data (WFAContext=Yes) |
| 2 | BTN: AGREEMENT: LEGAL ENTITY: 01. Relate Legal Entity to Agreement | Agreement (Level2=Legal Entity via "Legal Entities (Legal Entity)") | Create relationship |
| 3 | BTN: AGREEMENT: 02. Legal Entity Information | Agreement | Update agreement with LE info (4 columns) |

**Properties consumed:** `Legal Entities ID`, `Vendor ID`, `Legal Entities using Agreement + Branch |`

### 3. Legal Entity: "Create Legal Entity Contract"

**Type:** System create-child button (not a custom WFA button)
**Target:** Legal Entity Contract (child via "Collective" relationship)
**No WF report or import template** — standard PU "create new child" pattern

### 4. Questionnaire Response: "Complete Fourth Party Review"

**Conditional Display:** `Question ID` must match specific value (shows only on fourth-party questions)
**Conditional Enable:** `VALIDATOR - Fourth Party Review` must pass

**WF Report Chain (3 steps):**

| Step | Report Name | Object | Action |
|------|-------------|--------|--------|
| 1 | BTN: QR: Create Fourth Party Record | Questionnaire Response | Gather data (6 cols, WFAContext=Yes) |
| 2 | BTN: QR: Create Fourth Party Record | Fourth Party | Create Fourth Party record |
| 3 | BTN: QR: Create Ref data | Questionnaire Response | Create Reference Data entry for fourth party name |

**Button Action:** CONDITIONAL-BALI — stores created ID in `Created Vendor Fourth Party Id`
**Properties consumed:** `Selected Vendor Fourth Party Id`, `Question ID`, `Please enter the standardized name...`, `Parent Vendor ID`, `Fourth Party Disposition`, `Created Vendor Fourth Party Id`

### 5. Vendor: "Create New Fourth Party"

**WF Report Chain (4 steps):**

| Step | Report Name | Object | Action |
|------|-------------|--------|--------|
| 1 | BTN: VENDOR: Create Fourth Party Reference Data | Vendor | Gather data (2 cols, WFAContext=Yes) |
| 2 | BTN: VENDOR: Create Fourth Party Reference Data | Reference Data | Create ref data record |
| 3 | BTN: VENDOR: Create Fourth Party Record | Vendor | Gather data (5 cols, WFAContext=Yes) |
| 4 | BTN: VENDOR: Create Fourth Party Record | Fourth Party | Create Fourth Party record |

**Button Action:** CONDITIONAL-BALI — updates `Created Vendor Fourth Party Id`
**Form prompts:** "If the Fourth Party doesn't exist, please enter the name..." + shows existing related fourth parties

### 6. Vendor: "Relate Existing Fourth Party to Vendor"

**WF Report Chain (3 steps):**

| Step | Report Name | Object | Action |
|------|-------------|--------|--------|
| 1 | BTN: VENDOR: Relate Existing Fourth Party to Vendor | Vendor (Level2=Reference Data via "Existing Fourth Parties Ref Data List") | Pick existing fourth party |
| 2 | BTN: VENDOR: Relate Existing Fourth Party to Vendor | Fourth Party | Create/update relationship |
| 3 | BTN: VENDOR: Relate Existing Ref Data Fourth Party Record to Vendor | Vendor (Level2=Fourth Party via "Fourth Parties (Vendor Fourth Party)") | Create relationship link |

### 7. Vendor: "Relate Vendor to Legal Entity"

**Conditional Display:** `DORA?` property must be set

**WF Report Chain (2 steps):**

| Step | Report Name | Object | Action |
|------|-------------|--------|--------|
| 1 | BTN: VENDOR: LEGAL ENTITY: 01. Relate Legal Entity to Vendor | Vendor | Gather data (2 cols, WFAContext=Yes) |
| 2 | BTN: VENDOR: LEGAL ENTITY: 01. Relate Legal Entity to Vendor | Vendor (Level2=Legal Entity via "Legal Entities (Legal Entity)") | Create relationship |

### 8. Vendor Service: "Create Service Add On"

**WF Report Chain (3 steps):**

| Step | Report Name | Object | Action |
|------|-------------|--------|--------|
| 1 | BTN: SERVICE: SAO: 1. Create Service Add On | Service Add On | Create new SAO record (2 cols) |
| 2 | BTN: SERVICE: SAO: 1. Create Service Add On | Service Add On | Import target |
| 3 | BTN: SERVICE: SAO: 2. Relate Service Add On to Vendor | Vendor Service (Level2=SAO via "Service Add Ons (Parent Related Service Add On)") | Relate SAO to parent |

### 9. Vendor Service: "Relate Fourth Party to Vendor Service"

**WF Report Chain (2 steps):**

| Step | Report Name | Object | Action |
|------|-------------|--------|--------|
| 1 | BTN: VENDOR SERVICE: 01. Relate Fourth Party to Vendor Service | Vendor Service | Gather data (2 cols, WFAContext=Yes, WFAOther=Yes) |
| 2 | BTN: VENDOR SERVICE: 01. Relate Fourth Party to Vendor Service | Vendor Service (Level2=Fourth Party via "Fourth Parties (Vendor Fourth Party)") | Create relationship |

## WFA Technical Pattern

All DORA buttons follow this architecture:
1. **Data-gather report** — `EnableWFAContext=Yes`, role restricted to "Only Me" (System Administrator), defines columns to collect from context record
2. **Import target report** — no WFA flags, no role restrictions, defines the target object for record creation/update
3. Reports come in **paired oids** — the same report name appears twice with different oids and configurations

The buttons do NOT use standalone import templates. The 8 "DORA IMPORT" templates are separate bulk-load utilities for initial data population.

## Workflow Reports Summary (11 total)

| Report Name | Object | Purpose |
|-------------|--------|---------|
| BTN: AGREEMENT: 01. Link Service to Agreement | Agreement / Vendor Service | Button 1 chain |
| BTN: AGREEMENT: 01. Relate Agreement to Legal Entity | Agreement | Button 2 chain |
| BTN: AGREEMENT: 02. Legal Entity Information | Agreement | Button 2 chain |
| BTN: AGREEMENT: SERVICE: 03. Relate Service to Agreement | Agreement | Button 1 chain |
| BTN: QR: Create Fourth Party Record | QR / Fourth Party | Button 4 chain |
| BTN: QR: Create Ref data | QR / Ref Data | Button 4 chain |
| BTN: SERVICE: SAO: 1. Create Service Add On | Service Add On | Button 8 chain |
| BTN: VENDOR: Create Fourth Party Record | Vendor / Fourth Party | Button 5 chain |
| BTN: VENDOR: Create Fourth Party Reference Data | Vendor / Ref Data | Button 5 chain |
| BTN: VENDOR: Relate Existing Fourth Party to Vendor | Vendor / Fourth Party | Button 6 chain |
| BTN: VENDOR SERVICE: 01. Relate Fourth Party to Vendor Service | Vendor Service / Fourth Party | Button 9 chain |
