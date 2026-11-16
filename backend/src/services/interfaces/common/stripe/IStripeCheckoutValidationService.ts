import type Stripe from "stripe";
import type { StripeCheckoutData } from "../../../../dtos/common/stripe/stripe-checkout.dto";

export interface IStripeCheckoutValidationService {
  validate(session: Stripe.Checkout.Session): Promise<StripeCheckoutData>;
}
