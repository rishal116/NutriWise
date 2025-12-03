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
  
}
