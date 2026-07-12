# Toro Dashboard Charts Implementation Specification

## Overview

Implement a small set of useful operational charts inside the existing Toro dashboard at:

`/app/dashboard`

The charts must help a small carrier or back-office user understand invoice activity using only real invoice data that already exists for the authenticated user’s company.

This task is limited to dashboard charts and the minimum backend additions needed to support them.

Do not:

- Redesign the dashboard, app shell, sidebar, header, cards, routes, authentication, invoices architecture, company settings, or account settings.
- Add new dashboard routes.
- Add fake, seeded, forecasted, estimated, or derived business data that cannot be supported by current invoice records.
- Add dispatch, fleet, driver, load, telematics, payment-processing, accounting, OCR, or cross-company analytics.
- Add pie charts, donut charts, animated charts, 3D charts, gradients, glows, decorative illustrations, or marketing-style visualizations.
- Fetch unbounded invoice histories into the browser.
- Sum invoices across different currencies unless Toro already guarantees a single company currency.
- Invent URL filter parameters that the invoices page does not already support.

Use Apache ECharts through `echarts-for-react` or another minimal React integration that preserves direct control over ECharts configuration.

---

## Dashboard Chart Goals

The charts should answer a small number of operational questions:

1. How much invoice value has actually been marked paid over recent months?
2. How many invoices are being created over time?
3. How is the current invoice portfolio distributed across actual invoice statuses?

The first release must remain compact and operational. It should add insight without turning the Toro dashboard into a large analytics product.

---

# Recommended First-Release Charts

Implement exactly three charts for the first release:

1. Paid invoice totals over time
2. Invoice creation volume over time
3. Invoice status distribution

These three charts are supported directly by existing invoice fields and do not require speculative accounting logic.

---

## 1. Paid Invoice Totals Over Time

### Purpose

Show how much invoice value was marked paid during each recent calendar month.

This is useful because it lets a carrier or back-office user scan actual recorded payment activity without implying forecasting, cash-flow accounting, or payment-processing functionality.

### Priority

High.

### Chart type

Vertical bar chart.

Do not use a line chart for this first release because the data represents discrete monthly totals rather than a continuous measurement.

### Title

`Paid invoice totals`

### Supporting text

`Invoice value marked paid during the last 6 months.`

### Data source

Use invoice records for the authenticated company where:

- `status = Paid`
- `paid_at IS NOT NULL`
- `paid_at` falls within the selected six-month range

### Time range

Use the current calendar month plus the previous five calendar months.

Example:

If the current date is July 12, 2026, return buckets for:

- February 2026
- March 2026
- April 2026
- May 2026
- June 2026
- July 2026

The backend must return all six buckets, including months with zero values.

### Grouping

Group by calendar month using `paid_at`.

Do not group paid activity by:

- `created_at`
- `updated_at`
- Invoice status update date unless that field is explicitly `paid_at`

### Value

For each month return:

- Total paid invoice amount
- Number of paid invoices

### Status mapping

Only invoices whose current status is exactly the existing paid status should be included.

Do not include:

- Draft invoices
- Unpaid invoices
- Invoices with `paid_at` populated but a non-paid current status unless existing business logic explicitly treats them as paid

If Toro allows a paid invoice to be reopened, the current application behavior should determine whether `paid_at` is cleared. Keep dashboard logic aligned with that behavior.

### Currency behavior

If Toro guarantees one currency per company:

- Return and display one series in that company currency.

If invoices can use multiple currencies:

- Do not combine different currencies into one total.
- Either:
  - Return separate currency series only if the current data model supports this cleanly, or
  - Omit this chart and document that a single-currency company rule is required.

Do not perform currency conversion.

### Tooltip

On hover or keyboard focus, show:

- Full month and year
- Formatted paid total
- Paid invoice count

Example:

`March 2026`
`$18,420.00`
`7 paid invoices`

Use singular grammar for one invoice.

### Axis behavior

X-axis:

- Six month labels
- Use short labels such as `Feb`, `Mar`, `Apr`
- Include the year in the tooltip rather than repeating it on every axis label
- If the six-month range crosses a year boundary, include abbreviated year on the first month of each year where needed, such as `Dec '25`, `Jan '26`

Y-axis:

- Start at zero
- Use compact currency formatting where appropriate
- Preserve exact values in tooltips and accessible summaries
- Do not use a logarithmic scale

### Legend

No legend is needed because there is one series.

### Click behavior

Default behavior: no click action.

Only add bar-click navigation if the existing invoices route already supports a paid-status and date-range filter through an established URL convention.

Do not invent new query parameters solely for this chart.

### Empty state

If there are no paid invoices in the six-month period:

- Do not render an empty axis with meaningless bars.
- Show a compact empty state inside the chart card.

Title:

`No paid invoice activity`

Description:

`Invoices marked paid will appear here by month.`

Do not show mock bars.

### Loading state

Show a chart-card skeleton with:

- Title placeholder
- Supporting-text placeholder
- Chart-area placeholder matching the final height

Avoid a spinner inside an otherwise empty card.

### Error state

Show an inline card-level error:

`Unable to load paid invoice totals.`

Include a retry action if the existing dashboard data-fetching pattern supports refetching.

A failure in this chart must not block other dashboard sections.

### Buildability

Can be built now from:

- `status`
- `total_amount`
- `paid_at`

---

## 2. Invoice Creation Volume Over Time

### Purpose

Show how many invoices the company created during each recent week.

This helps users understand operational invoicing activity without implying revenue or payment performance.

### Priority

High.

### Chart type

Vertical bar chart.

Use a single compact series.

### Title

`Invoices created`

### Supporting text

`Weekly invoice creation during the last 12 weeks.`

### Data source

Use invoice records for the authenticated company where:

- `created_at` falls within the selected 12-week range

Include all current invoice statuses because the chart measures invoice creation activity, not payment state.

### Time range

Use the current calendar week plus the previous 11 calendar weeks.

Define the application week as:

- Monday 00:00 inclusive
- Following Monday 00:00 exclusive

Use the existing application timezone policy. If no explicit company timezone exists, use the backend’s established application timezone consistently.

Do not calculate bucket boundaries independently in the browser.

### Grouping

Group by calendar week using `created_at`.

The backend must return all 12 weekly buckets, including weeks with zero invoices.

Each bucket should include:

- `period_start`
- `period_end`
- `invoice_count`

### Value

Use invoice count only.

Do not sum invoice amounts in this chart because the metric is operational creation volume.

### Status mapping

All actual statuses are included:

- Draft
- Unpaid
- Paid

Do not split the first-release chart into multiple status series. That would make a small weekly chart unnecessarily noisy.

### Tooltip

Show:

- Week date range
- Number of invoices created

Example:

`Jun 15–Jun 21, 2026`
`4 invoices created`

Use singular grammar for one invoice.

### Axis behavior

X-axis:

- Show compact week-start labels such as `May 4`, `May 11`, `May 18`
- Reduce label density on narrow screens rather than allowing overlap
- Preserve the exact date range in the tooltip and accessible summary

Y-axis:

- Start at zero
- Use whole-number tick values
- Do not display fractional invoice counts

### Legend

No legend is needed.

### Click behavior

Default behavior: no click action.

Only add navigation if the existing invoices page already supports a created-date range through established URL state.

### Empty state

If no invoices were created during the 12-week period:

Title:

`No invoices created yet`

Description:

`New invoices will appear here as weekly activity.`

Primary action:

`Create invoice`

Link:

`/app/create-invoice`

Only show this action when the user belongs to a company.

### Loading state

Use the same chart skeleton pattern as the paid totals chart.

### Error state

Show:

`Unable to load invoice creation activity.`

Include retry behavior if supported.

### Buildability

Can be built now from:

- `created_at`
- Company-scoped invoice records

---

## 3. Invoice Status Distribution

### Purpose

Show the current number and amount of invoices in each real Toro invoice status.

This lets the user understand the current work mix without using a prohibited pie or donut chart.

### Priority

Medium-high.

### Chart type

Horizontal bar chart with one row per supported status.

Required statuses:

- Paid
- Unpaid
- Draft

Use the existing backend enum or canonical status values. Do not duplicate human-readable status mapping in multiple frontend components.

### Title

`Invoice status distribution`

### Supporting text

`Current invoices grouped by status.`

### Data source

Use all invoice records for the authenticated company.

Group by actual invoice status.

For each status return:

- Invoice count
- Total invoice amount

### Primary plotted value

Plot invoice count.

Invoice amount should appear as supporting information in the tooltip and accessible summary.

Using count as the bar length avoids misleading visual comparisons where one unusually large invoice dominates the chart.

### Status order

Always display statuses in this order:

1. Unpaid
2. Draft
3. Paid

This prioritizes open operational work.

If the backend enum names differ in casing, map them centrally to these display labels.

### Missing statuses

Return all supported statuses even when a count is zero.

This keeps the chart structure stable.

If the company has no invoices at all, show the section empty state instead of three zero bars.

### Colors

Use existing status colors:

- Paid: green
- Unpaid: amber or yellow
- Draft: neutral gray

Use restrained, accessible shades consistent with existing status badges.

Do not use gradients.

The chart must remain understandable through labels and values without relying on color alone.

### Tooltip

Show:

- Status label
- Invoice count
- Total invoice amount

Example:

`Unpaid`
`5 invoices`
`$12,740.00 total`

### Axis behavior

Category axis:

- Show status labels directly
- Do not abbreviate

Value axis:

- Invoice count
- Start at zero
- Whole-number ticks only

### Legend

No legend is needed because every horizontal bar has a visible category label.

### Click behavior

Default behavior: no click action.

Only link a bar to `/app/invoices` with a status filter if that filter convention already exists.

If no filter convention exists, the chart card may include a simple `View invoices` text action linking to `/app/invoices`.

### Empty state

If the company has no invoices:

Title:

`No invoice status data`

Description:

`Create an invoice to start tracking status distribution.`

Action:

`Create invoice`

Link:

`/app/create-invoice`

### Loading state

Show three horizontal skeleton rows inside the chart area.

### Error state

Show:

`Unable to load invoice status distribution.`

Include retry if supported.

### Buildability

Can be built now from:

- `status`
- `total_amount`

---

# Rejected Charts for This Release

Do not implement the following charts in the first release.

## Unpaid Amount by Customer

### Decision

Reject for now.

### Reason

The existing invoice record only provides a customer-name string. That may be sufficient for display but is not a reliable customer identity.

The same customer may appear under multiple variants, such as:

- `Acme Logistics`
- `ACME Logistics LLC`
- `Acme`

Grouping by raw name could split one customer into several bars or merge unrelated customers with similar names.

This chart may be reconsidered only after Toro has a stable customer identifier or an explicit normalized customer field.

Do not create customer normalization logic inside the dashboard task.

---

## Paid vs Unpaid Amount Comparison

### Decision

Reject as a standalone chart.

### Reason

The dashboard already contains:

- Unpaid total
- Paid this month
- Invoice status distribution

A paid-vs-unpaid amount chart would duplicate existing information while mixing:

- All-time current unpaid balance
- Potentially all-time paid invoice value
- Or current-month paid value

Those periods are not directly comparable without a clear accounting definition.

Do not build a chart that visually compares values with inconsistent time windows.

---

## Unpaid Invoice Aging

### Decision

Reject unless a real `due_date` field already exists and Toro has an explicit overdue rule.

### Reason

Aging cannot be calculated honestly from:

- `created_at`
- `updated_at`
- Invoice status alone

Do not infer due dates from invoice creation dates or default terms unless the product already stores and applies those rules consistently.

Even if `due_date` exists, first-release aging should remain out of scope unless:

- The due date is reliable on every applicable invoice
- The application has a clear overdue definition
- Timezone and boundary behavior are documented
- Existing invoices can be grouped without fabricating missing dates

Do not introduce accounting aging buckets such as `0–30`, `31–60`, or `61–90` days as part of this task.

---

## Customer Revenue Ranking

### Decision

Reject.

### Reason

Toro currently tracks invoices, not recognized revenue, collected payments by transaction, or normalized customer entities.

Do not label invoice totals as revenue.

---

## Trend Percentages

### Decision

Reject.

### Reason

A trend percentage requires:

- A defined comparison period
- Stable period boundaries
- Sufficient historical data
- Clear zero-period behavior

The first release should show direct operational values rather than percentage claims.

---

## Forecasting and Projections

### Decision

Reject.

### Reason

Current invoice data does not support defensible forecasting.

Do not add projected collections, expected revenue, cash-flow estimates, or predictive charts.

---

# Dashboard Placement

## Recommended section order

Keep the current dashboard structure and insert charts after the existing summary metrics.

Recommended order:

1. Dashboard page header
2. Action-needed notices
3. Summary metrics
4. Dashboard charts
5. Recent invoices and quick actions
6. Company setup completion
7. Existing compact status content, if still needed

### Existing invoice status breakdown

The new `Invoice status distribution` chart should replace the current non-chart invoice status breakdown if both communicate the same information.

Do not render duplicate status summaries.

If the current breakdown contains useful actions or labels not present in the chart:

- Preserve those actions in the chart card header or footer.
- Do not keep two separate sections with the same status counts.

---

## Desktop layout

Use a two-row chart layout inside the existing dashboard width.

Recommended arrangement:

### First row

- Paid invoice totals: two-thirds width
- Invoice status distribution: one-third width

### Second row

- Invoice creation volume: full width

Alternative:

- Paid invoice totals and invoice creation volume side by side at equal width
- Invoice status distribution full width below

Choose the arrangement that best fits the current dashboard’s actual container width and existing component proportions.

Do not make chart cards unusually tall.

Recommended chart card height:

- Paid invoice totals: 280–320px total card height
- Invoice creation volume: 260–300px total card height
- Status distribution: 260–300px total card height

Use existing spacing tokens and card padding.

---

## Tablet layout

At tablet widths:

- Use a single-column chart stack unless two cards remain clearly readable.
- Paid invoice totals first.
- Invoice creation volume second.
- Invoice status distribution third.

Do not preserve a narrow two-column layout that causes compressed labels or tooltips.

---

## Mobile layout

On mobile:

- Stack all chart cards vertically.
- Use the full available content width.
- Keep standard mobile page padding.
- Prevent chart canvases from exceeding the card width.
- Do not enable horizontal scrolling.
- Reduce axis-label density when needed.
- Keep tooltips within the viewport.
- Maintain a minimum readable chart plot height of approximately 200px.

Recommended order:

1. Paid invoice totals
2. Invoice creation volume
3. Invoice status distribution

For very narrow screens:

- Show fewer x-axis labels rather than rotating them excessively.
- Do not use labels smaller than the existing product’s minimum readable text size.
- Keep exact values in tooltips and the accessible summary.

---

# Backend Requirements

## Existing endpoint

Extend the existing company-scoped dashboard summary endpoint rather than creating a separate analytics subsystem.

The endpoint must:

- Require authentication.
- Determine the company from authenticated membership.
- Never trust a browser-provided company ID without verifying membership.
- Return no cross-company information.
- Return a valid company-required response according to existing dashboard behavior when the user has no company.
- Avoid unbounded invoice-history payloads.

---

## Recommended response shape

Extend the existing Pydantic dashboard response with a chart-data object conceptually equivalent to:

```text
DashboardChartsData
  paid_totals:
    range_start: datetime
    range_end: datetime
    currency: string
    buckets: list[PaidTotalsBucket]

  invoice_creation:
    range_start: datetime
    range_end: datetime
    buckets: list[InvoiceCreationBucket]

  status_distribution:
    currency: string
    items: list[InvoiceStatusDistributionItem]
```

Define bucket models conceptually as:

```text
PaidTotalsBucket
  period_start: date
  period_end: date
  paid_invoice_count: int
  paid_total: Decimal

InvoiceCreationBucket
  period_start: date
  period_end: date
  invoice_count: int

InvoiceStatusDistributionItem
  status: InvoiceStatus
  invoice_count: int
  invoice_total: Decimal
```

Use the project’s actual naming conventions.

Do not return presentation labels such as `Feb`, `Mar`, or `$12.4K` from the backend. Return canonical dates and decimal values so the frontend can format them consistently.

---

## Money serialization

Use `Decimal` in Python and database numeric types.

Do not convert money values to binary floating point during aggregation or serialization.

Return money using the project’s established Pydantic money serialization convention.

Acceptable wire formats:

- JSON string decimal, such as `"18420.00"`
- Existing project-specific money object

Do not introduce a new incompatible money format solely for charts.

---

## Paid totals query

Use an efficient company-scoped aggregate query.

Required behavior:

- Filter by authenticated company.
- Filter current status to paid.
- Require `paid_at IS NOT NULL`.
- Filter `paid_at` to the six-month range.
- Group by month.
- Sum `total_amount`.
- Count invoices.

Use PostgreSQL date truncation or an equivalent efficient SQL expression.

The service layer must fill missing month buckets with zeros after querying.

Do not issue one database query per month.

---

## Invoice creation query

Use one company-scoped aggregate query.

Required behavior:

- Filter by authenticated company.
- Filter `created_at` to the 12-week range.
- Group by calendar week.
- Count invoices.

Fill missing weekly buckets with zero counts in the service layer.

Do not load individual invoices to count them in Python.

---

## Status distribution query

Use one company-scoped aggregate query.

Required behavior:

- Group by actual invoice status.
- Count invoices.
- Sum invoice totals.
- Return zero entries for supported statuses that are absent.

Do not treat an unknown future status as one of the existing statuses silently.

If the invoice enum later gains a new status:

- Preserve it in backend output where safe.
- The frontend should either map it through the canonical status configuration or omit it with an explicit development warning.
- Do not mislabel it.

---

## Date boundaries

Calculate all range boundaries on the backend.

### Paid monthly range

- Start: first day of the earliest included month at 00:00
- End: first day of the month after the current month at 00:00
- Use an inclusive start and exclusive end

### Weekly creation range

- Start: Monday at 00:00 for the earliest included week
- End: Monday at 00:00 after the current week
- Use an inclusive start and exclusive end

Use the existing application timezone policy consistently.

Store and query timestamps according to current backend conventions, typically UTC, while deriving calendar boundaries in the selected application timezone.

Add tests around month, year, daylight-saving, and week boundaries where applicable.

---

## Query performance

Add or verify indexes only if query analysis shows they are needed.

Potentially relevant composite indexes include:

- `(company_id, paid_at)`
- `(company_id, created_at)`
- `(company_id, status)`

Do not add indexes blindly.

If an Alembic migration is required:

- Keep it limited to justified index additions.
- Do not change unrelated tables.

---

## Error handling

Follow existing dashboard endpoint conventions.

Do not expose raw SQL, stack traces, or internal exception messages.

Chart aggregation failure should use the application’s established server error response.

If the current dashboard endpoint is all-or-nothing, a backend chart failure may fail the summary request. The frontend must still show the page shell and a clear dashboard-level retry state.

If the architecture already supports partial data, chart sections may fail independently.

Do not introduce complex partial-response semantics solely for this task.

---

# Frontend Requirements

## Component boundaries

Use meaningful components without over-componentizing.

Recommended structure:

- `DashboardChartsSection`
- `PaidInvoiceTotalsChart`
- `InvoiceCreationVolumeChart`
- `InvoiceStatusDistributionChart`
- `ChartCard`
- `ChartLoadingState`
- `ChartEmptyState`
- `ChartErrorState`
- `AccessibleChartSummary`

Follow current repository naming and folder conventions.

Do not create separate components for every axis label, tooltip line, or tiny presentational fragment.

---

## ECharts integration

Use Apache ECharts through `echarts-for-react` or another small React wrapper.

Requirements:

- ECharts code must execute only in client components.
- Do not make the entire dashboard page a client component solely because charts require the DOM.
- Keep server-rendered dashboard data flow where the existing architecture supports it.
- Pass serialized chart data into client chart components.
- Avoid importing browser-only ECharts code during server rendering.
- Use dynamic import with server-side rendering disabled if required by the selected wrapper.
- Ensure the chart renders only after a browser DOM is available.
- Do not suppress hydration warnings as a substitute for correct integration.

---

## Resize behavior

Charts must resize when:

- The browser window changes width.
- The sidebar changes available content width.
- A responsive dashboard grid changes columns.
- The chart card changes size.

Use the ECharts resize API through:

- The selected wrapper’s automatic resize support, or
- A `ResizeObserver` attached to the chart container

Do not rely only on global window resize events if the app shell can resize without a window resize.

Clean up observers and chart instances on unmount.

---

## Chart configuration standards

Use shared chart option helpers for:

- Typography
- Grid spacing
- Axis labels
- Tooltip formatting
- Status colors
- Currency formatting
- Empty-series handling

Do not duplicate large ECharts option objects across components.

Keep configurations explicit enough to remain maintainable.

Disable or avoid:

- Chart animations
- Data zoom controls
- Toolbox controls
- Brush selection
- 3D effects
- Gradient fills
- Decorative background patterns
- Auto-rotating labels
- Unnecessary legends

Set animation off for the dashboard charts.

---

## Data formatting

Reuse existing application utilities for:

- Currency
- Dates
- Status labels
- Pluralization, where available

Do not create dashboard-only currency behavior that differs from summary cards or invoice tables.

Use exact currency values in tooltips.

Compact notation may be used on axes when necessary, such as `$12k`, but the full formatted value must remain available in:

- Tooltip
- Accessible text summary

---

## Accessible alternatives

Canvas charts are not sufficient on their own.

Each chart must include an accessible text alternative.

Preferred implementation:

- A visually hidden structured summary generated from the same chart data
- A short visible summary line where useful
- An accessible card title and description

Examples:

### Paid totals summary

`Paid invoice totals for the last 6 months: February 2026, $0 across 0 invoices; March 2026, $18,420 across 7 invoices; ...`

### Invoice creation summary

`Invoice creation for the last 12 weeks: week of June 15, 4 invoices; week of June 22, 2 invoices; ...`

### Status summary

`Current invoice statuses: 5 unpaid invoices totaling $12,740; 2 draft invoices totaling $3,800; 11 paid invoices totaling $28,400.`

Do not hide critical meaning exclusively inside hover tooltips.

Tooltips should also be triggerable through the chart library’s keyboard-accessibility support where practical.

If reliable keyboard interaction is not feasible, the text summary is mandatory.

---

## No-company state

When the authenticated user has no company:

- Render only the existing company-required dashboard state.
- Do not render chart cards.
- Do not request chart data from company-scoped aggregation queries unless the existing endpoint handles this internally without unnecessary work.
- Do not show chart skeletons.
- Do not show zero charts.

The existing company-required behavior remains the source of truth.

---

## Dashboard duplication control

The chart section must not duplicate existing metrics without additional value.

- Paid totals over time complements the `Paid this month` metric.
- Creation volume complements the `Total invoices` metric.
- Status distribution may replace the current status breakdown.

Do not add a second unpaid-total card, paid-total card, or status list beside equivalent existing content.

---

# Design Requirements

## Visual direction

The charts must match Toro’s current quiet operational interface.

Use:

- Dark text around `#161616`
- Card background around `#FAFAFA`
- Neutral borders around `#E5E5E5`
- Inter font
- Small-to-medium corner radii
- Existing dashboard card spacing and header patterns

Do not introduce:

- Gradients
- Glows
- Drop shadows stronger than existing cards
- Decorative illustrations
- Marketing copy
- Large chart titles
- Oversized empty areas
- Excessive labels
- Visual effects

---

## Color rules

Use neutral colors first.

Recommended chart usage:

### Paid totals

- Use a restrained green aligned with the existing Paid status badge.
- Do not use bright neon green.

### Invoice creation

- Use a neutral dark gray or Toro yellow accent.
- If yellow is used, use it selectively for bars and keep axes neutral.
- Ensure sufficient contrast against `#FAFAFA`.

### Status distribution

- Paid: green
- Unpaid: amber or yellow
- Draft: neutral gray

Do not use more colors than the data requires.

Do not use color alone to communicate the status; always show labels and values.

---

## Typography

Use the existing Inter font through inherited app styles.

Recommended hierarchy:

- Chart title: same style as existing dashboard section headings
- Supporting text: muted product text
- Axis labels: compact but readable
- Tooltip title: medium emphasis
- Tooltip values: tabular numerals where available

Do not use display typography.

---

## Card structure

Each chart card should include:

1. Header
   - Title
   - Supporting text
   - Optional existing-route action
2. Chart area
3. Accessible summary
4. Optional footer only when an existing action is useful

Do not place cards inside cards.

Do not add decorative icon badges unless they are already part of the dashboard section-header language.

---

# Loading, Empty, and Error States

## Loading

While chart data loads:

- Preserve the chart card’s final dimensions.
- Show restrained skeleton blocks.
- Avoid layout shift.
- Do not render ECharts with incomplete data.
- Do not show fake placeholder values.

## Empty

Use chart-specific empty states defined above.

Empty states must:

- Explain why the chart is empty.
- Avoid treating zero activity as an error.
- Provide an existing-route action only when useful.
- Remain compact.

## Error

Use section-level errors where the architecture permits.

Errors must:

- Use plain language.
- Avoid raw backend messages.
- Offer retry when supported.
- Preserve other dashboard content.

---

# Testing Requirements

## Backend tests

Add tests using the current FastAPI and database test patterns.

### Authentication and company scoping

Verify:

- Unauthenticated requests are rejected.
- A user without a company receives the existing company-required behavior.
- A user cannot receive another company’s chart data.
- Aggregates include only invoices for the authenticated company.

### Paid totals

Verify:

- Only `Paid` invoices are included.
- `paid_at` is used for monthly grouping.
- Paid invoices with null `paid_at` are excluded or handled according to existing business rules.
- Draft and Unpaid invoices are excluded.
- Month start is inclusive.
- Next-month boundary is exclusive.
- Missing months are returned as zero buckets.
- Year transitions are correct.
- Decimal sums remain exact.
- The current month is included.

### Invoice creation volume

Verify:

- All statuses are included.
- `created_at` is used.
- Week boundaries start on Monday.
- Range start is inclusive.
- Range end is exclusive.
- Missing weeks are returned as zero buckets.
- Exactly 12 buckets are returned.
- Invoices from other companies are excluded.

### Status distribution

Verify:

- Paid, Unpaid, and Draft are mapped correctly.
- Counts are correct.
- Amount sums are exact.
- Missing statuses return zero values.
- A company with no invoices returns a valid zero-data result.
- Unknown enum values are not silently misclassified.

### Currency

Verify:

- Different currencies are not combined unless a single company currency is enforced.
- No binary floating-point errors appear in serialized values.

### Query behavior

Where test tooling allows, validate that:

- Aggregations are performed in SQL.
- Queries do not load all invoice records.
- The implementation does not issue one query per bucket.

---

## Frontend tests and validation

Follow the existing frontend test setup.

### Rendering

Verify:

- Users with a company and valid data see all three charts.
- Users without a company see no chart section.
- The existing company-required state remains unchanged.
- The status chart replaces duplicate status breakdown content where intended.
- Titles and supporting text match the specification.

### Loading

Verify:

- Skeletons render at stable card heights.
- ECharts does not initialize with unavailable data.
- No hydration warning is produced.

### Empty states

Verify:

- Paid totals empty state appears for zero paid activity.
- Creation-volume empty state appears for zero created invoices.
- Status-distribution empty state appears when the company has no invoices.
- No fake bars are rendered.
- Existing-route actions point to valid routes.

### Error states

Verify:

- Each chart shows the correct inline error.
- Retry behavior works where supported.
- Failure of one chart does not hide unrelated dashboard sections when partial rendering is supported.

### Data mapping

Verify:

- Paid totals use backend monthly buckets in order.
- Creation-volume buckets remain chronological.
- Status order is Unpaid, Draft, Paid.
- Tooltip values use the existing currency formatter.
- Zero values are rendered correctly.
- Singular and plural invoice labels are correct.

### Responsive validation

At minimum, validate representative widths:

- Wide desktop
- Tablet
- Standard mobile
- Narrow mobile

Confirm:

- No horizontal page overflow
- No chart canvas overflow
- No clipped titles
- No overlapping axis labels
- Cards stack in the required order
- Tooltips stay within the viewport
- Chart instances resize when containers change width

### Accessibility

Verify:

- Every chart card has an accessible title.
- Every chart includes a text summary.
- Chart meaning remains available without hover.
- Status is not communicated through color alone.
- Empty and error states are announced meaningfully.
- Decorative chart elements are not exposed as noisy accessibility content.

---

# Implementation Sequence for Codex

Implement in this order:

1. Inspect the existing dashboard response model, endpoint, service, invoice enum, amount types, timezone policy, and frontend data-fetching pattern.
2. Confirm whether Toro enforces a single currency per company.
3. Add backend response models for chart data.
4. Add efficient company-scoped aggregate queries.
5. Add zero-filled monthly, weekly, and status buckets.
6. Extend the existing dashboard summary response.
7. Add backend tests for scoping, date boundaries, status logic, zero data, and decimal accuracy.
8. Add a reusable client-only ECharts wrapper that is safe with Next.js App Router.
9. Add shared chart formatting and option helpers.
10. Build the three chart cards.
11. Add loading, empty, error, and accessible text-summary states.
12. Insert the chart section after summary metrics.
13. Remove or replace any duplicate existing invoice-status breakdown.
14. Validate desktop, tablet, and mobile resizing.
15. Add frontend tests or documented manual validation according to the current project setup.

Do not begin by adding placeholder charts. Build the backend contract and real data flow first.

---

# Acceptance Criteria

The dashboard charts implementation is complete when:

1. The dashboard shows no more than three charts.
2. The implemented charts are:
   - Paid invoice totals over the last six calendar months
   - Invoice creation volume over the last 12 calendar weeks
   - Current invoice status distribution
3. All chart data is real and scoped to the authenticated user’s company.
4. Paid totals use `paid_at`.
5. Invoice creation volume uses `created_at`.
6. Status distribution uses the actual Draft, Unpaid, and Paid statuses.
7. Money aggregation preserves decimal accuracy.
8. Missing periods and statuses return explicit zero buckets.
9. No unbounded invoice histories are sent to the browser.
10. No pie, donut, animated, decorative, forecast, aging, or fake analytics chart is added.
11. The chart section fits the existing Toro dashboard layout and design language.
12. Charts resize correctly without horizontal overflow.
13. Users without a company see only the existing company-required dashboard state and no charts.
14. Loading, empty, and error states are implemented.
15. Every chart has a meaningful text alternative.
16. Existing routes, auth, app shell, invoice flows, company settings, and account settings remain unchanged.
17. The existing status breakdown is not duplicated when the new status chart is present.
18. Backend and frontend validation covers company scoping, date boundaries, status mapping, zero-data behavior, responsiveness, and accessibility.

---

# Final Scope Reminder

This task is a focused dashboard enhancement, not an analytics platform.

The implementation should help a carrier or back-office user quickly understand:

- Recorded paid invoice activity
- Invoice creation workload
- Current invoice status mix

Keep the result compact, accurate, company-scoped, accessible, and visually consistent with Toro.
