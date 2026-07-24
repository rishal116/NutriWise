import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { asyncHandler } from "../../../utils/asyncHandler";

import { StatusCode } from "../../../enums/statusCode.enum";

import { INutriProgramController } from "../../interfaces/nutritionist/INutriProgramController";
import { INutriProgramService } from "../../../services/interfaces/nutritionist/INutriProgramService";
import { GetProgramsQueryDTO } from "../../../dtos/nutritionist/program/program-request.dto";

@injectable()
export class NutriProgramController implements INutriProgramController {
  constructor(
    @inject(TYPES.INutriProgramService)
    private readonly _nutriProgramService: INutriProgramService,
  ) {}

  getPrograms = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const programs = await this._nutriProgramService.getPrograms(
      nutritionistId,
      req.query as unknown as GetProgramsQueryDTO,
    );
    
    res.status(StatusCode.OK).json({
      success: true,
      data: programs,
    });
  });

  getProgramDetails = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const { programId } = req.params;

    const program = await this._nutriProgramService.getProgramDetails(
      nutritionistId,
      {
        programId,
      },
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: program,
    });
  });
}
