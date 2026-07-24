import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { asyncHandler } from "../../../utils/asyncHandler";

import { StatusCode } from "../../../enums/statusCode.enum";

import { INutriProgramDayController } from "../../interfaces/nutritionist/INutriProgramDayController";
import { INutriProgramDayService } from "../../../services/interfaces/nutritionist/INutriProgramDayService";

@injectable()
export class NutriProgramDayController implements INutriProgramDayController {
  constructor(
    @inject(TYPES.INutriProgramDayService)
    private readonly _programDayService: INutriProgramDayService,
  ) {}

  getProgramDays = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { programId } = req.params;

    const result = await this._programDayService.getProgramDays(
      nutritionistId,
      programId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: result,
    });
  });

  getProgramDayDetails = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { dayId } = req.params;

    const result = await this._programDayService.getProgramDayDetails(
      nutritionistId,
      dayId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: result,
    });
  });

  createProgramDay = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { programId } = req.params;

    const result = await this._programDayService.createProgramDay(
      nutritionistId,
      programId,
      req.body,
    );

    res.status(StatusCode.CREATED).json({
      success: true,
      data: result,
    });
  });

  updateProgramDay = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { dayId } = req.params;

    const result = await this._programDayService.updateProgramDay(
      nutritionistId,
      dayId,
      req.body,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: result,
    });
  });

  deleteProgramDay = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;
    const { dayId } = req.params;

    await this._programDayService.deleteProgramDay(nutritionistId, dayId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Program day deleted successfully",
    });
  });
}
