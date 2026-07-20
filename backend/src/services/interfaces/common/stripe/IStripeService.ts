import { StripeCheckoutInputDTO } from "../../../dtos/common/stripe.dto";

export interface IStripeService {
  createCheckoutSession(
    stripeCheckoutInput: StripeCheckoutInputDTO,
  ): Promise<string>;
}