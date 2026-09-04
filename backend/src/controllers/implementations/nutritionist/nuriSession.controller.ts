import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { asyncHandler } from "../../../utils/asyncHandler";

import { StatusCode } from "../../../enums/statusCode.enum";

import { INutriSessionController } from "../../interfaces/nutritionist/INutriSessionController";

import { INutriSessionService } from "../../../services/interfaces/nutritionist/INutriSessionService";

import { CreateNutriSessionDTO } from "../../../dtos/nutritionist/session/create-session.dto";

import { UpdateNutriSessionDTO } from "../../../dtos/nutritionist/session/update-session.dto";

import {
  GetNutriSessionsQueryDTO,
  NutriSessionSortOption,
} from "../../../dtos/nutritionist/session/session-list-query.dto";

@injectable()
export class NutriSessionController implements INutriSessionController {
  constructor(
    @inject(TYPES.INutriSessionService)
    private readonly _nutriSessionService: INutriSessionService,
  ) {}

  createSession = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const dto = req.body as CreateNutriSessionDTO;

    const thumbnail = req.file;

    const session = await this._nutriSessionService.createSession(
      nutritionistId,
      dto,
      thumbnail,
    );

    res.status(StatusCode.CREATED).json({
      success: true,
      data: session,
    });
  });

  getSessions = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const query: GetNutriSessionsQueryDTO = {
      limit: Number(req.query.limit) || 10,
      cursor: req.query.cursor as string,
      search: req.query.search as string,
      status: req.query.status as GetNutriSessionsQueryDTO["status"],
      type: req.query.type as GetNutriSessionsQueryDTO["type"],
      sortBy: req.query.sortBy as NutriSessionSortOption,
    };

    const sessions = await this._nutriSessionService.getSessions(
      nutritionistId,
      query,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: sessions,
    });
  });

  getSessionDetails = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const nutritionistId = req.user!.userId;

    const session = await this._nutriSessionService.getSessionDetails(
      sessionId,
      nutritionistId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: session,
    });
  });

  updateSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const dto = req.body as UpdateNutriSessionDTO;

    const thumbnail = req.file;

    const session = await this._nutriSessionService.updateSession(
      sessionId,
      dto,
      thumbnail,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: session,
    });
  });

  deleteSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    await this._nutriSessionService.deleteSession(sessionId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Session deleted successfully",
    });
  });

  publishSession = asyncHandler(async (req: Request, res: Response) => {
    const { sessionId } = req.params;

    const nutritionistId = req.user!.userId;

    const session = await this._nutriSessionService.publishSession(
      sessionId,
      nutritionistId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: session,
      message: "Session published successfully",
    });
  });
}
