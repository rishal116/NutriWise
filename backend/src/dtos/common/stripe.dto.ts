export interface StripeCheckoutInputDTO {
  amount: number;          // in main currency unit (we convert to cents in StripeService)        // "INR", "USD" etc.
  title: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  metadata: {
    userId: string;
    planId: string;
    nutritionistId: string;
  };
}
