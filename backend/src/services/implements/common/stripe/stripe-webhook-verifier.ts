import Stripe from "stripe";
import { injectable } from "inversify";

import { stripe } from "../../../../configs/stripe";
import logger from "../../../../utils/logger";

import { IStripeWebhookVerifier } from "../../../interfaces/common/stripe/IStripeWebhookVerifier";

@injectable()
export class StripeWebhookVerifier implements IStripeWebhookVerifier {
  verify(payload: Buffer, signature: string): Stripe.Event {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      logger.error("Stripe webhook secret is not configured.");
      throw new Error("Stripe webhook configuration is missing.");
    }

    if (!Buffer.isBuffer(payload) || payload.length === 0) {
      throw new Error("Stripe webhook payload is invalid.");
    }

    if (!signature.trim()) {
      throw new Error("Stripe webhook signature is missing.");
    }

    try {
      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      logger.error("Stripe webhook signature verification failed.", {
        error,
      });

      throw new Error("Invalid Stripe webhook signature.");
    }
  }
}
