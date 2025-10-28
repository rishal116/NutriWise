import { Request, Response } from "express";
import { IAdminAuthController } from "../interface/IAdminAuthController.ts";
import { IAdminAuthService } from "../../../services/interfaces/admin/IAdminAuthService";
import {asyncHandler} from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.IAdminAuthService)
    private _adminAuthService: IAdminAuthService
  ) {}

  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._adminAuthService.login(req.body);
    res.status(200).json(result);
  });
  
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._adminAuthService.forgotPassword(req.body);
    res.status(200).json(result);
  });

}
