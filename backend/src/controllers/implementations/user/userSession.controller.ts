import { inject, injectable } from "inversify";
import type { RequestHandler } from "express";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";

import type { IUserSessionController } from "../../interfaces/user/IUserSessionController"; 
import type { IUserSessionService } from "../../../services/interfaces/user/IUserSessionService"; 
import { UserSessionListQueryDTO } from "../../../dtos/user/session/user-session-list-query.dto"; 

@injectable()
export class UserSessionController implements IUserSessionController {
  constructor(
    @inject(TYPES.IUserSessionService)
    private readonly _userSessionService: IUserSessionService,
  ) {}

  getUserSessions: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;

    const query = Object.assign(new UserSessionListQueryDTO(), req.query);

    const data = await this._userSessionService.getUserSessions(userId, query);

    res.status(StatusCode.OK).json({
      success: true,
      message: "User sessions retrieved successfully.",
      data,
    });
  });

  getUserSessionDetails: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { sessionId } = req.params;

    const data = await this._userSessionService.getUserSessionDetails(
      userId,
      sessionId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "User session details retrieved successfully.",
      data,
    });
  });
}
