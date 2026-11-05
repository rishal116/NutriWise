import type { Request, Response } from "express";
import { inject, injectable } from "inversify";

import { TYPES } from "../../../../types/types";
import type { IRoleSwitchService } from "../../../../services/interfaces/user/auth/IRoleSwitchService";
import type { IUserRoleController } from "../../../interfaces/user/auth/IUserRoleController";

import { StatusCode } from "../../../../enums/statusCode.enum";
import { asyncHandler } from "../../../../utils/asyncHandler";
import { setAuthCookies } from "../../../../utils/token.util";
import { AUTH_MESSAGES } from "../../../../constants";
import { sendResponse } from "../../../../utils/responseHandler";

@injectable()
export class UserRoleController implements IUserRoleController {
  constructor(
    @inject(TYPES.IRoleSwitchService)
    private readonly _roleSwitchService: IRoleSwitchService,
  ) {}

  switchRole = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.user!;

    const response = await this._roleSwitchService.switchRole(userId, req.body);

    setAuthCookies(res, response.refreshToken);

    return sendResponse(res, StatusCode.OK, AUTH_MESSAGES.ROLE_SWITCH_SUCCESS, {
      accessToken: response.accessToken,
    });
  });
}
