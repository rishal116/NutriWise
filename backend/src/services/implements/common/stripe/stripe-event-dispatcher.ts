import Stripe from "stripe";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import logger from "../../../../utils/logger";

import { IStripeEventDispatcher } from "../../../interfaces/common/stripe/IStripeEventDispatcher";
import { IStripeCheckoutHandlerRegistry } from "../../../interfaces/common/stripe/IStripeCheckoutHandlerRegistry";

@injectable()
export class StripeEventDispatcher implements IStripeEventDispatcher {
  constructor(
    @inject(TYPES.IStripeCheckoutHandlerRegistry)
    private readonly _handlerRegistry: IStripeCheckoutHandlerRegistry,
  ) {}

  async dispatch(event: Stripe.Event): Promise<void> {
    switch (event.type) {
      case "checkout.session.completed":
        await this.handleCheckoutSessionCompleted(event);
        return;

      default:
        logger.info("Unhandled Stripe event.", {
          eventId: event.id,
          eventType: event.type,
        });
    }
  }

  private async handleCheckoutSessionCompleted(
    event: Stripe.Event,
  ): Promise<void> {
    const session = event.data.object as Stripe.Checkout.Session;

    const paymentType = session.metadata?.paymentType;

    const handler = this._handlerRegistry.getHandler(paymentType);

    if (!handler) {
      logger.warn("No Stripe checkout handler registered.", {
        eventId: event.id,
        checkoutSessionId: session.id,
        paymentType,
      });

      return;
    }

    await handler.handle(session);
  }
}
