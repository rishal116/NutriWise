import { inject, injectable } from "inversify";
import type { RequestHandler } from "express";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";

import { UserSessionListQueryDTO } from "../../../dtos/user/session/user-session-list-query.dto";

import { USER_SESSION_MESSAGES } from "../../../constants/user/session/user-session.messages"; 

import type { IUserSessionController } from "../../interfaces/user/IUserSessionController";
import type { IUserSessionService } from "../../../services/interfaces/user/IUserSessionService";

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

    return sendResponse(
      res,
      StatusCode.OK,
      USER_SESSION_MESSAGES.SESSIONS_RETRIEVED,
      data,
    );
  });

  getUserSessionDetails: RequestHandler = asyncHandler(async (req, res) => {
    const userId = req.user!.userId;
    const { sessionId } = req.params;

    const data = await this._userSessionService.getUserSessionDetails(
      userId,
      sessionId,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      USER_SESSION_MESSAGES.SESSION_DETAILS_RETRIEVED,
      data,
    );
  });
}
