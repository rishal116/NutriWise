import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";

import type { INutriSessionRegistrationController } from "../../interfaces/nutritionist/INutriSessionRegistrationController";
import type { INutriSessionRegistrationService } from "../../../services/interfaces/nutritionist/INutriSessionRegistrationService";
import type { NutriSessionParticipantsQueryDTO } from "../../../dtos/nutritionist/session-registration/nutri-session-participants-query.dto";

import { NUTRI_SESSION_REGISTRATION_MESSAGES } from "../../../constants/nutritionist/session/nutri-session-registration.messages";

@injectable()
export class NutriSessionRegistrationController implements INutriSessionRegistrationController {
  constructor(
    @inject(TYPES.INutriSessionRegistrationService)
    private readonly _sessionRegistrationService: INutriSessionRegistrationService,
  ) {}

  getSessionParticipants = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

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

        query,
      );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRI_SESSION_REGISTRATION_MESSAGES.PARTICIPANTS_FETCHED,
      participants,
    );
  });
}
