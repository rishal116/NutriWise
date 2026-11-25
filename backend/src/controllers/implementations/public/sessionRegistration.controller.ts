import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { SESSION_REGISTRATION_MESSAGES } from "../../../constants/public/session/session-registration.messages";
import { StatusCode } from "../../../enums/statusCode.enum";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";
import type { ISessionRegistrationController } from "../../interfaces/public/ISessionRegistrationController";
import type { ISessionRegistrationService } from "../../../services/interfaces/public/ISessionRegistrationService";

@injectable()
export class SessionRegistrationController implements ISessionRegistrationController {
  constructor(
    @inject(TYPES.ISessionRegistrationService)
    private readonly _sessionRegistrationService: ISessionRegistrationService,
  ) {}

  registerForSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;
    const { userId } = req.user!;

    const result = await this._sessionRegistrationService.registerForSession(
      userId,
      sessionId,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      SESSION_REGISTRATION_MESSAGES.REGISTRATION_REQUEST_PROCESSED,
      result,
    );
  });

  cancelSessionRegistration = asyncHandler(
    async (req: Request, res: Response) => {
      const { sessionId } = req.params;
      const { userId } = req.user!;

      const registration =
        await this._sessionRegistrationService.cancelSessionRegistration(
          userId,
          sessionId,
        );

      return sendResponse(
        res,
        StatusCode.OK,
        SESSION_REGISTRATION_MESSAGES.REGISTRATION_CANCELLED,
        registration,
      );
    },
  );
}
