import { inject, injectable } from "inversify";
import type { Request, Response, NextFunction } from "express";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import type { INutritionistCredentialsService } from "../../../services/interfaces/nutritionist/INutriCredentialsService";
import type { INutriCredentialsController } from "../../interfaces/nutritionist/INutriCredentialsController";

@injectable()
export class NutritionistCredentialsController implements INutriCredentialsController {
  constructor(
    @inject(TYPES.INutriCredentialsService)
    private readonly nutritionistCredentialsService: INutritionistCredentialsService,
  ) {}

  getCredentials = (req: Request, res: Response, next: NextFunction): void => {
    asyncHandler(async (req: Request, res: Response): Promise<void> => {
      const credentials =
        await this.nutritionistCredentialsService.getCredentials(
          req.user!.userId,
        );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Nutritionist credentials retrieved successfully",
        data: credentials,
      });
    })(req, res, next);
  };
}
