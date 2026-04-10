# Expressions Reference

## Table of Contents
1. [Expression Basics](#expression-basics)
2. [Where Expressions Are Used](#where-expressions-are-used)
3. [Expression Dialog Features](#expression-dialog-features)
4. [Operators](#operators)
5. [Function Library](#function-library)
6. [Data Formatting](#data-formatting)
7. [Common Patterns](#common-patterns)
8. [Tips and Gotchas](#tips-and-gotchas)

---

## Expression Basics

ProcessUnity's expression engine is similar to Excel formula writing. Expressions generate computed values from properties, functions, operators, and literals.

**Critical syntax rule**: No space between function name and opening parenthesis. `LEFT([Name], 1)` ✓ — `LEFT ([Name], 1)` ✗ (will fail validation).

Property references use square brackets: `[Property Name]`. Pick list values use double quotes: `"High"`. String concatenation uses `+`.

All function parameters are comma-delimited, regardless of locale.

---

## Where Expressions Are Used

- **Calculated Properties** — computed fields on any subject area
- **Calculated Report Columns** — computed columns in custom reports
- **Conditional Colors** — font/background color on properties or report columns
- **Validation Rules** — prevent bad data entry
- **Conditional Display/Edit** — show/hide or lock/unlock properties based on conditions
- **Auto-Update Rules** — automatically set property values on events
- **Notification Rule Conditions** — control when notifications fire
- **Aggregate Filter Expressions** — filter which related items participate in aggregation
- **Pick List Filter Expressions** — filter available values in Reference Data, Individual, Vendor, Team pick lists
- **Questionnaire Scoring** — scoring expressions on questionnaire responses
- **External Components** — URL construction for iFrame content

All use the same Expression dialog and syntax.

---

## Expression Dialog Features

### Tabs
- **Properties**: available properties on the current object (with pick list value selector via icon)
- **Report Columns**: available columns (when in report context)
- **Functions**: searchable function list with categories
- **Operators**: common operators for quick insertion
- **Colors**: color palette for conditional color expressions
- **Globals**: application-level global expression variables
- **Icons**: Unicode emoji/icon library for visual indicators

### Validation
Click **Check Expression** to validate syntax and confirm return type matches the property/column type. Auto-validated on OK.

### Resize
Maximize/restore and expand/collapse buttons for large expressions.

### Comments
Use `//` for inline comments. Everything after `//` on a line is ignored. Useful for documenting complex expressions.

### Filter/Search
Filter bar at bottom of dialog to search properties, columns, or functions by keyword or type icon.

### Pick List Value Access
Click the pick list icon next to a pick list property to see available values and insert them (auto-wrapped in quotes).

---

## Operators

| Operator | Usage | Notes |
|----------|-------|-------|
| `+` | Addition / String concatenation | |
| `-` | Subtraction | Numeric only |
| `*` | Multiplication | Numeric only |
| `/` | Division | Numeric only |
| `%` | Modulo (remainder) | Numeric only |
| `^` | Exponentiation | Numeric only |
| `=` or `==` | Equal to | |
| `!=` or `<>` | Not equal to | |
| `<`, `<=`, `>`, `>=` | Comparisons | Works on numbers, dates, text |
| `&&` or `AND` | Logical AND | |
| `\|\|` or `OR` | Logical OR | |
| `!` or `NOT` | Logical NOT | |

---

## Function Library

### Logical Functions

| Function | Syntax | Returns | Description |
|----------|--------|---------|-------------|
| IF | `IF(condition, true_val, false_val)` | Any | Basic conditional |
| IFNULL | `IFNULL(val1, val2, ...)` | Any | First non-null value |
| ISNULL | `ISNULL(val)` | Boolean | True if null/empty |
| ISNUMBER | `ISNUMBER(val)` | Boolean | True if numeric |
| ISDATE | `ISDATE(val)` | Boolean | True if valid date |
| ISSELECTED | `ISSELECTED(picklist, "value")` | Boolean | True if value selected in a Select Many pick list |
| CONTAINS | `CONTAINS(string, substring)` | Boolean | True if substring found |
| ISBUSINESSDAY | `ISBUSINESSDAY(date)` | Boolean | True if date is a workday |
| CASE | `CASE(cond1, val1, cond2, val2, ..., else_val)` | Any | Multi-condition switch (evaluates in order, returns first true) |
| CASEX | `CASEX(expr, result1, val1, result2, val2, ..., else_val)` | Any | Single-expression switch (compares expr to each result) |

**CASE vs CASEX**: Use CASE when conditions are different expressions. Use CASEX when all conditions compare the same expression to different values.

Best practice: Put each condition/value pair on its own line for readability.

### Text Functions

| Function | Syntax | Returns | Description |
|----------|--------|---------|-------------|
| LEFT | `LEFT(text, n)` | Text | First n characters |
| RIGHT | `RIGHT(text, n)` | Text | Last n characters |
| MID | `MID(text, start [, length])` | Text | Substring from position |
| LEN | `LEN(text)` | Number | Character count |
| FIND | `FIND(search, text)` | Number | Position of first match (-1 if not found) |
| REPLACE | `REPLACE(text, old, new)` | Text | Replace all occurrences |
| UPPER | `UPPER(text)` | Text | Uppercase |
| LOWER | `LOWER(text)` | Text | Lowercase |
| TRIM | `TRIM(text)` | Text | Remove leading/trailing whitespace |
| REPEAT | `REPEAT(text, n)` | Text | Repeat string n times |
| REVERSE | `REVERSE(text)` | Text | Reverse characters |
| CODE | `CODE(char)` | Number | Character code |
| CHAR | `CHAR(code)` | Text | Character from code |
| CRLF | `CRLF()` | Text | Carriage return + line feed |
| TAB | `TAB()` | Text | Tab character (line break) |
| TOSTRING | `TOSTRING(value)` | Text | Convert to string |
| MAXTEXT | `MAXTEXT(val1, val2, ...)` | Text | Highest alphabetic value |
| MINTEXT | `MINTEXT(val1, val2, ...)` | Text | Lowest alphabetic value |
| APPROVALINFOPARSE | `APPROVALINFOPARSE(step, field, reviewer)` | Text | Review pattern field value |

### Number Functions

| Function | Syntax | Returns | Description |
|----------|--------|---------|-------------|
| ABS | `ABS(number)` | Number | Absolute value |
| ROUND | `ROUND(number, decimals)` | Number | Round to decimal places |
| CEILING | `CEILING(number)` | Number | Round up to integer |
| FLOOR | `FLOOR(number)` | Number | Round down to integer |
| TRUNC | `TRUNC(number, decimals)` | Number | Truncate (no rounding) |
| MIN | `MIN(n1, n2, ...)` | Number | Smallest value |
| MAX | `MAX(n1, n2, ...)` | Number | Largest value |
| RAND | `RAND(min, max)` | Number | Random integer in range |
| TONUMBER | `TONUMBER(text)` | Number | Convert text to number |
| COUNTSELECTED | `COUNTSELECTED(picklist)` | Number | Count of selected values in Select Many |
| APPROVALINFOFIND | `APPROVALINFOFIND(step, field, value)` | Number | Index of matching reviewer |

### Date Functions

| Function | Syntax | Returns | Description |
|----------|--------|---------|-------------|
| TODAY | `TODAY()` | Date | Current date (based on instance timezone) |
| NOW | `NOW()` | Date | Current date and time |
| TIMESTAMP | `TIMESTAMP()` | DateTime | Current local date+time (for Timestamp properties via auto-update rules) |
| DATE | `DATE(year, month, day)` | Date | Construct a date |
| TODATE | `TODATE(text)` | Date | Convert text string to date |
| DAY | `DAY(date)` | Number | Day of month (1-31) |
| MONTH | `MONTH(date)` | Number | Month number (1-12) |
| YEAR | `YEAR(date)` | Number | Year component |
| MONTHNAME | `MONTHNAME(month_number)` | Text | Month name from number |
| DAYSADD | `DAYSADD(date, days)` | Date | Add/subtract calendar days |
| DAYSADDB | `DAYSADDB(date, days)` | Date | Add/subtract business days |
| MONTHSADD | `MONTHSADD(date, months)` | Date | Add/subtract months |
| YEARSADD | `YEARSADD(date, years)` | Date | Add/subtract years |
| DAYSBETWEEN | `DAYSBETWEEN(date1, date2)` | Number | Calendar days between two dates |
| DAYSBETWEENB | `DAYSBETWEENB(date1, date2)` | Number | Business days between two dates |
| FIRSTDAYOFMONTH | `FIRSTDAYOFMONTH(date)` | Date | First calendar day of month |
| FIRSTDAYOFMONTHB | `FIRSTDAYOFMONTHB(date)` | Date | First business day of month |
| LASTDAYOFMONTH | `LASTDAYOFMONTH(date)` | Date | Last calendar day of month |
| LASTDAYOFMONTHB | `LASTDAYOFMONTHB(date)` | Date | Last business day of month |
| FIRSTDAYOFYEARB | `FIRSTDAYOFYEARB(date)` | Date | First business day of year |
| LASTDAYOFYEARB | `LASTDAYOFYEARB(date)` | Date | Last business day of year |
| NEXTBUSINESSDATE | `NEXTBUSINESSDATE(date)` | Date | Next business day (returns self if already business day) |
| PREVBUSINESSDATE | `PREVBUSINESSDATE(date)` | Date | Previous business day (returns self if already business day) |
| NEXTSCHEDULEDATE | `NEXTSCHEDULEDATE(date, frequency, recurrence)` | Date | Next scheduled date based on frequency/recurrence |
| MINDATE | `MINDATE(d1, d2, ...)` | Date | Earliest date |
| MAXDATE | `MAXDATE(d1, d2, ...)` | Date | Latest date |

Business day functions respect the Workdays configuration (Settings → General → Application Settings → Workdays) and defined Holidays.

---

## Data Formatting

Format strings must use English locale syntax regardless of user locale.

### Number Formats
| Format | Example Output | Notes |
|--------|---------------|-------|
| `0` | 1234 | Integer |
| `0.00` | 1234.56 | Two decimal places |
| `#,##0` | 1,234 | Thousands separator |
| `$#,##0.00` | $1,234.56 | Currency |
| `0%` | 85% | Percentage (multiplies by 100) |
| `0.00;(0.00)` | Positive;Negative format | |
| `0.00;(0.00);-` | Pos;Neg;Zero format | |

### Date Formats
| Format | Example | Notes |
|--------|---------|-------|
| `M/d/yyyy` | 1/5/2025 | Short US date |
| `MM/dd/yyyy` | 01/05/2025 | Zero-padded |
| `dd-MMM-yyyy` | 05-Jan-2025 | Day-Month abbrev-Year |
| `MMMM d, yyyy` | January 5, 2025 | Full month name |
| `dddd, MMMM d, yyyy` | Sunday, January 5, 2025 | Full day and month |
| `yyyy-MM-dd` | 2025-01-05 | ISO format |

### Select Many Display Formats
Comma separated, semicolon separated, or each value on a new line.

---

## Common Patterns

### Overdue check (nightly)
```
DAYSBETWEEN([Due Date], TODAY()) > 0
```

### Days remaining
```
DAYSBETWEEN(TODAY(), [Due Date])
```

### Concatenate first initial + last name
```
LEFT([First Name], 1) + ". " + [Last Name]
```

### Conditional status text
```
CASE(
  ISNULL([Due Date]), "No Due Date",
  DAYSBETWEEN([Due Date], TODAY()) > 0, "Overdue",
  DAYSBETWEEN(TODAY(), [Due Date]) <= 7, "Due Soon",
  "On Track"
)
```

### Conditional color (background)
```
IF([Risk Rating] = "High", [#red],
  IF([Risk Rating] = "Medium", [#orange],
    IF([Risk Rating] = "Low", [#green], [#white])))
```

### Check if value selected in Select Many
```
ISSELECTED([Categories], "Financial")
```

### Count selections in multi-select
```
COUNTSELECTED([Categories])
```

### Null-safe division
```
IF(ISNULL([Total]) OR [Total] = 0, 0, [Completed] / [Total] * 100)
```

### Global variable reference
```
IF([Score] < [Threshold], "Below Threshold", "Meets Threshold")
```
Where `[Threshold]` is a Global Expression Variable on the Application object.

---

## Tips and Gotchas

1. **Return type must match property/column type.** A date expression in a number property yields blank/zero/error.
2. **No space before `(`** — this is the #1 expression error.
3. **TODAY() and NOW()** depend on Instance Time Zone setting. Calculated properties using these recalculate nightly, not in real-time.
4. **Pick list values are case-sensitive in expressions** — `"High"` ≠ `"high"`. In imports they're case-insensitive.
5. **Pipe delimiter `|`** for multi-select values in expressions and imports.
6. **Date literals in quotes**: `"1/15/2025"` — format depends on expression context.
7. **Comments with `//`** — great for documenting complex expressions. Note: properties in comments still appear in Usage.
8. **Conditional colors cascade**: set background color first, font auto-contrasts.
9. **DAYSADDB / DAYSBETWEENB** respect Workdays and Holidays configuration.
10. **Check Expression button** validates syntax AND return type — use it before saving.
