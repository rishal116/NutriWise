import { Request, Response } from "express";
import { IAdminNutritionistController } from "../../interfaces/admin/IAdminNutritionistController";
import { IAdminNutritionistService } from "../../../services/interfaces/admin/IAdminNutritionistService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ADMIN_NUTRITIONIST_MESSAGES } from "../../../constants";
import { CustomError } from "../../../utils/customError";

@injectable()
export class AdminNutritionistController implements IAdminNutritionistController {
  constructor(
    @inject(TYPES.IAdminNutritionistService)
    private _adminNutritionistService: IAdminNutritionistService,
  ) {}

  getAllNutritionists = asyncHandler(async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.page) || 1;
    const pageLimit = Number(req.query.limit) || 10;
    const searchKeyword = req.query.search as string | undefined;
    const nutritionistResult =
      await this._adminNutritionistService.getAllNutritionists(
        pageNumber,
        pageLimit,
        searchKeyword,
      );
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.FETCH_ALL_SUCCESS,
      data: nutritionistResult,
    });
  });

  getNutritionistDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const nutritionist =
      await this._adminNutritionistService.getNutritionistById(userId);
    if (!nutritionist) {
      throw new CustomError(
        ADMIN_NUTRITIONIST_MESSAGES.NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.DETAILS_FETCH_SUCCESS,
      data: nutritionist,
    });
  });

  approveNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await this._adminNutritionistService.approveNutritionist(userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.APPROVED,
    });
  });

  rejectNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { reason } = req.body;
    if (!reason) {
      throw new CustomError(
        ADMIN_NUTRITIONIST_MESSAGES.REJECTION_REASON_REQUIRED,
        StatusCode.BAD_REQUEST,
      );
    }
    await this._adminNutritionistService.rejectNutritionist(userId, reason);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.REJECTED,
    });
  });

  getNutritionistProfile = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const profile =
      await this._adminNutritionistService.getNutritionistProfile(userId);
    if (!profile) {
      throw new CustomError(
        ADMIN_NUTRITIONIST_MESSAGES.PROFILE_NOT_FOUND,
        StatusCode.NOT_FOUND,
      );
    }
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.PROFILE_FETCH_SUCCESS,
      data: profile,
    });
  });

  updateNutritionistLevel = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { level } = req.body;
      await this._adminNutritionistService.updateNutritionistLevel(
        userId,
        level,
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: ADMIN_NUTRITIONIST_MESSAGES.LEVEL_UPDATED,
      });
    },
  );
}
