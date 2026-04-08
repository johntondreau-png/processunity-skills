---
tags:
  - processunity
  - reference
  - automation
  - notifications
  - workflow
created: 2026-04-08
parent: "[[PU Admin Navigator]]"
---

# PU Ref - Automated Actions

> System-executed workflow and notification rules. See [[PU Ref - Buttons and Workflow]] for user-triggered workflow and [[PU Admin Navigator]] for execution context.

## Automated Actions

**Location**: Settings > Notifications & Workflow > Automated Actions

### Event Types

| Event | When It Fires | Use Case |
|-------|---------------|----------|
| **On Change to True** | Condition changes false→true (on every data change) | Status transitions, threshold breaches |
| **On Value Change** | Watched expression's value changes | Cascading updates, recalculations |
| **Nightly if True** | During nightly processing (~2am) | Overdue detection, scheduled updates |
| **Manual if True** | Admin clicks "Run" button | On-demand batch processing |

### Limits
- Max per Instance: **200**
- Max per Object: **20**
- System Setting: `AUTOMATED_ACTIONS_ENABLED` must be True

### Automated Actions Queue
System Setting `ENABLE_AUTOMATED_ACTIONS_QUEUE` — when enabled, actions execute AFTER all form fields are saved (prevents order-of-operations bugs).

## Nightly Job Sequence (~2am regional)

| Order | Job | Notes |
|-------|-----|-------|
| 1 | Refresh Dynamic Calcs | TODAY(), NOW() recalculation |
| 2 | Send Certification Requests | Scheduled certifications |
| 3 | **Nightly Automated Actions** | "Nightly if True" actions |
| 4 | **Nightly Auto-Update Rules** | "Nightly if True" property rules |
| 5 | **Nightly Notifications** | "Nightly if True" notification rules |
| 6 | Deactivate User Accounts | Scheduled deactivations |
| 7 | Historical Data Capture | Monthly/weekly snapshots |
| 8 | Purge Audit Logs | Aged log cleanup |

**Key**: Auto-update rules (step 4) run AFTER automated actions (step 3).

## Notification Rules

**Location**: Settings > Notifications & Workflow > Notification Rules

Same 4 event types. Actions: **Send Email** and/or **Create Inbox Item**.

### Configuration Tabs
1. **Details** — Event Type, Condition, Email/Inbox toggles, Enable Bulk Email
2. **Inbox** — Type (Action/Alert), Title, Message, Due Date, Auto Cleanup
3. **Email** — Subject (text/expression), Body (text/expression with CRLF())
4. **Recipients** — Person, Relationship, Role, Team, Look Thru, This Person

### Recipient Options
- **Send as**: To, CC, or BCC
- **Escalation**: Notify recipient's manager
- **Conditional Recipients**: Per-recipient condition to exclude
- **Self-Notification Suppression**: Default ON for TO recipients (CC/BCC always receive)

### Limits
- Max per Object: **20**
- Max per Instance: **200**

## Common Patterns

**Overdue Detection** (Nightly): `[Due Date] < TODAY() AND [Status] != "Closed"` → Update Property: Status = "Overdue"

**Status Cascade** (On Change to True): `[Completion Date] != ""` → Update: Status = "Completed", Timestamp capture

**Threshold Escalation** (On Change to True): `[Risk Score] > 80 AND [Escalation Created?] = ""` → Create Issue + Create Relationship + Set Flag

**Notification with Escalation**: Recipients = Owner (To) + Owner's Manager (CC, Escalation) + Risk Committee Role (BCC)

---

*See also: [[PU Ref - Buttons and Workflow]] for user-triggered workflow, [[PU Ref - Function Library]] for expression syntax.*
