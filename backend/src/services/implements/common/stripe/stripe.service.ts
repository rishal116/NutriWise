import { injectable } from "inversify";

import { stripe } from "../../../../configs/stripe";
import { StripeCheckoutInputDTO } from "../../../../dtos/common/stripe/stripe.dto";
import { StripeCheckoutSessionDTO } from "../../../../dtos/common/stripe/stripe-checkout-session.dto";
import { IStripeService } from "../../../interfaces/common/stripe/IStripeService";

@injectable()
export class StripeService implements IStripeService {
  async createCheckoutSession(input: StripeCheckoutInputDTO): Promise<string> {
    this.validateCheckoutInput(input);

    const amountInMinorUnits = Math.round(input.amount * 100);

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: input.title.trim(),
              ...(input.description?.trim()
                ? { description: input.description.trim() }
                : {}),
            },
            unit_amount: amountInMinorUnits,
          },
          quantity: 1,
        },
      ],
      success_url: input.successUrl,
      cancel_url: input.cancelUrl,
      metadata: input.metadata,
    });

    if (!checkoutSession.url) {
      throw new Error("Stripe Checkout URL was not returned.");
    }

    return checkoutSession.url;
  }

  async retrieveCheckoutSession(
    sessionId: string,
  ): Promise<StripeCheckoutSessionDTO> {
    if (!sessionId.trim()) {
      throw new Error("Stripe checkout session ID is required.");
    }

    const checkoutSession = await stripe.checkout.sessions.retrieve(sessionId);

    const paymentIntent = checkoutSession.payment_intent;

    return {
      id: checkoutSession.id,
      url: checkoutSession.url,
      status: checkoutSession.status,
      paymentStatus: checkoutSession.payment_status,
      paymentIntentId:
        typeof paymentIntent === "string"
          ? paymentIntent
          : (paymentIntent?.id ?? null),
      amountTotal: checkoutSession.amount_total,
      currency: checkoutSession.currency,
      metadata: checkoutSession.metadata ?? {},
    };
  }

  private validateCheckoutInput(input: StripeCheckoutInputDTO): void {
    if (!input.title.trim()) {
      throw new Error("Checkout product title is required.");
    }

    if (!Number.isFinite(input.amount) || input.amount <= 0) {
      throw new Error("Checkout amount must be greater than zero.");
    }

    const amountInMinorUnits = Math.round(input.amount * 100);

    if (!Number.isSafeInteger(amountInMinorUnits)) {
      throw new Error("Checkout amount is invalid.");
    }

    this.validateUrl(input.successUrl, "success URL");
    this.validateUrl(input.cancelUrl, "cancel URL");

    if (!input.metadata || Object.keys(input.metadata).length === 0) {
      throw new Error("Checkout metadata is required.");
    }
  }

  private validateUrl(value: string, fieldName: string): void {
    try {
      const url = new URL(value);

      if (url.protocol !== "https:" && url.protocol !== "http:") {
        throw new Error();
      }
    } catch {
      throw new Error(`Invalid checkout ${fieldName}.`);
    }
  }
}
