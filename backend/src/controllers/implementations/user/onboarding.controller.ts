import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { USER_MESSAGES } from "../../../constants";
import { IOnboardingService } from "../../../services/interfaces/user/IOnboardingService";
import { IOnboardingController } from "../../interfaces/user/IOnboardingController";

@injectable()
export class OnboardingController implements IOnboardingController {
  constructor(
    @inject(TYPES.IOnboardingService)
    private _onboardingService: IOnboardingService,
  ) {}

  completeProfile = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const userId = req.user!.userId;
      await this._onboardingService.completeProfile(userId, req.body);
      res.status(StatusCode.OK).json({
        success: true,
        message: USER_MESSAGES.PROFILE_COMPLETED,
      });
    },
  );
}
