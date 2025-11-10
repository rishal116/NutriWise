import { Request, Response } from "express";
import { IAdminAuthController } from "../../interfaces/admin/IAdminAuthController";
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
    res.cookie("refreshToken", result.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    
    return res.status(200).json({
      success: true,
      message: "Login successful",
      admin: result.admin,
      accessToken: result.accessToken,
    });
  });
  
  forgotPassword = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._adminAuthService.forgotPassword(req.body);
    res.status(200).json(result);
  });

}
