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
    <div className="rounded-[14px] border border-[#EFEFEF] bg-white p-3 shadow-[0_18px_40px_rgba(22,22,22,0.05)]">
      <div className="grid gap-3">
        <div className="relative min-h-[520px] overflow-hidden rounded-[12px] border border-[#EAEAEA] bg-[#FAFAFA]">
          <Image
            src="/img.jpeg"
            alt="Map-based logistics background for Toro"
            fill
            sizes="(min-width: 1024px) 34rem, 100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.1)_0%,rgba(255,255,255,0.38)_42%,rgba(255,255,255,0.9)_100%)]" />
          <div className="absolute bottom-4 left-4 right-4 rounded-[12px] border border-[#EAEAEA] bg-white/94 p-6 backdrop-blur">
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-[#B38A00]">
              Trucking invoicing software
            </p>
            <h3 className="mt-3 max-w-md text-[28px] font-semibold leading-tight text-[#161616]">
              Keep billing work clean, consistent, and easier to move forward.
            </h3>
            <p className="mt-3 max-w-lg text-sm leading-7 text-[#666666]">
              Toro is built for small trucking operations that need a more
              professional invoicing process without adding unnecessary system
              complexity.
            </p>
          </div>
        </div>
      </div>
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
