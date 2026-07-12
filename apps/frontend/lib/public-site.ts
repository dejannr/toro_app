import type { Metadata } from "next";

export const publicPrimaryNav = [
  { href: "/features", label: "Features" },
  { href: "/use-cases", label: "Use Cases" },
  { href: "/pricing", label: "Pricing" },
  { href: "/faq", label: "FAQ" },
  { href: "/about", label: "About" }
] as const;

export const footerGroups = [
  {
    title: "Product",
    links: [
      { href: "/features", label: "Features" },
      { href: "/pricing", label: "Pricing" },
      { href: "/use-cases", label: "Use Cases" },
      { href: "/faq", label: "FAQ" }
    ]
  },
  {
    title: "Company",
    links: [
      { href: "/about", label: "About" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    title: "Account",
    links: [
      { href: "/app/login", label: "Log in" },
      { href: "/app/register", label: "Create account" },
      { href: "/support", label: "Support" }
    ]
  },
  {
    title: "Legal",
    links: [
      { href: "/privacy", label: "Privacy Policy" },
      { href: "/terms", label: "Terms of Service" }
    ]
  }
] as const;

export const homepageFaqs = [
  {
    question: "What does Toro help me do?",
    answer:
      "Toro helps carriers and small fleets prepare professional invoices from shipment paperwork, review the details, and keep draft, unpaid, and paid invoices organized."
  },
  {
    question: "Who is Toro built for?",
    answer:
      "Toro is built for owner-operators, small carriers, and billing staff who need a focused invoicing workspace without adopting a full dispatch or accounting platform."
  },
  {
    question: "Can I create a company after signing up?",
    answer:
      "Yes. Registration starts with your personal access, and company setup follows after signup."
  },
  {
    question: "Can I track unpaid and paid invoices?",
    answer:
      "Yes. Toro already supports invoice status tracking so teams can separate draft, unpaid, and paid work."
  },
  {
    question: "Can I download invoice PDFs?",
    answer:
      "Yes. Generated invoices can be reviewed in Toro and downloaded as PDF files."
  },
  {
    question: "Do I need to install anything?",
    answer:
      "No. Toro is browser-based and runs without local software installation."
  }
] as const;

export const faqSections = [
  {
    title: "Product basics",
    items: [
      {
        question: "What is Toro?",
        answer:
          "Toro is trucking invoicing software focused on helping carriers create invoices from shipment paperwork and keep invoice work organized in one operational workspace."
      },
      {
        question: "Who is Toro for?",
        answer:
          "Toro is designed for owner-operators, small carriers, billing staff, and small fleet teams that need a focused invoicing workflow."
      },
      {
        question: "Is Toro only for trucking companies?",
        answer:
          "Toro is intentionally positioned around trucking invoice workflows. It is not being marketed as a generic invoicing tool for unrelated industries."
      },
      {
        question: "What invoice statuses does Toro support?",
        answer:
          "Toro currently supports draft, unpaid, and paid invoice states so teams can see where each invoice stands."
      }
    ]
  },
  {
    title: "Invoice workflow",
    items: [
      {
        question: "How do I create an invoice?",
        answer:
          "Inside Toro you move through an upload step, a processing step, and a review step before creating the invoice."
      },
      {
        question: "Can I review invoice details before finalizing?",
        answer:
          "Yes. Toro is built around a review step so invoice information can be confirmed before finalization."
      },
      {
        question: "Can I download invoice PDFs?",
        answer:
          "Yes. Toro supports invoice PDF download from the invoice workflow."
      },
      {
        question: "Can I mark invoices as paid?",
        answer:
          "Yes. Paid status is part of the current invoice-management workflow."
      },
      {
        question: "Can I delete an invoice?",
        answer:
          "Yes. Toro currently supports deleting invoices from the management flow."
      }
    ]
  },
  {
    title: "Accounts and companies",
    items: [
      {
        question: "Can I register before creating a company?",
        answer:
          "Yes. You can register first and complete company setup afterward."
      },
      {
        question: "How do I create a company?",
        answer:
          "Toro guides company setup after signup so business information stays separate from the first account-creation step."
      },
      {
        question: "Can company information be updated later?",
        answer:
          "Yes. Business, billing, and remittance information can be updated later."
      },
      {
        question: "Can I manage remittance details?",
        answer:
          "Yes. Toro includes billing and remittance settings at the company level."
      }
    ]
  },
  {
    title: "Access and technical",
    items: [
      {
        question: "Is Toro browser-based?",
        answer: "Yes. Toro is a browser-based web application."
      },
      {
        question: "Do I need to install software?",
        answer:
          "No. Toro runs in the browser and does not require local installation."
      },
      {
        question: "How do I reset my password?",
        answer:
          "Use the password reset flow from the login page or go directly to the Toro forgot-password route."
      },
      {
        question: "How do I verify my email?",
        answer:
          "Toro sends an account-verification flow after registration. In the current environment the delivery is simulated so you can continue immediately."
      }
    ]
  }
] as const;

export function buildPublicMetadata(
  title: string,
  description: string,
  path: string
): Metadata {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  const absoluteUrl = new URL(path, siteUrl).toString();

  return {
    title: `${title} | Toro`,
    description,
    alternates: {
      canonical: absoluteUrl
    },
    openGraph: {
      title: `${title} | Toro`,
      description,
      url: absoluteUrl,
      siteName: "Toro",
      images: [
        {
          url: "/img.jpeg",
          width: 1366,
          height: 1600,
          alt: "Toro product preview"
        }
      ],
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | Toro`,
      description,
      images: ["/img.jpeg"]
    }
  };
}
