import { Request, Response, NextFunction } from "express";
import { INutritionistAuthController } from "../../interfaces/nutritionist/INutritionistAuthController";
import { INutritionistAuthService } from "../../../services/interfaces/nutritionist/INutritionistAuthService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";


@injectable()
export class NutritionistAuthController implements INutritionistAuthController {
  constructor(
    @inject(TYPES.INutritionistAuthService)
    private _nutritionistAuthService: INutritionistAuthService
  ) {}
  

  submitDetails = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { user } = req as any;
    logger.info(`Submit details attempt - Nutritionist ID: ${user.userId}`);
    const response = await this._nutritionistAuthService.submitDetails(req, user.userId);
    res.status(StatusCode.OK).json({success: true,message: "Details submitted successfully",data: response,});
  });

  
  approveNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    await this._nutritionistAuthService.approveNutritionist(userId);
    res.status(200).json({ success: true, message: "Nutritionist approved" });
  });
  

  rejectNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { reason } = req.body;
    if (!reason) {
      return res.status(400).json({ success: false, message: "Rejection reason is required" });
    }
    await this._nutritionistAuthService.rejectNutritionist(userId, reason);
    res.status(200).json({ success: true, message: "Nutritionist rejected" });
  });


}
