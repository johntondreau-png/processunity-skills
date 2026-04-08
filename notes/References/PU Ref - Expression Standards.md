---
tags:
  - processunity
  - reference
  - expressions
  - formulas
created: 2026-04-07
parent: "[[PU Admin Navigator]]"
---

# PU Ref - Expression Standards

> Syntax rules, patterns, and functions for ProcessUnity expressions. Used in Calculated Properties, Auto Update Rules, Validation Rules, Color Coding, and Report Calculated Columns.

## Critical Syntax Rule

**No space between function name and opening parenthesis.**

- Correct: `CASE(TRUE, ...)`
- Wrong: `CASE (TRUE, ...)`

This applies to ALL functions. A space causes a syntax error.

## Preferred Conditional Patterns

### CASE() — Multiple different logical tests

```
CASE(TRUE,
  [Score] >= 9, "Very High",
  [Score] >= 7, "High",
  [Score] >= 4, "Moderate",
  [Score] >= 2, "Low",
  "Very Low"
)
```

### CASEX() — Single value matching

```
CASEX([Data Classification],
  "Mission Critical", 5,
  "High", 4,
  "Moderate", 3,
  "Low", 2,
  "Public", 1,
  0
)
```

## Output-Type Rule

Match property type to expression output:
- `Text - Calculated` → returns text
- `Number - Calculated` → returns number
- `Date - Calculated` → returns date

## Null/Blank Handling

- `ISNULL([field])` — checks null
- `ISBLANK([field])` — checks blank/empty
- `IFNULL([field], fallback)` — returns fallback if null

Example: `IFNULL([Score], 0)` avoids null in calculations.

## Operators

| Operator | Meaning |
|----------|---------|
| `&&` / `AND` | Logical AND |
| `\|\|` / `OR` | Logical OR |
| `!` / `NOT` | Logical NOT |
| `+` | Addition / concatenation |
| `-`, `*`, `/`, `%`, `^` | Arithmetic |
| `=`, `==` | Equal |
| `!=`, `<>` | Not equal |
| `<`, `<=`, `>`, `>=` | Comparison |

## High-Leverage Functions

### Logical/Branching
- `CASE(TRUE, cond1, val1, ..., else)` — multi-branch
- `CASEX(expr, match1, val1, ..., else)` — value matching

### Text/String
`CONTAINS`, `LEFT`, `RIGHT`, `LOWER`, `UPPER`, `TRIM`, `REPLACE`, `LEN`

### Numeric
`ABS`, `ROUND`, `FLOOR`, `CEILING`, `MIN`, `MAX`

### Date/Time
`TODAY()`, `NOW()`, `TIMESTAMP()`, `DATE(y,m,d)`, `YEAR`, `MONTH`, `DAYSADD`, `MONTHSADD`, `YEARSADD`, `DAYSBETWEEN`, `BUSINESSDAYSBETWEEN`, `FIRSTDAYOFMONTH`, `LASTDAYOFMONTH`, `FIRSTDAYOFYEAR`, `LASTDAYOFYEAR`

### Pick List
`ISSELECTED(field, value)` — check if value is selected

## Readability Standards

1. One condition/value pair per line in CASE/CASEX
2. Always include an explicit else/fallback
3. Consistent double-quote strings
4. Prefer smaller helper properties over one massive expression
5. Reference properties by system Name in brackets: `[PropertyName]`

## Testing

For non-trivial expressions: define known test inputs, confirm expected outputs, verify null/blank inputs behave safely.
