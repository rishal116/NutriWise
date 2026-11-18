import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import { StatusCode } from "../../../../enums/statusCode.enum";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { sendResponse } from "../../../../utils/responseHandler";

import type { INutriProgramDayController } from "../../../interfaces/nutritionist/INutriProgramDayController";
import type { INutriProgramDayService } from "../../../../services/interfaces/nutritionist/INutriProgramDayService";
import type { ProgramDayListQueryDTO } from "../../../../dtos/nutritionist/program-day/nutri-program-day-list-query.dto";

import { NUTRI_PROGRAM_DAY_MESSAGES } from "../../../../constants/nutritionist/program/nutri-program-day.messages";

@injectable()
export class NutriProgramDayController implements INutriProgramDayController {
  constructor(
    @inject(TYPES.INutriProgramDayService)
    private readonly _programDayService: INutriProgramDayService,
  ) {}

  getProgramDays = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { programId } = req.params;

    const result = await this._programDayService.getProgramDays(
      nutritionistId,
      programId,
      req.query as unknown as ProgramDayListQueryDTO,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRI_PROGRAM_DAY_MESSAGES.DAYS_FETCHED,
      result,
    );
  });

  getProgramDayDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { dayId } = req.params;

    const result = await this._programDayService.getProgramDayDetails(
      nutritionistId,
      dayId,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRI_PROGRAM_DAY_MESSAGES.DAY_DETAILS_FETCHED,
      result,
    );
  });

  updateProgramDay = asyncHandler(async (req: Request, res: Response) => {
    const { userId: nutritionistId } = req.user!;
    const { dayId } = req.params;

    await this._programDayService.updateProgramDay(
      nutritionistId,
      dayId,
      req.body,
    );

    return sendResponse(
      res,
      StatusCode.OK,
      NUTRI_PROGRAM_DAY_MESSAGES.DAY_UPDATED,
    );
  });
}
