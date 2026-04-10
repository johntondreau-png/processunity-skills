# Administration Reference

## Table of Contents
1. [User Account Management](#user-account-management)
2. [Roles](#roles)
3. [Teams](#teams)
4. [Data Access Permissions](#data-access-permissions)
5. [Security Framework](#security-framework)
6. [Application Settings](#application-settings)
7. [Application Branding](#application-branding)
8. [Instance Management](#instance-management)

---

## User Account Management

### Creating Users
Path: **Settings → People & Permissions → People → New**

Standard properties on Individual object:

| Property | Notes |
|----------|-------|
| First Name / Last Name | Full Name auto-populates |
| State | Active, Inactive, or Terminated — only Active can log in |
| Username | Must be unique; defaults to email; can only change when Inactive or during creation |
| Email | Used for notifications |
| Start Area | Task area shown on login |
| Auto-Deactivate Date | Optional; nightly processing deactivates on/after this date |
| Roles / Teams | Can assign inline or via Related Items tab |
| Last Login Date | Read-only, system-updated |

A user requires at least one Role before activation. Alternative creation path: create from within the Roles task.

### Bulk User Import
Use Import Templates (type "Individuals") with CSV. Recommended minimum columns: `[First Name]`, `[Last Name]`, `[Full Name]`, `[Email Address]`, `[Username]`, `[Roles]`, `[State]`, `[Send Password]`.

Key tips:
- Set `[State]` to Inactive initially, then bulk activate after verifying
- `[Send Password]` column must be positioned AFTER `[State]` column to work
- Use `[External ID]` as a unique key for future update imports
- For SSO instances, no password send is needed — users just need to exist, have a role, and be Active
- Pick list values in CSV must match PU values (case-insensitive)

### Account States
- **Active** → can log in, consumes license
- **Inactive** → temporary disable; does not consume license; can reactivate
- **Terminated** → permanent disable; does not consume license; must reinstate then activate
- No functional difference between Inactive/Terminated except for reporting

### Activation / Deactivation
- Activate: Select user → Details tab → **activate** button. Fails if no role assigned.
- Deactivate: Select user → toolbar → **deactivate**
- Auto-Deactivate: Set date on user record; nightly processing handles it
- Reactivation requires sending a new temporary password

---

## Roles

### Role Types

| Type | Workspace | Assessments | Reports | Settings | Portal |
|------|:---------:|:-----------:|:-------:|:--------:|:------:|
| Admin | ✓ | ✓ | ✓ | ✓ | ✗ |
| Standard | ✓ | ✓ | ✓ | ✓ | ✗ |
| Lite | ✓ | ✗ | ✗ | ✗ | ✗ |
| Portal | ✓ | ✗ | ✗ | ✗ | ✓ |
| Service | ✗ | ✗ | ✗ | ✗ | ✗ |

### Creating Roles
Path: **Settings → People & Permissions → Roles → New**

1. Name and describe the role
2. Select Role Type (determines available task areas)
3. Check **Visible Task Areas and Tasks** — what the user sees in navigation
4. Set **Permissions** — per-subject-area CRUD + special permissions

Copy shortcut: Select existing role → **Copy** button → edit the copy.

### Permission Model
Multiple roles are **cumulative** — user gets union of all assigned role permissions. Same for Visible Task Areas.

Key permissions per object type: Create, View (broken into tabs: Details, Attachments, Related Items, plus object-specific), Edit, Delete, Owner View, Owner Edit.

Special permissions: Account Administration, Change Log, Web Services, Connectors, Import/Export Automation, Bulk Assessment Creation, Questionnaire Respondent, Auditor View, Send Questionnaire.

**Best practice**: If you disable all permissions for an object type, also hide the corresponding task from Visible Task Areas. Disabling permissions doesn't auto-hide the navigation entry.

---

## Teams

### Purpose
Teams provide horizontal (cross-object) data access restrictions, complementing roles' vertical (per-object) permissions. Teams control:
- **Access tab** restrictions on individual records or hierarchy branches
- Report sharing/publishing
- Property-level view/edit access

### Creating Teams
Path: **Settings → People & Permissions → Teams → New** — or create from within People → Related Items tab.

### Access Tab (Data Access Restrictions)
Any record's **Access** tab (admin-only) can restrict view/edit to specific teams. Key behaviors:
- Default: no restrictions (all users with role-based View can access)
- For hierarchies, restrictions on a parent cascade to all children (more restrictive downward)
- Restrictions are system-wide — they carry into reports
- Only admins can see/configure the Access tab

---

## Data Access Permissions

### Layered Security Model (from broadest to most specific)
1. **Role-based UI entitlement** — which task areas/tasks a user sees
2. **Role-based object permissions** — CRUD per subject area
3. **Owner View / Owner Edit** — restrict to owned items only (requires ownership property)
4. **Team-based Access tab** — restrict specific records/branches to team members
5. **Property-level view/edit access** — restrict individual properties by role, team, or expression
6. **Conditional display/edit** — expression-driven property visibility

### Item Ownership
A user is an "owner" if their name appears on at least one property where **Participates in Ownership** = Yes. When no ownership property is set, all users with view/edit privileges are considered owners.

### Custom Report Security
- Report access defaults to owner + all app admins
- **Publishing** (Access tab on report): share with Selected Roles, Selected Teams, or All Users
- **Display Owned Items Only**: row-level filter showing only owned items to the runner
- Reports respect underlying role permissions — columns the user can't view show blank

---

## Security Framework

### Password Policy
Path: **Settings → General → Application Settings → Password Policy**

Options: max failed attempts (3/5/10), expiration (30-180 days or 1 year), history (prevent reuse of last 3/5/10), min length (5/8/10), min lowercase/uppercase/numeric/special chars, enable remember username, enable browser autocomplete, send username/password in separate emails.

Disabled when SSO is active.

### IP Address Restrictions
Restrict instance access by IP address range.

### Login History Report
Path: **Reports → People & Permissions Reports → Login History** — shows all successful/failed logins with timestamp, IP, browser, OS. Not customizable but exportable.

### Change Log
Automatically logs every property value change and relationship change per item. Access via Change Log tab (role permission required) or the Change Log standard report (Reports → Administration → Standard Reports).

Enable per-property: Settings → Properties → select object → edit → property → **Track Changes** checkbox (up to 50 per object).

---

## Application Settings

Path: **Settings → General → Application Settings**

| Setting | Purpose |
|---------|---------|
| Application Name | Displayed on login page and header |
| Password Policy | Login attempts, expiration, strength |
| Email Notification Settings | HTML templates, salutation, separate username/password emails |
| IP Address Restrictions | Geo-based access control |
| Application Branding | Logos, favicon, login page colors, disclaimer |
| Help Modules | Enable ProcessUnity Help Center or custom help |
| Workdays | Define which days are workdays (for business day calculations) |
| General Settings | Enable auto import/export, property history tracking, default assessment category, health rating format |
| Broadcast Messaging | Post-login messages to internal/portal users; opt-out support; reset opt-out |
| Lockout | Lock out all non-admins (doesn't affect integrations, nightly jobs, or Excel Connector) |
| Instance Time Zone | Affects TODAY() and NOW() expressions |
| Attachment Sort Order | Upload Date Asc/Desc, or Filename Asc |

### Broadcast Messaging
Separate messages for internal and portal users. Multi-language supported via Translate tab. Best practice: if instance is checked out to sandbox, keep production as master and don't change broadcast messages in sandbox.

---

## Application Branding

Path: **Settings → General → Application Settings → Application Branding**

| Element | Max Size / Format | Notes |
|---------|------------------|-------|
| Login Image | 400×250 px, GIF/JPG/PNG/ICO | White background recommended |
| Application Header Image | 250×100 px, GIF/JPG/PNG/ICO | |
| Header Background Color | Hex color | Behind the logo area |
| Login Top/Bottom Colors | Hex colors | Default: green/blue gradient |
| Browser Favicon | 16×16 px, ICO only | |
| Login Page Disclaimer | Text | Visible to anyone on login page |
| Logout/Unauthorized/Timeout Pages | Redirect URL or custom Title/Subtitle/Text | |

---

## Instance Management

### Instance Types
- **Production** — live instance
- **Sandbox** — testing copy via Check-Out/Check-In from production. Config changes tested here before checking back in.
- **Archive** — read-only snapshot for audit purposes. Created via Settings → Create Archive. One archive per 30-day period. Separate URL: `https://app.processunity.net/instance-archive/`

### Backup Schedule
Hosted on Microsoft Azure. Encryption: AES-256 at rest, HTTPS/TLS/SSL 2048-bit in transit.

| Frequency | Retention |
|-----------|-----------|
| Hourly incremental | Rolling 7 days |
| Nightly full | Rolling 30 days + off-site |
| Monthly (1st of month) | Rolling 12 months |
| Yearly (Jan 1) | Through contract length |

Restore: Contact Customer Support. Generally restored to sandbox for selective content restoration.
