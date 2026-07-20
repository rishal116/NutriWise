import { injectable } from "inversify";
import { stripe } from "../../../../configs/stripe";
import { StripeCheckoutInputDTO } from "../../../../dtos/common/stripe.dto";
import { IStripeService } from "../../../interfaces/common/stripe/IStripeService";

@injectable()
export class StripeService implements IStripeService {
  async createCheckoutSession(
    stripeCheckoutInput: StripeCheckoutInputDTO,
  ): Promise<string> {
    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: stripeCheckoutInput.currency,

            product_data: {
              name: stripeCheckoutInput.title,
              description: stripeCheckoutInput.description,
            },

            unit_amount: Math.round(stripeCheckoutInput.amount * 100),
          },

          quantity: 1,
        },
      ],

      success_url: stripeCheckoutInput.successUrl,

      cancel_url: stripeCheckoutInput.cancelUrl,

      metadata: stripeCheckoutInput.metadata,
    });

    return checkoutSession.url!;
  }
}
