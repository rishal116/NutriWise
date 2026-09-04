import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import { ISessionRegistrationController } from "../../interfaces/public/ISessionRegistrationController";
import { ISessionRegistrationService } from "../../../services/interfaces/public/ISessionRegistrationService";

@injectable()
export class SessionRegistrationController
  implements ISessionRegistrationController
{
  constructor(
    @inject(TYPES.ISessionRegistrationService)
    private readonly _sessionRegistrationService: ISessionRegistrationService,
  ) {}

  registerForSession = asyncHandler(
    async (req: Request, res: Response) => {
      const { sessionId } = req.params;
      const { userId } = req.user!;

      const result =
        await this._sessionRegistrationService.registerForSession(
          userId,
          sessionId,
        );

      return res.status(StatusCode.OK).json({
        success: true,
        message:
          "Session registration request processed successfully",
        data: result,
      });
    },
  );

  getMySessionRegistration = asyncHandler(
    async (req: Request, res: Response) => {
      const { sessionId } = req.params;
      const { userId } = req.user!;

      const registration =
        await this._sessionRegistrationService.getMySessionRegistration(
          userId,
          sessionId,
        );

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Session registration fetched successfully",
        data: registration,
      });
    },
  );

  cancelSessionRegistration = asyncHandler(
    async (req: Request, res: Response) => {
      const { sessionId } = req.params;
      const { userId } = req.user!;

      const registration =
        await this._sessionRegistrationService.cancelSessionRegistration(
          userId,
          sessionId,
        );

      return res.status(StatusCode.OK).json({
        success: true,
        message: "Session registration cancelled successfully",
        data: registration,
      });
    },
  );
}