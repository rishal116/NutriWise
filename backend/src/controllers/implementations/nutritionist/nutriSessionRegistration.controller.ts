import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import type { INutriSessionRegistrationController } from "../../interfaces/nutritionist/INutriSessionRegistrationController";
import type { INutriSessionRegistrationService } from "../../../services/interfaces/nutritionist/INutriSessionRegistrationService";
import type { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session/nutri-session-participants-query.dto";

@injectable()
export class NutriSessionRegistrationController implements INutriSessionRegistrationController {
  constructor(
    @inject(TYPES.INutriSessionRegistrationService)
    private readonly _sessionRegistrationService: INutriSessionRegistrationService,
  ) {}

  getSessionParticipants = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const nutritionistId = req.user!.userId;

    const query: NutriSessionParticipantsQueryDTO = {
      search: req.query.search as string | undefined,
      status: req.query.status as NutriSessionParticipantsQueryDTO["status"],
      paymentStatus: req.query
        .paymentStatus as NutriSessionParticipantsQueryDTO["paymentStatus"],
      cursor: req.query.cursor as string | undefined,
      limit: Number(req.query.limit) || 10,
    };

    const participants =
      await this._sessionRegistrationService.getSessionParticipants(
        sessionId,
        nutritionistId,
        query,
      );

    res.status(StatusCode.OK).json({
      success: true,
      data: participants,
    });
  });
}
