import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { COMMON_MESSAGES } from "../../../constants";
import { asyncHandler } from "../../../utils/asyncHandler";
import { INutritionistBrowsingController } from "../../interfaces/user/INutriBrowsingController";
import { INutritionistBrowsingService } from "../../../services/interfaces/user/discovery/INutriBrowsingService";
import { toNutritionistListQueryDTO } from "../../../mapper/user/nutri-browsing/nutri-list-query.mapper";

@injectable()
export class NutritionistBrowsingController implements INutritionistBrowsingController {
  constructor(
    @inject(TYPES.INutritionistBrowsingService)
    private readonly _nutritionistBrowsingService: INutritionistBrowsingService,
  ) {}

  browseNutritionists = asyncHandler(async (req, res) => {
    const query = toNutritionistListQueryDTO(req.query);

    const result =
      await this._nutritionistBrowsingService.browseNutritionists(query);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Nutritionists fetched successfully",
      data: result,
    });
  });

  getNutritionistProfile = asyncHandler(async (req: Request, res: Response) => {
    const { username } = req.params;
    console.log(username);

    const nutritionist =
      await this._nutritionistBrowsingService.getNutritionistProfile(username);

    return res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data: nutritionist,
    });
  });

  getBrowseStatistics = asyncHandler(async (_req: Request, res: Response) => {
    const statistics =
      await this._nutritionistBrowsingService.getBrowseStatistics();

    res.status(StatusCode.OK).json({
      success: true,
      message: COMMON_MESSAGES.SUCCESS,
      data: statistics,
    });
  });
}
