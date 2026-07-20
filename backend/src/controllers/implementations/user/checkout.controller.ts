import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { PAYMENT_MESSAGES } from "../../../constants";
import { asyncHandler } from "../../../utils/asyncHandler";
import { CreateCheckoutSessionDTO } from "../../../dtos/user/checkout/create-checkout-session.dto";
import { ICheckoutController } from "../../interfaces/user/ICheckoutController";
import { ICheckoutService } from "../../../services/interfaces/user/ICheckoutService";

@injectable()
export class CheckoutController implements ICheckoutController {
  constructor(
    @inject(TYPES.ICheckoutService)
    private readonly _checkoutService: ICheckoutService,
  ) {}

  createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
    const { planId } = req.body;

    const { userId } = req.user!;

    const checkoutSessionDTO = new CreateCheckoutSessionDTO();

    checkoutSessionDTO.planId = planId;
    checkoutSessionDTO.userId = userId;

    const checkoutUrl =
      await this._checkoutService.createCheckoutSession(checkoutSessionDTO);

    return res.status(StatusCode.OK).json({
      success: true,
      message: PAYMENT_MESSAGES.CHECKOUT_CREATED,
      data: {
        checkoutUrl,
      },
    });
  });
}
