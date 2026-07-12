# Toro Public Website Implementation Specification

## Overview

Implement the public-facing marketing website for **Toro**, a trucking invoicing SaaS product.

The public website must explain the product clearly, build trust with carriers and small fleets, and convert qualified visitors into account creation.

This task covers only the public website and its connection into existing authentication and product flows.

Do not redesign or restructure the authenticated application.

Existing protected application routes include:

- `/app/dashboard`
- `/app/invoices`
- `/app/create-invoice`
- `/app/company`
- `/app/account`

Existing authentication routes and flows already support:

- Registration
- Login
- Email verification
- Password reset
- Account creation
- Company creation after signup

The public website must route users into those existing flows rather than recreating them.

---

# Product Summary

Toro is a trucking invoicing SaaS focused on helping carriers create professional invoices from shipping paperwork such as bills of lading, rate confirmations, and supporting shipment documents.

Toro helps small carriers and back-office teams reduce repetitive invoice administration, maintain cleaner invoice workflows, and gain visibility into draft, unpaid, and paid invoices.

The website must present Toro as:

- Operational software
- Built for trucking businesses
- Fast and practical
- Credible for everyday use
- Premium without feeling corporate or inflated
- Focused on invoice workflow rather than broad fleet management

Do not position Toro as:

- A dispatch platform
- A fleet management system
- An accounting suite
- A payment processor
- A load board
- A telematics product
- An OCR or AI platform unless that capability is currently implemented and exposed
- An enterprise analytics platform

---

# Site Goals

## Primary goals

1. Explain what Toro does within the first screen.
2. Make it clear that Toro is built for trucking invoicing.
3. Show how shipment paperwork becomes a professional invoice.
4. Communicate practical operational value.
5. Build enough trust for a carrier or small fleet to create an account.
6. Route users cleanly into existing signup and login flows.
7. Establish a public brand consistent with the existing app.

## Secondary goals

- Help visitors understand the current product scope.
- Address common questions before signup.
- Provide a credible pricing and company presence.
- Support sales or product inquiries.
- Create a scalable public-site structure for future product pages.

## Non-goals

- Broad content marketing
- Blog platform
- Customer community
- Partner marketplace
- Public API documentation
- Enterprise procurement portal
- Full support knowledge base
- Long-form thought leadership
- Generic trucking news content

---

# Target Audience

## Primary audience

### Owner-operators

Users who manage invoicing themselves and need to reduce paperwork time.

Typical needs:

- Create invoices faster
- Avoid repetitive data entry
- Keep invoice records organized
- Track draft, unpaid, and paid invoices
- Present a professional billing process

### Small carriers

Small trucking companies with a few trucks and limited back-office staff.

Typical needs:

- Standardize invoice creation
- Reduce administrative overhead
- Organize recent invoices
- Track unpaid balances
- Keep company and remittance details consistent

### Back-office and billing staff

Users responsible for preparing and managing invoices.

Typical needs:

- Turn shipment paperwork into invoices
- Review invoice details before sending
- Track invoice status
- Download invoice PDFs
- Maintain company billing settings

## Secondary audience

- Small fleet owners evaluating billing software
- Operations managers
- Administrative assistants
- Independent billing staff working directly for carriers

## Audience exclusions

Do not design messaging around:

- Large enterprise transportation procurement teams
- Freight brokers as the primary customer
- Shippers
- Drivers seeking route or load tools
- Accounting departments requiring full ERP functionality
- Fleet maintenance teams

---

# Positioning and Messaging

## Core positioning statement

Toro helps trucking companies turn shipment paperwork into professional invoices and keep invoice work organized in one operational workspace.

## Core value themes

### Speed

Reduce the time required to prepare invoices.

### Clarity

Keep draft, unpaid, and paid invoices easy to review.

### Professionalism

Create consistent, presentable invoices using company and remittance information.

### Operational focus

Keep invoice work close to the daily trucking workflow.

### Lower administrative friction

Reduce repetitive back-office effort without introducing a large or complicated system.

## Voice

Use a voice that is:

- Direct
- Calm
- Confident
- Practical
- Operational
- Respectful of the user’s time

## Avoid

Do not use:

- Vague startup slogans
- Unverifiable savings claims
- “Revolutionary”
- “Game-changing”
- “All-in-one”
- “AI-powered” unless currently and visibly true
- “Transform your business”
- Excessive trucking slang
- Aggressive sales language

## Preferred messaging examples

- Create professional trucking invoices from shipment paperwork.
- Keep draft, unpaid, and paid invoices organized.
- Review invoice details before sending.
- Keep company and remittance information consistent.
- Spend less time rebuilding invoices from documents.

Do not use unsupported quantified claims such as “save 10 hours per week” or “get paid 40% faster.”

---

# Information Architecture

Implement the following public pages:

1. Homepage
2. Features
3. Pricing
4. Use Cases
5. About
6. FAQ
7. Contact
8. Support
9. Privacy Policy
10. Terms of Service

Recommended routes:

- `/`
- `/features`
- `/pricing`
- `/use-cases`
- `/about`
- `/faq`
- `/contact`
- `/support`
- `/privacy`
- `/terms`

Use the existing public landing route at `/`.

Do not place marketing pages under `/app`.

Do not create new authenticated routes.

A blog, resource center, testimonials page, integrations page, and customer stories section are out of scope for the first release because Toro does not yet have enough verified content to support them credibly.

---

# Global Navigation

## Desktop navigation

Use a compact public navigation.

### Left

- Toro wordmark or existing logo
- Link to `/`

### Primary links

- Features
- Use Cases
- Pricing
- FAQ
- About

### Right actions

- `Log in`
- `Create account`

Use the app’s actual authentication routes. Based on the current route structure:

- Log in: `/app/login`
- Create account: `/app/register`

### Visual hierarchy

- `Log in`: text link or secondary button
- `Create account`: primary yellow CTA

Do not add multiple competing primary actions.

## Mobile navigation

Use a compact menu trigger.

Include:

- Features
- Use Cases
- Pricing
- FAQ
- About
- Contact
- Log in
- Create account

The signup CTA must remain visually prominent.

Do not create a mega menu.

---

# Global Footer

Use one consistent footer across public pages.

## Footer structure

### Brand block

- Toro logo or wordmark
- Short product description

Recommended description:

`Trucking invoicing software built for carriers and small fleets.`

### Product links

- Features
- Pricing
- Use Cases
- FAQ

### Company links

- About
- Contact

### Account links

- Log in
- Create account
- Support

### Legal links

- Privacy Policy
- Terms of Service

### Bottom row

- Copyright
- Current year
- Toro product name
- Optional legal company name if available

Do not include placeholder social links, addresses, phone numbers, certifications, awards, or badges.

---

# Reusable Public-Site Components

## Public page shell

Include:

- Global navigation
- Main content
- Global footer
- Consistent max-width container
- Consistent horizontal padding
- White page background

## Page header

For non-homepage pages:

- Optional eyebrow label
- Clear H1
- One concise supporting paragraph
- Optional CTA group

Do not use oversized empty hero sections.

## CTA group

Default pattern:

- Primary: `Create account`
- Secondary: context-specific action such as `See features`, `Contact Toro`, or `Log in`

## Product screenshot frame

Use for real product visuals.

Style:

- Subtle neutral border
- Restrained radius
- White or near-white surface
- Optional black structural frame
- Minimal shadow
- No decorative browser chrome unless it improves orientation
- No floating gradient shapes

Screenshots must show actual Toro UI or implementation placeholders that are replaced before production.

## Feature row

Reusable layout:

- Small icon or label
- Feature title
- Operational explanation
- Product screenshot or UI crop

Alternate image and text alignment only when it improves page rhythm.

## Feature card

Use sparingly.

Each card may contain:

- Icon
- Short heading
- One paragraph
- Optional page link

Do not create a large wall of generic benefit cards.

## Workflow step

Use numbered steps for:

1. Add shipment paperwork
2. Review invoice information
3. Finalize and manage the invoice

Do not imply unsupported automatic parsing.

## Trust strip

Use only factual trust signals.

Acceptable themes:

- Built for carriers and small fleets
- Secure account access
- Company-scoped invoice data
- Professional invoice PDFs
- Review before finalizing

Do not add fake customer logos, ratings, awards, certifications, or customer counts.

## FAQ accordion

Use one accessible accordion pattern.

Requirements:

- Keyboard accessible
- Clear expanded state
- Minimal animation
- Server-rendered question and answer content where practical

## Final CTA section

Use on major pages.

Structure:

- Strong heading
- One practical supporting sentence
- Primary signup CTA
- Secondary login or contact action when appropriate

Keep it compact.

---

# Homepage Specification

## Purpose

Explain Toro quickly and move qualified visitors toward signup.

The homepage must communicate:

- Trucking invoicing
- Shipment-paperwork workflow
- Professional invoice creation
- Invoice status visibility
- Operational speed and clarity

## Recommended section order

1. Global navigation
2. Hero
3. Product workflow
4. Product interface preview
5. Core operational benefits
6. Invoice visibility
7. Who Toro is for
8. Trust and product principles
9. FAQ preview
10. Final CTA
11. Footer

## Homepage Hero

### Above-the-fold requirements

The first viewport must include:

- Clear trucking-invoicing headline
- Specific supporting text
- Primary signup CTA
- Secondary product-exploration CTA
- Product UI preview
- No vague branding-only content

### Headline direction

Use wording similar to:

`Create trucking invoices from shipment paperwork—without rebuilding every detail by hand.`

Codex may refine the wording, but the meaning must remain specific.

### Supporting text

Explain that Toro helps carriers and small fleets:

- Prepare invoices
- Review details
- Track invoice status
- Keep billing information organized

Keep this to two or three short lines.

### Primary CTA

`Create account`

Link to `/app/register`.

### Secondary CTA

`See how Toro works`

Scroll to the workflow section or link to `/features`.

### Product visual

Preferred visual:

- Dashboard screenshot with summary metrics and recent invoices
- Create-invoice workflow crop
- Invoice review view

Do not use stock photography as the main hero visual.

Do not create a fictional analytics interface.

### Layout

Desktop:

- Two columns
- Copy and CTAs on the left
- Product preview on the right

Mobile:

- Copy first
- CTAs stacked or wrapped
- Product preview below
- No horizontal overflow

Avoid excessive hero height.

## Product Workflow Section

### Title

`From shipment paperwork to a finished invoice`

### Steps

#### 1. Add shipment documents

Communicate that users start from existing trucking paperwork.

Do not claim unsupported automatic extraction.

#### 2. Review invoice information

Show that users review and confirm invoice details.

#### 3. Finalize and manage the invoice

Show current capabilities:

- Create the invoice
- Download the PDF
- Use the supported send flow
- Track status

### UI pattern

Use three horizontal steps on desktop and stacked steps on mobile.

Use product UI crops where available.

Do not use cartoon illustrations.

## Product Interface Preview

### Purpose

Show that Toro is real operational software.

### Recommended views

- Dashboard
- Invoice list
- Invoice review

### Supporting content

Explain:

- Recent invoice visibility
- Draft, unpaid, and paid statuses
- Clear next actions
- Operational organization

### Requirements

- Use the real app structure
- Preserve the app palette
- Avoid unreadably tiny screenshots
- Add brief callouts only when necessary
- Do not surround screenshots with decorative floating cards

## Core Benefits

### Recommended benefits

#### Faster invoice preparation

Reduce repetitive invoice setup from shipment paperwork.

#### Cleaner invoice workflow

Keep invoice creation, review, and management in one place.

#### Better visibility

See draft, unpaid, and paid invoice activity.

#### Consistent company information

Use saved company and remittance settings across invoice work.

### Pattern

Use a two-column feature grid or four compact feature rows.

Do not use a large generic icon-card wall.

## Invoice Visibility Section

### Purpose

Show that Toro is more than an invoice form.

### Content

Highlight current dashboard capabilities:

- Unpaid total
- Paid this month
- Draft invoices
- Recent invoice activity
- Invoice status breakdown
- Operational charts if already implemented

### Visual

Use a real dashboard screenshot or accurate current-product mock.

### CTA

`Explore dashboard features`

Link to `/features`.

## Audience Section

### Title

`Built for the people running trucking operations`

### Groups

- Owner-operators
- Small carriers
- Billing and back-office teams

Explain one practical use case for each.

Do not create fictional personas or testimonials.

## Trust Section

### Content themes

- Secure account access
- Company-scoped invoice data
- Review before finalizing
- Consistent invoice records
- Built around carrier workflows

Use a compact checklist or structured text layout.

Do not add fake social proof.

## FAQ Preview

Show four to six questions:

- What does Toro help me do?
- Who is Toro built for?
- Can I create a company after signing up?
- Can I track unpaid and paid invoices?
- Can I download invoice PDFs?
- Do I need to install anything?

Link to `/faq`.

## Final CTA

### Heading direction

`Spend less time rebuilding invoices from paperwork.`

### Supporting text

Explain that users create a personal account first and set up their company inside Toro.

### Actions

- `Create account`
- `Log in`

Do not include fake urgency or scarcity.

---

# Features Page Specification

## Purpose

Explain current product capabilities in detail.

## Section order

1. Page header
2. Core workflow overview
3. Create-invoice workflow
4. Invoice management
5. Dashboard visibility
6. Company setup
7. Account and access
8. Product scope
9. Final CTA

## Page Header

### H1

`Trucking invoice workflow, organized from start to finish`

### Supporting text

Explain invoice preparation, review, status tracking, and company billing consistency.

### Actions

- Create account
- Log in

## Create-Invoice Workflow

Explain the current steps exactly:

1. Upload documents
2. Process information
3. Review invoice

Show:

- Step progress UI
- Upload state
- Processing state
- Review state
- Final invoice state

Do not claim:

- Error-free parsing
- Fully automatic extraction
- Zero-review invoicing
- AI document understanding unless implemented and verified

## Invoice Management

Explain existing capabilities:

- Invoice list
- Invoice detail
- Delete
- Send flow
- Mark paid
- PDF download
- Status visibility

Use a real interface screenshot.

## Dashboard Visibility

Explain:

- Unpaid total
- Paid this month
- Total invoices
- Draft invoices
- Recent invoices
- Status breakdown
- Operational charts if implemented

Do not describe forecasting or accounting analytics.

## Company Settings

Explain:

- Company profile
- Billing and remittance
- Invoice settings
- Team or members list

Do not imply advanced permissions unless they exist.

## Account Settings

Explain:

- User profile
- Password management
- Notification preferences

Keep this section brief.

## Product Scope

State clearly that Toro focuses on invoice administration and does not replace:

- Dispatch systems
- Accounting software
- Fleet management platforms

This section should build trust by setting accurate expectations.

---

# Pricing Page Specification

## Purpose

Explain pricing clearly without inventing plans or billing behavior.

## Critical rule

Do not invent:

- Prices
- Billing intervals
- Trials
- Plan names
- Usage limits
- Discounts
- Cancellation terms

Use one of the following states.

## State A: Pricing Is Defined

When real pricing exists in repository configuration:

- Show exact plan names
- Show exact prices
- Show actual billing interval
- Show actual included features
- Show actual trial or cancellation terms
- Route CTA to signup

Use one central typed pricing configuration.

## State B: Pricing Is Not Defined

Use a transparent early-access structure.

Recommended heading:

`Simple pricing for trucking teams`

Recommended message:

`Toro is currently onboarding early users. Create an account or contact us for current access details.`

Actions:

- `Create account`
- `Contact Toro`

Do not display `$0`, placeholder tiers, fake discounts, or empty “coming soon” cards.

## Layout

Prefer:

- One primary access or pricing card
- Clear capability list
- Short pricing FAQ

Avoid:

- Three arbitrary SaaS tiers
- Fake “Most popular” badges
- Enterprise-plan theater
- Dense comparison tables

## Pricing FAQ

Include only questions with verified answers.

Possible topics:

- Free trial
- Cancellation
- Per-user versus per-company billing
- Invoice limits
- Team members

Omit any question whose answer is not defined.

---

# Use Cases Page Specification

## Purpose

Explain how Toro fits different small trucking operations.

## Route

`/use-cases`

## Use cases

### Owner-operators

Focus on:

- Preparing invoices personally
- Keeping records organized
- Reducing repeated billing setup

### Small carriers

Focus on:

- Consistent invoicing
- Shared company details
- Invoice visibility
- Back-office efficiency

### Billing and administrative teams

Focus on:

- Reviewing invoice information
- Managing status
- Downloading and sending invoices
- Reducing fragmented paperwork handling

### Small fleets

Focus on:

- Central invoice visibility
- Consistent billing process
- Company-level settings

Use one structured page rather than separate audience routes.

## Section pattern

Each use case should include:

- Audience label
- Operational problem
- How Toro helps
- Relevant product screenshot
- Signup CTA

Do not invent testimonials.

---

# About Page Specification

## Purpose

Explain why Toro exists and establish a credible product philosophy.

## Section order

1. Page header
2. Mission
3. Problem
4. Product principles
5. Who Toro is built for
6. Current focus
7. Contact CTA

## Mission

Position Toro around reducing invoice administration for trucking businesses.

Do not make broad claims about transforming transportation.

## Problem

Explain:

- Shipment documents arrive in different forms
- Invoice creation is repetitive
- Small teams often manage billing manually
- Status visibility can become fragmented

Keep the content practical.

## Product principles

Recommended principles:

- Operational clarity
- Focused workflows
- Accurate user review
- Professional output
- Respect for small teams
- Build only what is useful

## Company details

Only include real:

- Founder information
- Location
- Contact details
- Company registration details

Do not fabricate a team, office, founder story, or biography.

When details are unavailable, keep the page product-focused.

---

# FAQ Page Specification

## Purpose

Answer product, conversion, and account questions.

## Categories

### Product basics

- What is Toro?
- Who is Toro for?
- Is Toro only for trucking companies?
- What invoice statuses does Toro support?

### Invoice workflow

- How do I create an invoice?
- Can I review invoice details before finalizing?
- Can I download invoice PDFs?
- Can I mark invoices as paid?
- Can I delete an invoice?

### Accounts and companies

- Can I register before creating a company?
- How do I create a company?
- Can company information be updated later?
- Can I manage remittance details?

### Access and technical

- Is Toro browser-based?
- Do I need to install software?
- How do I reset my password?
- How do I verify my email?

### Pricing and support

Include only questions with defined answers.

## Interaction

Use accessible accordions.

Keep question and answer text indexable in rendered HTML.

---

# Contact Page Specification

## Purpose

Provide a credible contact path.

## Layout

Desktop:

- Left: title, description, inquiry guidance, real contact details if available
- Right: contact form

Mobile:

- Stack content
- Preserve clear form hierarchy

## Form fields

- Name
- Email
- Company name
- Fleet or company size, optional
- Topic
- Message

Topic options:

- Product question
- Pricing
- Account help
- Partnership
- Other

Do not collect passwords, financial details, invoice documents, or sensitive shipment information.

## Form behavior

Use:

- React Hook Form
- Zod
- Existing UI primitives

Requirements:

- Client validation
- Server validation
- Accessible field errors
- Loading state
- Success state
- Error state
- Duplicate-submission prevention
- Spam protection when an existing pattern is available

Do not ship a form that silently discards submissions.

If no backend exists, add a minimal scoped contact endpoint or use an existing configured email integration.

---

# Support Page Specification

## Route

`/support`

## Purpose

Provide a simple public support entry point.

## Content

- Login help
- Password reset link
- Email verification guidance
- Account access help
- Company setup guidance
- Contact support link

## Actions

- Log in
- Forgot password
- Contact Toro

Do not build a full documentation center.

---

# Privacy Policy Page

## Route

`/privacy`

## Requirements

Use a readable legal layout:

- Page title
- Last-updated date
- Optional table of contents
- Constrained text width
- Clear heading hierarchy

Use approved legal copy.

If legal copy is unavailable:

- Build the page structure
- Use clearly marked development placeholders
- Do not ship generated legal text as final policy

---

# Terms of Service Page

## Route

`/terms`

Use the same legal layout as the Privacy Policy page.

Do not fabricate binding legal terms.

---

# CTA Strategy

## Primary CTA

Use:

`Create account`

Route:

`/app/register`

## Secondary CTA options

- `Log in`
- `See how Toro works`
- `Explore features`
- `Contact Toro`

## Placement

The primary signup CTA should appear in:

- Global navigation
- Homepage hero
- Homepage final CTA
- Features header
- Features final CTA
- Pricing page
- Use Cases page
- About final section

Do not place a primary CTA after every small section.

## Wording

Use consistent wording.

Avoid:

- Start crushing invoices
- Transform your workflow
- Get started instantly
- Book a demo unless a real demo process exists

---

# Authentication and App Flow Integration

## Logged-out visitors

### Create account

Route to `/app/register`.

Preserve the existing flow:

1. Personal account registration
2. Email verification
3. Login or session continuation
4. Company creation inside the app
5. Dashboard access

Do not add company fields to public registration unless the existing auth flow already supports them.

### Log in

Route to `/app/login`.

### Password reset

Support and login pages may link to the existing forgot-password route.

## Authenticated visitors

When session detection is already reliable:

- Replace `Create account` with `Open dashboard`
- Link to `/app/dashboard`
- Hide `Log in`

Do not expose user or company data on public pages.

If session-aware navigation complicates public rendering, retain static login and signup links and rely on existing auth-route redirect behavior.

## Company membership

Do not check company membership on public pages.

The existing app remains responsible for the company-required state.

---

# Content Hierarchy

## Page hierarchy

Each public page should use:

1. One H1
2. One concise introduction
3. Primary action where relevant
4. Main product content
5. Supporting trust or FAQ content
6. Final CTA
7. Footer

## Section hierarchy

Each section should have:

- One clear purpose
- A direct heading
- Limited supporting copy
- Product visual or structured information when useful

Avoid repeating the same value proposition with different wording.

## Copy length

Recommended limits:

- Hero paragraph: 30–60 words
- Feature description: 30–80 words
- Card description: 15–40 words
- Section introduction: 20–60 words

Do not add large blocks of filler copy.

---

# Product Imagery

## Preferred visuals

Use actual product UI:

- Dashboard
- Create-invoice upload step
- Processing step
- Invoice review
- Invoice list
- Invoice detail
- Company settings
- Generated invoice PDF preview

## Photography

Photography is optional and secondary.

When used, prefer:

- Real trucking operations
- Cab, trailer, terminal, or back-office contexts
- Natural editorial photography
- Minimal staging

Avoid:

- Generic smiling office teams
- Futuristic trucks
- Busy highway hero backgrounds
- Cartoon trucks
- AI-generated imagery that misrepresents operations

## Screenshot preparation

Before production:

- Use sanitized demo data
- Remove personal data
- Use believable company and customer names
- Keep figures internally consistent
- Avoid exaggerated metrics

Do not use live customer data.

---

# Visual Direction

## Palette

Use:

- `#161616`
- `#FFD028`
- `#FFFFFF`
- `#FAFAFA`
- `#F5F5F5`
- `#EFEFEF`
- `#EAEAEA`

Use neutral gray for secondary text and borders.

## Yellow usage

Use yellow for:

- Primary CTAs
- Selected highlights
- Small product accents
- Active states

Do not use yellow as a repeated full-section background.

## Black usage

Use black for:

- Strong text
- Navigation framing where appropriate
- Footer
- Structural sections
- Product framing

Use full black sections sparingly.

## Typography

Use Inter.

Hierarchy:

- Strong compact H1
- Clear H2 headings
- Restrained body copy
- Small operational labels

Avoid oversized editorial typography.

## Radius

Use restrained radii:

- Small controls: 6–8px
- Cards: 8–12px
- Large screenshot frames: 10–14px

Do not use highly rounded or pill-shaped cards.

## Borders and shadows

Prefer:

- 1px neutral borders
- Minimal shadow
- No glassmorphism
- No glow effects

---

# Responsive Behavior

Follow the existing Tailwind breakpoint system.

## Desktop

- Centered max-width container
- Two-column hero
- Balanced copy and visual
- Multi-column features only when readable
- Compact navigation

## Tablet

- Reduce columns
- Stack complex feature rows
- Preserve screenshot readability
- Avoid cramped navigation

## Mobile

- Single-column content
- Copy before imagery
- Full-width or near-full-width primary CTA
- Compact spacing
- Screenshots within the viewport
- No horizontal overflow
- No tiny multi-column grids
- Stacked footer groups

## Screenshot behavior

On narrow screens:

- Crop intentionally inside bounded frames
- Preserve the important UI area
- Do not shrink full desktop screenshots until text becomes unreadable
- Use mobile-specific crops where helpful

---

# Interaction Guidance

## Navigation

- Use standard links
- Preserve keyboard focus
- Keep transitions immediate
- Sticky navigation is optional

## Buttons

Reuse existing button primitives where practical.

Support:

- Hover
- Active
- Focus
- Disabled
- Loading

Avoid excessive motion.

## Scrolling

Allowed:

- Normal document scrolling
- Anchor links
- Subtle reveal effects if already used

Do not add:

- Scroll hijacking
- Parallax
- Horizontal scroll sections
- Auto-playing carousels
- Complex staged animations

## Product previews

Do not make static screenshots appear interactive.

If clickable, open a larger preview or link to a relevant feature page.

---

# Accessibility Requirements

Implement:

- Semantic HTML
- One H1 per page
- Logical heading hierarchy
- Keyboard-accessible navigation
- Visible focus states
- Accessible mobile menu
- Sufficient contrast
- Meaningful alt text
- Empty alt text for decorative images
- Proper form labels
- Accessible form errors
- Reduced-motion support
- No meaning through color alone

Do not place essential text only inside images.

---

# SEO and Metadata

## Per-page metadata

Define:

- Unique title
- Unique description
- Canonical URL
- Open Graph title
- Open Graph description
- Open Graph image
- Twitter card metadata when relevant

## Title pattern

`[Page Topic] | Toro`

Homepage example:

`Trucking Invoicing Software | Toro`

## Structured data

Add only accurate schema.

Potentially appropriate:

- Organization
- SoftwareApplication
- FAQPage

Do not add reviews or ratings without real data.

## Indexing

Public pages should be indexable.

Do not change protected app indexing rules as part of this task.

---

# Performance Requirements

- Use Next.js image optimization
- Avoid large client bundles
- Server-render public content
- Use client components only for interactive elements
- Lazy-load below-the-fold visuals
- Reserve image dimensions
- Optimize screenshot and Open Graph assets
- Do not add a heavy animation library without need

Public pages must not depend on authenticated APIs for core rendering.

---

# Analytics

Do not add analytics unless a provider is already approved.

When analytics exists, track only useful conversion events:

- Navigation signup click
- Hero signup click
- Pricing signup click
- Contact form submission
- Login click

Do not send user, company, invoice, or message content to analytics.

---

# Alignment With Existing App

The public website must feel like the same product as the authenticated Toro app.

## Palette alignment

Use the same:

- Black: `#161616`
- Yellow: `#FFD028`
- White
- Light neutral surfaces and borders

Do not introduce a separate marketing palette.

## Structural alignment

Use:

- Restrained cards
- Clean white surfaces
- Strong black text
- Operational spacing
- Subtle borders
- Small-to-medium radii
- Consistent button treatments

The public site may use more open spacing than the app, but it must remain compact and purposeful.

## Product voice

Use the same direct and practical language as the app.

Do not promise a broader system than Toro delivers.

## Product visuals

Use screenshots and UI patterns derived from the actual application.

Do not create a fictional product interface.

## Conversion path

Lead users into:

- `/app/register`
- `/app/login`

After signup, preserve:

- Personal account first
- Email verification
- Company creation inside the app
- Dashboard and invoice workflows

Do not duplicate or bypass auth and company-membership logic.

---

# Implementation Notes for Codex

## Scope control

Modify only files required for:

- Public marketing routes
- Shared public layout
- Navigation
- Footer
- Public page sections
- Contact handling if needed
- Legal-page shells
- Metadata
- Public-site tests

Do not refactor protected app architecture.

## Reuse

Inspect and reuse:

- Existing logo
- Inter font setup
- Button primitives
- Form primitives
- Icons
- Color tokens
- Container utilities
- Auth routes
- Responsive navigation patterns
- Screenshot assets

Do not duplicate brand tokens unnecessarily.

## Layout separation

Keep public and authenticated layouts separate.

Public layout:

- Marketing navigation
- Marketing footer

Authenticated layout:

- Existing sidebar
- Existing app shell

Do not render marketing navigation inside protected pages.

## Content management

Use typed local data or components for the first release.

Do not add a CMS unless one already exists.

Centralize repeated items such as:

- Navigation links
- Footer links
- FAQ entries
- Features
- Use cases

## Contact form

When implemented:

- Follow current FastAPI patterns
- Validate with Pydantic
- Add basic abuse protection
- Return clear success and error responses
- Avoid unnecessary sensitive-data storage

## Legal content

Create routes and layouts.

Do not fabricate final legal text.

## Screenshots

Use sanitized assets.

When final screenshots are unavailable:

- Use clearly labeled local placeholders
- Make replacement straightforward
- Do not ship generic dashboard imagery as final content

---

# Testing Requirements

## Navigation

Verify:

- All public links resolve
- Logo links to `/`
- Signup uses `/app/register`
- Login uses `/app/login`
- Protected routes are not presented as marketing pages

## Homepage

Verify:

- Clear H1
- Signup CTA above the fold
- Product visual present
- Workflow section present
- Final CTA present

## Responsive behavior

Validate:

- Desktop
- Tablet
- Standard mobile
- Narrow mobile

Confirm:

- No horizontal overflow
- Mobile menu works
- CTAs remain visible
- Screenshots remain readable
- Footer stacks correctly

## Forms

Verify:

- Required validation
- Email validation
- Accessible errors
- Loading
- Success
- Server error
- Duplicate-submission prevention

## Accessibility

Verify:

- Keyboard navigation
- Focus order
- Mobile-menu focus management
- Accordion accessibility
- Form labels
- Heading hierarchy
- Contrast
- Reduced motion

## SEO

Verify:

- Unique metadata
- Canonical URLs
- Open Graph metadata
- Sitemap inclusion
- Public indexing
- No indexing regression for protected routes

---

# Acceptance Criteria

The public website is complete when:

1. All required public pages exist.
2. The homepage clearly communicates trucking invoicing above the fold.
3. The site uses Toro’s black, yellow, white, and neutral palette.
4. Product visuals reflect the actual app.
5. Signup and login route into existing auth flows.
6. Protected app architecture remains unchanged.
7. Unsupported capabilities are not advertised.
8. Pricing contains no invented plans or prices.
9. Contact submissions are handled reliably or the form is not shipped.
10. Legal routes exist without fabricated final legal commitments.
11. Navigation and footer are consistent.
12. The site is responsive and accessible.
13. Styling remains restrained and operational.
14. No purple gradients, cartoon illustrations, generic startup layouts, or excessive decoration are introduced.
15. The marketing site visually aligns with the Toro application.
16. The account-creation path is clear on every major page.
17. The implementation remains focused on carriers, small fleets, owner-operators, and back-office invoice workflows.

---

# Recommended First-Release Scope

Implement in this order:

1. Public layout
2. Navigation and footer
3. Homepage
4. Features
5. Pricing
6. Use Cases
7. FAQ
8. Contact
9. About
10. Support
11. Privacy and Terms shells
12. Metadata and sitemap
13. Accessibility and responsive validation

Do not add a blog, resource center, customer-logo wall, testimonial system, integrations directory, or CMS in the first release.

The final website should make Toro feel like a credible, focused trucking operations product that helps carriers create and manage invoices with less administrative friction.
