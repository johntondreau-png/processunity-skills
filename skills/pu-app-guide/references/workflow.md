# Workflow Reference

## Table of Contents
1. [Workflow Overview](#workflow-overview)
2. [Built-In Workflow (Action Items)](#built-in-workflow)
3. [Custom Workflow](#custom-workflow)
4. [Notification Rules](#notification-rules)
5. [Workflow Steps and Automated Actions](#workflow-steps-and-automated-actions)
6. [Response Dialog](#response-dialog)
7. [Review Patterns](#review-patterns)
8. [Version Control](#version-control)

---

## Workflow Overview

ProcessUnity workflow = the series of activities to complete tasks within a business process. Two types:
- **Built-in workflow**: pre-configured state machines on action items (Issues, Doc Requests, Projects, Work Items, Notices, Incidents)
- **Custom workflow**: admin-configured using properties, auto-update rules, notification rules, and conditional display/edit

Components: data (object types/properties), participation (individuals/roles), communication (notifications/dialog), and status (states/conditions).

---

## Built-In Workflow

### Action Item Types

| Subject Area | Key States | Core Flow |
|-------------|------------|-----------|
| **Document Requests** | Requirement → In Review → Fulfilled | Requester creates → Provider attaches → Requester completes. Can reopen. |
| **Issues** | Open → Closed | Originator creates, assigns Owner → Dialog/collaboration → Close (with date + comment). Can reopen (→ Open). |
| **Projects** | Planned → In Process → Completed | Originator creates → Owner starts → complete. Can go On Hold, be Cancelled. |
| **Work Items** | Open → Closed | Similar to Issues but less formal. Originator creates, assigns Owner → Close. Can reopen (→ In Process). |
| **Notices** | Open → Closed | Originator posts info → Dialog responses → Close when no longer needed. |
| **Incidents** | Open → Closed | User creates, assigns Owner(s) → Dialog/tracking → Close with resolution. Can reopen. |

### Common Built-In Features
- **State transitions** via toolbar buttons (activate, start, complete, close, reopen, submit, cancel)
- **Automatic notifications** on state changes (configurable, can be disabled)
- **Response Dialog** for collaboration threading
- **Key dates** tracked per item type
- **Ownership** for responsibility assignment

---

## Custom Workflow

When built-in workflow doesn't fit, combine these features to create custom state machines on any subject area:

1. **Custom Properties** — add status/stage pick lists, date stamps, relationship properties for reviewers/approvers
2. **Calculated Properties** — derive statuses automatically from other values
3. **Auto-Update Rules** — change property values automatically on events:
   - **On Change to True**: fires when condition transitions false → true (e.g., `[Ready for Review] = "Yes"`)
   - **On Value Change**: fires when expression result changes (e.g., `[Owner]` changes)
   - **Nightly If True**: fires every night condition is true (e.g., overdue checks)
4. **Notification Rules** — send emails/inbox items when conditions are met
5. **Conditional Edit Properties** — lock fields based on status (e.g., only Reviewer can set Approval Status)
6. **Conditional Display Properties** — show/hide fields based on workflow stage

### Example: Vendor Approval Workflow
1. Add `[Vendor Reviewer]` (Individual - Select One, filtered to Reviewer responsibility)
2. Add `[Ready for Review]` (Yes/No)
3. Add `[Approval Status]` (Pick List: Approved/Rejected)
4. Add `[Vendor Status]` (Calculated: derives from Ready for Review + Approval Status)
5. Set Conditional Edit on `[Approval Status]` → only Vendor Reviewers team
6. Add Auto-Update Rule on `[Ready for Review]`: On Change to True → set `[Vendor Status]` = "In Review"
7. Add Notification Rule: when `[Ready for Review]` changes to Yes → notify `[Vendor Reviewer]`

---

## Notification Rules

Path: **Settings → Notifications & Workflow → Notification Rules**

Select an Object Type in Main panel → add/edit rules in Detail panel.

Built-in rules (🔒) can be disabled but not deleted.

### Configuration Tabs

**Details Tab:**
- **Name**: rule name
- **Event Type**: On Value Change, On Change to True, Nightly If True, Manual If True (for testing nightly rules)
- **Condition/Expression**: trigger expression
- **Send Email**: enable/disable email
- **Create Inbox Item**: enable/disable ProcessUnity Inbox notification

**Recipients Tab:**
- Static recipients (specific users, roles, teams)
- Dynamic recipients (property-based: e.g., `[Owner]`, `[Vendor Reviewer]`)
- CC/BCC options

**Message Tab:**
- Subject and body with merge fields (property values from the triggering record)
- HTML formatting supported via MS Word Template (dotx)

**Schedule Tab** (for Nightly rules):
- Frequency and timing options

### Key Tips
- **Nightly If True** should be used for date-based logic (overdue, reminders) — do NOT use On Change to True with TODAY()
- **Manual If True** lets you test nightly notifications immediately without waiting for nightly processing
- **Bulk notifications** can reduce email overload — check volumes before going live
- **Test with admin account first**: create a test user account (separate user, same admin email) to receive test notifications
- Notifications can be disabled by clearing both Send Email and Create Inbox Item checkboxes (rule remains visible with gray background)

---

## Workflow Steps and Automated Actions

### Detail Buttons
Path: **Settings → Notifications & Workflow → Detail Buttons**

Custom buttons on the Details tab toolbar that trigger configurable actions when clicked. Actions can include: setting property values, sending notifications, creating related items.

### Automated Actions
Path: **Settings → Notifications & Workflow → Automated Actions**

Server-side actions triggered by schedules or events. Used for: automated imports/exports, connector execution, data synchronization. Requires the Import/Export Automation permission.

### Report Actions
Custom actions that can be invoked from report rows — extend workflow into reporting context.

---

## Response Dialog

Built-in collaboration feature on action items and incidents. Captures threaded comment history with timestamps and usernames.

- Click **respond** button on Detail panel toolbar to add a comment
- System-generated events (creation, assignment, state changes) also appear in the dialog timeline
- Notifications can be configured for dialog responses
- Dialog permission controlled per role via the **Dialog** permission checkbox

---

## Review Patterns

Formal review and approval process for items that need sign-off before state transition. Used with: Controls, Assessment phases, Policies/Procedures, Loss Events.

### How It Works
1. Review Pattern defines: steps, reviewers (by role, team, ownership, or specific user), serial vs. parallel review, notifications
2. Item is submitted for review → system generates review requests
3. Reviewers approve or reject at each step
4. System tracks responses and notifies on status changes
5. Approval advances the item's state (e.g., Draft → In Use)

### Review Pattern Qualifiers
Allow different review patterns based on a qualifying variable (e.g., region). Different steps/reviewers/sequences per qualifier value (e.g., USA team vs. UK team).

**Note**: Review Patterns must be configured jointly with ProcessUnity System Administrator (Services team or Help Desk).

### Approval Tab
The Approval tab appears on subject areas with built-in review processing. Shows review status, steps, and reviewer responses.

### Approval Functions in Expressions
- `APPROVALINFOFIND(step, field, value)` — find reviewer index by field value
- `APPROVALINFOPARSE(step, field, reviewer)` — get specific reviewer field value

---

## Version Control

Certain subject areas support multiple simultaneous versions of the same record:

| Subject Area | Versioned Item Types |
|-------------|---------------------|
| Controls | Control Objective, Control Activity, Test Procedure |
| Documents | Managed Document |
| Metrics | Metric |
| Policies & Procedures | Policy/Procedure |
| Reference Controls | Reference Control Objective/Activity/Test Procedure |
| Regulations & Standards | Provision |

### Version States
- **Draft**: new or revised version being edited
- **In Review**: submitted for review/approval
- **In Use** (Active): approved, current version
- **Retired**: superseded by a newer version

### Lifecycle
1. New item starts as Draft
2. Submit for review → In Review
3. Approved → In Use (previous In Use version → Retired)
4. Create new version → new Draft (while existing version remains In Use)

### Property Behavior on New Version
Each property has a **Value on New Version** setting (Rules tab): Keep, Blank, or Default.

### Querying Active Versions
Use `ActiveOrLatestVersionView` in database queries to get current versions. Aggregate properties on versioned objects offer "Active Only" or "Active or Latest" options.
