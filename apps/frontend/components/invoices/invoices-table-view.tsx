"use client";

import {
  ArrowLeft,
  ArrowRight,
  Download01,
  FilterLines,
  PlusSquare,
  SearchLg
} from "@untitledui/icons";
import Link from "next/link";
import { useMemo, useState } from "react";

import type { InvoiceRow } from "@/lib/invoices";

const PAGE_SIZE = 8;

function formatMoney(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

function downloadCsv(rows: InvoiceRow[]) {
  const csv = [
    ["Invoice #", "Customer", "Load #", "Amount", "Status", "Date"].join(","),
    ...rows.map((row) =>
      [
        row.invoice_number,
        row.customer,
        row.load_number,
        row.amount.toFixed(2),
        row.status,
        row.date
      ]
        .map((value) => `"${String(value).replaceAll('"', '""')}"`)
        .join(",")
    )
  ].join("\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "invoices.csv";
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

type InvoicesTableViewProps = {
  invoices: InvoiceRow[];
};

export function InvoicesTableView({ invoices }: InvoicesTableViewProps) {
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("All");
  const [page, setPage] = useState(1);

  const filteredInvoices = useMemo(() => {
    const normalized = search.trim().toLowerCase();

    return invoices.filter((invoice) => {
      const matchesSearch =
        normalized.length === 0 ||
        invoice.invoice_number.toLowerCase().includes(normalized) ||
        invoice.customer.toLowerCase().includes(normalized) ||
        invoice.load_number.toLowerCase().includes(normalized);
      const matchesStatus = status === "All" || invoice.status === status;
      return matchesSearch && matchesStatus;
    });
  }, [invoices, search, status]);

  const totalPages = Math.max(1, Math.ceil(filteredInvoices.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);

  const visibleInvoices = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredInvoices.slice(start, start + PAGE_SIZE);
  }, [currentPage, filteredInvoices]);

  const pageNumbers = Array.from({ length: totalPages }, (_, index) => index + 1).slice(
    Math.max(0, currentPage - 2),
    Math.max(4, currentPage + 1)
  );

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-semibold text-[#161616]">Invoices</h1>
            <span className="rounded-md bg-[#FFD028] px-2 py-0.5 text-xs font-semibold text-[#161616]">
              {filteredInvoices.length}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Manage every invoice created from the upload and review flow.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#D7E8FF] bg-white px-4 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA]"
          >
            <FilterLines className="h-4 w-4" />
            <span>Filters</span>
          </button>
          <button
            type="button"
            onClick={() => downloadCsv(filteredInvoices)}
            className="inline-flex h-10 items-center gap-2 rounded-xl border border-[#EAEAEA] bg-white px-4 text-sm font-medium text-[#161616] transition-colors hover:bg-[#FAFAFA]"
          >
            <Download01 className="h-4 w-4" />
            <span>Export</span>
          </button>
          <Link
            href="/app/create-invoice"
            className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#161616] px-4 text-sm font-medium text-white transition-colors hover:bg-[#161616]/90"
          >
            <PlusSquare className="h-4 w-4" />
            <span>Add invoice</span>
          </Link>
        </div>
      </div>

      <div className="grid gap-3 xl:grid-cols-[1.15fr_0.9fr_0.8fr_220px]">
        <label className="flex h-11 items-center gap-3 rounded-xl border border-[#EAEAEA] bg-white px-4">
          <SearchLg className="h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search invoice #, customer, or load #"
            className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
          />
        </label>
        <input
          readOnly
          value="All customers"
          className="h-11 rounded-xl border border-[#EAEAEA] bg-white px-4 text-sm text-muted-foreground outline-none"
        />
        <input
          readOnly
          value="All loads"
          className="h-11 rounded-xl border border-[#EAEAEA] bg-white px-4 text-sm text-muted-foreground outline-none"
        />
        <select
          value={status}
          onChange={(event) => {
            setStatus(event.target.value);
            setPage(1);
          }}
          className="h-11 rounded-xl border border-[#EAEAEA] bg-white px-4 text-sm text-[#161616] outline-none"
        >
          <option>All</option>
          <option>Draft</option>
          <option>Unpaid</option>
          <option>Paid</option>
        </select>
      </div>

      <div className="overflow-hidden rounded-2xl border border-[#F0F0F0] bg-white">
        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[1.05fr_1.35fr_0.9fr_0.9fr_0.85fr_0.8fr_0.9fr] gap-4 border-b border-[#F3F3F3] bg-[#FCFCFC] px-5 py-4 text-xs font-medium text-[#9A9A9A]">
              <span>Invoice no.</span>
              <span>Customer</span>
              <span>Load no.</span>
              <span>Amount</span>
              <span>Status</span>
              <span>Date</span>
              <span className="text-right">Action</span>
            </div>

            {visibleInvoices.length ? (
              visibleInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="grid grid-cols-[1.05fr_1.35fr_0.9fr_0.9fr_0.85fr_0.8fr_0.9fr] gap-4 border-b border-[#F6F6F6] px-5 py-4 text-sm text-[#161616] last:border-b-0"
                >
                  <div className="font-medium">{invoice.invoice_number}</div>
                  <div className="truncate">{invoice.customer}</div>
                  <div>{invoice.load_number}</div>
                  <div>{formatMoney(invoice.amount)}</div>
                  <div>
                    <span
                      className={
                        invoice.status === "Paid"
                          ? "inline-flex rounded-full bg-[#EAF8EF] px-3 py-1 text-xs font-medium text-[#2F9E62]"
                          : invoice.status === "Unpaid"
                            ? "inline-flex rounded-full bg-[#FFF4DA] px-3 py-1 text-xs font-medium text-[#C98A00]"
                            : "inline-flex rounded-full bg-[#F0F0F0] px-3 py-1 text-xs font-medium text-[#6B6B6B]"
                      }
                    >
                      {invoice.status}
                    </span>
                  </div>
                  <div className="text-[#6B6B6B]">{invoice.date}</div>
                  <div className="flex items-center justify-end">
                    <Link
                      href={`/app/invoices/${invoice.id}`}
                      className="inline-flex rounded-lg bg-[#161616] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-[#161616]/90"
                    >
                      View more
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="px-6 py-10 text-sm text-muted-foreground">
                No invoices match the current filters.
              </div>
            )}
          </div>
        </div>
      </div>

      {totalPages > 1 ? (
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            disabled={currentPage === 1}
            className="inline-flex items-center gap-2 text-sm text-[#161616] disabled:opacity-40"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Previous</span>
          </button>

          <div className="flex items-center gap-2">
            {pageNumbers.map((pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                className={
                  pageNumber === currentPage
                    ? "flex h-9 w-9 items-center justify-center rounded-xl border border-[#6CB2FF] bg-white text-sm font-medium text-[#161616]"
                    : "flex h-9 w-9 items-center justify-center rounded-xl border border-[#EAEAEA] bg-white text-sm text-[#A1A1A1]"
                }
              >
                {pageNumber}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            disabled={currentPage === totalPages}
            className="inline-flex items-center gap-2 text-sm text-[#161616] disabled:opacity-40"
          >
            <span>Next</span>
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      ) : null}
    </section>
  );
}
