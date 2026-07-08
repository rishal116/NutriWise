import { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { IAdminNutritionistController } from "../../interfaces/admin/IAdminNutritionistController";
import { IAdminNutritionistService } from "../../../services/interfaces/admin/IAdminNutritionistService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ADMIN_NUTRITIONIST_MESSAGES } from "../../../constants";
import {
  ApplicationStatus,
  AvailabilityStatus,
  CoachLevel,
} from "../../../types/nutritionist.types";
import { AdminNutritionistListQueryDto } from "../../../dtos/admin/nutritionist/admin-nutritionist-list-query.dto";

@injectable()
export class AdminNutritionistController implements IAdminNutritionistController {
  constructor(
    @inject(TYPES.IAdminNutritionistService)
    private readonly _adminNutritionistService: IAdminNutritionistService,
  ) {}

  getNutritionists = asyncHandler(async (req: Request, res: Response) => {
    const query: AdminNutritionistListQueryDto = {
      skip: Number(req.query.skip) || 0,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string | undefined,
      coachLevel: req.query.coachLevel as CoachLevel | undefined,
      availabilityStatus: req.query.availabilityStatus as
        | AvailabilityStatus
        | undefined,
      applicationStatus: req.query.applicationStatus as
        | ApplicationStatus
        | undefined,
      isBlocked:
        req.query.isBlocked !== undefined
          ? req.query.isBlocked === "true"
          : undefined,
      sortBy: req.query.sortBy as
        | "createdAt"
        | "fullName"
        | "rating"
        | "coachLevel"
        | "totalExperienceYears"
        | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
    };
    const result = await this._adminNutritionistService.getNutritionists(query);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.FETCH_ALL_SUCCESS,
      ...result,
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
