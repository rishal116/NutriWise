export interface IStripeService {
  createCheckoutSession(data: {
    amount: number;
    title: string;
    description: string;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, string>;
  }): Promise<string>;
}