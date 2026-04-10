# Assessments & Questionnaires Reference

## Table of Contents
1. [Assessment Concepts](#assessment-concepts)
2. [Assessment Framework Setup](#assessment-framework-setup)
3. [Questionnaires](#questionnaires)
4. [Assessment Lifecycle](#assessment-lifecycle)
5. [Scoping Assessments](#scoping-assessments)
6. [Bulk Assessments](#bulk-assessments)
7. [Questionnaire Analysis and Follow-Up](#questionnaire-analysis-and-follow-up)
8. [Vendor Portal](#vendor-portal)
9. [Assessment Permissions](#assessment-permissions)

---

## Assessment Concepts

Assessments are point-in-time evaluations of entities within a risk management framework. They identify, measure, and rank risks, then drive remediation.

### Key Components
- **Properties**: data elements on each assessment (standard + custom)
- **Scope**: which auditable entities are included (controls, processes, questionnaires, etc.)
- **Phases**: stages of the assessment (planned, in process, completed)
- **Assessment Types**: templates defining scope types, phases, and findings templates
- **Questionnaire**: self-assessment survey sent to vendors or internal users
- **Findings**: analyst observations documented during review
- **Related Items**: issues, projects, attachments linked to the assessment

### Auditable Entities
Subject areas that can participate in assessment scope: Business Elements, Controls, Financial Accounts, Processes, Questionnaire, Regulations, Risks.

---

## Assessment Framework Setup

Path: **Assessments → Administration**

### Setup Order
1. **Assessment Periods** (Settings → Notifications & Workflow → Assessment Periods) — define time periods for grouping assessments
2. **Assessment Types** — define scope type(s), phases, findings template. Path: Assessments → Administration → Assessment Types
3. **Questionnaire Templates** — build question sets. Path: Assessments → Questionnaire Setup → Questionnaire Templates
4. **Findings Templates** — define standard finding categories (optional)
5. **Manage Assessments** — create and organize actual assessments in a hierarchical tree

### Assessment Types Configuration
- Name and describe the type
- Set **Assessment Scope Type(s)**: one or more of Business Elements, Controls, Financial Accounts, Processes, Questionnaire, Regulations, Risks
- Define phases (optional) with review patterns
- Associate findings template (optional)
- Set default scope (optional)

---

## Questionnaires

### Questionnaire Templates
Path: **Assessments → Questionnaire Setup → Questionnaire Templates**

Templates define the structure of a questionnaire:
1. Create template with name, description
2. Add **Sections** — logical groupings of questions
3. Add **Questions** within sections — various response types (text, pick list, yes/no, etc.)
4. Add **Sub-Questions** as needed
5. Configure **Scoring Expressions** on questions (optional) — expressions that calculate scores based on responses
6. **Activate** the template (Draft → In Use) — required before it can be used in an assessment

Questions support: required flag, comments/evidence requirements, weighting, conditional display based on other answers, scoring.

### Questionnaire Workflow (Vendor Assessment)
1. Internal user creates assessment with Questionnaire scope type
2. Associates questionnaire template and sends to vendor contact (Primary Contact)
3. Vendor receives notification and completes questionnaire in Vendor Portal
4. Visual indicators highlight incomplete required questions
5. Vendor submits responses
6. Internal analyst reviews responses, adds notes, raises issues/findings
7. Follow-up questionnaires can be sent if needed
8. Assessment is completed

### Internal Questionnaires
Questionnaires can be sent to internal users (not just vendors). Internal recipients see the questionnaire in their ProcessUnity Inbox.

**Questionnaire Delegation**: vendor contacts or internal users can delegate specific questions to other individuals.

### Questionnaire Import/Export
Users with the Questionnaire Import/Export permission can download questionnaire responses to Excel, complete offline, and re-import. Useful for reusing previous responses.

### SIG Connector
Automates building questionnaire templates from the Standardized Information Gathering (SIG) Questionnaire — an industry standard for vendor risk assessment.

---

## Assessment Lifecycle

### Assessment States
| State | Trigger |
|-------|---------|
| **In Process** | Created and saved, or reopened from Completed |
| **Completed** | Complete button clicked (requires Actual Completion Date) |
| **Cancelled** | Cancel button clicked. Can be reopened. Responses become read-only. Does NOT auto-notify respondents. |

### Assessment Phase States
| State | Trigger |
|-------|---------|
| **Planned** | Phase created, not yet started |
| **In Process** | Start button clicked (with start date) |
| **Completed** | Complete button clicked |
| **Cancelled** | Cancel button clicked |

Phases can go through Review and Approval (Review Patterns) before transitioning states.

---

## Scoping Assessments

### Single Scope Type
If the Assessment Type has one scope type, the assessment's **Scope** tab shows all items of that entity type. Select which specific items to include.

Example: Assessment Type = "Controls Assessment" (scope = Controls) → Scope tab shows all controls; select IT-related controls for this specific assessment.

### Multiple Scope Types
If the Assessment Type has multiple scope types, first select which scope type to use on the Scope tab, then select specific items.

### Questionnaire Scope
For Questionnaire scope type, the Scope tab configures **Questions in Scope for this Assessment** — which questions from the associated template to include.

### Default Scope
Assessment Types can define a default scope — pre-selected items that new assessments of this type inherit.

---

## Bulk Assessments

### Vendor Bulk Assessments
Automates creating and sending questionnaire assessments to multiple vendors at once. Requires **Bulk Assessment Creation** permission.

Workflow:
1. Ensure vendor data is current (confirm primary contacts)
2. Set vendor **Readiness Flag** = Yes
3. Run the **Vendor Bulk Assessment Automation** standard report (or Vendor Service variant)
4. Launch **Create Bulk Assessments** from the report
5. Configure: assessment type, questionnaire template, time period, category folder
6. Click OK → system creates assessments and sends questionnaires automatically
7. Standard review/follow-up/completion workflow follows

### Default Assessment Category
Path: Settings → General → Application Settings → General Settings → Default Assessment Category

Pre-select the folder in the Manage Assessments tree where bulk assessments are stored. Best practice: organize by quarter or year.

### People Bulk Assessments
Similar process for sending assessments to internal individuals rather than vendors.

### Bulk Complete / Bulk Document Requests
Additional bulk operations available via right-click on assessment category folders:
- **Complete Assessments**: bulk-complete all assessments in a folder
- **Bulk Document Requests**: simultaneously create/apply document requests for all assessments in a folder

---

## Questionnaire Analysis and Follow-Up

After vendor submits responses:
1. **Review Responses**: analyst reviews answers, scores, evidence in the assessment detail
2. **Add Comments**: analyst can add notes to individual responses
3. **Raise Issues**: create issues directly from concerning responses
4. **Create Findings**: document observations using findings templates
5. **Follow-Up Questionnaire**: send additional questions or re-send for revision
6. **Score Review**: review calculated scores based on scoring expressions
7. **Complete Assessment**: finalize when review is done

Follow-up features: follow-up questionnaires, conditional follow-up based on responses, response dialog for back-and-forth with vendor.

---

## Vendor Portal

External-facing portal where vendor contacts complete questionnaires, submit documentation, and respond to requests.

### Portal Access
Configured per vendor contact. Users with Portal role type access the portal URL. Portal users see only their assigned items.

### Portal Features
- Active Questionnaire task: complete and submit questionnaires
- Document Requests: view and fulfill requests
- Response Dialog: communicate with internal users
- Delegation: assign questions to other vendor contacts
- Import/Export: download questionnaire to Excel, complete offline, re-import

### Portal Configuration
See `references/solutions.md` for Vendor Portal configuration details.

---

## Assessment Permissions

Granted at the Role level:

| Permission | Controls |
|-----------|----------|
| **View** (Assessment) | Can see assessments |
| **Edit** (Assessment) | Can modify assessments |
| **Complete** | Can click the Complete button |
| **Send Questionnaire** | Can send questionnaires (initial or follow-up) |
| **Questionnaire Import/Export** | Can import/export questionnaire responses (Portal and View Detail) |
| **Bulk Assessment Creation** | Can use the bulk assessment workflow |
| **Bulk Document Requests** | Can bulk-create document requests |
| **Bulk Complete** | Can bulk-complete assessments |
| **Auditor View** | Monitor schedules, progress, and results (read-only access) |
| **Release for Audit** | Selective access to results for external auditors |
| **Questionnaire Response Dialog** | Can respond to questions via dialog |

Some admins hide built-in buttons (Complete, Send Questionnaire) and manage these actions via custom Detail Buttons with permissions instead.
