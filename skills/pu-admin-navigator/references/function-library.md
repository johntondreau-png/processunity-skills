# ProcessUnity Function Library

Complete reference for all expression functions available in ProcessUnity. Functions are used in: Calculated Properties, Calculated Report Columns, Conditional Color, Validation Rules, Auto-Update Rules, Notification Rules, Button Conditions, Aggregate Filters, Questionnaire Scoring, and more.

**Syntax rule**: NO space between function name and opening parenthesis. `IF(...)` not `IF (...)`.

## Logical Functions

### IF(logical, valTRUE, valFALSE)
Conditional evaluation. Returns valTRUE when logical is true, valFALSE otherwise.
```
IF([Due Date] < TODAY(), "Overdue", "On Track")
IF([Risk Score] > 80, "Critical", IF([Risk Score] > 60, "High", IF([Risk Score] > 40, "Medium", "Low")))
```

### CASE(logical1, val1, logical2, val2, ..., logicalN, valN, valELSE)
Multi-branch conditional — returns the value paired with the FIRST true condition. Cleaner than nested IF.
```
CASE(
  [Risk Score] >= 90, "Critical",
  [Risk Score] >= 70, "High",
  [Risk Score] >= 40, "Medium",
  [Risk Score] >= 20, "Low",
  "Nominal"
)
```

### CASEX(expression, value1, result1, value2, result2, ..., valueN, resultN, resultELSE)
Switch/case on a single expression. Compares expression against each value, returns the paired result.
```
CASEX([Status],
  "Active", "#388E46",
  "Inactive", "#F3F3F3",
  "Pending", "#F7CF47",
  "#e5e7eb"
)
```

### CONTAINS(string, substring)
Case-sensitive substring check. Returns boolean.
```
CONTAINS([Service Type], "Cloud")
CONTAINS(LOWER([Name]), "test")  // case-insensitive pattern
```

### ISNULL(value)
Returns TRUE if value is null/empty/not set.
```
IF(ISNULL([Due Date]), "No due date", TOSTRING([Due Date], "MMM dd, yyyy"))
```

### ISDATE(value)
Returns TRUE if value is a valid date.
```
IF(ISDATE([User Input]), TODATE([User Input]), "")
```

### ISNUMBER(value)
Returns TRUE if value is numeric.
```
IF(ISNUMBER([Score]), [Score] * 100, 0)
```

### ISSELECTED(pickList, value)
Returns TRUE if value is selected in a multi-select pick list. Case-sensitive. Multi-select values are stored as pipe-delimited internally.
```
IF(ISSELECTED([Risk Categories], "Operational"), "Yes", "No")
```

### Operators
| Operator | Usage |
|----------|-------|
| `&&` or `AND` | Both conditions true |
| `\|\|` or `OR` | Either condition true |
| `!` or `NOT` | Inverts boolean |
| `=` or `==` | Equal |
| `!=` or `<>` | Not equal |
| `<`, `<=`, `>`, `>=` | Comparison (works on numbers, dates, text) |
| `+` | Addition / text concatenation |
| `-`, `*`, `/` | Arithmetic |
| `%` | Modulo (remainder) |
| `^` | Exponentiation |

**Order of operations**: Negation → Parentheses → Exponentiation → Multiply/Divide → Add/Subtract → Comparison

## Text Functions

### LEFT(string, length)
First N characters. `LEFT("ProcessUnity", 7)` → "Process"

### RIGHT(string, length)
Last N characters. `RIGHT("ProcessUnity", 5)` → "Unity"

### MID(string, start, length)
Substring from position (1-based). `MID("ProcessUnity", 8, 5)` → "Unity"

### LEN(string)
Character count. `LEN("ProcessUnity")` → 12

### FIND(string, substring, occurrence)
Position of Nth occurrence of substring (1-based). Case-sensitive.
```
FIND("Hello World", "World", 1)  // returns 7
```

### REPLACE(string, old, new)
Replace ALL occurrences. Case-sensitive.
```
REPLACE([Name], " ", "_")  // spaces to underscores
```

### TRIM(string)
Remove leading/trailing whitespace.

### UPPER(string) / LOWER(string)
Case conversion. Use `LOWER()` to make CONTAINS/ISSELECTED case-insensitive.

### TOSTRING(value, format)
Convert number or date to text with optional format string.
```
TOSTRING(4375, "#,##0.00")        // "4,375.00"
TOSTRING(TODAY(), "yyyy-MM-dd")    // "2026-04-07"
TOSTRING(TODAY(), "MMM dd, yyyy")  // "Apr 07, 2026"
TOSTRING([Score], "0.0")           // "85.3"
```

### REVERSE(string)
Reverses character order. Useful for extracting the LAST value from a delimited list:
```
// Get last item from "A|B|C" → reverse to "C|B|A" → LEFT to "C"
LEFT(REVERSE([My List]), FIND(REVERSE([My List]), "|", 1) - 1)
```

### REPEAT(string, count)
Repeat string N times. `REPEAT("*-", 4)` → "*-*-*-*-"

### CODE(char)
ASCII code for a character. `CODE("A")` → 65

### MAXTEXT(text1, text2, ..., textN) / MINTEXT(text1, text2, ..., textN)
Alphabetic comparison. Note: lowercase < uppercase in MINTEXT.

### CRLF()
Carriage return + line feed. Use for multi-line text in notifications, validators, rich text.
```
"Line 1" + CRLF() + "Line 2"
```

### ApprovalInfoParse(ApprovalInfo, step, field, reviewer)
Extract values from approval info block. Fields: 1=Reviewer ID, 2=Email, 3=Name, 4=Date, 5=Comment, 6=Is Delegate, 7=Review State.

## Number Functions

### ABS(number)
Absolute value. `ABS(-35)` → 35

### ROUND(number, digits)
Round to N decimal places. `ROUND(3.14159, 2)` → 3.14

### CEILING(number) / CEILING(number, significance)
Round up. `CEILING(4.1)` → 5. `CEILING(4.1, 0.5)` → 4.5

### FLOOR(number) / FLOOR(number, significance)
Round down. `FLOOR(4.9)` → 4. `FLOOR(4.9, 0.5)` → 4.5

### TRUNCATE(number, digits)
Truncate (no rounding). `TRUNCATE(3.789, 1)` → 3.7

### MAX(num1, num2, ..., numN) / MIN(num1, num2, ..., numN)
Largest/smallest numeric value.

### TONUMBER(string)
Convert text to number. **Gotcha**: Comma separators NOT supported — `TONUMBER("1,842.33")` returns **0**. Strip commas first: `TONUMBER(REPLACE([Value], ",", ""))`.

### COUNTSELECTED(pickList)
Count selected items in a multi-select pick list. Also counts pipe-delimited values.
```
COUNTSELECTED([Risk Categories])  // how many categories selected
COUNTSELECTED(REPLACE([Formats], ", ", "|"))  // count comma-delimited items
```

### RAND(min, max)
Random number between min and max. Dynamically recalculated.

### APPROVALINFOFIND(ApprovalInfo, step, field, value)
Finds reviewer index in approval info block.

## Date Functions

### TODAY()
Current date (12:00:00am). Dynamically recalculated. Nightly processing refreshes calculated properties using TODAY().

### TIMESTAMP()
Current datetime resolving across timezones. **Preferred over NOW()** for timestamp capture.

### NOW()
Current datetime in Instance Time Zone only. Use TIMESTAMP() instead.

### DATE(year, month, day)
Construct a date. `DATE(2026, 1, 15)` → January 15, 2026

### TODATE(string)
Convert text to date. `TODATE("01/15/2026")`

### DAY(date) / MONTH(date) / YEAR(date)
Extract date components. `MONTH(TODAY())` → 4 (April)

### DAYOFWEEK(date)
Day of week (1=Sunday through 7=Saturday).

### DAYOFYEAR(date)
Day of year (1-366).

### DAYSADD(date, days)
Add/subtract calendar days. `DAYSADD(TODAY(), 30)` → 30 days from now.

### DAYSADDB(date, days)
Add/subtract **business days** (honors workdays and Holidays configured in system).

### DAYSBETWEEN(date1, date2)
Calendar days between dates (date2 - date1). Positive if date2 > date1.

### DAYSBETWEENB(date1, date2)
**Business days** between dates.

### MONTHSADD(date, months)
Add/subtract months. `MONTHSADD(TODAY(), 6)` → 6 months from now.

### FIRSTDAYOFMONTH(date) / LASTDAYOFMONTH(date)
Calendar first/last day of month.

### FIRSTDAYOFMONTHB(date) / LASTDAYOFMONTHB(date)
First/last **business day** of month.

### FIRSTDAYOFYEARB(date) / LASTDAYOFYEAR(date) / LASTDAYOFYEARB(date)
First business day of year / last calendar day / last business day of year.

### NEXTBUSINESSDATE(date) / PREVBUSINESSDATE(date)
Next/previous business day (returns self if already a business day).

### MAXDATE(date1, ..., dateN) / MINDATE(date1, ..., dateN)
Latest/earliest date. NULL dates excluded from comparison.

### NEXTSCHEDULEDATE(startDate, frequency, interval, effectiveDate)
Next scheduled date based on recurring frequency.
```
NEXTSCHEDULEDATE([Start Date], "Monthly", 3, TODAY())  // every 3 months
```
Frequencies: "Daily", "Weekly", "Monthly", "Quarterly", "Semi-Annually", "Annually"

## Date-Timestamp Comparison Gotcha

When comparing Date-Timestamp properties with date functions, time components cause false mismatches. Strip time first:
```
// WRONG: TODAY() = [My Timestamp]  (time component makes this false)
// RIGHT:
TODAY() = TODATE(TOSTRING([My Timestamp], "MM/dd/yyyy"))
```

## Data Formatting

### Number Formats
| Char | Meaning |
|------|---------|
| `0` | Always display digit |
| `#` | Display only if significant |
| `.` | Decimal separator |
| `,` | Thousand separator |
| `%` | Percentage (multiplies by 100) |

Three sections: positive;negative;zero. Example: `#,##0.00;(#,##0.00);0.00`

Common formats:
- Integer: `#,##0`
- 2 decimals: `#,##0.00`
- Currency: `$#,##0.00`
- Percentage: `0.0%`

### Date Formats
| Format | Example |
|--------|---------|
| `d` / `dd` | 5 / 05 (day) |
| `ddd` / `dddd` | Thu / Thursday |
| `M` / `MM` | 7 / 07 (month) |
| `MMM` / `MMMM` | Jul / July |
| `yy` / `yyyy` | 26 / 2026 |
| `h` / `hh` | 5 / 05 (12-hour) |
| `H` / `HH` | 17 / 17 (24-hour) |
| `mm` | 03 (minutes) |
| `ss` | 51 (seconds) |
| `tt` | PM |

Common formats:
- ISO: `yyyy-MM-dd`
- US: `MM/dd/yyyy`
- Display: `MMM dd, yyyy`
- Full: `dddd, MMMM dd, yyyy`

## Color Expression Reference

Colors in expressions use `[#ColorName]` or `[#HEXCODE]` syntax:
```
IF([Risk Rating] = "High", [#Red], IF([Risk Rating] = "Medium", [#Orange], [#Green]))
CASEX([Status], "Active", [#388E46], "Inactive", [#F3F3F3], "Pending", [#F7CF47], [#e5e7eb])
```

## Common Expression Patterns

### Composite Name
```
[Vendor Name] + " - " + [Assessment Type] + " - " + TOSTRING([Start Date], "MMM yyyy")
```

### Days Until Due (with overdue handling)
```
IF(ISNULL([Due Date]), "",
  IF(DAYSBETWEEN(TODAY(), [Due Date]) < 0,
    TOSTRING(ABS(DAYSBETWEEN(TODAY(), [Due Date])), "#,##0") + " days overdue",
    TOSTRING(DAYSBETWEEN(TODAY(), [Due Date]), "#,##0") + " days remaining"))
```

### Risk Score to Rating
```
CASE(
  [Risk Score] >= 90, "Critical",
  [Risk Score] >= 70, "High",
  [Risk Score] >= 40, "Medium",
  [Risk Score] >= 20, "Low",
  "Nominal")
```

### VALIDATOR (multi-field compliance check)
```
IF([Field A] = "", "❌ Field A is required." + CRLF(), "") +
IF([Field B] = "", "❌ Field B is required." + CRLF(), "") +
IF([Field C] = "", "❌ Field C is required." + CRLF(), "")
```
Empty result = all valid. Non-empty result lists failures.

### Status State Machine (auto-update)
```
CASE(
  !ISNULL([Completion Date]), "5. Completed",
  !ISNULL([Submitted Date]), "4. Under Review",
  !ISNULL([Sent Date]), "3. With Respondent",
  !ISNULL([Start Date]), "2. In Progress",
  "1. Not Started")
```

### Percentage Calculation with Division Safety
```
IF([Total] = 0, 0, ROUND([Completed] / [Total] * 100, 1))
```

### Extract Domain from Email
```
IF(FIND([Email], "@", 1) > 0,
  RIGHT([Email], LEN([Email]) - FIND([Email], "@", 1)),
  "")
```

### Business Day Aging
```
IF(ISNULL([Created Date]), 0, DAYSBETWEENB([Created Date], TODAY()))
```
