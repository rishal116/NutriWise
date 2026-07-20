import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";

import { IStripeWebhookController } from "../../interfaces/common/IStripeWebhookController";
import { IStripeWebhookService } from "../../../services/interfaces/common/stripe/IStripeWebhookService";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class StripeWebhookController implements IStripeWebhookController {
  constructor(
    @inject(TYPES.IStripeWebhookService)
    private readonly _stripeWebhookService: IStripeWebhookService,
  ) {}

  handle = asyncHandler(async (req: Request, res: Response) => {
    const signature = req.headers["stripe-signature"];

    if (typeof signature !== "string") {
      res.status(400).json({
        message: "Missing Stripe signature.",
      });

      return;
    }

    await this._stripeWebhookService.handleWebhook(
      req.body as Buffer,
      signature,
    );

    res.status(StatusCode.OK).json({
      received: true,
    });
  });
}
