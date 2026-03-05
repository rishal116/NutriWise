import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { ICheckoutController } from "../../interfaces/user/ICheckoutController";
import { ICheckoutService } from "../../../services/interfaces/user/ICheckoutService";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { AUTH_MESSAGES, PAYMENT_MESSAGES } from "../../../constants";

@injectable()
export class CheckoutController implements ICheckoutController {
  constructor(
    @inject(TYPES.ICheckoutService)
    private _checkoutService: ICheckoutService
  ) {}

  createSession = asyncHandler(async (req: Request, res: Response) => {
    const { planId, nutritionistId } = req.body;
    const {userId}= req.user!
    const checkoutUrl = await this._checkoutService.createSession({
      planId,
      nutritionistId,
      userId,
    });
    return res.status(StatusCode.OK).json({
      success: true,
      message: PAYMENT_MESSAGES.CHECKOUT_CREATED,
      url: checkoutUrl,
    });
  });

}
