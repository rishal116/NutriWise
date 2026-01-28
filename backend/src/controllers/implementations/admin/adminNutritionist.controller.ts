import { Request, Response, NextFunction } from "express";
import { IAdminNutritionistController } from "../../interfaces/admin/IAdminNutritionistController";
import { IAdminNutritionistService } from "../../../services/interfaces/admin/IAdminNutritionistService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class AdminNutritionistController implements IAdminNutritionistController {
  constructor(
    @inject(TYPES.IAdminNutritionistService)
    private _adminNutritionistService: IAdminNutritionistService
  ) {}

  getAllNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const response = await this._adminNutritionistService.getAllNutritionists(
      page,
      limit,
      search
    );
    res.status(StatusCode.OK).json(response);
  });

  getNutritionistDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const nutritionist = await this._adminNutritionistService.getNutritionistById(userId);
    if (!nutritionist) {
      return res.status(StatusCode.NOT_FOUND).json({ success: false, message: "Nutritionist not found" });
    }
    res.status(StatusCode.OK).json({ success: true, nutritionist });
  });
  
  approveNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    await this._adminNutritionistService.approveNutritionist(userId);
    res.status(StatusCode.OK).json({ success: true, message: "Nutritionist approved" });
  });
  
  rejectNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { reason } = req.body;
    if (!reason) {
      return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "Rejection reason is required" });
    }
    await this._adminNutritionistService.rejectNutritionist(userId, reason);
    res.status(StatusCode.OK).json({ success: true, message: "Nutritionist rejected" });
  });
  
  getNutritionistProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const profile = await this._adminNutritionistService.getNutritionistProfile(userId);
    if (!profile) {
      return res.status(StatusCode.NOT_FOUND).json({success: false,message: "Nutritionist profile not found"});
    }
    res.status(StatusCode.OK).json({ success: true,
      message: "Nutritionist profile fetched successfully",
      data: profile,
    });
  });
  
  updateNutritionistLevel = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { level } = req.body;
    await this._adminNutritionistService.updateNutritionistLevel(userId, level);
    res.status(StatusCode.OK).json({
      success: true,
      message: "Nutritionist level updated successfully",
    });
  });


  
}
