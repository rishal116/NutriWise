export interface CreateCheckoutSessionRequestDTO {
  planId: string;
}

export interface CreateCheckoutSessionResponseDTO {
  success: boolean;
  message: string;
  data: {
    checkoutUrl: string;
  };
}

export type CheckoutPaymentStatus = "completed" | "pending" | "failed";

export interface CheckoutStatusData {
  status: CheckoutPaymentStatus;
  sessionId: string;
  amount?: number;
  currency?: string;
  itemTitle?: string;
  message?: string;
}

export interface CheckoutStatusResponseDTO {
  success: boolean;
  data: CheckoutStatusData;
}