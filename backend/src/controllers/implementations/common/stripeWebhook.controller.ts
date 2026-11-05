import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { CustomError } from "../../../utils/customError";
import { sendResponse } from "../../../utils/responseHandler";

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
      throw new CustomError(
        "Missing Stripe signature.",
        StatusCode.BAD_REQUEST,
      );
    }

    await this._stripeWebhookService.handleWebhook(
      req.body as Buffer,
      signature,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      "Stripe webhook received successfully.",
      { received: true },
    );
  });
}