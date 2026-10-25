import type { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { asyncHandler } from "../../../utils/asyncHandler";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ADMIN_NUTRITIONIST_MESSAGES } from "../../../constants";
import type { IAdminNutritionistApplicationController } from "../../interfaces/admin/IAdminNutritionistApplicationController";
import type { IAdminNutritionistApplicationService } from "../../../services/interfaces/admin/IAdminNutritionistApplicationService";
import type { AdminNutritionistApplicationListQueryDto } from "../../../dtos/admin/nutritionistApplication/admin-nutritionist-application-list-query.dto";
import type { ApplicationStatus } from "../../../types/nutritionist.types";

@injectable()
export class AdminNutritionistApplicationController implements IAdminNutritionistApplicationController {
  constructor(
    @inject(TYPES.IAdminNutritionistApplicationService)
    private readonly _applicationService: IAdminNutritionistApplicationService,
  ) {}

  getApplications = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._applicationService.getApplications(
      req.query as unknown as AdminNutritionistApplicationListQueryDto,
    );

    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_NUTRITIONIST_MESSAGES.FETCH_ALL_SUCCESS,
      data: result,
    });
  });

  updateApplicationStatus = asyncHandler(
    async (req: Request, res: Response) => {
      const { userId } = req.params;
      const { status, rejectionReason } = req.body as {
        status: ApplicationStatus;
        rejectionReason?: string;
      };

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
