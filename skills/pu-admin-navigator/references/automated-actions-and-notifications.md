# Automated Actions and Notification Rules Reference

System-executed workflow that runs without user interaction — triggered by data changes, conditions, schedules, or manual admin invocation.

## Automated Actions

**Location**: Settings > Notifications & Workflow > Automated Actions

### Event Types

| Event Type | When It Fires | Use Case |
|-----------|---------------|----------|
| **On Change to True** | When condition expression changes from false to true (evaluated on every data change) | Status transitions, threshold breaches, flag toggles |
| **On Value Change** | When a watched expression's value changes (evaluated on every data change) | Field updates, recalculations, cascading changes |
| **Nightly if True** | During nightly processing when condition is true | Recurring checks, overdue detection, scheduled updates |
| **Manual if True** | When admin clicks "Run" button, if condition is true | On-demand batch processing, manual triggers |

### Configuration
1. Select **Object Type** — which records this action applies to
2. Set **Event Type** — what triggers execution
3. Define **Condition Expression** — when the action fires
4. Add **Steps** — same 11 Workflow Step types as Buttons (Update Property, Create New Item, Create Relationship, etc.)

### Automated Actions Queue
System Setting (`ENABLE_AUTOMATED_ACTIONS_QUEUE`) that changes execution timing:
- **Enabled**: Actions execute AFTER all property values on a form are saved
- **Disabled**: Actions execute immediately after each property update

Enable this to prevent order-of-operations bugs (e.g., action fires before all form fields are saved).

### Limits
| Limit | Value |
|-------|-------|
| Max Automated Actions per Instance | 200 |
| Max Automated Actions per Object | 20 |
| System Setting | `AUTOMATED_ACTIONS_ENABLED` must be True |

### History
Viewable via "Automated Actions History" standard report. Useful for debugging failed actions.

## Nightly Job Sequence

ProcessUnity runs a nightly batch job (~2am in regional timezone: NA/EMEA/APAC). The steps execute in this order:

| Order | Job Step | Description |
|-------|---------|-------------|
| 1 | Refresh Dynamic Calcs | Recalculate properties using `TODAY()`, `NOW()`, and other date-dependent functions |
| 2 | Send Certification Requests | Process scheduled certification workflows |
| 3 | **Process Nightly Automated Actions** | Execute all "Nightly if True" automated actions |
| 4 | **Process Nightly Auto-Update Rules** | Execute all "Nightly if True" auto-update rules on properties |
| 5 | **Send Nightly Custom Notifications** | Execute all "Nightly if True" notification rules |
| 6 | Deactivate User Accounts | Process scheduled account deactivations |
| 7 | Historical Data Capture | Snapshot property values for trending (monthly/weekly) |
| 8 | Purge Audit Logs | Clean up aged audit log entries |

**Key insight**: Auto-update rules (step 4) run AFTER automated actions (step 3). This means automated actions see property values BEFORE nightly auto-updates run. Design accordingly.

## Notification Rules

**Location**: Settings > Notifications & Workflow > Notification Rules

### Event Types
Same 4 event types as Automated Actions:
- On Change to True
- On Value Change
- Nightly if True
- Manual if True (with "Run Notification Rule" button)

### Actions
Each rule can perform one or both:
- **Send Email** — delivers to recipients' email addresses
- **Create Inbox Item** — creates a task/alert in PU's internal inbox

Rule is disabled when neither action is selected.

### Configuration Tabs (4)

#### Details Tab
| Field | Purpose |
|-------|---------|
| **Event Type** | Trigger mechanism (required) |
| **Condition** | Expression defining when the event fires |
| **Send Email** | Checkbox — enable email delivery |
| **Create Inbox Item** | Checkbox — enable inbox item creation |
| **Enable Bulk Email** | Consolidates multiple records into a single email |

#### Inbox Tab
| Field | Purpose |
|-------|---------|
| **Inbox Type** | Action (requires activity) or Alert (informational) |
| **Inbox Title** | Text for organizing inbox items |
| **Inbox Message** | Text or expression |
| **Due Date** | Optional due date for Action items |
| **Auto Cleanup Condition** | Expression for when inbox item is auto-deleted |
| **Auto Cleanup Age** | 7 days, 30 days, 60 days, or Unlimited |

#### Email Tab
| Field | Purpose |
|-------|---------|
| **Subject Type** | Text or expression — e.g., `"High Severity Issue: " + [Name]` |
| **Body Type** | Text or expression — supports `CRLF()`, property references, `TOSTRING()` |

#### Bulk Email Tab
When Enable Bulk Email is checked, separate subject and body templates for consolidated email. Body is replicated per record.

#### Recipients Tab

**Recipient Types**:
| Type | Who Gets It |
|------|------------|
| **Person** | Specific named Individual with active user account |
| **Relationship** | A people property on the object (e.g., `[Owner]`, `[Analyst]`) — most common |
| **Role** | All active Individuals in a Role |
| **Team** | All active Individuals on a Team |
| **Look Thru** | People property on a RELATED object (via Related Items) |
| **This Person** | (Individual object only) The person the record represents |

**Recipient options**:
| Option | Purpose |
|--------|---------|
| **Send email as** | To, CC, or BCC (default: To) |
| **Escalation** | Notify recipient's manager or linked Individual |
| **Conditional Recipients** | Per-recipient condition to optionally exclude them |
| **Self-Notification Suppression** | Default ON — suppresses TO recipients who triggered the event (CC/BCC always receive) |

### Limits
| Limit | Value |
|-------|-------|
| Max Notification Rules per Object | 20 |
| Max Notification Rules per Instance | 200 |

### Built-in Notifications
These are locked (cannot be deleted, but can be disabled):
- User account setup / password resets
- Approval/rejection/review requests
- Send questionnaire actions
- Dialog entry notifications

## Common Automated Action Patterns

### Pattern: Overdue Detection (Nightly)
```
Event: Nightly if True
Condition: [Due Date] < TODAY() AND [Status] != "Closed"
Steps:
  1. Update Property: [Status] = "Overdue"
  2. Update Property: [Overdue Flag] = "Yes"
```

### Pattern: Status Cascade (On Change to True)
```
Event: On Change to True
Condition: [Assessment Completion Date] != ""
Steps:
  1. Update Property: [Status] = "Completed"
  2. Update Property: [Completion Timestamp] = TIMESTAMP()
  3. Create New Item: Follow-up Assessment (if recurring)
```

### Pattern: External System Sync (On Value Change)
```
Event: On Value Change
Condition: [Risk Score] (watched field)
Steps:
  1. Send to External API: Push updated risk data to ERP
```

### Pattern: Record Creation on Threshold (On Change to True)
```
Event: On Change to True
Condition: [Risk Score] > 80 AND [Escalation Issue Created?] = ""
Steps:
  1. Create New Item: Issue (from high-risk vendor data)
  2. Create Relationship: Link Issue to Vendor
  3. Update Property: [Escalation Issue Created?] = "Yes"
```

### Pattern: Notification with Escalation
```
Event: On Change to True
Condition: DAYSBETWEEN([Due Date], TODAY()) > 5 AND [Status] = "Open"
Action: Send Email + Create Inbox Item
Recipients:
  - Relationship: [Owner] (To)
  - Relationship: [Owner] with Escalation to Manager (CC)
  - Role: Risk Committee (BCC)
Subject: "OVERDUE: " + [Name] + " - " + TOSTRING(DAYSBETWEEN([Due Date], TODAY()), "#,##0") + " days past due"
```

## Automation Architecture

### How the Three Mechanisms Work Together

A typical workflow combines all three:

1. **Button** — User clicks "Approve" on a Vendor Request
   - Form collects approval notes
   - Steps: Create Vendor, Create Assessment, Create Relationship
   - Navigation: Opens new Vendor record

2. **Automated Action** — On Assessment record
   - Event: On Change to True (when [Sent Date] is populated)
   - Steps: Send to External API (notify external stakeholder)

3. **Notification Rule** — On Assessment record
   - Event: Nightly if True (when [Due Date] < TODAY() AND [Status] = "Open")
   - Action: Email owner + inbox item + escalation to manager

### Button → Report → Step Chain

The key architectural pattern:

```
Button (trigger)
  → Form (collect input)
    → Step: Create New Item
      → Custom Report (WFA-enabled, runs in context)
        → Import Template (maps report columns to target object)
          → New Record Created
      → ButtonActionLastID holds new record's ID
    → Step: Update Property (store BALI)
    → Step: Create Relationship
      → Custom Report (2 columns: source ID + target ID)
        → Import Template (relationship mapping)
  → Navigation (open created record)
```

Every step that creates or updates records needs a **paired** Custom Report + Import Template. Design reports and templates before building buttons.
