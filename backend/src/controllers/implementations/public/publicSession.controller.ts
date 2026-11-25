import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";

import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";

import type { IPublicSessionController } from "../../interfaces/public/IPublicSessionController";
import type { IPublicSessionService } from "../../../services/interfaces/public/IPublicSessionService";

import { GetPublicSessionsQueryDTO } from "../../../dtos/public/session/public-session-list-query.dto";

import { PUBLIC_SESSION_MESSAGES } from "../../../constants/public/session/session-messages.constants";

@injectable()
export class PublicSessionController implements IPublicSessionController {
  constructor(
    @inject(TYPES.IPublicSessionService)
    private readonly _publicSessionService: IPublicSessionService,
  ) {}

  getPublicSessions = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const query = Object.assign(new GetPublicSessionsQueryDTO(), req.query);

      const sessions =
        await this._publicSessionService.getPublicSessions(query);

      sendResponse(
        res,
        StatusCode.OK,
        PUBLIC_SESSION_MESSAGES.LIST_FETCHED,
        sessions,
      );
    },
  );

  getPublicSessionDetails = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const session = await this._publicSessionService.getPublicSessionDetails(
        req.params.sessionId,
        req.user?.userId,
      );

      sendResponse(
        res,
        StatusCode.OK,
        PUBLIC_SESSION_MESSAGES.DETAILS_FETCHED,
        session,
      );
    },
  );
}
