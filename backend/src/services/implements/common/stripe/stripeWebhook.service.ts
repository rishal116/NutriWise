import Stripe from "stripe";
import { inject, injectable } from "inversify";
import { stripe } from "../../../../configs/stripe";
import { TYPES } from "../../../../types/types";
import logger from "../../../../utils/logger";
import { IStripeWebhookService } from "../../../interfaces/common/stripe/IStripeWebhookService";
import { IStripeCheckoutHandlerService } from "../../../interfaces/common/stripe/IStripeCheckoutHandlerService";

@injectable()
export class StripeWebhookService implements IStripeWebhookService {
  constructor(
    @inject(TYPES.IStripeCheckoutHandlerService)
    private readonly _checkoutHandler: IStripeCheckoutHandlerService,
  ) {}

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const event = this.constructEvent(payload, signature);

    switch (event.type) {
      case "checkout.session.completed":
        await this._checkoutHandler.handle(
          event.data.object as Stripe.Checkout.Session,
        );
        break;

      default:
        logger.info(`Unhandled Stripe event: ${event.type}`);
    }
  }

  private constructEvent(payload: Buffer, signature: string): Stripe.Event {
    try {
      return stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!,
      );
    } catch (error) {
      logger.error("Stripe webhook signature verification failed", error);

      throw new Error("Invalid Stripe webhook signature.");
    }
  }
}
