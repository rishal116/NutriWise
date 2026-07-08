import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { IAdminUserController } from "../../interfaces/admin/IAdminUserController";
import { IAdminUserService } from "../../../services/interfaces/admin/IAdminUserService";
import { TYPES } from "../../../types/types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ADMIN_CLIENT_MESSAGES } from "../../../constants";
import { AdminUserListQueryDto } from "../../../dtos/admin/user/admin-user-list-query.dto";

@injectable()
export class AdminUserController implements IAdminUserController {
  constructor(
    @inject(TYPES.IAdminUserService)
    private readonly _adminUserService: IAdminUserService,
  ) {}

  getUsers = asyncHandler(async (req: Request, res: Response) => {
    const query: AdminUserListQueryDto = {
      skip: Number(req.query.skip) || 0,
      limit: Number(req.query.limit) || 20,
      search: req.query.search as string | undefined,
      sortBy: req.query.sortBy as
        | "createdAt"
        | "fullName"
        | "email"
        | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
      isBlocked:
        req.query.isBlocked !== undefined
          ? req.query.isBlocked === "true"
          : undefined,
    };
    const result = await this._adminUserService.getUsers(query);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_CLIENT_MESSAGES.USERS_FETCH_SUCCESS,
      ...result,
    });
  });

  updateBlockStatus = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    const { isBlocked } = req.body as { isBlocked: boolean };
    await this._adminUserService.updateBlockStatus(userId, isBlocked);
    return res.status(StatusCode.OK).json({
      success: true,
      message: isBlocked
        ? ADMIN_CLIENT_MESSAGES.ACCOUNT_BLOCK_SUCCESS
        : ADMIN_CLIENT_MESSAGES.ACCOUNT_UNBLOCK_SUCCESS,
    });
  });
}
