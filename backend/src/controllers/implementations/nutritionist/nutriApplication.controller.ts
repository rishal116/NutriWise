import { Request, Response } from "express";
import { INutritionistApplicationService } from "../../../services/interfaces/nutritionist/INutriApplicationService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { NutritionistFiles } from "../../../types/nutritionist-files.type";
import { INutritionistApplicationController } from "../../interfaces/nutritionist/INutriApplicationController";

@injectable()
export class NutritionistApplicationController implements INutritionistApplicationController {
  constructor(
    @inject(TYPES.INutritionistApplicationService)
    private _nutritionistAuthService: INutritionistApplicationService,
  ) {}

  getApplicationDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const response =
      await this._nutritionistAuthService.getApplicationDetails(userId);
    res.status(StatusCode.OK).json({
      success: true,
      message: "Details fetch successfully",
      data: response,
    });
  });

  submitApplication = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const response = await this._nutritionistAuthService.submitApplication({
      userId,
      body: req.body,
      files: req.files as NutritionistFiles,
    });
    res.status(StatusCode.OK).json({
      success: true,
      message: "Details submitted successfully",
      data: response,
    });
  });

  getApplicationStatus = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const dto =
      await this._nutritionistAuthService.getApplicationStatus(userId);
    res.status(StatusCode.OK).json({
      success: true,
      data: dto,
    });
  });
}
