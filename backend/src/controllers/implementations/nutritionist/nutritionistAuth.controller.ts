import { Request, Response, NextFunction } from "express";
import { INutritionistAuthController } from "../../interfaces/nutritionist/INutritionistAuthController";
import { INutritionistAuthService } from "../../../services/interfaces/nutritionist/INutritionistAuthService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";


@injectable()
export class NutritionistAuthController implements INutritionistAuthController {
  constructor(
    @inject(TYPES.INutritionistAuthService)
    private _nutritionistAuthService: INutritionistAuthService
  ) {}

  getMyDetails = asyncHandler(async(req:Request, res:Response)=>{
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    const { userId } = req.user;
    const response = await this._nutritionistAuthService.getMyDetails(userId);
    res.status(StatusCode.OK).json({success: true,message: "Details fetch successfully",data: response,});
  })
  
  submitDetails = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    const { userId } = req.user;
    const response = await this._nutritionistAuthService.submitDetails(req,userId);
    res.status(StatusCode.OK).json({success: true,message: "Details submitted successfully",data: response,});
  });
  
  getRejectionReason = asyncHandler(async (req: Request, res: Response ) => {
    const { userId } = req.params;
    const dto = await this._nutritionistAuthService.getRejectionReason(userId);
    res.status(StatusCode.OK).json({
      success: true,
      data: dto,
    });
  });
  
  
  getName = asyncHandler(async (req: Request, res: Response) => {
    if (!req.user) {
      return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    const { userId } = req.user;
    const dto = await this._nutritionistAuthService.getName(userId);
    res.status(StatusCode.OK).json({success: true,data: dto });
  });

  
}
