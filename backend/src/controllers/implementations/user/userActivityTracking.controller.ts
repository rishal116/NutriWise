import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { IUserActivityTrackingController } from "../../interfaces/user/IUserActivityTrackingController";
import { IUserActivityTrackingService } from "../../../services/interfaces/user/tracking/IUserActivityTrackingService";
import { UpdateActivityTrackingDTO } from "../../../dtos/user/tracking/update-activity-tracking.dto";

@injectable()
export class UserActivityTrackingController implements IUserActivityTrackingController {
  constructor(
    @inject(TYPES.IUserActivityTrackingService)
    private readonly _userActivityTrackingService: IUserActivityTrackingService,
  ) {}

  startActivity = asyncHandler(async (req: Request, res: Response) => {
    const { programId, dayId, activityId } = req.params;
    const userId = req.user!.userId;
    const tracking = await this._userActivityTrackingService.startActivity(
      userId,
      programId,
      dayId,
      activityId,
    );
    res.status(StatusCode.OK).json({
      success: true,
      data: tracking,
    });
  });

  updateActivity = asyncHandler(async (req: Request, res: Response) => {
    const { programId, dayId, activityId } = req.params;
    const userId = req.user!.userId;
    const data: UpdateActivityTrackingDTO = req.body;
    const tracking = await this._userActivityTrackingService.updateActivity(
      userId,
      programId,
      dayId,
      activityId,
      data,
    );
    res.status(StatusCode.OK).json({
      success: true,
      data: tracking,
    });
  });

  skipActivity = asyncHandler(async (req: Request, res: Response) => {
    const { programId, dayId, activityId } = req.params;
    const userId = req.user!.userId;
    const { skippedReason } = req.body;
    const tracking = await this._userActivityTrackingService.skipActivity(
      userId,
      programId,
      dayId,
      activityId,
      skippedReason,
    );
    res.status(StatusCode.OK).json({
      success: true,
      data: tracking,
    });
  });

  getActivityTracking = asyncHandler(async (req: Request, res: Response) => {
    const { dayId, activityId } = req.params;
    const userId = req.user!.userId;
    const tracking =
      await this._userActivityTrackingService.getActivityTracking(
        userId,
        dayId,
        activityId,
      );
    res.status(StatusCode.OK).json({
      success: true,
      data: tracking,
    });
  });

  getDayActivityTracking = asyncHandler(async (req: Request, res: Response) => {
    const { dayId } = req.params;
    const userId = req.user!.userId;
    const tracking =
      await this._userActivityTrackingService.getDayActivityTracking(
        userId,
        dayId,
      );
    res.status(StatusCode.OK).json({
      success: true,
      data: tracking,
    });
  });
}
