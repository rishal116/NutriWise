import { stripe } from "../../../configs/stripe";
import { IStripeService } from "../../interfaces/common/IStripeService";
import { injectable } from "inversify";
import Stripe from "stripe";

@injectable()
export class StripeService implements IStripeService {
  async createCheckoutSession(data: {
    amount: number;
    title: string;
    description: string;
    successUrl: string;
    cancelUrl: string;
    metadata: Record<string, string>;
  }): Promise<string> {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: data.title,
              description: data.description,
            },
            unit_amount: Math.round(data.amount * 100),
          },
          quantity: 1,
        },
      ],
      success_url: data.successUrl,
      cancel_url: data.cancelUrl,
      metadata: data.metadata,
    });

    return session.url!;
  }

  async retrieveCheckoutSession(
    sessionId: string,
  ): Promise<Stripe.Checkout.Session> {
    return stripe.checkout.sessions.retrieve(sessionId);
  }
}