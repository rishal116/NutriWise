import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/responseHandler";
import { NUTRI_SESSION_MESSAGES } from "../../../constants/nutritionist/session/nutri-session-message.constant";
import type { INutriSessionController } from "../../interfaces/nutritionist/INutriSessionController";
import type { INutriSessionService } from "../../../services/interfaces/nutritionist/INutriSessionService";
import type { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";
import type { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";
import { NutriSessionQueryMapper } from "../../../mappers/nutritionist/session/nutri-session-query.mapper";

@injectable()
export class NutriSessionController implements INutriSessionController {
  constructor(
    @inject(TYPES.INutriSessionService)
    private readonly _nutriSessionService: INutriSessionService,
  ) {}

  createSession = asyncHandler(async (req: Request, res: Response) => {
    await this._nutriSessionService.createSession(
      req.user!.userId,
      req.body as CreateNutriSessionDTO,
      req.file,
    );

    return sendResponse(
      res,
      StatusCode.CREATED,
      NUTRI_SESSION_MESSAGES.CREATED,
    );
  });

  getSessions = asyncHandler(async (req: Request, res: Response) => {
    const query = NutriSessionQueryMapper.toDTO(req.query);

    const sessions = await this._nutriSessionService.getSessions(
      req.user!.userId,
      query,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRI_SESSION_MESSAGES.FETCHED,
      sessions,
    );
  });

  getSessionDetails = asyncHandler(async (req: Request, res: Response) => {
    const session = await this._nutriSessionService.getSessionDetails(
      req.params.sessionId,
      req.user!.userId,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRI_SESSION_MESSAGES.DETAILS_FETCHED,
      session,
    );
  });

  updateSession = asyncHandler(async (req: Request, res: Response) => {
    await this._nutriSessionService.updateSession(
      req.params.sessionId,
      req.user!.userId,
      req.body as UpdateNutriSessionDTO,
      req.file,
    );

    return sendResponse(res, StatusCode.OK, NUTRI_SESSION_MESSAGES.UPDATED);
  });

  deleteSession = asyncHandler(async (req: Request, res: Response) => {
    await this._nutriSessionService.deleteSession(
      req.params.sessionId,
      req.user!.userId,
    );

    return sendResponse(res, StatusCode.OK, NUTRI_SESSION_MESSAGES.DELETED);
  });

  publishSession = asyncHandler(async (req: Request, res: Response) => {
    await this._nutriSessionService.publishSession(
      req.params.sessionId,
      req.user!.userId,
    );

    return sendResponse(res, StatusCode.OK, NUTRI_SESSION_MESSAGES.PUBLISHED);
  });
}
