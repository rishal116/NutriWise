export interface StripeCheckoutSessionDTO {
  id: string;
  url: string | null;
  status: "open" | "complete" | "expired" | null;
  paymentStatus: "paid" | "unpaid" | "no_payment_required";
  paymentIntentId: string | null;
  amountTotal: number | null;
  currency: string | null;
  metadata: Record<string, string>;
}
