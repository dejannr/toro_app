import {
  ArrowRight,
  CheckCircle,
  File06,
} from "@untitledui/icons";
import Image from "next/image";

function Frame({
  children,
  className = ""
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-[14px] border border-[#EAEAEA] bg-white ${className}`}>
      {children}
    </div>
  );
}

export function HeroProductPreview() {
  return (
    <ImagePlaceholder
      label="A clean product composition showing shipment documents, a reviewed trucking invoice, and simple invoice status indicators."
      className="min-h-[360px]"
    />
  );
}

export function ImagePlaceholder({
  className = "",
  label
}: {
  className?: string;
  label: string;
}) {
  return (
    <div
      role="img"
      aria-label={label}
      className={`relative flex min-h-[240px] items-center justify-center overflow-hidden rounded-[14px] border border-dashed border-[#D9D9D9] bg-[#FAFAFA] p-6 ${className}`}
    >
      <div className="pointer-events-none absolute inset-4 rounded-[10px] border border-[#EFEFEF] bg-[linear-gradient(135deg,rgba(255,255,255,0.82),rgba(250,250,250,0.48))]" />
      <div className="relative max-w-sm text-center">
        <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#FFD028] text-[#161616]">
          <File06 className="h-5 w-5" />
        </span>
        <p className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-[#A98000]">
          Image placeholder
        </p>
        <p className="mt-2 text-sm leading-6 text-[#4F4F4F]">{label}</p>
      </div>
    </div>
  );
}

type MarketingVisualVariant =
  | "documents"
  | "review"
  | "status"
  | "comparison"
  | "details"
  | "attention"
  | "confirmation";

const documentLabels = ["Rate confirmation", "Bill of lading", "Proof of delivery"];

export function MarketingVisual({
  className = "",
  variant
}: {
  className?: string;
  variant: MarketingVisualVariant;
}) {
  if (variant === "documents") {
    return (
      <MarketingFrame className={className} label="Shipment documents">
        <div className="mx-auto flex max-w-[290px] -space-x-12 pt-7">
          {documentLabels.map((label, index) => (
            <DocumentSheet key={label} label={label} rotate={[-7, 0, 7][index]} />
          ))}
        </div>
      </MarketingFrame>
    );
  }

  if (variant === "review") {
    return (
      <MarketingFrame className={className} label="Review invoice information">
        <InvoiceSheet className="mx-auto max-w-[290px]" highlighted />
      </MarketingFrame>
    );
  }

  if (variant === "status") {
    return (
      <MarketingFrame className={className} label="Invoice status">
        <div className="grid items-center gap-4 sm:grid-cols-[0.95fr_1.05fr]">
          <InvoiceSheet compact />
          <div className="space-y-2">
            <StatusRow label="Draft" tone="neutral" />
            <StatusRow label="Unpaid" tone="yellow" />
            <StatusRow label="Paid" tone="green" />
          </div>
        </div>
      </MarketingFrame>
    );
  }

  if (variant === "comparison") {
    return (
      <MarketingFrame className={className} label="From scattered paperwork to one invoice">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-[10px] border border-[#EAEAEA] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#777777]">Before</p>
            <div className="mt-4 space-y-2">
              {documentLabels.concat("Email note").map((label) => (
                <div key={label} className="flex items-center gap-2 rounded-[8px] border border-[#EFEFEF] px-3 py-2 text-xs text-[#666666]">
                  <File06 className="h-3.5 w-3.5 text-[#8A8A8A]" />
                  {label}
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-[10px] border border-[#E6CF7B] bg-[#FFFCF1] p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A98000]">After</p>
            <InvoiceSheet className="mt-4" compact />
          </div>
        </div>
      </MarketingFrame>
    );
  }

  if (variant === "details") {
    return (
      <MarketingFrame className={className} label="Invoice and remittance details">
        <div className="grid gap-4 sm:grid-cols-[1.1fr_0.9fr]">
          <InvoiceSheet compact highlighted />
          <div className="space-y-3 rounded-[10px] border border-[#EAEAEA] bg-white p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#777777]">Attached paperwork</p>
            {documentLabels.slice(0, 2).map((label) => (
              <div key={label} className="flex items-center gap-2 text-xs font-medium text-[#3F3F3F]">
                <File06 className="h-4 w-4 text-[#A98000]" />
                {label}
              </div>
            ))}
            <div className="border-t border-[#EFEFEF] pt-3 text-xs leading-5 text-[#666666]">
              Company and remittance information stays ready for each invoice.
            </div>
          </div>
        </div>
      </MarketingFrame>
    );
  }

  if (variant === "attention") {
    return (
      <MarketingFrame className={className} label="Invoice activity">
        <div className="rounded-[10px] border border-[#EAEAEA] bg-white p-4">
          <div className="flex items-center justify-between border-b border-[#EFEFEF] pb-3">
            <p className="text-sm font-semibold text-[#161616]">Invoice activity</p>
            <span className="rounded-full bg-[#FFF2D5] px-2 py-1 text-xs font-medium text-[#9A6400]">1 needs review</span>
          </div>
          <div className="divide-y divide-[#EFEFEF]">
            <ActivityRow label="Draft invoice" status="Draft" />
            <ActivityRow label="Customer invoice" status="Unpaid" />
            <ActivityRow label="Completed billing" status="Paid" />
          </div>
        </div>
      </MarketingFrame>
    );
  }

  return (
    <MarketingFrame className={className} label="Review and confirm">
      <div className="rounded-[10px] border border-[#EAEAEA] bg-white p-5">
        <p className="text-sm font-semibold text-[#161616]">Review before finalizing</p>
        <div className="mt-4 space-y-3">
          {["Customer details", "Load details", "Charges", "Company information", "Remittance information"].map((label) => (
            <div key={label} className="flex items-center justify-between border-b border-[#EFEFEF] pb-3 text-sm text-[#4F4F4F] last:border-0 last:pb-0">
              {label}
              <CheckCircle className="h-4 w-4 text-[#6D9472]" />
            </div>
          ))}
        </div>
      </div>
    </MarketingFrame>
  );
}

export function PaperworkToInvoiceImage({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden rounded-[14px] border border-[#EAEAEA] bg-[#FAFAFA] shadow-[0_20px_45px_rgba(22,22,22,0.08)] ${className}`}>
      <Image
        src="/toro-paperwork-to-invoice-digital.png"
        alt="Shipment paperwork flowing into a browser-based invoice review workspace with invoice statuses"
        width={1448}
        height={1086}
        priority
        className="h-full w-full object-cover"
      />
    </div>
  );
}

function MarketingFrame({
  children,
  className,
  label
}: {
  children: React.ReactNode;
  className: string;
  label: string;
}) {
  return (
    <div className={`rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-4 ${className}`}>
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#A98000]">{label}</p>
      <div className="mt-4">{children}</div>
    </div>
  );
}

function DocumentSheet({ label, rotate }: { label: string; rotate: number }) {
  return (
    <div
      className="relative h-36 w-32 rounded-[8px] border border-[#E4E4E4] bg-white p-3 shadow-[0_8px_18px_rgba(22,22,22,0.06)]"
      style={{ transform: `rotate(${rotate}deg)` }}
    >
      <span className="block h-1.5 w-10 rounded-full bg-[#FFD028]" />
      <span className="mt-3 block h-1.5 w-full rounded-full bg-[#D8D8D8]" />
      <span className="mt-2 block h-1.5 w-4/5 rounded-full bg-[#E8E8E8]" />
      <span className="mt-2 block h-1.5 w-3/5 rounded-full bg-[#E8E8E8]" />
      <p className="absolute bottom-3 left-3 right-3 text-[10px] font-medium leading-3 text-[#4F4F4F]">{label}</p>
    </div>
  );
}

function InvoiceSheet({
  className = "",
  compact = false,
  highlighted = false
}: {
  className?: string;
  compact?: boolean;
  highlighted?: boolean;
}) {
  return (
    <div className={`rounded-[8px] border border-[#E4E4E4] bg-white p-4 shadow-[0_6px_14px_rgba(22,22,22,0.04)] ${className}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2">
          <span className="block h-2 w-20 rounded-full bg-[#161616]" />
          <span className="block h-1.5 w-12 rounded-full bg-[#D8D8D8]" />
        </div>
        <span className="h-2 w-8 rounded-full bg-[#FFD028]" />
      </div>
      <div className="mt-5 space-y-2.5">
        {["w-full", "w-4/5", "w-11/12"].map((width, index) => (
          <span key={index} className={`block h-1.5 ${width} rounded-full bg-[#E5E5E5]`} />
        ))}
      </div>
      <div className="mt-5 space-y-2 border-t border-[#EAEAEA] pt-3">
        {["w-full", "w-full", "w-3/4"].map((width, index) => (
          <span key={index} className={`block h-1.5 ${width} rounded-full bg-[#DADADA]`} />
        ))}
      </div>
      {!compact ? (
        <span className={`mt-5 block h-7 rounded-[4px] ${highlighted ? "bg-[#FFF2C7]" : "bg-[#F2F2F2]"}`} />
      ) : null}
    </div>
  );
}

function StatusRow({ label, tone }: { label: string; tone: "green" | "neutral" | "yellow" }) {
  const styles = {
    green: "bg-[#E9F5EB] text-[#3E8B4B]",
    neutral: "bg-[#F1F1F1] text-[#666666]",
    yellow: "bg-[#FFF2D5] text-[#9A6400]"
  };

  return <div className={`rounded-[8px] px-3 py-2 text-xs font-medium ${styles[tone]}`}>{label}</div>;
}

function ActivityRow({ label, status }: { label: string; status: "Draft" | "Paid" | "Unpaid" }) {
  const tone = status === "Paid" ? "text-[#3E8B4B]" : status === "Unpaid" ? "text-[#9A6400]" : "text-[#666666]";

  return (
    <div className="flex items-center justify-between gap-3 py-3 text-xs">
      <span className="font-medium text-[#3F3F3F]">{label}</span>
      <span className={tone}>{status}</span>
    </div>
  );
}

export function WorkflowStepPreview({
  description,
  step,
  title
}: {
  description: string;
  step: string;
  title: string;
}) {
  return (
    <Frame className="h-full p-5">
      <span className="inline-flex rounded-full bg-[#FFD028] px-2.5 py-1 text-xs font-semibold text-[#161616]">
        {step}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-[#161616]">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{description}</p>
      <div className="mt-5 rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA] p-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#EAEAEA] bg-white text-[#161616]">
            <File06 className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-medium text-[#161616]">{title}</p>
            <p className="text-sm text-[#6B6B6B]">Clear operational step</p>
          </div>
        </div>
      </div>
    </Frame>
  );
}

export function InvoiceListPreview() {
  return (
    <Frame className="overflow-hidden">
      <div className="border-b border-[#EAEAEA] bg-[#FAFAFA] px-5 py-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-lg font-semibold text-[#161616]">
              What stays organized
            </p>
            <p className="mt-1 text-sm text-[#6B6B6B]">
              Core billing work in one structured flow.
            </p>
          </div>
          <span className="rounded-[10px] border border-[#EAEAEA] bg-white px-4 py-2 text-sm font-medium text-[#161616]">
            Less friction
          </span>
        </div>
      </div>
      <div className="divide-y divide-[#EAEAEA] px-5">
        {[
          ["Shipment paperwork", "Source documents", "Organized", "Ready for billing"],
          ["Customer billing", "Professional output", "Reviewed", "Consistent"],
          ["Payment follow-up", "Invoice records", "Tracked", "Easier to manage"]
        ].map(([label, context, status, meta]) => (
          <div
            key={label}
            className="grid gap-2 py-4 text-sm sm:grid-cols-[0.9fr_1.1fr_0.8fr_auto]"
          >
            <p className="font-medium text-[#161616]">{label}</p>
            <p className="text-[#6B6B6B]">{context}</p>
            <p className="text-[#6B6B6B]">{status}</p>
            <p className="text-[#161616]">{meta}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function InvoiceReviewPreview() {
  return (
    <Frame className="p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-lg font-semibold text-[#161616]">
            A reviewable billing process
          </p>
          <p className="mt-1 text-sm text-[#6B6B6B]">
            Keep invoice information easier to confirm before final output.
          </p>
        </div>
        <span className="rounded-[10px] border border-[#EAEAEA] bg-white px-4 py-2 text-sm font-medium text-[#161616]">
          Final review
        </span>
      </div>
      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {[
          ["Customer billing", "Professional invoice output"],
          ["Shipment details", "Reviewed before send"],
          ["Invoice amount", "Consistent billing records"],
          ["Payment terms", "Clear remittance expectations"]
        ].map(([label, value]) => (
          <div key={label} className="rounded-[10px] border border-[#EAEAEA] bg-[#FAFAFA] p-4">
            <p className="text-xs font-medium uppercase tracking-[0.1em] text-[#6B6B6B]">
              {label}
            </p>
            <p className="mt-2 text-sm font-medium text-[#161616]">{value}</p>
          </div>
        ))}
      </div>
    </Frame>
  );
}

export function FinalCtaCard({
  description,
  title
}: {
  description: string;
  title: string;
}) {
  return (
    <div className="rounded-[14px] border border-[#EFEFEF] bg-[#161616] px-6 py-8 text-white sm:px-8">
      <h2 className="text-3xl font-semibold tracking-tight">{title}</h2>
      <p className="mt-3 max-w-2xl text-sm leading-7 text-[#CFCFCF] sm:text-base">
        {description}
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <a
          href="/app/register"
          className="inline-flex h-11 items-center justify-center rounded-[10px] bg-[#FFD028] px-5 text-sm font-medium text-[#161616] transition-colors hover:bg-[#E9BC15]"
        >
          Create account
        </a>
        <a
          href="/app/login"
          className="inline-flex h-11 items-center justify-center rounded-[10px] border border-[#333333] px-5 text-sm font-medium text-white transition-colors hover:bg-[#222222]"
        >
          Log in
        </a>
      </div>
    </div>
  );
}

export function TrustChecklist({ items }: { items: readonly string[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      {items.map((item) => (
        <div
          key={item}
          className="flex items-start gap-3 rounded-[12px] border border-[#EAEAEA] bg-white p-4"
        >
          <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FAFAFA] text-[#161616]">
            <CheckCircle className="h-4 w-4" />
          </span>
          <p className="text-sm leading-6 text-[#161616]">{item}</p>
        </div>
      ))}
    </div>
  );
}

export function SimpleUseCaseCard({
  description,
  problem,
  title
}: {
  description: string;
  problem: string;
  title: string;
}) {
  return (
    <Frame className="p-5">
      <p className="text-sm font-semibold text-[#161616]">{title}</p>
      <p className="mt-3 text-sm font-medium text-[#6B6B6B]">Operational problem</p>
      <p className="mt-1 text-sm leading-6 text-[#161616]">{problem}</p>
      <p className="mt-4 text-sm font-medium text-[#6B6B6B]">How Toro helps</p>
      <p className="mt-1 text-sm leading-6 text-[#161616]">{description}</p>
      <a
        href="/app/register"
        className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-[#161616]"
      >
        Create account
        <ArrowRight className="h-4 w-4" />
      </a>
    </Frame>
  );
}
