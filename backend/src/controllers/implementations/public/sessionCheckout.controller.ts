import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { StatusCode } from "../../../enums/statusCode.enum";

import { asyncHandler } from "../../../utils/asyncHandler";

import { ISessionCheckoutController } from "../../interfaces/public/ISessionCheckoutController";

import { ISessionCheckoutService } from "../../../services/interfaces/public/ISessionCheckoutService";

import { CreateSessionCheckoutDTO } from "../../../dtos/public/session-registration/create-session-checkout.dto";

@injectable()
export class SessionCheckoutController implements ISessionCheckoutController {
  constructor(
    @inject(TYPES.ISessionCheckoutService)
    private readonly _sessionCheckoutService: ISessionCheckoutService,
  ) {}

  createCheckoutSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.body;
    const { userId } = req.user!;

    const checkoutSessionDTO = new CreateSessionCheckoutDTO();

    checkoutSessionDTO.sessionId = sessionId;
    checkoutSessionDTO.userId = userId;

    const checkoutUrl =
      await this._sessionCheckoutService.createCheckoutSession(
        checkoutSessionDTO,
      );

    return res.status(StatusCode.OK).json({
      success: true,
      message: "Session checkout created successfully",
      data: {
        checkoutUrl,
      },
    });
  });
}
