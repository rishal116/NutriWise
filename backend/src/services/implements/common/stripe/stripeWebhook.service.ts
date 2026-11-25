import { inject, injectable } from "inversify";
import { TYPES } from "../../../../types/types";
import { IStripeWebhookService } from "../../../interfaces/common/stripe/IStripeWebhookService";
import { IStripeWebhookVerifier } from "../../../interfaces/common/stripe/IStripeWebhookVerifier";
import { IStripeEventDispatcher } from "../../../interfaces/common/stripe/IStripeEventDispatcher";

@injectable()
export class StripeWebhookService implements IStripeWebhookService {
  constructor(
    @inject(TYPES.IStripeWebhookVerifier)
    private readonly _webhookVerifier: IStripeWebhookVerifier,

    @inject(TYPES.IStripeEventDispatcher)
    private readonly _eventDispatcher: IStripeEventDispatcher,
  ) {}

  async handleWebhook(payload: Buffer, signature: string): Promise<void> {
    const event = this._webhookVerifier.verify(payload, signature);

    await this._eventDispatcher.dispatch(event);
  }
}
