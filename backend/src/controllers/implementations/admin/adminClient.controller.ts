import { Request, Response } from "express";
import { IAdminClientController } from "../../interfaces/admin/IAdminClientController";
import { IAdminClientService } from "../../../services/interfaces/admin/IAdminClientService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { StatusCode } from "../../../enums/statusCode.enum";
import { ADMIN_CLIENT_MESSAGES } from "../../../constants";

@injectable()
export class AdminClientController implements IAdminClientController {
  constructor(
    @inject(TYPES.IAdminClientService)
    private _adminClientService: IAdminClientService
  ) {}
  
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const pageNumber = Number(req.query.page) || 1;
    const pageLimit = Number(req.query.limit) || 10;
    const searchKeyword = req.query.search as string | undefined;
    const usersResult = await this._adminClientService.getAllUsers(
      pageNumber,
      pageLimit,
      searchKeyword
    );
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_CLIENT_MESSAGES.USERS_FETCH_SUCCESS,
      data: usersResult,
    });
  });
  
  blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await this._adminClientService.blockUser(userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_CLIENT_MESSAGES.ACCOUNT_BLOCK_SUCCESS,
    });
  });
  
  unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await this._adminClientService.unblockUser(userId);
    return res.status(StatusCode.OK).json({
      success: true,
      message: ADMIN_CLIENT_MESSAGES.ACCOUNT_UNBLOCK_SUCCESS,
    });
  });
  
}
