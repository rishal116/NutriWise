export interface IStripeWebhookService {
  handleWebhook(payload: Buffer, signature: string): Promise<void>;
}
