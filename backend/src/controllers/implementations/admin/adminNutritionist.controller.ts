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
    logger.info( `Admin fetching nutritionists | page=${page}, limit=${limit}, search=${search ?? "none"}`);
    const response = await this._adminNutritionistService.getAllNutritionists(
      page,
      limit,
      search
    );
    logger.info(`Admin fetched nutritionists list | total=${response.total}`);
    res.status(StatusCode.OK).json(response);
  });


  blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    logger.warn(`Admin attempting to block nutritionist | ID=${userId}`);
    await this._adminNutritionistService.blockUser(userId);
    logger.warn(`Nutritionist blocked successfully | ID=${userId}`);
    res.status(StatusCode.OK).json({ success: true, message: "User blocked successfully" });
  });


  unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    logger.info(`Admin attempting to unblock nutritionist | ID=${userId}`);
    await this._adminNutritionistService.unblockUser(userId);
    logger.info(`Nutritionist unblocked successfully | ID=${userId}`);
    res.status(StatusCode.OK).json({ success: true, message: "User unblocked successfully" });
  });
  
  
  getNutritionistDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    logger.info(`Fetching nutritionist full details | ID=${userId}`);
    const nutritionist = await this._adminNutritionistService.getNutritionistById(userId);
    if (!nutritionist) {
      logger.error(`Nutritionist not found | ID=${userId}`);
      return res.status(StatusCode.NOT_FOUND).json({ success: false, message: "Nutritionist not found" });
    }
    logger.info(`Nutritionist details fetched | ID=${userId}`);
    res.status(StatusCode.OK).json({ success: true, nutritionist });
  });
  
  
  approveNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    logger.info(`Admin approving nutritionist | ID=${userId}`);
    await this._adminNutritionistService.approveNutritionist(userId);
    logger.info(`Nutritionist approved | ID=${userId}`);
    res.status(StatusCode.OK).json({ success: true, message: "Nutritionist approved" });
  });


  rejectNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.params.userId;
    const { reason } = req.body;
    if (!reason) {
      logger.error(`Rejection failed — reason missing | ID=${userId}`);
      return res.status(StatusCode.BAD_REQUEST).json({ success: false, message: "Rejection reason is required" });
    }
    logger.warn(`Admin rejecting nutritionist | ID=${userId}, reason=${reason}`);
    await this._adminNutritionistService.rejectNutritionist(userId, reason);
    logger.warn(`Nutritionist rejected | ID=${userId}`);
    res.status(StatusCode.OK).json({ success: true, message: "Nutritionist rejected" });
  });
  
  
  getNutritionistProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    logger.info(`Fetching nutritionist profile | ID=${userId}`);
    const profile = await this._adminNutritionistService.getNutritionistProfile(userId);
    if (!profile) {
      logger.error(`Nutritionist profile not found | ID=${userId}`);
      return res.status(StatusCode.NOT_FOUND).json({success: false,message: "Nutritionist profile not found"});
    }
    logger.info(`Nutritionist profile fetched successfully | ID=${userId}`);
    res.status(StatusCode.OK).json({ success: true,
      message: "Nutritionist profile fetched successfully",
      data: profile,
    });
  });

  
}
