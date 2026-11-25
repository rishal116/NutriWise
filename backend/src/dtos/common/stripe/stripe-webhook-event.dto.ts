export interface StripeWebhookEventDTO {
  id: string;
  type: string;
  data: {
    object: unknown;
  };
}
