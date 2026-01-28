import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { IUserPlanService } from "../../../services/interfaces/user/IUserPlanService";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { INutritionistSubscriptionController } from "../../interfaces/nutritionist/INutritionistSubscriptionController";

@injectable()
export class NutritionistSubscriptionController implements INutritionistSubscriptionController {
  constructor(
    @inject(TYPES.IUserPlanService)
    private _userPlanService: IUserPlanService
  ) {}
  
  getSubscribers = asyncHandler(async (req:Request, res: Response ) => {
    if (!req.user) {
        return res.status(StatusCode.UNAUTHORIZED).json({ message: "Unauthorized" });
    }
    const { userId } = req.user;
    
    const users = await this._userPlanService.getSubscribers(userId);
    res.status(200).json({
      success: true,
      data: users,
    });
  });
  
}
