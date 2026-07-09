# Trucking Invoice SaaS -- MVP UX Plan

## Goal

Build the simplest possible SaaS for trucking companies that
automatically generates invoices from uploaded documents.

**The priority is UX and interface design, not AI extraction.**

------------------------------------------------------------------------

# IMPORTANT (Development Note)

**Do NOT use real OCR, AI extraction, or document parsing yet.**

For this stage of development:

-   Uploads should be accepted normally.
-   The application should **NOT read or extract actual data** from the
    uploaded files.
-   Instead, after clicking **Generate Invoice**, populate the review
    form with **mock/example values**.
-   The uploaded files only exist to simulate the future workflow.

Example values:

-   Broker: ABC Logistics
-   Load #: 123456
-   Pickup: Chicago, IL
-   Delivery: Dallas, TX
-   Pickup Date: July 10, 2026
-   Delivery Date: July 12, 2026
-   Rate: \$2,350.00
-   Invoice #: INV-1001

This allows the interface and user experience to be built and refined
before implementing OCR and AI extraction.

------------------------------------------------------------------------

# Sidebar

-   Dashboard
-   Invoices
-   Create Invoice
-   Company
-   Account

------------------------------------------------------------------------

# Create Invoice Flow

## Step 1 -- Upload Documents

Display two upload cards side by side.

### Bill of Lading (BOL)

-   Drag & Drop
-   Browse Files
-   Accepted: PDF, JPG, PNG

### Rate Confirmation

-   Drag & Drop
-   Browse Files
-   Accepted: PDF, JPG, PNG

Primary button:

**Generate Invoice**

The button remains disabled until both documents are uploaded.

If one file is missing, display:

> Please upload both the Bill of Lading and the Rate Confirmation.

------------------------------------------------------------------------

## Step 2 -- Processing

After clicking **Generate Invoice**, show a short loading screen.

Example:

-   Uploading documents...
-   Processing...
-   Preparing draft invoice...

No real OCR or AI should run yet.

------------------------------------------------------------------------

## Step 3 -- Review Draft Invoice

Populate the form using mock data.

Editable sections:

### Bill To

-   Broker Name
-   Address
-   Email

### Load Information

-   Load Number
-   Pickup
-   Delivery
-   Pickup Date
-   Delivery Date

### Charges

-   Linehaul
-   Additional Charges
-   Total

### Payment Terms

-   Due Date
-   Payment Terms

All fields should be editable.

Primary button:

**Create Invoice**

------------------------------------------------------------------------

## Step 4 -- Invoice Created

Navigate to the Invoice Details page.

Actions:

-   Download PDF
-   Send Email
-   Mark as Paid

------------------------------------------------------------------------

# Dashboard

Simple summary cards:

-   Create Invoice
-   Unpaid Invoices
-   Paid This Month
-   Recent Invoices

------------------------------------------------------------------------

# Invoices

Simple table.

Columns:

-   Invoice \#
-   Customer
-   Load \#
-   Amount
-   Status
-   Date
-   Action

Statuses:

-   Draft
-   Unpaid
-   Paid

------------------------------------------------------------------------

# Company

Simple settings page.

-   Company Information
-   Invoice Settings
-   Members

Roles for MVP:

-   Owner
-   Member

------------------------------------------------------------------------

# Design Principles

-   Minimize clicks.
-   Never ask users to configure anything before they receive value.
-   Keep every page clean and focused.
-   Make the workflow feel like:
    1.  Upload documents
    2.  Review draft
    3.  Create invoice
-   Hide technical details like OCR or AI from the user.
-   Optimize for speed and clarity over feature count.

The product should feel effortless: upload two documents, review a draft
invoice, and finish in under a minute.
