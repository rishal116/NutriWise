export interface StripeCheckoutInputDTO {
  title: string;
  description?: string;
  amount: number;
  successUrl: string;
  cancelUrl: string;
  metadata: Record<string, string>;
}
