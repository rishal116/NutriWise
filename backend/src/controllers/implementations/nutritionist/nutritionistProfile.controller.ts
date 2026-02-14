import { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
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
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    
    }
    const { userId } = req.user;
    const updateData = req.body;
    const updatedProfile = await this._nutritionistProfileService.updateNutritionistProfile(userId, updateData);
    if (!updatedProfile) {
      return res.status(StatusCode.NOT_FOUND).json({ success: false, message: "Update failed" });
    }
    res.status(StatusCode.OK).json({ success: true, data: updatedProfile });
  });
  

  getNutritionistProfileImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }
    const { userId } = req.user;
    const imageData = await this._nutritionistProfileService.getNutritionistProfileImage(userId);
    res.status(StatusCode.OK).json({ success: true, data: imageData });
  });
  
  
  updateNutritionistProfileImage = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({ success: false, message: "Unauthorized" });
    }
    const userId = req.user.userId;
    if (!req.file) {
      return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "No file uploaded" });
    }
    const updatedProfile = await this._nutritionistProfileService.updateNutritionistProfileImage(userId, req.file);
    if (!updatedProfile) {
      return res.status(StatusCode.INTERNAL_SERVER_ERROR).json({ success: false, message: "Image upload failed" });
    }
    res.status(StatusCode.OK).json({ success: true, data: updatedProfile, message: "Profile image updated successfully" });
  });

  
}
