export interface StripeCheckoutInputDTO {
  amount: number;      
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
