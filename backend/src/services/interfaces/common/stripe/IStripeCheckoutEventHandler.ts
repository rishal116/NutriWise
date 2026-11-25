import Stripe from "stripe";

export type StripePaymentType = "nutritionist_plan" | "session_registration";

export interface IStripeCheckoutEventHandler {
  readonly paymentType: StripePaymentType;

  handle(session: Stripe.Checkout.Session): Promise<void>;
}
