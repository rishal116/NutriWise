import Stripe from "stripe";

export interface ISessionStripeCheckoutHandlerService {
  handle(session: Stripe.Checkout.Session): Promise<void>;
}
