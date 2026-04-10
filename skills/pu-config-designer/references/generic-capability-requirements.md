# Generic Capability Requirements

What the generic PU skills must support to configure **any** regulation or solution — not just DORA.
Distilled from the DORA reference implementation analysis (April 2026).

## 1. Bulk Property Creation

The DORA exercise required 194+ properties across 10 objects, using every property type in the platform. A generic "add regulation" skill must handle:

### Property Types That Must Be Supported

| Type | DORA Example | Generic Pattern |
|------|-------------|-----------------|
| **Text - Short** | `(DORA_05.01.0010) - Identification code` | Free text data entry fields |
| **Text - Long** | `(DORA_06.01.0060) - Reasons for criticality` | Narrative/freeform fields |
| **Text - Calculated** | External ID shadows, VALIDATOR fields | Derived values, validation concatenation |
| **Text - Aggregate** | External ID lookups, parent field reads | Cross-object data reads (7 aggregate sub-types) |
| **Number - Integer** | RTO, RPO, notice periods | Whole number fields |
| **Number - Decimal** | Total assets, annual cost | Currency/financial fields |
| **Date - Calendar** | Start/end dates, reporting dates | User-entered dates |
| **Date - Calculated** | Blank date sentinels | Derived dates with null handling |
| **Pick List - Select One** | Code type selectors | Simple enumeration |
| **Pick List - Yes/No** | `Branch?` flag | Boolean toggles |
| **Relationship (Reference Data)** | Country, Currency, ICT Service Type | Pick list backed by Reference Data type |
| **Relationship (Object)** | Legal Entity link from CIF | Cross-object record selection |
| **Section Header** | `DORA (RT.05.01)` | Visual grouping with conditional display |

### Property Creation Order Matters

Properties must be created in dependency order:
1. **Section Headers** first (other properties reference them for conditional display)
2. **Simple fields** (Text, Number, Date, Pick List) — no dependencies
3. **Relationship fields** — require target object + reference data types to exist
4. **Aggregate fields** — require source relationship + source property to exist
5. **Calculated fields** — require all referenced properties to exist
6. **VALIDATOR fields** — last, since they reference multiple other properties

### Metadata Per Property

Every property creation needs these attributes:
- **Name** (system identifier, no spaces in some contexts)
- **Label** (display name — what users see)
- **Description** (tooltip text)
- **Type** (from canonical type list)
- **Conditional Display** (expression gating visibility)
- **Conditional Edit** (expression gating editability)
- **Required** flag
- **Hidden** flag (for shadow/helper properties)
- **Sort Order** (position within object)
- **External ID** (for import/export mapping)
- For aggregates: item type, aggregate type (1-7), source property, filter property/value
- For calculated: expression text, auto-update expression
- For reference data: reference data type name
- For relationships: target object type, relationship name

## 2. Reference Data Bulk Loading

DORA required ~956 reference data values across 28+ types, each with an External ID storing an EBA taxonomy code.

### Generic Requirements

- **Create reference data types** — named categories (e.g., "DORA - Country")
- **Bulk load values** — Name + External ID per value, via Import API
- **External ID is critical** — stores the regulatory code that export reports need
- **Dependency chain** — ref data must be loaded BEFORE properties that reference it
- **Type naming convention** — `{Regulation} - {Description}` (e.g., "DORA - Currency", "SOX - Control Type")
- **Deduplication** — check if type/value already exists before loading

### The External ID Shadow Pattern (Generic)

Any time a Reference Data pick list property must produce a machine-readable code (not just the display name) for export:

1. User-facing property: `{Field Name}` — Reference Data relationship, user picks display name
2. Shadow property: `{Field Name} - External ID` — Text-Aggregate (Lookup Type 5), reads External ID from same relationship
3. Shadow is **Hidden** — never shown to users
4. Export reports reference the shadow, not the display property

This pattern applies to ANY regulation that uses coded taxonomies (DORA EBA codes, SOX control frameworks, NIST CSF subcategories, etc.).

## 3. Conditional Display Cascading

DORA uses a `DORA?` flag on parent objects that controls visibility of entire property sections.

### Generic Pattern: Regulation Flag + Section Gating

1. **Regulation flag** — Pick List on each participating object (e.g., `DORA?`, `SOX?`, `GDPR?`)
2. **Section Headers** — conditional display: `[Regulation Flag] = "Yes"`
3. **Child properties** — placed below section header; hidden when section is hidden
4. **Cross-object cascade** — child objects can aggregate the parent's flag to gate their own sections

### Multi-Regulation Support

An object may participate in multiple regulations simultaneously:
- `DORA?` controls DORA sections
- `SOX?` controls SOX sections
- `GDPR?` controls GDPR sections
- Each regulation's properties live under its own section headers

This means the generic skill must support:
- Multiple regulation flags on a single object
- Multiple section header groups with independent conditional display
- Properties that belong to a specific regulation section

## 4. VALIDATOR Pattern (Generic)

Calculated text fields that concatenate error messages for missing required data.

### Generic Pattern

```
IF([Field A]="", "❌ {Field A code} is required for {Regulation} compliance." + CRLF(), "") +
IF([Field B]="", "❌ {Field B code} is required for {Regulation} compliance." + CRLF(), "") +
...
```

### Requirements

- One VALIDATOR per object per regulation (e.g., `VALIDATOR - DORA`, `VALIDATOR - SOX`)
- References all required fields for that regulation on that object
- Output is empty string when all fields are populated (= valid)
- Can be used as conditional enable on buttons (button disabled when VALIDATOR has content)
- Can be shown on dashboards as data quality metric
- Expression length can exceed 500+ characters — must handle PU expression limits

## 5. Report Pipeline

DORA required 14 export reports, 8 import reports, 12 dashboard reports, 11 workflow reports, and operational navigation reports.

### Generic Report Categories

| Category | Naming Convention | Purpose | Build Order |
|----------|------------------|---------|-------------|
| **Import** | `{REG} IMPORT {N}: {OBJECT}` | Bulk data loading | 1st — needed for initial data |
| **Operational** | `{REG} - {Letter}: {Description}` | Day-to-day navigation | 2nd |
| **Export** | `EXCEL_{REG}_{Template ID}` | Regulatory submission | 3rd — needs data to validate |
| **Dashboard** | `DASH: {REG} {Subject}` | Visual monitoring | 4th |
| **Workflow** | `BTN: {OBJECT}: {Action}` | Button-driven workflows | 5th — needs all properties/reports |

### Multi-Level Report Requirements

Export reports frequently need 2-4 level joins:
- Level 1: Primary object
- Level 2: Related object via named relationship
- Level 3+: Deeper relationships (e.g., Agreement → Vendor Service → Service Add On → Legal Entity)

The generic skill must know:
- Which relationships exist between objects (from `pu-app-guide`)
- Exact relationship name strings (critical — PU uses these as join keys)
- Column selection per level (which properties from which object)
- Shadow property columns for coded exports

## 6. WFA Button Creation

DORA uses 9 buttons with Workflow Action (WFA) paired report chains.

### Generic WFA Pattern

Every workflow button requires:
1. **Data-gather WF report** — `EnableWFAContext=Yes`, role restricted to "Only Me" (System Administrator)
2. **Import target WF report** — no WFA flags, defines target object for record creation
3. **Button configuration** — custom button type, wired to the WF report chain
4. **Conditional display** — show button only when regulation flag is set
5. **Conditional enable** — enable button only when VALIDATOR passes

### Common Button Actions

| Action Type | Example | Generic Pattern |
|------------|---------|-----------------|
| **Create child record** | Create Service Add On | Button on parent, creates record on child object |
| **Link existing record** | Relate Fourth Party to Vendor | Button on source, creates relationship to target |
| **Create + link** | Create New Fourth Party | Button creates record AND establishes relationship |
| **Create from questionnaire** | Complete Fourth Party Review | Button on QR, creates record on separate object |
| **Bidirectional link** | Update and Relate Service | Button creates relationship on BOTH sides |

### WFA Dual-OID Pattern

Same report name appears twice with different OIDs and configurations:
- OID A: data-gather report (WFAContext=Yes, restricted role)
- OID B: import target report (no WFA flags, no restrictions)

This is a PU platform pattern, not DORA-specific. Any regulation needing inline record creation will use it.

## 7. Instance State Analysis (Delta Detection)

Before configuring, must analyze what already exists:

### What to Check

- **Which objects are enabled** — system settings scan
- **Existing properties** — metadata export or API query per object
- **Existing reference data types** — list all types and value counts
- **Existing reports** — scan for naming convention matches
- **Existing relationships** — check if required joins exist
- **Existing buttons** — check for WFA button configurations

### Delta Computation

Compare "what exists" against "what's needed" to produce:
- Properties to **create** (don't exist yet)
- Properties to **update** (exist but wrong type/config)
- Properties to **skip** (already correct)
- Reference data to **load** (types/values that don't exist)
- Reports to **build** (don't exist yet)
- Relationships to **create**

This requires either:
- **Metadata export** (CSV from PU admin) — the cwiedersheim approach
- **API-based scan** — using Reports API to inventory existing configuration
- **Browser-based scan** — using pu-admin-navigator to read admin screens

## 8. Import Dependency Ordering

Every regulation has a dependency graph for data loading:

### Generic Pattern

```
Reference Data (no dependencies)
  → Custom Objects (may need ref data for pick lists)
    → Standard Objects (may need custom objects for relationships)
      → Child Objects (need parent records)
        → Junction/Link Records (need both sides)
```

### DORA Example

```
Ref Data → Legal Entity → CIF → Vendor → Vendor Service → Service Add On → Agreement → Fourth Party
```

The generic skill must:
- Accept a regulation's object dependency graph
- Produce the correct import order
- Handle circular dependencies (e.g., Agreement needs Vendor, but Vendor may reference Agreement)
- Support incremental loading (add new records without destroying existing)

## 9. Expression Building

DORA uses 75+ calculated/aggregate expressions. The generic skill must construct expressions that follow PU syntax rules.

### Expression Categories

| Category | Example | Pattern |
|----------|---------|---------|
| **External ID Shadow** | Aggregate Type 5, Source=External Id | Lookup from relationship |
| **Parent Field Read** | Aggregate Type 5, Source=specific property | Read field from parent/related object |
| **Blank Date Sentinel** | `IF([date]="","9999-12-31",[date])` | Null handling for dates |
| **VALIDATOR** | Chained `IF()` with `CRLF()` | Multi-field validation |
| **Derived Display** | `IF([DORA?]="Yes",[Name],"")` | Conditional output |
| **Code Mapping** | `CASE([Type],"LEI","eba_ZZ:x844","National","eba_ZZ:x845",...)` | Pick list to code translation |

### PU Expression Rules (from pu-admin-navigator)

- No space between function name and parenthesis: `IF(` not `IF (`
- String comparisons are case-sensitive
- `CRLF()` for line breaks in text output
- `CASE()` preferred over nested `IF()` for multi-value mapping
- All expressions must produce the declared output type (text, number, date)

## 10. Gaps in Current Generic Skills

Based on the DORA exercise, these capabilities are **missing or incomplete** in the current skill set:

### pu-admin-navigator

| Gap | What's Needed | Priority |
|-----|--------------|----------|
| **Bulk property creation** | Create N properties in sequence, respecting dependency order | HIGH |
| **Aggregate property config** | Set aggregate type, source property, filter property via UI | HIGH |
| **Conditional display setup** | Set conditional display expression on a property | HIGH |
| **Section header creation** | Create section header type properties | MEDIUM |
| **Button creation** | Create custom buttons with WFA wiring | HIGH |
| **WFA report pairing** | Create paired WF reports with EnableWFAContext flags | HIGH |
| **Relationship creation** | Create new relationship between objects | MEDIUM |
| **Reference data type creation** | Create new reference data types via admin UI | MEDIUM |

### pu-config-designer

| Gap | What's Needed | Priority |
|-----|--------------|----------|
| **Regulation overlay pattern** | Standard pattern for adding a regulation overlay to existing objects | HIGH |
| **Multi-regulation coexistence** | Design properties that don't conflict with other regulation overlays | MEDIUM |
| **Property dependency graph** | Automatically determine creation order from property type dependencies | HIGH |
| **Import dependency graph** | Determine import order from object relationships | HIGH |
| **Delta plan generation** | Compare desired state against existing instance, output only deltas | HIGH |

### pu-app-guide (references/report-builder.md)

| Gap | What's Needed | Priority |
|-----|--------------|----------|
| **WFA report design** | Design paired WF reports for button workflows | HIGH |
| **Export report design** | Design reports where columns output coded values (External ID shadows) | MEDIUM |
| **Report pipeline template** | Standard report set for a regulation (import, export, operational, dashboard, workflow) | MEDIUM |

### pu-import

| Gap | What's Needed | Priority |
|-----|--------------|----------|
| **Reference data bulk load** | Load N reference data values with External IDs across M types | HIGH |
| **Object dependency ordering** | Accept regulation object graph, produce import sequence | MEDIUM |
| **Import template discovery** | Discover what import templates exist for a target instance | LOW (exists partially) |

### New Skill Needed: pu-instance-analyzer

| Capability | Description |
|-----------|-------------|
| **Metadata export parser** | Parse cwiedersheim-style metadata CSV exports to build object/property inventory |
| **API-based inventory** | Use Reports API to enumerate objects, properties, ref data, reports |
| **Fingerprint detection** | Detect which solutions/regulations are already configured |
| **Gap analysis** | Compare desired configuration against actual, produce delta report |
| **Health check** | Validate that all expected components (properties, reports, relationships, ref data) exist and are correctly configured |

## Summary: The Generic Configuration Lifecycle

Any regulation or solution configuration follows this lifecycle:

```
1. ANALYZE    — What does the instance have today? (pu-instance-analyzer)
2. DESIGN     — What configuration is needed? (pu-config-designer)
3. PLAN       — What's the delta? What order? (pu-config-designer)
4. REFERENCE  — Load reference data types + values (pu-import)
5. CONFIGURE  — Create properties in dependency order (pu-admin-navigator)
6. RELATE     — Establish object relationships (pu-admin-navigator)
7. REPORT     — Build import → operational → export → dashboard → WFA reports (pu-app-guide + pu-admin-navigator)
8. BUTTON     — Wire WFA buttons to workflow reports (pu-admin-navigator)
9. VALIDATE   — Verify everything works end-to-end (pu-instance-analyzer)
10. LOAD      — Bulk import initial data (pu-import)
```

Each step is a generic capability that works for DORA, SOX, GDPR, NIS2, or any other regulation. The regulation-specific skill (like pu-dora) provides the **what** — the generic skills provide the **how**.
