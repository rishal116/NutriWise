import Stripe from "stripe";

export interface IStripeEventDispatcher {
  dispatch(event: Stripe.Event): Promise<void>;
}