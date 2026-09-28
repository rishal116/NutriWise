export type CheckoutPaymentStatus = "completed" | "pending" | "failed";

export class CheckoutStatusResponseDTO {
  status!: CheckoutPaymentStatus;
  sessionId!: string;
  amount?: number;
  currency?: string;
  itemTitle?: string;
  message?: string;
}
