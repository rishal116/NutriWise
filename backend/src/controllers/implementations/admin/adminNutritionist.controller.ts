import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import type { IAdminNutritionistController } from "../../interfaces/admin/IAdminNutritionistController";
import type { IAdminNutritionistService } from "../../../services/interfaces/admin/IAdminNutritionistService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ADMIN_NUTRITIONIST_MESSAGES } from "../../../constants";
import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";

@injectable()
export class AdminNutritionistController implements IAdminNutritionistController {
  constructor(
    @inject(TYPES.IAdminNutritionistService)
    private readonly _adminNutritionistService: IAdminNutritionistService,
  ) {}

  getNutritionists = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._adminNutritionistService.getNutritionists(
      req.query as unknown as AdminNutritionistListQueryDto,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.FETCH_ALL_SUCCESS,
      data: result,
    });
  });

  getNutritionistDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;

    const nutritionist =
      await this._adminNutritionistService.getNutritionistDetails(userId);

    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.DETAILS_FETCH_SUCCESS,
      data: nutritionist,
    });
  });

  updateCoachLevel = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { coachLevel } = req.body;

    await this._adminNutritionistService.updateCoachLevel(userId, coachLevel);

    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.LEVEL_UPDATED,
    });
  });
}
