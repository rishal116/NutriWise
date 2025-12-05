import { Request, Response, NextFunction } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutritionistController } from "../../interfaces/user/INutritionistsController";
import { INutritionistService } from "../../../services/interfaces/user/INutritionistsService";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { asyncHandler } from "../../../utils/asyncHandler";

@injectable()
export class NutritionistController implements INutritionistController {

    constructor(
        @inject(TYPES.INutritionistService)
        private _nutritionistService: INutritionistService
    ) {}
    getAllNutritionists = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        logger.info("Fetching all nutritionists with filters");
        const filters = req.query;
        const nutritionists = await this._nutritionistService.getAll(filters);
        res.status(StatusCode.OK).json({ success: true, data: nutritionists });
    });
    
    
    getNutritionistById = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
        const { id } = req.params;
        logger.info(`Fetching nutritionist by ID: ${id}`);
        const nutritionist = await this._nutritionistService.getById(id);
        console.log("dde",nutritionist);
        if (!nutritionist) {
            res.status(StatusCode.NOT_FOUND).json({ success: false, message: "Nutritionist not found" });
            return;
        }
        
        
        res.status(StatusCode.OK).json({ success: true, data: nutritionist });
    });


}
