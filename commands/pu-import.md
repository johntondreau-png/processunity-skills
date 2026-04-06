---
description: Import data into ProcessUnity via the API using an import template
---

# /pu-import

Import records into a ProcessUnity object using the Import API.

## Usage

```
/pu-import <object_type> [--template-id <id>] [--data-source <file_or_plan>]
```

## Examples

```
/pu-import reference-data
/pu-import regulations --template-id 258700 --data-source execution_plan_regulations_tree.json
/pu-import threats --data-source vendorshield_import_templates.xlsx
```

## Workflow

1. Read the `pu-import` SKILL.md for API details and known templates
2. Identify or create the import template for the target object
3. Build the row data from the specified data source (execution plan, Excel, or inline)
4. Authenticate with the PU API
5. Execute the import
6. Validate results and report summary
