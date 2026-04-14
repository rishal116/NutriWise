import { Request, Response } from "express";
import { IAdminAuthController } from "../../interfaces/admin/IAdminAuthController";
import { IAdminAuthService } from "../../../services/interfaces/admin/IAdminAuthService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { setAdminAuthCookies, clearAdminAuthCookies } from "../../../utils/jwt";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ADMIN_AUTH_MESSAGES } from "../../../constants";
import logger from "../../../utils/logger";

@injectable()
export class AdminAuthController implements IAdminAuthController {
  constructor(
    @inject(TYPES.IAdminAuthService)
    private _adminAuthService: IAdminAuthService,
  ) {}

  login = asyncHandler(async (req: Request, res: Response) => {
    const loginPayload = req.body;
    const loginResult = await this._adminAuthService.login(loginPayload);
    setAdminAuthCookies(res, loginResult.refreshToken);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_AUTH_MESSAGES.LOGIN_SUCCESS,
      data: {
        admin: loginResult.admin,
        accessToken: loginResult.accessToken,
      },
    });
  });

  logout = asyncHandler(async (_req: Request, res: Response) => {
    clearAdminAuthCookies(res);
    logger.info("Admin logout successful");
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_AUTH_MESSAGES.LOGOUT_SUCCESS,
    });
  });
}
