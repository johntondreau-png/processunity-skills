---
name: pu-analyze
description: Analyze a ProcessUnity instance — fingerprint, inventory, gap analysis
allowed-tools:
  - mcp__processunity__list_reports
  - mcp__processunity__list_import_templates
  - mcp__processunity__get_columns
  - mcp__processunity__get_report_columns
  - mcp__processunity__export_report
---

# /pu-analyze

Analyze a ProcessUnity instance to understand what's configured. Uses the `pu-instance-analyzer` skill.

## Usage

```
/pu-analyze [action] [options]
```

## Actions

### `fingerprint` (default)
Detect the active solution, connectors, and report/template counts.

```
/pu-analyze fingerprint
```

### `connectors`
Inventory all configured third-party data connectors with column schemas.

```
/pu-analyze connectors
```

### `reports`
Classify all reports by category (Connector, BTN, DASH, BYOAI, etc.).

```
/pu-analyze reports
```

### `templates`
Analyze all import templates — insert/update support, key columns, complexity.

```
/pu-analyze templates
```

### `gap [target]`
Compare current state against a desired configuration. Targets: `dora`, `vrm`, or a custom checklist.

```
/pu-analyze gap dora
/pu-analyze gap vrm
```

### `health`
Data quality check — field completeness, risk distribution, connector freshness.

```
/pu-analyze health
```

## Workflow

1. Load the `pu-instance-analyzer` and `pu-data-model` skills
2. Connect to the ProcessUnity MCP server (or provide metadata CSV exports)
3. Run the requested analysis procedure
4. Output a structured report (Fingerprint Report or Gap Analysis Report format)

## Examples

```
/pu-analyze                    # Full fingerprint
/pu-analyze connectors         # Which connectors are active?
/pu-analyze gap dora           # What's missing for DORA?
/pu-analyze health             # How complete is the vendor data?
```
