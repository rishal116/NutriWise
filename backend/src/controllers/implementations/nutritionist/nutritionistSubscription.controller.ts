import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { INutritionistSubscriptionController } from "../../interfaces/nutritionist/INutritionistSubscriptionController";
import { INutriSubscriptionService } from "../../../services/interfaces/nutritionist/INutriSubcriptionService";

@injectable()
export class NutritionistSubscriptionController implements INutritionistSubscriptionController {
  constructor(
    @inject(TYPES.INutriSubscriptionService)
    private _nutriSubscriptionService: INutriSubscriptionService,
  ) {}

  getSubscribers = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const subscribers =
      await this._nutriSubscriptionService.getSubscribers(userId);
    console.log(subscribers);

    res.status(StatusCode.OK).json({ success: true, data: subscribers });
  });

  getSubscriptions = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;
    const subscriptions =
      await this._nutriSubscriptionService.getSubscriptions(userId);
    res.status(StatusCode.OK).json({ success: true, data: subscriptions });
  });
}
