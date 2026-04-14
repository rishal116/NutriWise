// types/checkout.types.ts

export interface CreateCheckoutSessionPayload {
  planId: string;
  nutritionistId: string;
}

export interface CreateCheckoutSessionResponse {
  success: boolean;
  message: string;
  sessionId?: string;
  url?: string; // Stripe redirect URL
}