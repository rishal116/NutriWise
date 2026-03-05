import { Request, Response } from "express";
import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { IHealthDetailsController } from "../../interfaces/user/IHealthDetailsController";
import { IHealthDetailsService } from "../../../services/interfaces/user/IHealthDetailsService";
import { HealthDetailsRequestDTO } from "../../../dtos/user/healthDetails.dto";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { COMMON_MESSAGES, USER_MESSAGES } from "../../../constants";


@injectable()
export class HealthDetailsController implements IHealthDetailsController {
    constructor(
        @inject(TYPES.IHealthDetailsService)
        private _healthDetailsService: IHealthDetailsService
    ) {}
    
    getMyDetails = asyncHandler(async (req: Request, res: Response) => {
        const {userId} = req.user!;
        const data = await this._healthDetailsService.getHealthDetails(userId);
        return res.status(StatusCode.OK).json({
            success: true,
            message: COMMON_MESSAGES.SUCCESS,
            data,
        });
    });
    
    saveDetails = asyncHandler(async (req: Request, res: Response) => {
        const { userId } = req.user!;
        const payload: HealthDetailsRequestDTO = req.body;
        const data = await this._healthDetailsService.saveHealthDetails(userId, payload);
        return res.status(StatusCode.OK).json({
            success: true,
            message: USER_MESSAGES.HEALTH_DETAILS_UPDATED,
            data,
        });
    });
}
