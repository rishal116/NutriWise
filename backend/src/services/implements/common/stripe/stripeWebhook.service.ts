import Stripe from "stripe";
import { inject, injectable } from "inversify";

import { stripe } from "../../../../configs/stripe";
import { TYPES } from "../../../../types/types";
import logger from "../../../../utils/logger";

import { IStripeWebhookService } from "../../../interfaces/common/stripe/IStripeWebhookService";
import { IStripeCheckoutHandlerService } from "../../../interfaces/common/stripe/IStripeCheckoutHandlerService";
import { ISessionStripeCheckoutHandlerService } from "../../../interfaces/common/stripe/ISessionStripeCheckoutHandlerService";

@injectable()
export class StripeWebhookService implements IStripeWebhookService {
  constructor(
    @inject(TYPES.IStripeCheckoutHandlerService)
    private readonly _checkoutHandler: IStripeCheckoutHandlerService,

    @inject(TYPES.ISessionStripeCheckoutHandlerService)
    private readonly _sessionCheckoutHandler: ISessionStripeCheckoutHandlerService,
  ) {}

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const event = this.constructEvent(payload, signature);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;

        if (session.metadata?.paymentType === "session_registration") {
          await this._sessionCheckoutHandler.handle(session);
        } else {
          await this._checkoutHandler.handle(session);
        }

        break;
      }

      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }
  }

  private constructEvent(payload: Buffer, signature: string): Stripe.Event {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

      if (!webhookSecret) {
        throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
      }

      return stripe.webhooks.constructEvent(payload, signature, webhookSecret);
    } catch (error) {
      logger.error("Stripe webhook signature verification failed", error);
      throw new Error("Invalid Stripe webhook signature.");
    }
  }
}
