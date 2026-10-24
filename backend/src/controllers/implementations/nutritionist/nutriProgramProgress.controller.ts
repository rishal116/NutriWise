import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

import type { INutriProgramProgressController } from "../../interfaces/nutritionist/INutriProgramProgressController";
import type { INutriProgramProgressService } from "../../../services/interfaces/nutritionist/INutriProgramProgressService";

import type { GetProgramOverviewDTO } from "../../../dtos/nutritionist/program-progress/get-program-overview.dto";
import type { GetProgramDaysDTO } from "../../../dtos/nutritionist/program-progress/get-program-days.dto";
import type { GetDayActivityResultsDTO } from "../../../dtos/nutritionist/program-progress/get-day-activity-results.dto";

@injectable()
export class NutriProgramProgressController
  implements INutriProgramProgressController
{
  constructor(
    @inject(TYPES.INutriProgramProgressService)
    private readonly _nutriProgramProgressService: INutriProgramProgressService,
  ) {}

  getProgramOverview = asyncHandler(
    async (req: Request, res: Response) => {
      const nutritionistId = req.user!.userId;

      const query: GetProgramOverviewDTO = {
        clientId: req.params.clientId,
        userProgramId: req.params.userProgramId,
      };

      const overview =
        await this._nutriProgramProgressService.getProgramOverview(
          nutritionistId,
          query,
        );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Program progress overview retrieved successfully",
        data: overview,
      });
    },
  );

  getProgramDays = asyncHandler(
    async (req: Request, res: Response) => {
      const nutritionistId = req.user!.userId;

      const query: GetProgramDaysDTO = {
        clientId: req.params.clientId,
        userProgramId: req.params.userProgramId,
        cursor:
          typeof req.query.cursor === "string"
            ? req.query.cursor
            : undefined,
        limit: Number(req.query.limit) || 10,
      };

      const days = await this._nutriProgramProgressService.getProgramDays(
        nutritionistId,
        query,
      );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Program days retrieved successfully",
        data: days,
      });
    },
  );

  getDayActivityResults = asyncHandler(
    async (req: Request, res: Response) => {
      const nutritionistId = req.user!.userId;

      const query: GetDayActivityResultsDTO = {
        clientId: req.params.clientId,
        userProgramId: req.params.userProgramId,
        dayNumber: Number(req.params.dayNumber),
      };

      const activities =
        await this._nutriProgramProgressService.getDayActivityResults(
          nutritionistId,
          query,
        );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Day activity results retrieved successfully",
        data: activities,
      });
    },
  );
}