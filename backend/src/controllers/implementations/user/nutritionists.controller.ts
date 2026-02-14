import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistController } from "../../interfaces/user/INutritionistsController";
import { INutritionistService } from "../../../services/interfaces/user/INutritionistsService";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { NutritionistListFilter } from "../../../dtos/user/nutritionistUser.dto";
import { COMMON_MESSAGES, USER_MESSAGES } from "../../../constants";

@injectable()
export class NutritionistController implements INutritionistController {
    constructor(
        @inject(TYPES.INutritionistService)
        private _nutritionistService: INutritionistService
    ) {}
    
    getAllNutritionists = asyncHandler(async (req: Request, res: Response) => {
        const filters: NutritionistListFilter = {
            page: Number(req.query.page) || 1,
            limit: Number(req.query.limit) || 4,
            search: req.query.search as string | undefined,
            specializations: req.query.specializations as string | undefined,
        };
        const result = await this._nutritionistService.getAll(filters);
        return res.status(StatusCode.OK).json({
            success: true,
            message: COMMON_MESSAGES.SUCCESS,
            ...result,
        });
    });
    
    getNutritionistById = asyncHandler(async (req: Request, res: Response) => {
        const { nutritionistId } = req.params;
        const nutritionist = await this._nutritionistService.getById(nutritionistId);
        if (!nutritionist) {
            return res.status(StatusCode.NOT_FOUND).json({
                success: false,
                message: COMMON_MESSAGES.NOT_FOUND,
            });
        }
        return res.status(StatusCode.OK).json({
            success: true,
            message: COMMON_MESSAGES.SUCCESS,
            data: nutritionist,
        });
    });
    
    getNutritionistPlans = asyncHandler(async (req: Request, res: Response) => {
        const { nutritionistId } = req.params;
        const plans = await this._nutritionistService.getPlansByNutritionist(nutritionistId);
        return res.status(StatusCode.OK).json({
            success: true,
            message: USER_MESSAGES.PLANS_FETCHED,
            data: plans,
        });
    });
    
}
