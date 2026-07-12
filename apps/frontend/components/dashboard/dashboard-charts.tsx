"use client";

import type { EChartsOption } from "echarts";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useEffect, useMemo, useState, type ReactNode } from "react";

import type {
  DashboardChartsData,
  InvoiceCreationBucket,
  InvoiceStatusDistributionItem,
  PaidTotalsBucket
} from "@/lib/dashboard";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false
});

const axisTextColor = "#7D7D7D";
const gridLineColor = "#E8E8E8";
const statusColors: Record<string, string> = {
  Paid: "#4FA573",
  Unpaid: "#D8A200",
  Draft: "#9A9A9A"
};

function formatMoney(value: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(Number(value));
}

function formatCompactMoney(value: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: "compact",
    maximumFractionDigits: 0
  }).format(Number(value));
}

function formatMonth(value: string, includeYear = false) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    ...(includeYear ? { year: "2-digit" } : {})
  }).format(new Date(`${value}T00:00:00`));
}

function formatFullMonth(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatShortDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric"
  }).format(new Date(`${value}T00:00:00`));
}

function formatWeekRange(start: string, end: string) {
  const endDate = new Date(`${end}T00:00:00`);
  endDate.setDate(endDate.getDate() - 1);
  const startLabel = formatShortDate(start);
  const endLabel = new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric"
  }).format(endDate);
  return `${startLabel}-${endLabel}`;
}

function invoiceLabel(count: number) {
  return `${count} ${count === 1 ? "invoice" : "invoices"}`;
}

function useNarrowChart() {
  const [isNarrow, setIsNarrow] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(max-width: 640px)");
    const update = () => setIsNarrow(mediaQuery.matches);
    update();
    mediaQuery.addEventListener("change", update);
    return () => mediaQuery.removeEventListener("change", update);
  }, []);

  return isNarrow;
}

function ChartCard({
  title,
  description,
  children,
  summary,
  action
}: {
  title: string;
  description: string;
  children: ReactNode;
  summary: string;
  action?: ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[#E5E5E5] bg-[#FAFAFA] p-5">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-semibold text-[#161616]">{title}</h2>
          <p className="mt-1 text-sm text-[#6F6F6F]">{description}</p>
        </div>
        {action}
      </div>
      <div className="mt-5">{children}</div>
      <p className="sr-only">{summary}</p>
    </section>
  );
}

function ChartEmptyState({
  title,
  description,
  action
}: {
  title: string;
  description: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex h-[220px] flex-col justify-center rounded-lg border border-dashed border-[#DCDCDC] bg-white px-5">
      <h3 className="text-sm font-medium text-[#161616]">{title}</h3>
      <p className="mt-1 text-sm text-[#6F6F6F]">{description}</p>
      {action ? <div className="mt-4">{action}</div> : null}
    </div>
  );
}

function PaidInvoiceTotalsChart({ buckets }: { buckets: PaidTotalsBucket[] }) {
  const hasActivity = buckets.some((bucket) => bucket.paid_invoice_count > 0);
  const summary = `Paid invoice totals for the last 6 months: ${buckets
    .map(
      (bucket) =>
        `${formatFullMonth(bucket.period_start)}, ${formatMoney(bucket.paid_total)} across ${invoiceLabel(bucket.paid_invoice_count)}`
    )
    .join("; ")}.`;
  const option = useMemo<EChartsOption>(() => {
    const years = new Set(
      buckets.map((bucket) =>
        new Date(`${bucket.period_start}T00:00:00`).getFullYear()
      )
    );

    return {
      animation: false,
      grid: {
        top: 12,
        right: 8,
        bottom: 28,
        left: 52,
        containLabel: false
      },
      xAxis: {
        type: "category",
        data: buckets.map((bucket) =>
          formatMonth(bucket.period_start, years.size > 1)
        ),
        axisLine: { lineStyle: { color: gridLineColor } },
        axisTick: { show: false },
        axisLabel: { color: axisTextColor, fontSize: 12, interval: 0 }
      },
      yAxis: {
        type: "value",
        min: 0,
        splitLine: { lineStyle: { color: gridLineColor } },
        axisLabel: {
          color: axisTextColor,
          fontSize: 11,
          formatter: (value: number) => formatCompactMoney(String(value))
        }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#161616",
        borderWidth: 0,
        textStyle: { color: "#FFFFFF", fontFamily: "Inter" },
        formatter: (params) => {
          const dataIndex = Array.isArray(params)
            ? (params[0]?.dataIndex ?? 0)
            : 0;
          const bucket = buckets[dataIndex];
          return `${formatFullMonth(bucket.period_start)}<br/>${formatMoney(bucket.paid_total)}<br/><span style="color:#CFCFCF">${invoiceLabel(bucket.paid_invoice_count)} paid</span>`;
        }
      },
      series: [
        {
          type: "bar",
          data: buckets.map((bucket) => Number(bucket.paid_total)),
          barMaxWidth: 36,
          itemStyle: { color: "#4FA573", borderRadius: [4, 4, 0, 0] }
        }
      ]
    };
  }, [buckets]);

  return (
    <ChartCard
      title="Paid invoice totals"
      description="Invoice value marked paid during the last 6 months."
      summary={summary}
    >
      {hasActivity ? (
        <div
          role="img"
          aria-label="Bar chart of paid invoice totals by month"
          className="h-[220px] w-full"
        >
          <ReactECharts
            option={option}
            notMerge
            lazyUpdate
            opts={{ renderer: "svg" }}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      ) : (
        <ChartEmptyState
          title="No paid invoice activity"
          description="Invoices marked paid will appear here by month."
        />
      )}
    </ChartCard>
  );
}

function InvoiceCreationVolumeChart({
  buckets
}: {
  buckets: InvoiceCreationBucket[];
}) {
  const isNarrow = useNarrowChart();
  const hasActivity = buckets.some((bucket) => bucket.invoice_count > 0);
  const summary = `Invoice creation for the last 12 weeks: ${buckets
    .map(
      (bucket) =>
        `week of ${formatWeekRange(bucket.period_start, bucket.period_end)}, ${invoiceLabel(bucket.invoice_count)} created`
    )
    .join("; ")}.`;
  const option = useMemo<EChartsOption>(
    () => ({
      animation: false,
      grid: { top: 12, right: 8, bottom: 28, left: 32, containLabel: false },
      xAxis: {
        type: "category",
        data: buckets.map((bucket) => formatShortDate(bucket.period_start)),
        axisLine: { lineStyle: { color: gridLineColor } },
        axisTick: { show: false },
        axisLabel: {
          color: axisTextColor,
          fontSize: 12,
          interval: isNarrow ? 2 : 0
        }
      },
      yAxis: {
        type: "value",
        min: 0,
        minInterval: 1,
        splitLine: { lineStyle: { color: gridLineColor } },
        axisLabel: { color: axisTextColor, fontSize: 11, formatter: "{value}" }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#161616",
        borderWidth: 0,
        textStyle: { color: "#FFFFFF", fontFamily: "Inter" },
        formatter: (params) => {
          const dataIndex = Array.isArray(params)
            ? (params[0]?.dataIndex ?? 0)
            : 0;
          const bucket = buckets[dataIndex];
          return `${formatWeekRange(bucket.period_start, bucket.period_end)}<br/><span style="color:#CFCFCF">${invoiceLabel(bucket.invoice_count)} created</span>`;
        }
      },
      series: [
        {
          type: "bar",
          data: buckets.map((bucket) => bucket.invoice_count),
          barMaxWidth: 30,
          itemStyle: { color: "#3D3D3D", borderRadius: [4, 4, 0, 0] }
        }
      ]
    }),
    [buckets, isNarrow]
  );

  return (
    <ChartCard
      title="Invoices created"
      description="Weekly invoice creation during the last 12 weeks."
      summary={summary}
    >
      {hasActivity ? (
        <div
          role="img"
          aria-label="Bar chart of invoice creation by week"
          className="h-[220px] w-full"
        >
          <ReactECharts
            option={option}
            notMerge
            lazyUpdate
            opts={{ renderer: "svg" }}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      ) : (
        <ChartEmptyState
          title="No invoices created yet"
          description="New invoices will appear here as weekly activity."
          action={
            <Link
              href="/app/create-invoice"
              className="text-sm font-medium text-[#161616] underline-offset-4 hover:underline"
            >
              Create invoice
            </Link>
          }
        />
      )}
    </ChartCard>
  );
}

function InvoiceStatusDistributionChart({
  items
}: {
  items: InvoiceStatusDistributionItem[];
}) {
  const hasActivity = items.some((item) => item.invoice_count > 0);
  const summary = `Current invoice statuses: ${items
    .map(
      (item) =>
        `${item.status}, ${invoiceLabel(item.invoice_count)} totaling ${formatMoney(item.invoice_total)}`
    )
    .join("; ")}.`;
  const option = useMemo<EChartsOption>(
    () => ({
      animation: false,
      grid: { top: 8, right: 32, bottom: 12, left: 68, containLabel: false },
      xAxis: {
        type: "value",
        min: 0,
        minInterval: 1,
        splitLine: { lineStyle: { color: gridLineColor } },
        axisLabel: { color: axisTextColor, fontSize: 11, formatter: "{value}" }
      },
      yAxis: {
        type: "category",
        data: items.map((item) => item.status),
        axisLine: { show: false },
        axisTick: { show: false },
        axisLabel: { color: "#161616", fontSize: 12 }
      },
      tooltip: {
        trigger: "axis",
        backgroundColor: "#161616",
        borderWidth: 0,
        textStyle: { color: "#FFFFFF", fontFamily: "Inter" },
        formatter: (params) => {
          const dataIndex = Array.isArray(params)
            ? (params[0]?.dataIndex ?? 0)
            : 0;
          const item = items[dataIndex];
          return `${item.status}<br/>${invoiceLabel(item.invoice_count)}<br/><span style="color:#CFCFCF">${formatMoney(item.invoice_total)} total</span>`;
        }
      },
      series: [
        {
          type: "bar",
          data: items.map((item) => ({
            value: item.invoice_count,
            itemStyle: {
              color: statusColors[item.status] ?? "#707070",
              borderRadius: [0, 4, 4, 0]
            }
          })),
          barMaxWidth: 26
        }
      ]
    }),
    [items]
  );

  return (
    <ChartCard
      title="Invoice status distribution"
      description="Current invoices grouped by status."
      summary={summary}
      action={
        <Link
          href="/app/invoices"
          className="shrink-0 text-sm font-medium text-[#161616] underline-offset-4 hover:underline"
        >
          View invoices
        </Link>
      }
    >
      {hasActivity ? (
        <div
          role="img"
          aria-label="Horizontal bar chart of current invoice status distribution"
          className="h-[220px] w-full"
        >
          <ReactECharts
            option={option}
            notMerge
            lazyUpdate
            opts={{ renderer: "svg" }}
            style={{ height: "100%", width: "100%" }}
          />
        </div>
      ) : (
        <ChartEmptyState
          title="No invoice status data"
          description="Create an invoice to start tracking status distribution."
          action={
            <Link
              href="/app/create-invoice"
              className="text-sm font-medium text-[#161616] underline-offset-4 hover:underline"
            >
              Create invoice
            </Link>
          }
        />
      )}
    </ChartCard>
  );
}

export function DashboardChartsSection({
  charts
}: {
  charts: DashboardChartsData;
}) {
  return (
    <section className="space-y-6" aria-label="Invoice activity charts">
      <div className="grid gap-6 xl:grid-cols-[minmax(280px,1fr)_minmax(0,2fr)]">
        <InvoiceStatusDistributionChart
          items={charts.status_distribution.items}
        />
        <PaidInvoiceTotalsChart buckets={charts.paid_totals.buckets} />
      </div>
      <InvoiceCreationVolumeChart buckets={charts.invoice_creation.buckets} />
    </section>
  );
}
