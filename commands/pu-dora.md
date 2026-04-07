---
name: pu-dora
description: Implement DORA compliance in a ProcessUnity instance
---

# /pu-dora — DORA Implementation Command

Implement EU DORA (Digital Operational Resilience Act) compliance in a ProcessUnity instance.

## Usage

```
/pu-dora [action]
```

## Actions

| Action | Description |
|--------|-------------|
| `plan` | Generate a full DORA implementation plan for the target instance |
| `reference-data` | Load all DORA reference data types with EBA taxonomy codes |
| `configure [object]` | Configure DORA properties on a specific object (legal-entity, cif, vendor, vendor-service, service-add-on, agreement, fourth-party, legal-entity-contract) |
| `reports` | Build the DORA report pipeline (import, export, dashboard) |
| `validate` | Check current instance configuration against DORA requirements |
| `status` | Show progress on DORA implementation checklist |

## Examples

```
/pu-dora plan
/pu-dora reference-data
/pu-dora configure vendor
/pu-dora configure legal-entity
/pu-dora reports
/pu-dora validate
```

## How It Works

1. Loads the **pu-dora** skill for DORA-specific knowledge (RTS templates, EBA codes, object mapping)
2. Loads supporting skills: **pu-data-model**, **pu-config-designer**, **pu-admin-navigator**, **pu-report-builder**, **pu-import**
3. Executes the requested action using platform knowledge + DORA regulatory requirements

## Prerequisites

- ProcessUnity instance with VRM base solution active
- Admin access to the target instance
- Agreements and Fourth Parties enabled in system settings
- At least 2 Custom Objects available (for Legal Entity and CIF)
