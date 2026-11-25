import { injectable, multiInject } from "inversify";

import { TYPES } from "../../../../types/types";

import { IStripeCheckoutEventHandler } from "../../../interfaces/common/stripe/IStripeCheckoutEventHandler";

import { IStripeCheckoutHandlerRegistry } from "../../../interfaces/common/stripe/IStripeCheckoutHandlerRegistry";

@injectable()
export class StripeCheckoutHandlerRegistry implements IStripeCheckoutHandlerRegistry {
  private readonly _handlers: Map<string, IStripeCheckoutEventHandler>;

  constructor(
    @multiInject(TYPES.IStripeCheckoutEventHandler)
    handlers: IStripeCheckoutEventHandler[],
  ) {
    this._handlers = new Map();

    for (const handler of handlers) {
      if (this._handlers.has(handler.paymentType)) {
        throw new Error(
          `Duplicate Stripe payment handler registration: ${handler.paymentType}`,
        );
      }

      this._handlers.set(handler.paymentType, handler);
    }
  }

  getHandler(
    paymentType: string | undefined,
  ): IStripeCheckoutEventHandler | undefined {
    if (!paymentType) {
      return undefined;
    }

    return this._handlers.get(paymentType);
  }
}
