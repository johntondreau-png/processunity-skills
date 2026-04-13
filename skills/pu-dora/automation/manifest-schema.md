# Regulatory Uplift Manifest Schema

Standard JSON manifest schemas for automating any regulatory compliance uplift in ProcessUnity. These schemas are framework-agnostic — they work for DORA, NIS2, CPS 230, or any custom framework.

## Overview

A complete uplift is driven by four manifests:

| Manifest | Purpose | Drives |
|----------|---------|--------|
| `{framework}-properties.json` | All custom properties to create | Property creation, formula config, filter config |
| `{framework}-reports.json` | All reports, import templates, dashboards | Report creation, column addition, chart config |
| `{framework}-buttons.json` | All buttons with WFA wiring | Button creation, gating, step wiring |
| `{framework}-validation.json` | Pre/post-flight checks | Validation scripts |

Plus a data file:
| File | Purpose |
|------|---------|
| `{framework}-reference-data.json` | Reference data records to bulk-load |

## Property Manifest Schema

```json
{
  "_meta": {
    "framework": "DORA",
    "totalProperties": 194,
    "generatedAt": "2026-04-12",
    "source": "STAR sizing doc + reference implementation metadata"
  },
  "properties": [
    {
      "object": "Legal Entity",
      "puObjectName": "Custom Object One",
      "puObjectTypeId": 237,
      "name": "(DORA_01.02.0010) - LEI of the financial entity",
      "typeId": 17,
      "typeName": "Text - Short",
      "pickListValues": null,
      "formula": null,
      "aggregateSource": null,
      "refDataFilter": null,
      "hidden": false,
      "conditionalDisplay": null,
      "section": "DORA (RT.01.02)"
    }
  ]
}
```

### Property Fields

| Field | Type | Description |
|-------|------|-------------|
| `object` | string | Logical object name (e.g., "Legal Entity", "CIF") |
| `puObjectName` | string | PU system object name (e.g., "Custom Object One") |
| `puObjectTypeId` | number | PU object type ID for navigation |
| `name` | string | Property name exactly as it will appear in PU |
| `typeId` | number | PU property type ID (see Property Type IDs table) |
| `typeName` | string | Human-readable type name |
| `pickListValues` | string/null | Newline-separated pick list values (for typeId 10, 11) |
| `formula` | string/null | Expression for calculated types (typeId 13, 1, 4) |
| `aggregateSource` | string/null | Source property for aggregates: "External Id", "Name", or null |
| `refDataFilter` | string/null | DORA type name filter (e.g., "DORA - Country") for typeId 1005 |
| `hidden` | boolean | Mark as hidden (External ID shadow properties) |
| `conditionalDisplay` | string/null | Property name to gate display on (e.g., "DORA?") |
| `section` | string/null | Section header this property belongs under |

### Property Type IDs

| ID | Type | Needs Postback? |
|----|------|-----------------|
| 3 | Section Header | No |
| 17 | Text - Short | No |
| 14 | Text - Long | No |
| 13 | Text - Calculated | No |
| 21 | Text - Aggregate | No |
| 7 | Number - Integer | No |
| 6 | Number - Decimal | No |
| 20 | Number - Aggregate | No |
| 2 | Date - Calendar | No |
| 1 | Date - Calculated | No |
| 10 | Pick List - Select One | **YES** |
| 11 | Pick List - Yes/No | No |
| 1005 | Reference Data - Select One | No |
| 1013 | Object - Select One | No |
| 1014 | Object - Select Many | No |
| 1007 | Third Party - Select One | No |

## Report Manifest Schema

```json
{
  "_meta": {
    "framework": "DORA",
    "totalReports": 39,
    "generatedAt": "2026-04-12"
  },
  "importTemplates": [
    {
      "name": "DORA IMPORT 1: LEGAL ENTITY",
      "objectTypeId": 237,
      "columns": ["External Id", "Name", "(DORA_01.02.0010) - LEI"],
      "keyColumn": "External Id",
      "inserts": true,
      "updates": true
    }
  ],
  "exportReports": [
    {
      "name": "EXCEL_DORA_RT.01.01",
      "objectTypeId": 237,
      "columns": ["Name", "(DORA_01.01.0010) - Entity maintains register?"],
      "automatedExport": true,
      "gridScrollPct": 70
    }
  ],
  "dashboardReports": [
    {
      "name": "DASH: DORA Vendors",
      "objectTypeId": 214,
      "columns": ["Name", "DORA?"],
      "chartType": "Chart - Standard",
      "chartTypeId": 1,
      "gridScrollPct": 54
    }
  ],
  "wfaReports": [
    {
      "name": "BTN: VENDOR: Create Fourth Party Record",
      "objectTypeId": 226,
      "category": "Actions",
      "wfaEnabled": true,
      "gridScrollPct": 45
    }
  ],
  "adminReports": [
    {
      "name": "ADM: Delete Typeless Reference Data",
      "objectTypeId": 209,
      "hasDeleteAction": true,
      "filter": { "column": "Type", "operator": "Is equal to", "value": "" }
    }
  ]
}
```

### Chart Type IDs

| ID | Type |
|----|------|
| 1 | Chart - Standard |
| 2 | Chart - Gauge |
| 3 | Chart - Geographical Map |
| 4 | Chart - Matrix |
| 5 | Table - List |
| 6 | Table - Summary |
| 7 | Chart - Number Box |

## Button Manifest Schema

```json
{
  "_meta": {
    "framework": "DORA",
    "totalButtons": 9,
    "generatedAt": "2026-04-12"
  },
  "buttons": [
    {
      "object": "Agreement",
      "puObjectName": "Agreement",
      "puObjectTypeId": 256,
      "name": "Update and Relate Service",
      "conditionalDisplay": "DORA?",
      "conditionalEnable": null,
      "steps": [
        {
          "type": "Export/Import",
          "reportName": "BTN: AGREEMENT: 01. Link Service to Agreement"
        }
      ]
    }
  ]
}
```

### Button Step Types

| Type | Description |
|------|-------------|
| Update Property | Set a property value |
| Create New Item | Create a child record |
| Create Relationship | Link two objects |
| Export/Import | Run a WFA report chain |
| Send to External API | Call external API |
| Get from External API | Receive from external API |
| Attach Word Template | Generate document |
| GRX Integration | GRX connector action |
| Copy Files | Copy file attachments |

## Subject Area Renames (Three Levels)

Custom Objects need renaming at **three levels** in Subject Areas (Settings > System Administration > Subject Areas):

| Level | What It Changes | Field IDs |
|-------|----------------|-----------|
| **Subject Area Name** | Nav menu, workspace tab | `tbxName` |
| **Related Item Name** | Relationship labels (singular + plural) | `tbxRelatedItemNameSingular`, `tbxRelatedItemNamePlural` |
| **Related Object Types** | Object type names in the child table | `tbxSingularName_{objectTypeId}`, `tbxPluralName_{objectTypeId}` |

Level 3 is easy to miss — click Edit on the Subject Area, scroll down to the "Related Object Types" table. Each row has its own rename fields with the objectTypeId appended (e.g., `tbxSingularName_263` for Service Add On).

**Vendor Custom Object One** (Service Add On) is renamed from the **Third Parties** subject area — it appears as a child object type in Third Parties' Related Object Types table.

## Validation Manifest Schema

```json
{
  "_meta": { "framework": "DORA" },
  "preFlight": {
    "systemSettings": ["Vendors", "Agreements", "Fourth Parties", "Custom Object One", "Custom Object Three", "Vendor Custom Object One", "Custom Object One Child Objects"],
    "subjectAreaRenames": {
      "Custom Object One": { "singular": "Legal Entity", "plural": "Legal Entities" },
      "Custom Object Three": { "singular": "CIF", "plural": "CIFs" },
      "Vendor Custom Object One": { "singular": "Service Add On", "plural": "Service Add Ons" }
    },
    "referenceDataTypes": 20,
    "referenceDataRecords": 643
  },
  "postFlight": {
    "propertyCountsByObject": {
      "Custom Object One": 30,
      "Custom Object Three": 19
    },
    "reportCounts": {
      "importTemplates": 8,
      "exportReports": 14,
      "dashboardReports": 5,
      "wfaReports": 11,
      "buttons": 9
    }
  }
}
```

## Reference Data Schema

```json
{
  "referenceDataTypes": [
    {
      "typeName": "DORA - Binary",
      "values": [
        { "name": "Yes", "externalId": "eba_BT:x28_BIN" }
      ]
    }
  ]
}
```

## Automation Flow

Given these manifests, a complete uplift runs:

1. **Pre-flight** → Validate system settings, check for conflicts
2. **Reference Data** → Add Type pick list values → Import records
3. **Properties** → For each object, create properties from manifest (simple types first, then Pick Lists)
4. **Formulas** → For each object, configure calculated/aggregate properties from manifest
5. **Ref Data Filters** → For each object, set type filters from manifest
6. **Conditional Display** → For each section header, set conditional display from manifest
7. **Reports** → Create import templates, export reports, dashboards, WFA reports from manifest
8. **Report Columns** → Add columns to export + dashboard reports from manifest
9. **Dashboard Charts** → Set chart types from manifest
10. **Buttons** → Create buttons, set gating, wire WFA steps from manifest
11. **Post-flight** → Verify all counts match expected

Each step reads from the manifest and calls the corresponding function in `helpers.js`.
