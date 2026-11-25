import { IStripeCheckoutEventHandler } from "./IStripeCheckoutEventHandler";

export interface IStripeCheckoutHandlerRegistry {
  getHandler(
    paymentType: string | undefined,
  ): IStripeCheckoutEventHandler | undefined;
}
