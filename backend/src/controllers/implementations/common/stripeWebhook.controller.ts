import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { IStripeWebhookService } from "../../../services/interfaces/common/IStripeWebhookService";
import { IStripeWebhookController } from "../../interfaces/common/IStripeWebhookController";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class StripeWebhookController implements IStripeWebhookController {
  constructor(
    @inject(TYPES.IStripeWebhookService)
    private _webhookService: IStripeWebhookService,
  ) {}

  handle = asyncHandler(async (req: Request, res: Response) => {
    const sig = req.headers["stripe-signature"] as string;

    if (!sig) {
      return res.status(400).json({ message: "Missing Stripe signature" });
    }

    await this._webhookService.process(req.body, sig);

    res.json({ received: true });
  });
}
