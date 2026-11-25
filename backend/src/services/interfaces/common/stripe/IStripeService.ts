import { StripeCheckoutInputDTO } from "../../../../dtos/common/stripe/stripe.dto";
import { StripeCheckoutSessionDTO } from "../../../../dtos/common/stripe/stripe-checkout-session.dto";

export interface IStripeService {
  createCheckoutSession(input: StripeCheckoutInputDTO): Promise<string>;

  retrieveCheckoutSession(sessionId: string): Promise<StripeCheckoutSessionDTO>;
}
