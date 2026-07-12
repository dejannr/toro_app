# Toro Dashboard Implementation Specification

## Overview

Implement a production-quality operational dashboard for Toro at:

`/app/dashboard`

The dashboard should give a carrier or back-office user a fast overview of invoice activity, outstanding work, and company setup status.

This task is limited to the Dashboard section of the existing application.

Do not:

- Redesign the global app shell or sidebar.
- Change routing architecture.
- Change authentication or authorization architecture.
- Redesign invoices, company settings, or account settings.
- Introduce advanced trucking, dispatch, fleet, payment, OCR, or analytics systems.
- Add fake enterprise metrics that cannot be supported by the current product.
- Add landing-page-style content, hero sections, decorative graphics, gradients, or marketing copy.

Use existing app routes, components, API clients, data models, loading patterns, and design primitives wherever possible.

---

## Dashboard Purpose

The dashboard should answer these questions within a few seconds:

1. Does the user belong to a company?
2. What invoice work needs attention?
3. How much money is currently unpaid?
4. How much has been marked paid this month?
5. What invoices were recently created or updated?
6. Is the company sufficiently configured to create and send invoices?
7. What is the next useful action the user can take?

The dashboard should feel operational and credible without implying functionality that Toro does not yet provide.

---

## Dashboard Goals

### Primary goals

- Make invoice-related status visible immediately.
- Surface useful next actions.
- Help users identify unpaid invoices and incomplete setup.
- Provide fast navigation into existing workflows.
- Support useful empty states for new accounts and new companies.
- Respect the existing company-membership requirement.

### Secondary goals

- Reduce the number of clicks needed to create or review invoices.
- Make the product feel active even when invoice volume is low.
- Provide a clear foundation for future dashboard improvements without requiring future systems now.

### Non-goals

- Financial forecasting.
- Revenue recognition.
- Payment processing.
- Aging reports requiring complex accounting rules.
- Dispatch or load management.
- Fleet, driver, equipment, or telematics reporting.
- OCR or document-processing analytics.
- Subscription or billing information.
- Cross-company analytics.
- Custom dashboard configuration.

---

## Page Header

Use the existing protected-app page header pattern.

### Content

**Title:** `Dashboard`

**Description:** Use a concise operational description such as:

`Review invoice activity, outstanding balances, and company setup.`

### Header actions

When the user belongs to a company:

- Primary action: `Create invoice`
  - Link to `/app/create-invoice`
  - Use the existing primary button treatment.
  - Include an appropriate Untitled UI icon if consistent with current buttons.

- Optional secondary action: `View invoices`
  - Link to `/app/invoices`
  - Use a secondary or outline button.
  - Hide this action on narrow mobile layouts if header space is limited because the same action appears elsewhere.

When the user does not belong to a company:

- Primary action: `Create company`
  - Link to `/app/company`

Do not show a create-invoice action that leads into an unusable workflow for users without a company.

---

## Information Architecture

For users with a company, render dashboard content in this order:

1. Page header
2. Action-needed notice, when applicable
3. Summary metrics
4. Main content grid
   - Recent invoices
   - Quick actions
5. Company setup status, when incomplete
6. Optional compact invoice-status breakdown

For users without a company, replace the normal dashboard content with a focused company-required state.

Do not render unusable metric cards filled with zeros behind the company-required state.

---

# Dashboard Sections

## 1. Action Needed

### Purpose

Surface a small number of concrete issues that the user can resolve now.

### Priority

High, but conditional.

Render this section only when at least one actionable issue exists.

### Content

Supported action-needed items may include:

- One or more unpaid invoices.
- Company profile is incomplete.
- Billing or remittance information is incomplete.
- Invoice settings are incomplete.
- No invoice has been created yet.

Each item should include:

- A short title.
- One sentence of context.
- A direct action link or button.
- An appropriate icon.

Examples:

- `3 invoices are unpaid`
- `Add remittance details before sending invoices`
- `Finish your invoice settings`
- `Create your first invoice`

### Actions

- Unpaid invoices:
  - Link to `/app/invoices`
  - If the invoices page supports status filters through existing URL state, use the existing unpaid filter.
  - Do not invent a new filtering convention solely for the dashboard.

- Missing company information:
  - Link to `/app/company`

- No invoices:
  - Link to `/app/create-invoice`

### Presentation

Use one compact notice container rather than separate oversized cards.

If multiple issues exist:

- Show a maximum of three.
- Order them by operational importance:
  1. Missing configuration that blocks invoice creation or sending.
  2. Unpaid invoices.
  3. No invoices yet.
  4. Lower-priority profile completion items.

Avoid alarming warning styling unless an action is genuinely blocked.

### Buildability

Can be built now if the app can determine:

- Invoice counts by status.
- Company field completeness.
- Whether any invoices exist.

If field completeness is not exposed cleanly, use the simplified company-completion logic described in the Data Requirements section.

---

## 2. Summary Metrics

### Purpose

Provide a compact snapshot of current invoice activity.

### Priority

High.

### Layout

Desktop:

- Four metrics in one row where space allows.
- Use a responsive grid.
- Avoid oversized cards.

Tablet:

- Two columns.

Mobile:

- Two columns when readable.
- One column only on very narrow screens.

### Metrics

#### A. Unpaid total

**Label:** `Unpaid`

**Value:** Sum of invoice totals for invoices currently considered unpaid.

Include a secondary line such as:

- `Across 4 invoices`
- `No unpaid invoices`

**Action:** Entire card or a subtle inline link may navigate to `/app/invoices`.

Do not imply the balance is overdue unless Toro has an explicit due-date and overdue-status rule.

#### B. Paid this month

**Label:** `Paid this month`

**Value:** Sum of invoice totals marked paid during the current calendar month.

Include a secondary line such as:

- `6 invoices`
- `No payments recorded`

Use the invoice paid timestamp if one exists. Do not use invoice creation date as a substitute for paid date without clearly documenting that limitation.

#### C. Total invoices

**Label:** `Total invoices`

**Value:** Total number of invoices belonging to the current company.

Include a secondary line showing useful context, for example:

- `2 created this month`
- `No invoices yet`

If created-this-month data requires no additional backend complexity, calculate or request it. Otherwise, omit the secondary count rather than use mock data.

#### D. Draft or pending work

Use the most meaningful status supported by the current invoice model.

Preferred label order:

1. `Draft invoices`
2. `Pending invoices`
3. `Open invoices`

The metric must map to an actual existing invoice status or a clearly defined group of existing statuses.

Include:

- Count of invoices requiring user follow-up.
- A short contextual line such as `Ready to review` when accurate.

Do not invent a new invoice status.

### Visual rules

- Show currency with the company or application’s existing currency formatting.
- Use tabular numerals if already available in the typography system.
- Keep labels subdued and values prominent.
- Icons may be used, but they should not dominate the card.
- Do not add percentage-change indicators because Toro does not currently have a meaningful comparison or analytics layer.
- Do not show fake trend arrows or charts.

### Buildability

Can be built now from invoice records if the frontend already receives the relevant collection and amounts.

For better efficiency, a small backend summary endpoint may be added as described later.

---

## 3. Recent Invoices

### Purpose

Let users quickly inspect and continue work on the latest invoices.

### Priority

High.

### Section header

**Title:** `Recent invoices`

**Description:** Optional. Keep it brief, for example:

`Your latest invoice activity.`

**Header action:** `View all`

- Link to `/app/invoices`

### Content

Show the five most recent invoices for the current company.

Use the most appropriate existing date field for ordering:

1. `updated_at`, if invoice updates are meaningful and consistently maintained.
2. Otherwise, `created_at`.

Do not sort by invoice number.

### Recommended columns on desktop

- Invoice number
- Customer or recipient
- Amount
- Status
- Updated or created date
- Row action

Use the actual customer naming field available in the invoice model. Do not create a new customer entity.

### Mobile presentation

Do not force the full desktop table into a narrow viewport.

On mobile, each invoice row should become a compact stacked item showing:

- Invoice number
- Customer or recipient
- Amount
- Status
- Date

The entire row may be clickable if that matches existing app interaction patterns.

### Row actions

Primary row behavior:

- Open the existing invoice detail view.

Optional contextual actions may be included only if equivalent actions already exist and can be reused safely:

- Review invoice
- Download PDF
- Mark paid

Avoid placing all invoice actions directly in the dashboard row. Prefer a single detail link or existing overflow menu.

### Status display

Use the existing invoice-status badge component and status labels.

Do not create dashboard-specific status colors that conflict with the invoices list.

### Empty state

When the company has no invoices:

- Show a compact, useful empty state inside this section.
- Title: `No invoices yet`
- Description: `Create your first invoice to start tracking billing activity.`
- Primary action: `Create invoice`
- Link to `/app/create-invoice`

Do not show an empty table header with no rows.

### Loading state

Use a skeleton matching the final table or list shape.

Do not use a full-page spinner if the app shell and page header can render immediately.

### Error state

Show a compact inline error with:

- `Unable to load recent invoices.`
- A retry action if the current data-fetching approach supports refetching.

A failure in this section should not necessarily prevent other dashboard sections from rendering.

### Buildability

Can be built now from the existing invoice list data.

Prefer a limited backend query rather than downloading the entire invoice history just to show five records.

---

## 4. Quick Actions

### Purpose

Provide direct access to common existing Toro workflows.

### Priority

Medium-high.

### Content

Show a compact list of actions, not large promotional cards.

Required actions:

#### Create invoice

- Label: `Create invoice`
- Supporting text: `Upload documents and prepare a new invoice.`
- Link: `/app/create-invoice`
- Primary visual emphasis.

#### View invoices

- Label: `View invoices`
- Supporting text: `Review, send, download, or update existing invoices.`
- Link: `/app/invoices`

#### Company settings

- Label: `Company settings`
- Supporting text: `Update company, remittance, and invoice details.`
- Link: `/app/company`

#### Account settings

- Label: `Account settings`
- Supporting text: `Manage your profile, password, and notifications.`
- Link: `/app/account`

### Presentation

Preferred desktop treatment:

- A single card with vertically stacked action rows.
- Each row contains:
  - Icon
  - Label
  - Optional supporting text
  - Chevron or lightweight button affordance

Do not use four large equal-sized feature cards.

### Conditional behavior

If company setup is incomplete:

- Company settings may include a subtle `Setup needed` label.

If the user does not have a company:

- The normal quick-actions section should not appear.
- The company-required state should provide the relevant company and account actions instead.

### Buildability

Can be built now using existing routes.

---

## 5. Company Setup Status

### Purpose

Help users complete the information needed for professional invoices.

### Priority

Medium and conditional.

Show this section only when:

- The user belongs to a company, and
- One or more required or recommended setup groups are incomplete.

Once all tracked groups are complete, either hide the section or replace it with a very small completion confirmation. Hiding it is preferred to reduce dashboard noise.

### Setup groups

Use the existing Company Settings structure.

Recommended groups:

#### Company profile

Examples of relevant fields:

- Company name
- Business address
- Company contact information

#### Billing and remittance

Examples:

- Remittance address
- Payment instructions
- Billing contact details

#### Invoice settings

Examples:

- Invoice numbering or prefix settings
- Default invoice terms
- Company details used on generated invoices

Use fields that actually exist in Toro.

Do not introduce new required fields solely for dashboard completion scoring.

### Content

Show:

- Section title: `Company setup`
- Completion summary, such as `2 of 3 sections complete`
- A simple progress bar
- A short checklist of setup groups
- Action: `Complete company setup`
- Link to `/app/company`

### Completion logic

Calculate completion by setup group, not by raw field percentage.

Example:

- Company profile complete: all fields currently required by the company form are populated.
- Billing/remittance complete: required remittance fields are populated.
- Invoice settings complete: required invoice settings are populated.

This produces a stable and understandable result such as `2 of 3 sections complete`.

Do not display misleading values such as `83% complete` based on arbitrary field counts.

### Buildability

Can be built now if current company data includes the relevant fields.

If the dashboard only receives a minimal company object, extend the existing current-company response or add a lightweight completion summary.

---

## 6. Invoice Status Breakdown

### Purpose

Show how current invoices are distributed across supported statuses.

### Priority

Low-medium.

This section is optional for the first implementation. Include it only if invoice status data is already easy to retrieve and the result adds value beyond the summary cards.

### Content

Use a compact horizontal or vertical list, not a complex chart.

For each supported status, show:

- Status name
- Invoice count
- Optional total amount

Possible statuses must come from the current invoice model, such as:

- Draft
- Sent
- Unpaid
- Paid

Do not assume these exact statuses exist. Map to the actual current values.

### Actions

- Each row may link to `/app/invoices`.
- Apply a status filter only if the invoices page already supports it.

### Presentation

Preferred formats:

- Compact segmented bar with a legend, or
- Simple rows with labels and counts.

Do not use:

- Pie charts
- Donut charts
- Animated charts
- Trend charts
- Fake comparative analytics

### Empty state

Do not render this section when there are no invoices.

### Buildability

Can be built now if counts by invoice status are available.

---

# Quick Actions Summary

The dashboard should link only to existing routes.

| Action | Route | Availability |
|---|---|---|
| Create invoice | `/app/create-invoice` | Company members only |
| View invoices | `/app/invoices` | Company members only |
| Company settings | `/app/company` | All authenticated users; used to create or manage company |
| Account settings | `/app/account` | All authenticated users |
| Open invoice detail | Existing invoice detail route | Company members only |

Do not create new routes as part of the dashboard implementation.

---

# States and Empty States

## 1. User Has No Company

### Required behavior

The dashboard must respect the existing company-membership business rule.

When the authenticated user does not belong to a company:

- Do not show invoice metrics.
- Do not show recent invoices.
- Do not show invoice-status breakdown.
- Do not show a create-invoice action as the primary action.
- Do not fetch company-scoped invoice data unless existing application architecture already handles this safely.
- Show one focused company-required state in the main content area.

### Company-required state content

**Title:** `Create a company to use the dashboard`

**Description:**

`Toro needs your company information before you can create, manage, and track invoices.`

### Primary action

`Create company`

- Link to `/app/company`

### Secondary action

`Go to account settings`

- Link to `/app/account`

### Supporting content

Include a short, restrained list of what becomes available after company setup:

- Create invoices
- Track unpaid and paid invoices
- Configure invoice and remittance details

Keep this state practical. Do not turn it into a marketing hero section.

### Visual treatment

- Use a single centered or full-width operational card.
- Keep width constrained enough for readability.
- Use a simple company or building icon.
- Do not add illustrations, gradients, or decorative background elements.

---

## 2. Company Exists but Has No Invoices

Render the standard dashboard with meaningful zero states.

Expected behavior:

- Summary metrics show formatted zero values where appropriate.
- Recent invoices shows its dedicated empty state.
- Action-needed section may include `Create your first invoice`.
- Quick actions remains visible.
- Company setup status appears if incomplete.

The page should not feel broken or excessively empty.

---

## 3. Company Exists and Setup Is Incomplete

Expected behavior:

- Show normal invoice information.
- Show company setup section.
- Show an action-needed item only when incomplete fields affect invoice quality or an existing workflow.
- Do not block dashboard access unless the current app already treats a missing field as a hard requirement.

Do not invent additional blocking behavior.

---

## 4. No Unpaid Invoices

The unpaid metric should show:

- `$0.00` or the existing currency equivalent
- Supporting text: `No unpaid invoices`

Do not present this as an error.

A subtle positive state is acceptable, but avoid celebratory illustrations or excessive success styling.

---

## 5. No Paid Invoices This Month

The paid-this-month metric should show:

- `$0.00`
- Supporting text: `No payments recorded this month`

Do not hide the metric because a stable layout is easier to scan.

---

## 6. Partial Data Failure

Where practical, load sections independently.

Examples:

- If recent invoices fail but summary data succeeds, keep the summary visible.
- If company completion cannot load, omit or show an inline error in that section.
- Do not replace the entire page with a fatal error for one non-critical request.

Follow existing app error-handling conventions.

---

## 7. Full Dashboard Failure

If core dashboard data cannot be loaded:

- Keep the page header visible.
- Show a clear error state in the dashboard content area.
- Message: `Unable to load dashboard data.`
- Add a retry action.
- Do not expose raw API messages, stack traces, or response payloads.

---

## 8. Loading

Preferred behavior:

- Render the app shell and page header immediately.
- Use skeletons for metric cards, recent invoices, and conditional sections.
- Match skeleton dimensions closely to final content to reduce layout shift.
- Avoid one large spinner covering the page.

---

# Data Requirements

## Required existing data

The dashboard should use current authenticated app state and current company-scoped invoice data.

### Current user

Required fields:

- User ID
- First name or display name, if already available
- Company membership state
- Existing role or membership information only if needed for action visibility

Do not add role-based dashboard behavior unless roles already affect the linked actions.

### Current company

Required fields:

- Company ID
- Company name
- Existing company profile fields needed for completeness
- Existing billing/remittance fields needed for completeness
- Existing invoice settings fields needed for completeness

### Invoice summary

Required values:

- Total invoice count
- Count by existing invoice status
- Total amount currently unpaid
- Number of unpaid invoices
- Total amount marked paid in the current calendar month
- Number of invoices marked paid in the current calendar month
- Optional count created during the current calendar month

### Recent invoices

Required fields for up to five invoices:

- Invoice ID
- Invoice number
- Customer or recipient display name
- Total amount
- Currency, if invoice currency varies
- Existing invoice status
- Created timestamp
- Updated timestamp
- Existing invoice detail route identifier

### Paid-this-month definition

Use the current month in the application’s established timezone behavior.

Preferred calculation:

- Include invoices whose status is paid and whose `paid_at` timestamp falls within the current calendar month.

If no `paid_at` field exists:

- Do not silently calculate paid-this-month from `updated_at`.
- Either:
  - Add a proper paid timestamp when the existing mark-paid action runs, or
  - Temporarily replace this metric with a metric that can be calculated accurately, such as `Paid invoices`.

Document whichever choice is implemented.

### Unpaid definition

Map unpaid to current invoice statuses.

Do not assume every non-paid invoice is unpaid. Draft or incomplete invoices should not necessarily contribute to unpaid receivables.

Define the mapping in one shared place so the dashboard and invoices page remain consistent.

### Currency

Use the existing invoice or company currency rules.

If Toro currently supports one currency:

- Format all dashboard amounts consistently using that currency.

If invoices can have different currencies:

- Do not sum different currencies into one misleading total.
- Group totals by currency or use the app’s existing normalization rule.
- Do not introduce currency conversion.

---

# Data Fetching Strategy

## Preferred approach

Use one dashboard-oriented backend response for summary data and a separate recent-invoices request only if that matches the existing API architecture.

A practical response shape should conceptually include:

- Company membership state
- Summary counts and totals
- Recent invoices
- Company setup completion

The exact API shape must follow existing backend conventions.

## Acceptable first implementation

If the existing frontend already has efficient invoice queries and the dataset is small:

- Reuse the existing invoice API.
- Calculate summary values client-side.
- Limit the recent-invoice display to five records.

However:

- Do not fetch an unbounded invoice history.
- Do not duplicate inconsistent status-mapping logic across multiple components.
- Do not add mock production values to make the dashboard appear populated.

## Caching

Follow existing application caching and request patterns.

Do not introduce Redis-backed dashboard caching solely for this task unless the current app already uses Redis for equivalent API response caching.

---

# Placeholder and Mock Data Rules

## Production behavior

The implemented dashboard must not show fabricated financial or invoice values.

Do not hardcode:

- Invoice totals
- Customer names
- Invoice counts
- Status distribution
- Payment activity
- Trend percentages

## Allowed placeholders

Placeholders are acceptable only for:

- Skeleton loading states
- Local story/demo fixtures
- Development-only component previews
- Temporary response fields explicitly marked for later backend connection

Any temporary mock must be:

- Isolated from production behavior.
- Clearly named as mock or fixture data.
- Easy to remove.
- Not used when a real authenticated session is active.

## Backend limitation fallback

If the backend does not expose enough information for a section:

1. Use available real data.
2. Simplify or omit the section.
3. Add a small backend extension only when necessary.

Do not compensate for missing backend support with fake operational data.

---

# Suggested Backend Additions

Only add backend functionality that directly supports this dashboard.

## 1. Dashboard summary endpoint

Add a company-scoped dashboard summary endpoint if the current APIs would otherwise require loading all invoices.

The endpoint should return only the data needed by this page:

- Total invoice count
- Invoice count by status
- Unpaid count and total
- Paid-this-month count and total
- Optional invoices-created-this-month count
- Up to five recent invoices
- Company setup completion summary

Follow the existing FastAPI dependency, authentication, company-membership, Pydantic, SQLAlchemy async, and error-response patterns.

Do not build a generic analytics framework.

## 2. Paid timestamp

If invoices can be marked paid but no reliable paid timestamp exists, add or consistently populate a `paid_at` field.

Requirements:

- Set it when an invoice is marked paid.
- Preserve or clear it according to the existing status-change behavior.
- Use an Alembic migration if the database schema changes.
- Keep the change scoped to supporting accurate current invoice behavior and the dashboard metric.

Do not build payment transaction records.

## 3. Company completion summary

If current-company data does not expose enough information, add a lightweight completion object.

Conceptually:

- `company_profile_complete`
- `billing_remittance_complete`
- `invoice_settings_complete`
- `completed_sections`
- `total_sections`

Derive these values from existing fields and validation rules.

Do not store an arbitrary percentage in the database unless there is a clear existing need. Prefer computing completion from current company data.

---

# UI and Layout Guidelines

## Global alignment

Use the current Toro app shell without changing:

- Fixed dark sidebar
- White main content surface
- Main-content scrolling behavior
- Existing content width and horizontal padding conventions

The dashboard must look like another native Toro app page, not a separate template.

## Main page spacing

Use a restrained vertical rhythm.

Recommended structure:

- Page header
- 24–32px gap
- Conditional action-needed section
- 16–24px gap
- Summary metric grid
- 24px gap
- Main dashboard grid
- 24px gap
- Conditional setup or status section

Follow existing spacing tokens where available rather than introducing arbitrary values.

## Main dashboard grid

On wide desktop screens:

- Use a two-column layout.
- Recent invoices should receive more space.
- Quick actions should occupy the narrower column.

Suggested proportion:

- Recent invoices: approximately two-thirds
- Quick actions: approximately one-third

The company-setup section may:

- Span the full width below the main grid, or
- Occupy the narrow column below quick actions if that creates a balanced layout.

Avoid deeply nested grids.

## Cards

Use existing card primitives.

Expected visual treatment:

- Background close to `#FAFAFA`
- Subtle neutral border
- Medium-small radius
- Minimal or no shadow
- Clear internal padding
- No decorative card headers
- No cards nested inside other cards unless an existing component requires it

Metric cards may use a white or existing surface color if that better matches current Toro components, but all dashboard cards should feel consistent.

## Typography

Use Inter through the existing app typography setup.

Hierarchy:

- Page title: existing page-title style
- Section title: restrained semibold heading
- Metric value: prominent but not oversized
- Labels and supporting details: muted neutral text
- Table content: compact and readable

Do not use landing-page display typography.

## Color

Use Toro’s existing palette.

- Primary sidebar accent remains `#FFD028`.
- Do not spread bright yellow across every dashboard component.
- Use yellow selectively for primary actions, active states, or important highlights consistent with the current app.
- Use neutral colors for most cards and text.
- Reuse existing semantic status badge colors.

Do not add gradients, glows, or colorful analytics palettes.

## Icons

Use Untitled UI icons already available in the project.

Suitable icon categories:

- Invoice or file
- Currency or payment
- Check
- Alert
- Building or company
- Settings
- Arrow or chevron

Keep icon size and stroke weight consistent with the rest of the app.

Do not mix icon libraries unless the existing app already does so.

## Buttons and links

Reuse existing button variants.

- One clear primary action per major state.
- Avoid multiple primary-colored buttons in the same section.
- Use text links or secondary buttons for lower-priority navigation.
- Preserve existing focus, hover, disabled, and loading behavior.

## Tables

Reuse the existing invoices table styling where practical.

- Keep row density operational.
- Avoid excessive row height.
- Align amounts consistently.
- Use existing status badges.
- Make row navigation clear.
- Maintain keyboard accessibility.

---

# Mobile Responsiveness

## Overall behavior

The dashboard must remain usable on mobile without reproducing the desktop grid at a smaller scale.

### Page header

- Stack title/description and actions vertically when needed.
- Primary action should remain easy to reach.
- Buttons may become full width on very narrow screens.
- Do not allow header buttons to overflow horizontally.

### Metrics

- Use a two-column grid where each card remains readable.
- Collapse to one column on very narrow screens.
- Prevent long currency values from overflowing.
- Use compact number formatting only if the app already has an established formatter.

### Main grid

- Collapse to one column.
- Recommended order:
  1. Action needed
  2. Summary metrics
  3. Recent invoices
  4. Quick actions
  5. Company setup
  6. Status breakdown

### Recent invoices

- Replace the desktop table layout with stacked invoice rows or cards.
- Avoid horizontal scrolling where possible.
- Preserve the most important fields:
  - Invoice number
  - Customer
  - Amount
  - Status
  - Date

### Quick actions

- Keep actions as full-width rows.
- Maintain minimum touch-target sizes.
- Supporting text may wrap to two lines.

### Company-required state

- Use full available width with standard mobile page padding.
- Keep the primary action prominent.
- Stack primary and secondary actions.

### Sidebar interaction

Do not alter the current sidebar or mobile navigation implementation as part of this task.

The dashboard should work within the existing responsive app shell.

---

# Accessibility

Follow existing accessibility patterns and ensure:

- Semantic heading order.
- Buttons are buttons and navigation actions are links.
- All interactive rows have visible focus states.
- Status is not communicated through color alone.
- Currency and metric labels remain available to screen readers.
- Loading skeletons are not announced as meaningful content.
- Error messages are understandable without raw technical information.
- Icons used only decoratively are hidden from assistive technology.
- Mobile touch targets are appropriately sized.

Do not make an entire card clickable if it contains nested buttons or links that would create conflicting interaction targets.

---

# Implementation Notes for Codex

## Scope control

Modify only files required for:

- `/app/dashboard`
- Dashboard-specific reusable components
- Dashboard data fetching
- Minimal backend support required for real dashboard data
- Relevant tests

Do not refactor unrelated application architecture.

## Reuse first

Before creating new components, inspect and reuse:

- Existing app page-header component
- Button variants
- Card primitives
- Status badges
- Invoice table or invoice-row patterns
- Currency and date formatters
- Loading skeletons
- Empty-state patterns
- API client utilities
- Authenticated-user and current-company hooks or providers
- Error handling and query-state conventions

Do not create duplicate formatters or status mappings inside the dashboard.

## Recommended component boundaries

The exact file organization should follow the current repository, but the dashboard can be decomposed conceptually into:

- Dashboard page/container
- Dashboard header
- Action-needed panel
- Summary metric grid
- Summary metric card
- Recent invoices section
- Quick actions section
- Company setup section
- Optional invoice-status breakdown
- Company-required state
- Dashboard loading state
- Dashboard error state

Avoid over-componentization. A component should represent a meaningful UI or data responsibility.

## Server and client components

Follow the project’s established Next.js App Router pattern.

Prefer server-side data loading where it matches current protected-page architecture.

Use client components only where required for:

- Interactive refetch behavior
- Existing client-side data-fetching library
- Menus or client-only controls
- Responsive interactions that cannot be handled with CSS

Do not convert the whole page into a client component without a concrete need.

## Data consistency

Centralize or reuse definitions for:

- Which statuses count as unpaid
- Which statuses represent draft or pending work
- Currency formatting
- Date formatting
- Company setup completeness

The dashboard and invoices screens must not disagree about status labels or amounts.

## Permissions

Respect current backend authorization and company scoping.

- Never accept a company ID from the browser without verifying membership.
- Dashboard invoice data must be scoped to the authenticated user’s current company.
- A user without a company must receive a valid company-required result, not an internal server error.
- Do not rely only on frontend hiding for access control.

## URL behavior

Use existing routes exactly.

Do not create new dashboard subroutes.

Use existing invoice-detail URLs for invoice rows.

Do not change sidebar routes or route names.

## Testing expectations

Add tests consistent with the current project test setup.

At minimum, cover:

### Frontend states

- User without a company sees the company-required state.
- User without a company does not see invoice metrics or create-invoice CTA.
- Company with no invoices sees correct zero and empty states.
- Company with invoices sees summary metrics.
- Recent invoices are limited and ordered correctly.
- Incomplete company setup displays the setup section.
- Complete company setup hides the setup section.
- Loading state renders without layout-breaking behavior.
- Error state exposes retry behavior where supported.
- Dashboard links point to existing routes.

### Backend behavior, if an endpoint is added

- Authentication is required.
- User without a company receives the expected non-error response or established company-required response.
- Data is restricted to the authenticated user’s company.
- Unpaid totals exclude statuses that should not count as unpaid.
- Paid-this-month uses the paid timestamp and current calendar-month boundaries.
- Recent invoices are correctly ordered and limited.
- Company completion is derived from existing required fields.
- Decimal currency values are returned without floating-point inaccuracies.

## Acceptance criteria

The dashboard implementation is complete when:

1. `/app/dashboard` uses the existing Toro shell and page-header conventions.
2. Users without a company see a focused company-required state.
3. Users with a company see useful invoice summary metrics based on real data.
4. The dashboard shows up to five recent invoices with links to existing invoice details.
5. Users can navigate directly to create invoice, invoices, company settings, and account settings.
6. Empty, loading, error, and incomplete-setup states are handled.
7. The layout is responsive and usable on desktop and mobile.
8. No fabricated operational data is shown in production.
9. No unsupported future product systems are introduced.
10. Existing auth, routing, invoice architecture, company settings architecture, and account settings architecture remain intact.
11. Dashboard data is correctly scoped to the authenticated user’s company.
12. Styling matches Toro’s quiet, operational design language.

---

# Recommended First-Release Composition

For the first dashboard release, prioritize this exact scope:

1. Page header with `Create invoice` and `View invoices`
2. Company-required state
3. Conditional action-needed panel
4. Four invoice summary metrics
5. Recent invoices
6. Quick actions
7. Conditional company setup status
8. Loading, error, and empty states

Treat invoice-status breakdown as optional. Implement it only after the required sections are complete and only when it can use accurate existing status data.

The result should be compact, useful, and credible for an early-stage trucking invoicing product. It should help a user understand current invoice operations and move directly into the next relevant workflow without presenting Toro as a broader fleet or financial platform than it currently is.
