import Stripe from "stripe";

export interface IStripeWebhookVerifier {
  verify(payload: Buffer, signature: string): Stripe.Event;
}
