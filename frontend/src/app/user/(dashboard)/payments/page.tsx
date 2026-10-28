"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowUpRight,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  Clock3,
  CreditCard,
  LoaderCircle,
  ReceiptText,
  RefreshCw,
  Wallet,
} from "lucide-react";

import { userPaymentService } from "@/services/user/user-payment.service";
import type { UserPaymentDTO } from "@/dtos/user/payment/user-payment.dto";
import type { UserWalletDTO } from "@/dtos/user/payment/user-wallet.dto";
import type { UserWalletTransactionDTO } from "@/dtos/user/payment/user-wallet-transaction.dto";

type PaymentTab = "payments" | "transactions";

const PAGE_SIZE = 10;

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatAmount(amount: number, currency = "INR"): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function getStatusStyles(status: string): string {
  switch (status) {
    case "paid":
    case "success":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "refunded":
      return "bg-blue-50 text-blue-700 ring-blue-600/20";
    case "failed":
      return "bg-rose-50 text-rose-700 ring-rose-600/20";
    default:
      return "bg-gray-50 text-gray-600 ring-gray-500/20";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusStyles(status)}`}
    >
      {status}
    </span>
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
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gray-100 text-gray-500">
        <ReceiptText className="h-6 w-6" />
      </div>
      <h3 className="text-base font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}

export default function UserPaymentsPage() {
  const [activeTab, setActiveTab] = useState<PaymentTab>("payments");

  const [wallet, setWallet] = useState<UserWalletDTO | null>(null);
  const [payments, setPayments] = useState<UserPaymentDTO[]>([]);
  const [transactions, setTransactions] = useState<UserWalletTransactionDTO[]>(
    [],
  );

  const [paymentsCursor, setPaymentsCursor] = useState<string | null>(null);
  const [transactionsCursor, setTransactionsCursor] = useState<string | null>(
    null,
  );

  const [paymentsHasMore, setPaymentsHasMore] = useState(false);
  const [transactionsHasMore, setTransactionsHasMore] = useState(false);

  const [hasLoadedTransactions, setHasLoadedTransactions] = useState(false);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadInitialData = useCallback(async (showLoader = true) => {
    if (showLoader) setIsInitialLoading(true);
    setError(null);

    const errors: string[] = [];

    const [walletResult, paymentsResult] = await Promise.allSettled([
      userPaymentService.getWallet(),
      userPaymentService.getPayments(PAGE_SIZE),
    ]);

    if (walletResult.status === "fulfilled") {
      const response = walletResult.value;

      if (response.success) {
        setWallet(response.data ?? null);
      } else {
        errors.push(response.message || "Couldn't load your wallet.");
      }
    } else {
      errors.push("Couldn't load your wallet.");
    }

    if (paymentsResult.status === "fulfilled") {
      const response = paymentsResult.value;

      if (response.success && response.data) {
        setPayments(response.data.items);
        setPaymentsCursor(response.data.nextCursor);
        setPaymentsHasMore(response.data.hasMore);
      } else {
        errors.push(response.message || "Couldn't load your payments.");
      }
    } else {
      errors.push("Couldn't load your payments.");
    }

    setError(errors.length > 0 ? errors.join(" ") : null);
    setIsInitialLoading(false);
  }, []);

  const loadTransactions = useCallback(
    async (cursor?: string, append = false) => {
      if (isLoadingMore) return;

      setIsLoadingMore(true);
      setError(null);

      try {
        const response = await userPaymentService.getWalletTransactions(
          PAGE_SIZE,
          cursor,
        );

        if (!response.success || !response.data) {
          setError(response.message || "Couldn't load wallet transactions.");
          return;
        }

        setTransactions((current) =>
          append ? [...current, ...response.data!.items] : response.data!.items,
        );
        setTransactionsCursor(response.data.nextCursor);
        setTransactionsHasMore(response.data.hasMore);
        setHasLoadedTransactions(true);
      } catch {
        setError("Couldn't load wallet transactions. Please try again.");
      } finally {
        setIsLoadingMore(false);
      }
    },
    [isLoadingMore],
  );

  useEffect(() => {
    void loadInitialData();
  }, [loadInitialData]);

  const handleTabChange = (tab: PaymentTab) => {
    setActiveTab(tab);
    setError(null);

    if (tab === "transactions" && !hasLoadedTransactions) {
      void loadTransactions();
    }
  };

  const handleLoadMore = async () => {
    if (isLoadingMore) return;

    if (activeTab === "payments" && paymentsCursor) {
      setIsLoadingMore(true);
      setError(null);

      try {
        const response = await userPaymentService.getPayments(
          PAGE_SIZE,
          paymentsCursor,
        );

        if (!response.success || !response.data) {
          setError(response.message || "Couldn't load more payments.");
          return;
        }

        setPayments((current) => [...current, ...response.data!.items]);
        setPaymentsCursor(response.data.nextCursor);
        setPaymentsHasMore(response.data.hasMore);
      } catch {
        setError("Couldn't load more payments. Please try again.");
      } finally {
        setIsLoadingMore(false);
      }
    } else if (activeTab === "transactions" && transactionsCursor) {
      await loadTransactions(transactionsCursor, true);
    }
  };

  const handleRefresh = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      await loadInitialData(false);

      if (hasLoadedTransactions) {
        await loadTransactions();
      }
    } finally {
      setIsRefreshing(false);
    }
  };

  const paidCount = payments.filter(
    (payment) => payment.status === "paid",
  ).length;

  const refundedCount = payments.filter(
    (payment) => payment.status === "refunded",
  ).length;

  if (isInitialLoading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <LoaderCircle className="h-8 w-8 animate-spin text-emerald-600" />
          <p className="text-sm text-gray-500">
            Loading your payment information...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-7xl space-y-7 px-4 py-6 sm:px-6 lg:px-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-emerald-700">
            Account & finances
          </p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-gray-950 sm:text-3xl">
            Payments
          </h1>
          <p className="mt-2 text-sm text-gray-500">
            Manage your payments and track your wallet activity.
          </p>
        </div>

        <button
          type="button"
          onClick={() => void handleRefresh()}
          disabled={isRefreshing}
          className="inline-flex h-10 items-center justify-center gap-2 self-start rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:opacity-60 sm:self-auto"
        >
          <RefreshCw
            className={`h-4 w-4 ${isRefreshing ? "animate-spin" : ""}`}
          />
          Refresh
        </button>
      </div>

      {error && (
        <div
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-sm text-rose-700">{error}</p>
          <button
            type="button"
            onClick={() => {
              if (activeTab === "payments") {
                void loadInitialData();
              } else {
                void loadTransactions();
              }
            }}
            className="self-start text-sm font-semibold text-rose-700 hover:text-rose-900 sm:self-auto"
          >
            Try again
          </button>
        </div>
      )}

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Available wallet balance
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950">
                {wallet
                  ? formatAmount(wallet.availableBalance, wallet.currency)
                  : "—"}
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                Funds currently available in your wallet
              </p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700">
              <Wallet className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Wallet escrow balance
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950">
                {wallet
                  ? formatAmount(wallet.escrowBalance, wallet.currency)
                  : "—"}
              </h2>
              <p className="mt-2 text-xs text-gray-500">
                Funds currently held in escrow
              </p>
            </div>
            <div className="rounded-xl bg-blue-50 p-3 text-blue-700">
              <CreditCard className="h-5 w-5" />
            </div>
          </div>
        </div>

        <div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm sm:col-span-2 xl:col-span-1">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500">
                Payments loaded
              </p>
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-950">
                {payments.length}
              </h2>
              <div className="mt-2 flex flex-wrap gap-3 text-xs">
                <span className="inline-flex items-center gap-1 text-emerald-700">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {paidCount} paid
                </span>
                <span className="inline-flex items-center gap-1 text-blue-700">
                  <RefreshCw className="h-3.5 w-3.5" />
                  {refundedCount} refunded
                </span>
              </div>
            </div>
            <div className="rounded-xl bg-violet-50 p-3 text-violet-700">
              <ReceiptText className="h-5 w-5" />
            </div>
          </div>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-200 px-5 pt-5 sm:px-6">
          <h2 className="text-lg font-semibold text-gray-950">
            Transaction history
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Review your payments and wallet activity.
          </p>

          <div className="mt-5 flex gap-6">
            {(["payments", "transactions"] as const).map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => handleTabChange(tab)}
                className={`relative pb-3 text-sm font-medium transition ${
                  activeTab === tab
                    ? "text-emerald-700"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                {tab === "payments" ? "Payments" : "Wallet transactions"}
                {activeTab === tab && (
                  <span className="absolute inset-x-0 bottom-0 h-0.5 rounded-full bg-emerald-600" />
                )}
              </button>
            ))}
          </div>
        </div>

        {activeTab === "payments" ? (
          payments.length === 0 ? (
            <EmptyState
              title="No payments yet"
              description="Your purchases and payment records will appear here when you make a payment."
            />
          ) : (
            <>
              <div className="divide-y divide-gray-100">
                {payments.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50/70 sm:px-6 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-600">
                        <ReceiptText className="h-5 w-5" />
                      </div>

                      <div className="min-w-0">
                        <h3 className="truncate text-sm font-semibold text-gray-900">
                          {payment.itemSnapshot.title}
                        </h3>
                        <p className="mt-1 text-xs capitalize text-gray-500">
                          {payment.resourceType.replaceAll("_", " ")}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {formatDate(payment.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end md:min-w-48">
                      <div className="md:text-right">
                        <p className="text-base font-semibold text-gray-950">
                          {formatAmount(payment.amount, payment.currency)}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={payment.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {paymentsHasMore && (
                <div className="border-t border-gray-100 px-5 py-4 text-center sm:px-6">
                  <button
                    type="button"
                    onClick={() => void handleLoadMore()}
                    disabled={isLoadingMore}
                    className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {isLoadingMore ? (
                      <LoaderCircle className="h-4 w-4 animate-spin" />
                    ) : (
                      <ChevronDown className="h-4 w-4" />
                    )}
                    Load more payments
                  </button>
                </div>
              )}
            </>
          )
        ) : isLoadingMore && !hasLoadedTransactions ? (
          <div className="flex justify-center py-12">
            <LoaderCircle className="h-6 w-6 animate-spin text-emerald-600" />
          </div>
        ) : transactions.length === 0 ? (
          <EmptyState
            title="No wallet transactions"
            description="Credits and debits recorded in your wallet will appear here."
          />
        ) : (
          <>
            <div className="divide-y divide-gray-100">
              {transactions.map((transaction) => {
                const isCredit = transaction.type === "credit";

                return (
                  <div
                    key={transaction.id}
                    className="flex flex-col gap-4 px-5 py-5 transition hover:bg-gray-50/70 sm:px-6 md:flex-row md:items-center md:justify-between"
                  >
                    <div className="flex min-w-0 items-start gap-3">
                      <div
                        className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${
                          isCredit
                            ? "bg-emerald-50 text-emerald-700"
                            : "bg-orange-50 text-orange-700"
                        }`}
                      >
                        {isCredit ? (
                          <ArrowDownLeft className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-5 w-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold capitalize text-gray-900">
                          {transaction.reason.replaceAll("_", " ")}
                        </h3>
                        <p className="mt-1 break-all text-xs text-gray-500">
                          Reference: {transaction.referenceId}
                        </p>
                        <p className="mt-2 flex items-center gap-1.5 text-xs text-gray-500">
                          <Clock3 className="h-3.5 w-3.5" />
                          {formatDateTime(transaction.createdAt)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-4 sm:justify-end md:min-w-48">
                      <div className="md:text-right">
                        <p
                          className={`text-base font-semibold ${
                            isCredit ? "text-emerald-700" : "text-gray-950"
                          }`}
                        >
                          {isCredit ? "+" : "−"}
                          {formatAmount(
                            transaction.amount,
                            wallet?.currency ?? "INR",
                          )}
                        </p>
                        <div className="mt-2">
                          <StatusBadge status={transaction.status} />
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {transactionsHasMore && (
              <div className="border-t border-gray-100 px-5 py-4 text-center sm:px-6">
                <button
                  type="button"
                  onClick={() => void handleLoadMore()}
                  disabled={isLoadingMore}
                  className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isLoadingMore ? (
                    <LoaderCircle className="h-4 w-4 animate-spin" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                  Load more transactions
                </button>
              </div>
            )}
          </>
        )}
      </section>

      <p className="text-center text-xs text-gray-400">
        Payment records reflect the information currently available in your
        account.
      </p>
    </div>
  );
}
