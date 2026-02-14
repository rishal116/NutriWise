import { Request, Response } from "express";
import { IAdminAuthController } from "../../interfaces/admin/IAdminAuthController";
import { IAdminAuthService } from "../../../services/interfaces/admin/IAdminAuthService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { setAdminAuthCookies, clearAdminAuthCookies } from "../../../utils/jwt";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.IAdminAuthService)
    private _adminAuthService: IAdminAuthService
  ) {}
  
  login = asyncHandler(async (req: Request, res: Response) => {
    const result = await this._adminAuthService.login(req.body);
    setAdminAuthCookies(res, result.refreshToken);
    res.status(StatusCode.OK).json({
    success: true,
    message: "Login successful",
    admin: result.admin,
    accessToken: result.accessToken,})
  });

  logout = asyncHandler(async ( req: Request, res: Response) => {
    clearAdminAuthCookies(res);
    logger.info("Admin logged out successfully");
    return res.status(StatusCode.OK).json({
      success: true,
      message: "Logged out successfully",
    });
  });
}
