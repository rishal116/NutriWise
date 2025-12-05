import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistAvailabilityService } from "../../../services/interfaces/nutritionist/INutritionistAvailabilityService";
import { StatusCode } from "../../../enums/statusCode.enum";
import { INutritionistAvailabilityController } from "../../interfaces/nutritionist/INutritionistAvailabilityController";

@injectable()
export class NutritionistAvailabilityController implements INutritionistAvailabilityController{
  constructor(
    @inject(TYPES.INutritionistAvailabilityService)
    private _nutritionistAvailabilityService: INutritionistAvailabilityService
  ) {}

  saveAvailability = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: "User not authenticated" });
    }

    console.log("times",req.body);
    

    const result = await this._nutritionistAvailabilityService.saveAvailability(userId, req.body);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Availability saved successfully",
      data: result
    });
  });

  getAvailability = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    if (!userId) {
      return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: "User not authenticated" });
    }

    const data = await this._nutritionistAvailabilityService.getAvailability(userId);
    res.status(StatusCode.OK).json({ success: true, data });
  });
}
