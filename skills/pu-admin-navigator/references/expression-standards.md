# ProcessUnity Expression Standards

Expressions are used in Calculated Properties, Auto Update Rules, Validation Rules, Color Coding, and Report Calculated Columns. Following these standards ensures consistency, readability, and correctness.

## Critical Syntax Rule

**No space between function name and opening parenthesis.**
- Correct: `CASE(TRUE, ...)`
- Wrong: `CASE (TRUE, ...)`

This applies to ALL functions. A space before the parenthesis will cause a syntax error.

## Preferred Conditional Patterns

### Multi-branch conditions → CASE()
Use when you have multiple different logical tests:

```
CASE(TRUE,
  [Score] >= 9, "Very High",
  [Score] >= 7, "High",
  [Score] >= 4, "Moderate",
  [Score] >= 2, "Low",
  "Very Low"
)
```

### Single value matching → CASEX()
Use when matching against a single expression's value:

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

Match the calculated property type to the expression output:
- `Text - Calculated` → expression returns text (strings)
- `Number - Calculated` → expression returns a number
- `Date - Calculated` → expression returns a date

## Null/Blank Handling

Use these to avoid unexpected results:
- `ISNULL([field])` → checks if value is null
- `ISBLANK([field])` → checks if value is blank/empty
- `IFNULL([field], fallback)` → returns fallback if null

Example: `IFNULL([Score], 0)` ensures a zero instead of null in calculations.

## Operators

| Operator | Meaning | Notes |
|----------|---------|-------|
| `&&` or `AND` | Logical AND | |
| `\|\|` or `OR` | Logical OR | |
| `!` or `NOT` | Logical NOT | |
| `+` | Addition / text concatenation | Numeric or text |
| `-` | Subtraction | Numeric only |
| `*` | Multiplication | Numeric only |
| `/` | Division | Numeric only |
| `%` | Modulo (remainder) | Numeric only |
| `^` | Exponentiation | Numeric only |
| `=` or `==` | Equal | |
| `!=` or `<>` | Not equal | |
| `<` | Less than | |
| `<=` | Less than or equal | |
| `>` | Greater than | |
| `>=` | Greater than or equal | |

## High-Leverage Functions

### Logical / Branching
- `CASE(TRUE, condition1, value1, condition2, value2, ..., else_value)`
- `CASEX(expression, match1, value1, match2, value2, ..., else_value)`

### Text / String
- `CONTAINS(text, search)` — check if text contains search string
- `LEFT(text, count)` / `RIGHT(text, count)` — extract characters
- `LOWER(text)` / `UPPER(text)` — case conversion
- `TRIM(text)` — remove leading/trailing whitespace
- `REPLACE(text, old, new)` — string replacement
- `LEN(text)` — character count

### Numeric
- `ABS(number)` — absolute value
- `ROUND(number, decimals)` — round to decimal places
- `FLOOR(number)` / `CEILING(number)` — round down/up
- `MIN(a, b)` / `MAX(a, b)` — minimum/maximum

### Date/Time
- `TODAY()` — current date
- `NOW()` — current date and time
- `TIMESTAMP()` — current timestamp (0 parameters)
- `DATE(year, month, day)` — construct a date
- `YEAR(date)` / `MONTH(date)` — extract components
- `DAYSADD(date, count)` / `MONTHSADD(date, count)` / `YEARSADD(date, count)` — date arithmetic
- `DAYSBETWEEN(date1, date2)` / `BUSINESSDAYSBETWEEN(date1, date2)` — date differences
- `FIRSTDAYOFMONTH(date)` / `LASTDAYOFMONTH(date)`
- `FIRSTDAYOFYEAR(date)` / `LASTDAYOFYEAR(date)`

### Pick List Evaluation
- `ISSELECTED(field, value)` — check if a pick list value is selected

## Expression Readability Standards

1. One condition/value pair per line in CASE/CASEX
2. Always include an explicit else/fallback value
3. Use consistent quoting for text values (double quotes)
4. Prefer smaller helper properties over one massive expression — create intermediate calculated properties
5. Reference properties by system Name in brackets: `[PropertyName]`

## Testing Guidance

For any non-trivial expression:
1. Create a small set of known test inputs
2. Confirm the output matches expected values
3. Confirm null/blank inputs behave safely (don't cause errors or unexpected results)
