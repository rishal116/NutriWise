import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IAdminNutritionistApplicationController } from "../../interfaces/admin/IAdminNutritionistApplicationController";
import { IAdminNutritionistApplicationService } from "../../../services/interfaces/admin/IAdminNutritionistApplicationService";
import { ADMIN_NUTRITIONIST_MESSAGES } from "../../../constants";
import { ApplicationStatus } from "../../../types/nutritionist.types";
import { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";

@injectable()
export class AdminNutritionistApplicationController implements IAdminNutritionistApplicationController {
  constructor(
    @inject(TYPES.IAdminNutritionistApplicationService)
    private _applicationService: IAdminNutritionistApplicationService,
  ) {}

  getApplications = asyncHandler(async (req: Request, res: Response) => {
    const query: AdminNutritionistApplicationListQueryDto = {
      skip: Number(req.query.skip) || 0,
      limit: Number(req.query.limit) || 10,
      search: req.query.search as string | undefined,
      applicationStatus: req.query.applicationStatus as
        | ApplicationStatus
        | undefined,
      sortBy: req.query.sortBy as "createdAt" | "fullName" | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
    };
    const result = await this._applicationService.getApplications(query);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.FETCH_ALL_SUCCESS,
      ...result,
    });
  });

  updateApplicationStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { status, rejectionReason } = req.body;
      await this._applicationService.updateApplicationStatus(
        userId,
        status,
        rejectionReason,
      );
      return res.status(StatusCode.OK).json({
        success: true,
        message: ADMIN_NUTRITIONIST_MESSAGES.STATUS_UPDATED,
      });
    },
  );
}
