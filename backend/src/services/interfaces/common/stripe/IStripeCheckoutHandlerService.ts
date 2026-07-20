import Stripe from "stripe";

export interface IStripeCheckoutHandlerService {
  handle(session: Stripe.Checkout.Session): Promise<void>;
}
