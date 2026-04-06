# Creating Custom Reports in ProcessUnity (Browser Automation Guide)

## Navigation Path

Reports → Administration → Custom Reports → +New

## Step-by-Step Workflow

### Step 1: Create the Report Shell
1. Navigate to **Reports → Administration → Custom Reports**
2. Click **+New** in the middle panel toolbar
3. Enter **Name** (keep brief — this is the internal identifier)
4. Optionally enter **Report Title** (overrides Name in the report heading when run)
5. Enter **Instructions** (shown at top of report — explain what the report shows and any actions available)
6. Enter **Tooltip** (displays on hover in the nav panel when published)
7. **Owner** defaults to you; reassign if needed
8. Select a **Category** (optional, for organization)

### Step 2: Set Level 1 (Primary Object)
1. Select **Type (Level 1)** — the primary object type
   - For vendor reports → "Third Parties" or "Vendors"
   - For issue reports → "Issues"
   - For risk reports → "Risks"
   - etc.
2. Configure Level 1 options if applicable:
   - **Display Owned Items Only** — restricts to report consumer's owned records
   - **Allow Creation of New Items** — adds +New button to report toolbar
   - **Historical Data Report** — enables access to historical property snapshots

### Step 3: Add Columns
1. Click **Add Columns**
2. Select properties to include (click to select, click again to deselect, Shift+Click for ranges)
3. **Always include "Name"** as the primary identifier
4. Click OK to add selected columns
5. Columns appear in the right panel in selection order

### Step 4: Run and Preview
1. Click **Run/Refresh** in the middle panel toolbar
2. Review the report output
3. Iterate: edit in right panel → Run in middle panel to see changes immediately

### Step 5: Add Calculated Columns (if needed)
1. Click **Add Calculated Column**
2. Choose type: Number, Date, or Text
3. Write the expression (follows the same expression standards as properties)
4. Up to 20 calculated columns per type

### Step 6: Reorder Columns
Use up/down arrows or move-after icon to sequence columns as desired.

### Step 7: Configure Column Attributes
Click each column to edit its attributes:

**Display Tab:**
- Column Name, Label, Group Label, Tooltip
- Font Color, Background Color, Cell Background Color, Header Background Color (all expression-based)
- Display Format (dates, numbers, currencies, hyperlinks)
- Width, Bold, Alignment, Borders, Font Size, Rotate Label
- Hide Column, Suppress Repeating Values

**Totals Tab:**
- Total Type: Sum, Average, Count, Min, Max, First, Last, etc.
- Total Display Format, colors, formatting

**Filters Tab:**
- **Design Time Filter** — reduces rows at query level (critical for performance with >1,000 rows)
- **Run Time Filter** — interactive filter for end users
- Run Time Filter Default and Type (Optional Post Filter vs. Required Pre-Filter)

**Drilldown Tab:**
- Drilldown Target: record Details tab or a Context Report

### Step 8: Group the Report
1. In the Groups area of the right panel, add grouping columns
2. Groups create category rows with detail rows indented beneath
3. Column subtotals display at each group level
4. Apply background color to group columns for visual differentiation
5. Recommended: no more than 3 groups

### Step 9: Filter the Report
- Add **Design Time Filters** to reduce data volume and improve performance
- Add **Run Time Filters** for interactive end-user filtering
- For high-volume reports (>1,000 rows), always use design-time filters

### Step 10: Sort Detail Rows
Configure sort order in the Sort area of the right panel. Multiple sort columns are supported.

### Step 11: Set Report Options
- Display Grand Totals (with label)
- Display Detail Rows (default expand/collapse state)
- Automatic Refresh (disable for high-volume reports)
- Enable for Workflow Actions (In Context / Other Object Types)
- Enable for Automated Export (for web services / Excel connector)

### Step 12: Add Chart (if needed for dashboards)
1. Go to the **Chart tab** in report configuration
2. Select **Chart Series** (must have a column with totals)
3. Select **Chart Type** (Bar, Column, Pie, Donut, Line, Area, Gauge, Number Box, Table)
4. Configure chart properties (legend, colors, drawing style)
5. Set **Initial Display** (report view or chart view)

### Step 13: Publish / Share
1. Click the **Access tab**
2. Set access: Only Me, Selected Roles, Selected Teams, or All Users
3. Publish to a specific task area and report group in the nav panel

## Multi-Level Reports

To report across related objects:
- Add Level 2 (and optionally Level 3, Level 4)
- Each level allows columns from that object
- Groups can span levels
- Suppress repeating values on parent-level columns to avoid redundancy

## Report Appearance Settings
- **Border Color** — lines between rows
- **Header Background Default Color** — default column header color (can be overridden per column)

## Post-Creation Verification
- [ ] Report runs without errors
- [ ] All expected columns appear
- [ ] Filters work correctly (design-time and run-time)
- [ ] Groups display properly
- [ ] Totals calculate correctly
- [ ] Chart renders (if configured)
- [ ] Drilldown works (if configured)
- [ ] Published to correct audience (if sharing)
