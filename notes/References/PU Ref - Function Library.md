---
tags:
  - processunity
  - reference
  - functions
  - expressions
  - calculated
created: 2026-04-08
parent: "[[PU Data Model]]"
---

# PU Ref - Function Library

> Complete function reference for ProcessUnity's expression language. Used everywhere: calculated properties, report columns, conditional color, validation rules, auto-update rules, notification conditions, button visibility, aggregate filters, scoring, and more.

**Syntax rule**: NO space before parenthesis. `IF(...)` not `IF (...)`.

## Logical Functions (8)

| Function | Signature | Returns |
|----------|-----------|---------|
| **IF** | `IF(logical, valTrue, valFalse)` | Conditional value |
| **CASE** | `CASE(cond1, val1, ..., condN, valN, valElse)` | First true condition's value |
| **CASEX** | `CASEX(expr, val1, res1, ..., valN, resN, resElse)` | Switch/case on expression |
| **CONTAINS** | `CONTAINS(string, substring)` | Boolean (case-sensitive) |
| **ISNULL** | `ISNULL(value)` | Boolean |
| **ISDATE** | `ISDATE(value)` | Boolean |
| **ISNUMBER** | `ISNUMBER(value)` | Boolean |
| **ISSELECTED** | `ISSELECTED(pickList, value)` | Boolean (multi-select) |

**Tip**: Use `CASE()` instead of nested `IF()` for readability. Use `LOWER()` with `CONTAINS()` for case-insensitive matching.

## Text Functions (17)

| Function | What It Does | Example |
|----------|-------------|---------|
| **LEFT/RIGHT/MID** | Substring extraction | `LEFT("ProcessUnity", 7)` → "Process" |
| **LEN** | Character count | `LEN("Hello")` → 5 |
| **FIND** | Position of substring | `FIND("Hello World", "World", 1)` → 7 |
| **REPLACE** | Replace all occurrences | `REPLACE([Name], " ", "_")` |
| **TRIM** | Strip whitespace | |
| **UPPER/LOWER** | Case conversion | |
| **TOSTRING** | Number/date → text | `TOSTRING(TODAY(), "yyyy-MM-dd")` |
| **REVERSE** | Reverse string | Useful for extracting last value in delimited list |
| **REPEAT** | Repeat N times | `REPEAT("*", 5)` → "*****" |
| **CODE** | ASCII code | `CODE("A")` → 65 |
| **CRLF** | Line break | Multi-line text in notifications/validators |
| **MAXTEXT/MINTEXT** | Alphabetic comparison | |
| **ApprovalInfoParse** | Extract approval data | Fields 1-7 (ID, Email, Name, Date, Comment, Delegate, State) |

## Number Functions (11)

| Function | What It Does | Gotcha |
|----------|-------------|--------|
| **ABS** | Absolute value | |
| **ROUND** | Round to N decimals | |
| **CEILING/FLOOR** | Round up/down | Optional significance parameter |
| **TRUNCATE** | Truncate (no round) | |
| **MAX/MIN** | Largest/smallest | |
| **TONUMBER** | Text → number | **Commas NOT supported**: `TONUMBER("1,842")` returns 0 |
| **COUNTSELECTED** | Count multi-select items | Also counts pipe-delimited values |
| **RAND** | Random number | Dynamically recalculated |

## Date Functions (27)

| Function | What It Does | Business Day? |
|----------|-------------|:---:|
| **TODAY()** | Current date (12:00am) | — |
| **TIMESTAMP()** | Current datetime (timezone-safe) | — |
| **DATE(y,m,d)** | Construct date | — |
| **TODATE(string)** | Text → date | — |
| **DAY/MONTH/YEAR** | Extract component | — |
| **DAYOFWEEK/DAYOFYEAR** | Day position | — |
| **DAYSADD** | Add/subtract days | No |
| **DAYSADDB** | Add/subtract days | **Yes** |
| **DAYSBETWEEN** | Days between | No |
| **DAYSBETWEENB** | Days between | **Yes** |
| **MONTHSADD** | Add/subtract months | — |
| **FIRSTDAYOFMONTH/B** | First day of month | Both |
| **LASTDAYOFMONTH/B** | Last day of month | Both |
| **LASTDAYOFYEAR/B** | Last day of year | Both |
| **FIRSTDAYOFYEARB** | First biz day of year | **Yes** |
| **NEXTBUSINESSDATE** | Next business day | **Yes** |
| **PREVBUSINESSDATE** | Previous business day | **Yes** |
| **MAXDATE/MINDATE** | Latest/earliest | — |
| **NEXTSCHEDULEDATE** | Next recurring date | — |

**Gotcha**: Comparing Date-Timestamp with TODAY() fails due to time component. Use: `TODAY() = TODATE(TOSTRING([timestamp], "MM/dd/yyyy"))`

## Data Formatting

**Numbers**: `#,##0` (integer), `#,##0.00` (2 decimals), `$#,##0.00` (currency), `0.0%` (percentage)

**Dates**: `yyyy-MM-dd` (ISO), `MM/dd/yyyy` (US), `MMM dd, yyyy` (display), `dddd, MMMM dd, yyyy` (full)

**Colors**: `[#ColorName]` or `[#HEXCODE]` syntax in color expressions.

## Common Expression Patterns

**Risk Score → Rating**: `CASE([Score]>=90,"Critical", [Score]>=70,"High", [Score]>=40,"Medium", "Low")`

**Status State Machine**: `CASE(!ISNULL([Completed]),"Done", !ISNULL([Sent]),"With Respondent", "Not Started")`

**VALIDATOR**: `IF([A]="","❌ A required."+CRLF(),"") + IF([B]="","❌ B required."+CRLF(),"")`

**Days Overdue**: `IF([Due]<TODAY(), TOSTRING(ABS(DAYSBETWEEN(TODAY(),[Due])),"#,##0")+" days overdue", "On track")`

**Domain from Email**: `RIGHT([Email], LEN([Email]) - FIND([Email], "@", 1))`

---

*See also: [[PU Ref - Expression Standards]] for syntax rules and pitfalls, [[PU Data Model]] for where expressions are used, [[PU Ref - Property Types]] for calculated/aggregate property configuration.*
