"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  CreditCard,
  FileText,
  LoaderCircle,
  RefreshCw,
  ShieldCheck,
  XCircle,
} from "lucide-react";

import { userPaymentService } from "@/services/user/user-payment.service";
import type { UserPaymentDTO } from "@/dtos/user/payment/user-payment.dto";

const STATUS_STYLES: Record<
  UserPaymentDTO["status"],
  { label: string; className: string }
> = {
  pending: {
    label: "Pending",
    className: "bg-amber-50 text-amber-700 ring-amber-600/20",
  },
  paid: {
    label: "Paid",
    className: "bg-emerald-50 text-emerald-700 ring-emerald-600/20",
  },
  failed: {
    label: "Failed",
    className: "bg-red-50 text-red-700 ring-red-600/20",
  },
  refunded: {
    label: "Refunded",
    className: "bg-blue-50 text-blue-700 ring-blue-600/20",
  },
};

function formatAmount(amount: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

function formatDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(date);
}

function formatDateTime(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "Unavailable";
  }

  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function formatResourceType(resourceType: UserPaymentDTO["resourceType"]): string {
  const labels: Record<UserPaymentDTO["resourceType"], string> = {
    nutritionist_plan: "Nutritionist plan",
    consultation_session: "Consultation session",
    session_registration: "Session registration",
  };

  return labels[resourceType];
}

function formatReason(reason: string): string {
  return reason
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export default function PaymentDetailsPage() {
  const params = useParams<{ paymentId: string }>();
  const paymentId = params.paymentId;

  const [payment, setPayment] = useState<UserPaymentDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPayment = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await userPaymentService.getPaymentById(paymentId);

      if (!response.success) {
        setError(response.message || "Unable to load payment details.");
        setPayment(null);
        return;
      }

      setPayment(response.data ?? null);
    } catch {
      setError("Unable to load payment details. Please try again.");
      setPayment(null);
    } finally {
      setIsLoading(false);
    }
  }, [paymentId]);

  useEffect(() => {
    void loadPayment();
  }, [loadPayment]);

  if (isLoading) {
    return (
      <main className="mx-auto flex min-h-[60vh] max-w-4xl items-center justify-center px-4">
        <div className="flex items-center gap-3 text-sm text-gray-500">
          <LoaderCircle className="h-5 w-5 animate-spin" />
          Loading payment details...
        </div>
      </main>
    );
  }

  if (error || !payment) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href="/user/payments"
          className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to payments
        </Link>

        <section className="rounded-2xl border border-gray-200 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
            <FileText className="h-6 w-6 text-red-600" />
          </div>

          <h1 className="text-lg font-semibold text-gray-900">
            {error ? "Unable to load payment" : "Payment not found"}
          </h1>

          <p className="mt-2 text-sm text-gray-500">
            {error ??
              "This payment may not exist or may not be available to your account."}
          </p>

          {error && (
            <button
              type="button"
              onClick={() => void loadPayment()}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-700"
            >
              <RefreshCw className="h-4 w-4" />
              Try again
            </button>
          )}
        </section>
      </main>
    );
  }

  const status = STATUS_STYLES[payment.status];

  return (
    <main className="mx-auto max-w-4xl space-y-6 px-4 py-8 sm:px-6 lg:py-10">
      <Link
        href="/user/payments"
        className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 transition hover:text-emerald-700"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to payments
      </Link>

      <section className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
        <div className="border-b border-gray-100 px-6 py-6 sm:px-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-50">
                <CreditCard className="h-6 w-6 text-emerald-700" />
              </div>

              <div>
                <p className="text-sm text-gray-500">Payment details</p>
                <h1 className="mt-1 text-xl font-semibold text-gray-900">
                  {payment.itemSnapshot.title}
                </h1>
                <p className="mt-1 text-sm text-gray-500">
                  {formatResourceType(payment.resourceType)}
                </p>
              </div>
            </div>

            <span
              className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold ring-1 ring-inset ${status.className}`}
            >
              {payment.status === "paid" && (
                <CheckCircle2 className="h-3.5 w-3.5" />
              )}
              {payment.status === "pending" && (
                <Clock3 className="h-3.5 w-3.5" />
              )}
              {payment.status === "failed" && (
                <XCircle className="h-3.5 w-3.5" />
              )}
              {payment.status === "refunded" && (
                <RefreshCw className="h-3.5 w-3.5" />
              )}
              {status.label}
            </span>
          </div>

          <div className="mt-8">
            <p className="text-sm text-gray-500">Payment amount</p>
            <p className="mt-1 text-3xl font-bold tracking-tight text-gray-900">
              {formatAmount(payment.amount, payment.currency)}
            </p>
          </div>
        </div>

        <div className="grid gap-6 px-6 py-6 sm:grid-cols-2 sm:px-8">
          <DetailItem
            icon={<CalendarDays className="h-4 w-4" />}
            label="Payment date"
            value={formatDateTime(payment.createdAt)}
          />

          <DetailItem
            icon={<CreditCard className="h-4 w-4" />}
            label="Payment provider"
            value={payment.provider.toUpperCase()}
          />

          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Item price"
            value={formatAmount(
              payment.itemSnapshot.price,
              payment.itemSnapshot.currency,
            )}
          />

          <DetailItem
            icon={<ShieldCheck className="h-4 w-4" />}
            label="Last updated"
            value={formatDateTime(payment.updatedAt)}
          />

          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Resource type"
            value={formatResourceType(payment.resourceType)}
          />

          <DetailItem
            icon={<FileText className="h-4 w-4" />}
            label="Payment reference"
            value={payment.id}
            mono
          />
        </div>
      </section>

      {payment.status === "refunded" && (
        <section className="rounded-2xl border border-blue-200 bg-blue-50/60 p-6 sm:p-8">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100">
              <RefreshCw className="h-5 w-5 text-blue-700" />
            </div>

            <div className="flex-1">
              <h2 className="font-semibold text-gray-900">Refund details</h2>
              <p className="mt-1 text-sm text-gray-600">
                Information about the refund for this payment.
              </p>

              <div className="mt-5 space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-gray-600">
                    Refunded amount
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatAmount(payment.refundedAmount, payment.currency)}
                  </span>
                </div>

                {payment.refundReason && (
                  <div>
                    <p className="text-sm text-gray-600">Refund reason</p>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatReason(payment.refundReason)}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm sm:p-8">
        <h2 className="font-semibold text-gray-900">Payment summary</h2>

        <div className="mt-5 space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">Item</span>
            <span className="text-right text-sm font-medium text-gray-900">
              {payment.itemSnapshot.title}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">Original price</span>
            <span className="text-sm font-medium text-gray-900">
              {formatAmount(
                payment.itemSnapshot.price,
                payment.itemSnapshot.currency,
              )}
            </span>
          </div>

          <div className="flex items-center justify-between gap-4">
            <span className="text-sm text-gray-600">Payment status</span>
            <span className="text-sm font-medium text-gray-900">
              {status.label}
            </span>
          </div>

          {payment.status === "refunded" && (
            <div className="flex items-center justify-between gap-4">
              <span className="text-sm text-gray-600">Refunded</span>
              <span className="text-sm font-medium text-blue-700">
                {formatAmount(payment.refundedAmount, payment.currency)}
              </span>
            </div>
          )}

          <div className="border-t border-gray-100 pt-4">
            <div className="flex items-center justify-between gap-4">
              <span className="font-semibold text-gray-900">
                Amount charged
              </span>
              <span className="text-lg font-bold text-gray-900">
                {formatAmount(payment.amount, payment.currency)}
              </span>
            </div>
          </div>
        </div>
      </section>

      <p className="text-center text-xs leading-5 text-gray-500">
        If you have a question about this payment, please contact NutriWise
        support.
      </p>
    </main>
  );
}

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string;
  mono?: boolean;
}

function DetailItem({ icon, label, value, mono = false }: DetailItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 text-gray-400">{icon}</div>

      <div className="min-w-0 flex-1">
        <p className="text-sm text-gray-500">{label}</p>
        <p
          className={`mt-1 break-words text-sm font-medium text-gray-900 ${
            mono ? "font-mono text-xs" : ""
          }`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}