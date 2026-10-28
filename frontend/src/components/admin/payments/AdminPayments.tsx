"use client";

import { useCallback, useEffect, useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronDown,
  CreditCard,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  Wallet,
  X,
} from "lucide-react";

import { adminPaymentService } from "@/services/admin/admin-payment.service";

import type {
  AdminPaymentDTO,
  AdminPaymentQueryDTO,
} from "@/dtos/admin/payment/admin-payment.dto";
import type { AdminWalletDTO } from "@/dtos/admin/payment/admin-wallet.dto";
import type {
  AdminWalletTransactionDTO,
  WalletTransactionStatus,
} from "@/dtos/admin/payment/admin-wallet-transaction.dto";
import type { AdminPaymentStatisticsDTO } from "@/dtos/admin/payment/admin-payment-statistics.dto";

type Tab = "payments" | "wallets";
type PaymentStatusFilter = "all" | "pending" | "paid" | "failed" | "refunded";
type OwnerFilter = "all" | "admin" | "nutritionist" | "user";

const PAGE_SIZE = 10;

const PAYMENT_STATUSES: PaymentStatusFilter[] = [
  "all",
  "paid",
  "pending",
  "failed",
  "refunded",
];

function formatCurrency(amount: number, currency = "INR"): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

function formatDate(value?: string): string {
  if (!value) return "—";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "—";

  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function formatLabel(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function getId(value: string | { _id?: string }): string {
  return typeof value === "string" ? value : (value._id ?? "");
}

function getStatusClasses(status: string): string {
  switch (status) {
    case "paid":
    case "success":
      return "bg-emerald-50 text-emerald-700 ring-emerald-600/20";
    case "pending":
      return "bg-amber-50 text-amber-700 ring-amber-600/20";
    case "failed":
      return "bg-red-50 text-red-700 ring-red-600/20";
    case "refunded":
      return "bg-purple-50 text-purple-700 ring-purple-600/20";
    default:
      return "bg-gray-50 text-gray-700 ring-gray-600/20";
  }
}

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-medium capitalize ring-1 ring-inset ${getStatusClasses(status)}`}
    >
      {formatLabel(status)}
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
    <div className="flex flex-col items-center justify-center px-4 py-14 text-center">
      <div className="mb-3 rounded-full bg-gray-100 p-3">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-gray-500">{description}</p>
    </div>
  );
}

function StatCard({
  title,
  value,
  description,
  icon: Icon,
}: {
  title: string;
  value: string;
  description: string;
  icon: typeof Wallet;
}) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm text-gray-500">{title}</p>
          <p className="mt-2 break-words text-xl font-semibold tracking-tight text-gray-900 sm:text-2xl">
            {value}
          </p>
          <p className="mt-1 text-xs text-gray-500">{description}</p>
        </div>
        <div className="rounded-lg bg-gray-100 p-2.5">
          <Icon className="h-5 w-5 text-gray-600" />
        </div>
      </div>
    </div>
  );
}

export default function AdminPayments() {
  const [activeTab, setActiveTab] = useState<Tab>("payments");

  const [statistics, setStatistics] =
    useState<AdminPaymentStatisticsDTO | null>(null);
  const [payments, setPayments] = useState<AdminPaymentDTO[]>([]);
  const [wallets, setWallets] = useState<AdminWalletDTO[]>([]);
  const [transactions, setTransactions] = useState<AdminWalletTransactionDTO[]>(
    [],
  );

  const [selectedPayment, setSelectedPayment] =
    useState<AdminPaymentDTO | null>(null);
  const [selectedWallet, setSelectedWallet] = useState<AdminWalletDTO | null>(
    null,
  );

  const [paymentStatus, setPaymentStatus] =
    useState<PaymentStatusFilter>("all");
  const [ownerType, setOwnerType] = useState<OwnerFilter>("all");
  const [search, setSearch] = useState("");

  const [paymentCursor, setPaymentCursor] = useState<string | undefined>();
  const [walletCursor, setWalletCursor] = useState<string | undefined>();
  const [transactionCursor, setTransactionCursor] = useState<
    string | undefined
  >();

  const [paymentHasMore, setPaymentHasMore] = useState(false);
  const [walletHasMore, setWalletHasMore] = useState(false);
  const [transactionHasMore, setTransactionHasMore] = useState(false);

  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false);
  const [transactionsLoading, setTransactionsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadStatistics = useCallback(async () => {
    const response = await adminPaymentService.getPaymentStatistics();

    if (response.success && response.data) {
      setStatistics(response.data);
    }
  }, []);

  const loadPayments = useCallback(
    async (cursor?: string, append = false) => {
      const filters: AdminPaymentQueryDTO = {
        limit: PAGE_SIZE,
        cursor,
        search: search.trim() || undefined,
        status: paymentStatus === "all" ? undefined : paymentStatus,
      };

      const response = await adminPaymentService.getPayments(filters);

      if (!response.success || !response.data) {
        return;
      }

      const result = response.data;

      setPayments((previous) =>
        append ? [...previous, ...result.items] : result.items,
      );
      setPaymentCursor(result.nextCursor ?? undefined);
      setPaymentHasMore(result.hasMore);
    },
    [paymentStatus, search],
  );

  const loadWallets = useCallback(
    async (cursor?: string, append = false) => {
      const response = await adminPaymentService.getWallets({
        limit: PAGE_SIZE,
        cursor,
        search: search.trim() || undefined,
        ownerType: ownerType === "all" ? undefined : ownerType,
      });

      if (!response.success || !response.data) {
        return;
      }

      const result = response.data;

      setWallets((previous) =>
        append ? [...previous, ...result.items] : result.items,
      );
      setWalletCursor(result.nextCursor ?? undefined);
      setWalletHasMore(result.hasMore);
    },
    [ownerType, search],
  );

  const loadTransactions = useCallback(
    async (walletId: string, cursor?: string, append = false) => {
      setTransactionsLoading(true);

      try {
        const response = await adminPaymentService.getWalletTransactions(
          walletId,
          { limit: PAGE_SIZE, cursor },
        );

        if (!response.success || !response.data) {
          setError("Unable to load wallet transactions.");
          return;
        }

        const result = response.data;

        setTransactions((previous) =>
          append ? [...previous, ...result.items] : result.items,
        );
        setTransactionCursor(result.nextCursor ?? undefined);
        setTransactionHasMore(result.hasMore);
      } catch {
        setError("Unable to load wallet transactions.");
      } finally {
        setTransactionsLoading(false);
      }
    },
    [],
  );

  const refreshData = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      await Promise.all([
        loadStatistics(),
        activeTab === "payments" ? loadPayments() : loadWallets(),
      ]);
    } catch {
      setError("Unable to load financial data. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [activeTab, loadPayments, loadStatistics, loadWallets]);

  useEffect(() => {
    let cancelled = false;

    async function loadInitialData() {
      setLoading(true);
      setError(null);

      try {
        const results = await Promise.allSettled([
          loadStatistics(),
          activeTab === "payments" ? loadPayments() : loadWallets(),
        ]);

        if (
          !cancelled &&
          results.some((result) => result.status === "rejected")
        ) {
          setError("Some financial data could not be loaded. Please refresh.");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void loadInitialData();

    return () => {
      cancelled = true;
    };
  }, [activeTab, loadPayments, loadStatistics, loadWallets]);

  const openPayment = async (paymentId: string) => {
    setSelectedPayment(null);
    setDetailLoading(true);
    setError(null);

    try {
      const response = await adminPaymentService.getPaymentById(paymentId);

      if (response.success && response.data) {
        setSelectedPayment(response.data);
      } else {
        setError("Unable to load payment details.");
      }
    } catch {
      setError("Unable to load payment details.");
    } finally {
      setDetailLoading(false);
    }
  };

  const openWallet = async (wallet: AdminWalletDTO) => {
    setSelectedWallet(wallet);
    setTransactions([]);
    setTransactionCursor(undefined);
    setTransactionHasMore(false);
    setError(null);

    await loadTransactions(wallet._id);
  };

  const closeWallet = () => {
    setSelectedWallet(null);
    setTransactions([]);
    setTransactionCursor(undefined);
    setTransactionHasMore(false);
  };

  const changeTab = (tab: Tab) => {
    setActiveTab(tab);
    setSearch("");
    setPaymentStatus("all");
    setOwnerType("all");
    setPaymentCursor(undefined);
    setWalletCursor(undefined);
  };

  const clearPaymentFilters = () => {
    setSearch("");
    setPaymentStatus("all");
  };

  const clearWalletFilters = () => {
    setSearch("");
    setOwnerType("all");
  };

  const currency = "INR";

  return (
    <div className="space-y-6">
      {error && (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <span>{error}</span>
          <button
            type="button"
            onClick={() => void refreshData()}
            className="font-medium underline underline-offset-2"
          >
            Retry
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total payments"
          value={
            statistics ? statistics.totalPayments.toLocaleString("en-IN") : "—"
          }
          description="All recorded payments"
          icon={CreditCard}
        />
        <StatCard
          title="Total revenue"
          value={
            statistics ? formatCurrency(statistics.totalRevenue, currency) : "—"
          }
          description={`${statistics?.paidPayments ?? 0} successful payments`}
          icon={ArrowDownLeft}
        />
        <StatCard
          title="Commission earned"
          value={
            statistics
              ? formatCurrency(statistics.totalCommission, currency)
              : "—"
          }
          description="Commission from paid payments"
          icon={ArrowUpRight}
        />
        <StatCard
          title="Total refunded"
          value={
            statistics
              ? formatCurrency(statistics.totalRefunded, currency)
              : "—"
          }
          description={`${statistics?.refundedPayments ?? 0} refunded payments`}
          icon={RefreshCw}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-gray-200">
        <div className="flex gap-6">
          <button
            type="button"
            onClick={() => changeTab("payments")}
            className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${
              activeTab === "payments"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <CreditCard className="h-4 w-4" />
            Payments
          </button>
          <button
            type="button"
            onClick={() => changeTab("wallets")}
            className={`inline-flex items-center gap-2 border-b-2 px-1 pb-3 text-sm font-medium transition ${
              activeTab === "wallets"
                ? "border-gray-900 text-gray-900"
                : "border-transparent text-gray-500 hover:text-gray-800"
            }`}
          >
            <Wallet className="h-4 w-4" />
            Wallets
          </button>
        </div>

        <button
          type="button"
          onClick={() => void refreshData()}
          disabled={loading}
          className="mb-2 inline-flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </button>
      </div>

      {activeTab === "payments" ? (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Payment records
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review transactions, payment status, and refunds.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => {
                    setSearch(event.target.value);
                    setPaymentCursor(undefined);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void loadPayments();
                  }}
                  placeholder="Search payments..."
                  className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none transition focus:border-gray-400 focus:ring-2 focus:ring-gray-100 sm:w-56"
                />
              </div>

              <div className="relative">
                <select
                  value={paymentStatus}
                  onChange={(event) => {
                    setPaymentStatus(event.target.value as PaymentStatusFilter);
                    setPaymentCursor(undefined);
                  }}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm outline-none focus:border-gray-400 sm:w-40"
                >
                  {PAYMENT_STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status === "all" ? "All statuses" : formatLabel(status)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <button
                type="button"
                onClick={clearPaymentFilters}
                className="h-10 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[850px] divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Payment",
                      "Item",
                      "Amount",
                      "Commission",
                      "Status",
                      "Date",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {!loading &&
                    payments.map((payment) => (
                      <tr key={payment._id} className="hover:bg-gray-50/70">
                        <td className="px-4 py-4">
                          <p className="font-medium text-gray-900">
                            #{payment._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {formatLabel(payment.resourceType)}
                          </p>
                        </td>
                        <td className="max-w-52 px-4 py-4">
                          <p className="truncate text-sm font-medium text-gray-800">
                            {payment.itemSnapshot.title}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            {payment.provider.toUpperCase()}
                          </p>
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(payment.amount, payment.currency)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-600">
                          {formatCurrency(
                            payment.commissionAmount,
                            payment.currency,
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge status={payment.status} />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {formatDate(payment.createdAt)}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => void openPayment(payment._id)}
                            aria-label="View payment details"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Details
                          </button>
                        </td>
                      </tr>
                    ))}

                  {loading && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Loading payments...
                        </p>
                      </td>
                    </tr>
                  )}

                  {!loading && payments.length === 0 && (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState
                          title="No payments found"
                          description="Try changing your search or status filters."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {payments.length} payment
              {payments.length === 1 ? "" : "s"}
              {paymentHasMore ? " on this page and previous pages" : ""}
            </p>
            <button
              type="button"
              disabled={loading || !paymentHasMore || !paymentCursor}
              onClick={async () => {
                setLoading(true);
                try {
                  await loadPayments(paymentCursor, true);
                } catch {
                  setError("Unable to load more payments.");
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Load more
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      ) : (
        <section className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-base font-semibold text-gray-900">
                Wallet management
              </h2>
              <p className="mt-1 text-sm text-gray-500">
                Review wallet balances and inspect transaction history.
              </p>
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <div className="relative">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") void loadWallets();
                  }}
                  placeholder="Search wallets..."
                  className="h-10 w-full rounded-lg border border-gray-200 pl-9 pr-3 text-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-100 sm:w-56"
                />
              </div>

              <div className="relative">
                <select
                  value={ownerType}
                  onChange={(event) => {
                    setOwnerType(event.target.value as OwnerFilter);
                    setWalletCursor(undefined);
                  }}
                  className="h-10 w-full appearance-none rounded-lg border border-gray-200 bg-white py-2 pl-3 pr-9 text-sm outline-none focus:border-gray-400 sm:w-44"
                >
                  <option value="all">All owners</option>
                  <option value="admin">Admin</option>
                  <option value="nutritionist">Nutritionist</option>
                  <option value="user">User</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              </div>

              <button
                type="button"
                onClick={clearWalletFilters}
                className="h-10 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 hover:bg-gray-50"
              >
                Clear
              </button>
            </div>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[760px] divide-y divide-gray-200 text-left">
                <thead className="bg-gray-50">
                  <tr>
                    {[
                      "Wallet",
                      "Owner type",
                      "Available balance",
                      "Escrow balance",
                      "Status",
                      "Last activity",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                  {!loading &&
                    wallets.map((wallet) => (
                      <tr key={wallet._id} className="hover:bg-gray-50/70">
                        <td className="px-4 py-4">
                          <p className="font-medium text-gray-900">
                            #{wallet._id.slice(-8).toUpperCase()}
                          </p>
                          <p className="mt-1 text-xs text-gray-500">
                            Owner: {getId(wallet.ownerId).slice(-8)}
                          </p>
                        </td>
                        <td className="px-4 py-4 text-sm text-gray-700">
                          {formatLabel(wallet.ownerType)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm font-medium text-gray-900">
                          {formatCurrency(
                            wallet.availableBalance,
                            wallet.currency,
                          )}
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-700">
                          {formatCurrency(
                            wallet.escrowBalance,
                            wallet.currency,
                          )}
                        </td>
                        <td className="px-4 py-4">
                          <StatusBadge
                            status={wallet.isActive ? "success" : "inactive"}
                          />
                        </td>
                        <td className="whitespace-nowrap px-4 py-4 text-sm text-gray-500">
                          {formatDate(wallet.lastTransactionAt)}
                        </td>
                        <td className="px-4 py-4">
                          <button
                            type="button"
                            onClick={() => void openWallet(wallet)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-gray-200 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-100"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            Transactions
                          </button>
                        </td>
                      </tr>
                    ))}

                  {loading && (
                    <tr>
                      <td colSpan={7} className="px-4 py-12 text-center">
                        <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                        <p className="mt-2 text-sm text-gray-500">
                          Loading wallets...
                        </p>
                      </td>
                    </tr>
                  )}

                  {!loading && wallets.length === 0 && (
                    <tr>
                      <td colSpan={7}>
                        <EmptyState
                          title="No wallets found"
                          description="Try another owner type or search term."
                        />
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-gray-500">
              Showing {wallets.length} wallet{wallets.length === 1 ? "" : "s"}
            </p>
            <button
              type="button"
              disabled={loading || !walletHasMore || !walletCursor}
              onClick={async () => {
                setLoading(true);
                try {
                  await loadWallets(walletCursor, true);
                } catch {
                  setError("Unable to load more wallets.");
                } finally {
                  setLoading(false);
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Load more
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </section>
      )}

      {selectedPayment && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
          onClick={() => setSelectedPayment(null)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-detail-title"
            className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-gray-200 p-5">
              <div>
                <h2
                  id="payment-detail-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Payment details
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  #{selectedPayment._id}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                aria-label="Close payment details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-5 p-5">
              <div className="flex items-center justify-between gap-4 rounded-xl bg-gray-50 p-4">
                <div>
                  <p className="text-sm text-gray-500">Payment amount</p>
                  <p className="mt-1 text-2xl font-semibold text-gray-900">
                    {formatCurrency(
                      selectedPayment.amount,
                      selectedPayment.currency,
                    )}
                  </p>
                </div>
                <StatusBadge status={selectedPayment.status} />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {[
                  ["Item", selectedPayment.itemSnapshot.title],
                  ["Resource type", formatLabel(selectedPayment.resourceType)],
                  ["Provider", selectedPayment.provider.toUpperCase()],
                  [
                    "Commission",
                    formatCurrency(
                      selectedPayment.commissionAmount,
                      selectedPayment.currency,
                    ),
                  ],
                  [
                    "Refunded amount",
                    formatCurrency(
                      selectedPayment.refundedAmount,
                      selectedPayment.currency,
                    ),
                  ],
                  ["Created", formatDate(selectedPayment.createdAt)],
                  ["Customer ID", getId(selectedPayment.userId)],
                  [
                    "Seller ID",
                    selectedPayment.sellerId
                      ? getId(selectedPayment.sellerId)
                      : "—",
                  ],
                  ["Payment intent", selectedPayment.paymentIntentId ?? "—"],
                  ["Charge ID", selectedPayment.chargeId ?? "—"],
                  [
                    "Checkout session",
                    selectedPayment.checkoutSessionId ?? "—",
                  ],
                  ["Refund reason", selectedPayment.refundReason ?? "—"],
                ].map(([label, value]) => (
                  <div key={label} className="min-w-0">
                    <p className="text-xs font-medium text-gray-500">{label}</p>
                    <p className="mt-1 break-words text-sm text-gray-900">
                      {value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end border-t border-gray-200 p-4">
              <button
                type="button"
                onClick={() => setSelectedPayment(null)}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {detailLoading && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/30">
          <div className="flex items-center gap-3 rounded-xl bg-white px-5 py-4 shadow-lg">
            <Loader2 className="h-5 w-5 animate-spin text-gray-700" />
            <span className="text-sm font-medium text-gray-700">
              Loading payment details...
            </span>
          </div>
        </div>
      )}

      {selectedWallet && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-3 sm:p-5"
          onClick={closeWallet}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="wallet-detail-title"
            className="flex max-h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-2xl bg-white shadow-xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex flex-wrap items-start justify-between gap-3 border-b border-gray-200 p-5">
              <div>
                <button
                  type="button"
                  onClick={closeWallet}
                  className="mb-3 inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to wallets
                </button>
                <h2
                  id="wallet-detail-title"
                  className="text-lg font-semibold text-gray-900"
                >
                  Wallet transactions
                </h2>
                <p className="mt-1 text-sm text-gray-500">
                  {formatLabel(selectedWallet.ownerType)} · #
                  {selectedWallet._id}
                </p>
              </div>
              <button
                type="button"
                onClick={closeWallet}
                aria-label="Close wallet details"
                className="rounded-lg p-2 text-gray-500 hover:bg-gray-100"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 border-b border-gray-200 p-5 sm:grid-cols-2">
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Available balance</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(
                    selectedWallet.availableBalance,
                    selectedWallet.currency,
                  )}
                </p>
              </div>
              <div className="rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">Escrow balance</p>
                <p className="mt-2 text-xl font-semibold text-gray-900">
                  {formatCurrency(
                    selectedWallet.escrowBalance,
                    selectedWallet.currency,
                  )}
                </p>
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-5">
              <h3 className="mb-4 text-sm font-semibold text-gray-900">
                Transaction history
              </h3>

              {transactionsLoading ? (
                <div className="py-12 text-center">
                  <Loader2 className="mx-auto h-6 w-6 animate-spin text-gray-400" />
                  <p className="mt-2 text-sm text-gray-500">
                    Loading transactions...
                  </p>
                </div>
              ) : transactions.length === 0 ? (
                <EmptyState
                  title="No transactions found"
                  description="This wallet does not have any transactions to display."
                />
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200">
                  <table className="w-full min-w-[650px] divide-y divide-gray-200 text-left">
                    <thead className="bg-gray-50">
                      <tr>
                        {[
                          "Transaction",
                          "Reason",
                          "Amount",
                          "Balance after",
                          "Status",
                          "Date",
                        ].map((heading) => (
                          <th
                            key={heading}
                            className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500"
                          >
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {transactions.map((transaction) => (
                        <tr key={transaction._id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <span
                                className={`rounded-full p-1.5 ${
                                  transaction.type === "credit"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                                }`}
                              >
                                {transaction.type === "credit" ? (
                                  <ArrowDownLeft className="h-4 w-4" />
                                ) : (
                                  <ArrowUpRight className="h-4 w-4" />
                                )}
                              </span>
                              <div>
                                <p className="text-sm font-medium text-gray-900">
                                  {formatLabel(transaction.type)}
                                </p>
                                <p className="text-xs text-gray-500">
                                  Ref: {transaction.referenceId}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-sm text-gray-700">
                            {formatLabel(transaction.reason)}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900">
                            {transaction.type === "credit" ? "+" : "−"}
                            {formatCurrency(
                              transaction.amount,
                              selectedWallet.currency,
                            )}
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-700">
                            {formatCurrency(
                              transaction.balanceAfter,
                              selectedWallet.currency,
                            )}
                          </td>
                          <td className="px-4 py-3">
                            <StatusBadge
                              status={
                                transaction.status as WalletTransactionStatus
                              }
                            />
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-500">
                            {formatDate(transaction.createdAt)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {transactionHasMore && transactionCursor && (
                <div className="mt-4 flex justify-center">
                  <button
                    type="button"
                    disabled={transactionsLoading}
                    onClick={() =>
                      void loadTransactions(
                        selectedWallet._id,
                        transactionCursor,
                        true,
                      )
                    }
                    className="inline-flex items-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  >
                    {transactionsLoading && (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    )}
                    Load more transactions
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </div>

            <div className="flex justify-end border-t border-gray-200 p-4">
              <button
                type="button"
                onClick={closeWallet}
                className="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
