export interface StripeCheckoutPlanInputDTO {
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


export interface StripeCheckoutSessionInputDTO {
  amount: number;      
  title: string;
  description: string;
  successUrl: string;
  cancelUrl: string;
  metadata: {
    userId: string;
    sessionId: string;
    type: string;
  };
}
