export interface IStripeWebhookService {
  process(payload: Buffer, signature: string): Promise<void>;
}
