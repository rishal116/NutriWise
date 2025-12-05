import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { INutritionistProfileService } from "../../../services/interfaces/nutritionist/INutritionistProfileService";
import { INutritionistProfileController } from "../../interfaces/nutritionist/INutritionistProfileController";

@injectable()
export class NutritionistProfileController implements INutritionistProfileController {
  constructor(
    @inject(TYPES.INutritionistProfileService)
    private _nutritionistProfileService: INutritionistProfileService
  ) {}

  getNutritionistProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?.userId;
    console.log("User: ",userId);
    if (!userId) {
      return res.status(StatusCode.UNAUTHORIZED).json({
        success: false,
        message: "User not authenticated or token invalid"
      });
    }
    const profile = await this._nutritionistProfileService.getNutritionistProfile(userId);
    if (!profile) {
      return res.status(StatusCode.NOT_FOUND).json({ success: false, message: "Profile not found" });
    }
    res.status(StatusCode.OK).json({ success: true, data: profile });
  });

  updateNutritionistProfile = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id;
    const updateData = req.body;
    const updatedProfile = await this._nutritionistProfileService.updateNutritionistProfile(userId, updateData);
    if (!updatedProfile) {
      return res.status(StatusCode.NOT_FOUND).json({ success: false, message: "Update failed" });
    }
    res.status(StatusCode.OK).json({ success: true, data: updatedProfile });
  });

  
}
