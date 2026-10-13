"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  Banknote,
  ChevronDown,
  Clock3,
  CreditCard,
  LoaderCircle,
  RefreshCw,
  Wallet,
} from "lucide-react";
import { nutriEarningsService } from "@/services/nutritionist/nutriEarnings.service";
import type { NutriEarningsSummaryDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-summary.dto";
import type { NutriEarningsTransactionDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-transaction.dto";
import type { NutriEarningsPaymentDTO } from "@/dtos/nutritionist/earnings/nutri-earnings-payment.dto";
import type { GetNutriEarningsQueryDTO } from "@/dtos/nutritionist/earnings/earnings-list-query.dto";

type EarningsTab = "transactions" | "payments";

const PAGE_SIZE = 10;

const transactionStatuses = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Successful", value: "success" },
  { label: "Failed", value: "failed" },
] as const;

const paymentStatuses = [
  { label: "All statuses", value: "" },
  { label: "Pending", value: "pending" },
  { label: "Paid", value: "paid" },
  { label: "Failed", value: "failed" },
  { label: "Refunded", value: "refunded" },
] as const;

const transactionTypes = [
  { label: "All types", value: "" },
  { label: "Credits", value: "credit" },
  { label: "Debits", value: "debit" },
] as const;

const transactionReasons = [
  { label: "All reasons", value: "" },
  { label: "Plan purchase", value: "plan_purchase" },
  { label: "Refund", value: "refund" },
  { label: "Withdrawal", value: "withdrawal" },
  { label: "Top up", value: "top_up" },
] as const;

function formatCurrency(amount: number, currency: string = "inr"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: currency.toUpperCase(),
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(date: string): string {
  const parsedDate = new Date(date);

  if (Number.isNaN(parsedDate.getTime())) {
    return "Date unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(parsedDate);
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusClass(status: string): string {
  switch (status) {
    case "success":
    case "paid":
      return "bg-emerald-50 text-emerald-700";

    case "pending":
      return "bg-amber-50 text-amber-700";

    case "failed":
    case "refunded":
      return "bg-red-50 text-red-700";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function SummaryCard({
  title,
  amount,
  description,
  icon: Icon,
}: {
  title: string;
  amount: string;
  description: string;
  icon: typeof Wallet;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <p className="mt-3 text-2xl font-semibold tracking-tight text-slate-900">
            {amount}
          </p>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
          <Icon size={21} />
        </div>
      </div>
    </div>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-16 text-center">
      <div className="rounded-full bg-slate-100 p-4 text-slate-500">
        <Wallet size={26} />
      </div>
      <h3 className="mt-4 font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default function NutritionistEarningsPage() {
  const [summary, setSummary] = useState<NutriEarningsSummaryDTO | null>(null);

  const [tab, setTab] = useState<EarningsTab>("transactions");

  const [transactions, setTransactions] = useState<
    NutriEarningsTransactionDTO[]
  >([]);

  const [payments, setPayments] = useState<NutriEarningsPaymentDTO[]>([]);

  const [transactionType, setTransactionType] = useState<
    GetNutriEarningsQueryDTO["transactionType"] | ""
  >("");

  const [reason, setReason] = useState<GetNutriEarningsQueryDTO["reason"] | "">(
    "",
  );

  const [transactionStatus, setTransactionStatus] = useState<
    GetNutriEarningsQueryDTO["transactionStatus"] | ""
  >("");

  const [paymentStatus, setPaymentStatus] = useState<
    GetNutriEarningsQueryDTO["paymentStatus"] | ""
  >("");

  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(false);

  const [summaryLoading, setSummaryLoading] = useState(true);
  const [listLoading, setListLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const filters = useMemo<GetNutriEarningsQueryDTO>(() => {
    const query: GetNutriEarningsQueryDTO = {
      limit: PAGE_SIZE,
    };

    if (tab === "transactions") {
      if (transactionType) query.transactionType = transactionType;
      if (reason) query.reason = reason;
      if (transactionStatus) query.transactionStatus = transactionStatus;
    } else if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    return query;
  }, [tab, transactionType, reason, transactionStatus, paymentStatus]);

  const loadSummary = useCallback(async () => {
    setSummaryLoading(true);

    try {
      const result = await nutriEarningsService.getSummary();
      setSummary(result);
    } catch {
      setError("Unable to load your earnings summary.");
    } finally {
      setSummaryLoading(false);
    }
  }, []);

  const loadFirstPage = useCallback(async () => {
    setListLoading(true);
    setError(null);
    setNextCursor(null);
    setHasMore(false);
    setTransactions([]);
    setPayments([]);

    try {
      const result =
        tab === "transactions"
          ? await nutriEarningsService.getTransactions(filters)
          : await nutriEarningsService.getPayments(filters);

      if (tab === "transactions") {
        setTransactions(result.items as NutriEarningsTransactionDTO[]);
      } else {
        setPayments(result.items as NutriEarningsPaymentDTO[]);
      }

      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch {
      setError(
        `Unable to load ${tab === "transactions" ? "wallet transactions" : "payment history"}.`,
      );
    } finally {
      setListLoading(false);
    }
  }, [tab, filters]);

  useEffect(() => {
    void loadSummary();
  }, [loadSummary]);

  useEffect(() => {
    void loadFirstPage();
  }, [loadFirstPage]);

  const loadMore = async () => {
    if (!nextCursor || !hasMore || loadingMore) return;

    setLoadingMore(true);
    setError(null);

    try {
      const query: GetNutriEarningsQueryDTO = {
        ...filters,
        cursor: nextCursor,
      };

      const result =
        tab === "transactions"
          ? await nutriEarningsService.getTransactions(query)
          : await nutriEarningsService.getPayments(query);

      if (tab === "transactions") {
        setTransactions((current) => [
          ...current,
          ...(result.items as NutriEarningsTransactionDTO[]),
        ]);
      } else {
        setPayments((current) => [
          ...current,
          ...(result.items as NutriEarningsPaymentDTO[]),
        ]);
      }

      setNextCursor(result.nextCursor);
      setHasMore(result.hasMore);
    } catch {
      setError("Unable to load more records. Please try again.");
    } finally {
      setLoadingMore(false);
    }
  };

  const refresh = async () => {
    setRefreshing(true);
    setError(null);

    try {
      const result = await nutriEarningsService.getSummary();
      setSummary(result);
    } catch {
      setError("Unable to refresh your earnings summary.");
    }

    await loadFirstPage();
    setRefreshing(false);
  };

  const currency = summary?.currency ?? "inr";

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-7">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-emerald-700">
              Nutritionist dashboard
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
              Earnings
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Track your wallet balances, transactions, and payment history.
            </p>
          </div>

          <button
            type="button"
            onClick={() => void refresh()}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {refreshing ? (
              <LoaderCircle size={17} className="animate-spin" />
            ) : (
              <RefreshCw size={17} />
            )}
            Refresh
          </button>
        </header>

        <section className="grid gap-4 sm:grid-cols-2">
          <SummaryCard
            title="Available balance"
            amount={
              summaryLoading
                ? "Loading..."
                : formatCurrency(summary?.availableBalance ?? 0, currency)
            }
            description="Funds currently available in your wallet"
            icon={Wallet}
          />

          <SummaryCard
            title="Escrow balance"
            amount={
              summaryLoading
                ? "Loading..."
                : formatCurrency(summary?.escrowBalance ?? 0, currency)
            }
            description="Funds currently held in escrow"
            icon={Banknote}
          />
        </section>

        {error && (
          <div
            role="alert"
            className="flex flex-col gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 sm:flex-row sm:items-center sm:justify-between"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={() => {
                void loadFirstPage();
                void loadSummary();
              }}
              className="inline-flex shrink-0 items-center gap-2 font-semibold hover:underline"
            >
              <RefreshCw size={15} />
              Try again
            </button>
          </div>
        )}

        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 pt-5 sm:px-6">
            <div className="flex flex-wrap gap-6">
              <button
                type="button"
                onClick={() => setTab("transactions")}
                className={`border-b-2 pb-4 text-sm font-semibold transition ${
                  tab === "transactions"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Wallet transactions
              </button>

              <button
                type="button"
                onClick={() => setTab("payments")}
                className={`border-b-2 pb-4 text-sm font-semibold transition ${
                  tab === "payments"
                    ? "border-emerald-600 text-emerald-700"
                    : "border-transparent text-slate-500 hover:text-slate-800"
                }`}
              >
                Payment history
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3 border-b border-slate-100 p-5 sm:flex-row sm:flex-wrap sm:items-center sm:px-6">
            {tab === "transactions" ? (
              <>
                <label className="relative">
                  <span className="sr-only">Transaction type</span>
                  <select
                    value={transactionType}
                    onChange={(event) =>
                      setTransactionType(
                        event.target.value as typeof transactionType,
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-500 sm:w-auto"
                  >
                    {transactionTypes.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </label>

                <label className="relative">
                  <span className="sr-only">Transaction reason</span>
                  <select
                    value={reason}
                    onChange={(event) =>
                      setReason(event.target.value as typeof reason)
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-500 sm:w-auto"
                  >
                    {transactionReasons.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </label>

                <label className="relative">
                  <span className="sr-only">Transaction status</span>
                  <select
                    value={transactionStatus}
                    onChange={(event) =>
                      setTransactionStatus(
                        event.target.value as typeof transactionStatus,
                      )
                    }
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-500 sm:w-auto"
                  >
                    {transactionStatuses.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </label>
              </>
            ) : (
              <label className="relative">
                <span className="sr-only">Payment status</span>
                <select
                  value={paymentStatus}
                  onChange={(event) =>
                    setPaymentStatus(event.target.value as typeof paymentStatus)
                  }
                  className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-2.5 pl-3 pr-9 text-sm text-slate-700 outline-none focus:border-emerald-500 sm:w-auto"
                >
                  {paymentStatuses.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <ChevronDown
                  size={15}
                  className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
                />
              </label>
            )}
          </div>

          {listLoading ? (
            <div className="flex items-center justify-center gap-3 px-5 py-20 text-sm text-slate-500">
              <LoaderCircle
                size={20}
                className="animate-spin text-emerald-600"
              />
              Loading {tab === "transactions" ? "transactions" : "payments"}...
            </div>
          ) : tab === "transactions" ? (
            transactions.length === 0 ? (
              <EmptyState
                title="No wallet transactions found"
                description="Your wallet credits and debits will appear here when available."
              />
            ) : (
              <div className="divide-y divide-slate-100">
                {transactions.map((transaction) => {
                  const isCredit = transaction.type === "credit";

                  return (
                    <div
                      key={transaction.transactionId}
                      className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                    >
                      <div className="flex min-w-0 items-start gap-3">
                        <div
                          className={`mt-0.5 rounded-xl p-2.5 ${
                            isCredit
                              ? "bg-emerald-50 text-emerald-700"
                              : "bg-orange-50 text-orange-700"
                          }`}
                        >
                          {isCredit ? (
                            <ArrowDownLeft size={20} />
                          ) : (
                            <ArrowUpRight size={20} />
                          )}
                        </div>

                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900">
                            {formatLabel(transaction.reason)}
                          </p>
                          <p className="mt-1 text-sm text-slate-500">
                            {formatDate(transaction.createdAt)}
                          </p>
                          {transaction.referenceId && (
                            <p className="mt-1 truncate text-xs text-slate-400">
                              Reference: {transaction.referenceId}
                            </p>
                          )}
                          <p className="mt-1 text-xs text-slate-500">
                            Balance after:{" "}
                            {formatCurrency(transaction.balanceAfter, currency)}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                        <p
                          className={`text-base font-semibold ${
                            isCredit ? "text-emerald-700" : "text-slate-900"
                          }`}
                        >
                          {isCredit ? "+" : "−"}
                          {formatCurrency(transaction.amount, currency)}
                        </p>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(transaction.status)}`}
                        >
                          {formatLabel(transaction.status)}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )
          ) : payments.length === 0 ? (
            <EmptyState
              title="No payments found"
              description="Payments associated with your services will appear here."
            />
          ) : (
            <div className="divide-y divide-slate-100">
              {payments.map((payment) => (
                <div
                  key={payment.paymentId}
                  className="flex flex-col gap-3 px-5 py-4 transition hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between sm:px-6"
                >
                  <div className="flex min-w-0 items-start gap-3">
                    <div className="mt-0.5 rounded-xl bg-blue-50 p-2.5 text-blue-700">
                      <CreditCard size={20} />
                    </div>

                    <div className="min-w-0">
                      <p className="font-semibold text-slate-900">
                        {formatLabel(payment.resourceType)}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {formatDate(payment.createdAt)}
                      </p>
                      <p className="mt-1 text-xs text-slate-400">
                        Payment ID: {payment.paymentId}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Provider: {formatLabel(payment.provider)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
                    <p className="text-base font-semibold text-slate-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <span
                      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClass(payment.status)}`}
                    >
                      {formatLabel(payment.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!listLoading &&
            ((tab === "transactions" && transactions.length > 0) ||
              (tab === "payments" && payments.length > 0)) && (
              <div className="border-t border-slate-100 px-5 py-5 text-center sm:px-6">
                {hasMore ? (
                  <button
                    type="button"
                    onClick={() => void loadMore()}
                    disabled={loadingMore}
                    className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {loadingMore ? (
                      <LoaderCircle size={17} className="animate-spin" />
                    ) : (
                      <Clock3 size={17} />
                    )}
                    {loadingMore ? "Loading..." : "Load more"}
                  </button>
                ) : (
                  <p className="text-sm text-slate-400">
                    You&apos;ve reached the end of the list.
                  </p>
                )}
              </div>
            )}
        </section>
      </div>
    </div>
  );
}
