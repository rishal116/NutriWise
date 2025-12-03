import { Request, Response, NextFunction } from "express";
import { IAdminClientController } from "../../interfaces/admin/IAdminClientController";
import { IAdminClientService } from "../../../services/interfaces/admin/IAdminClientService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class AdminClientController implements IAdminClientController {
  constructor(
    @inject(TYPES.IAdminClientService)
    private _adminClientService: IAdminClientService,
  ) {}


  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    logger.info(`Admin fetching users | page=${page}, limit=${limit}, search=${search ?? "none"}`);
    const response = await this._adminClientService.getAllUsers(page, limit, search);
    logger.info(`Admin successfully fetched users list | total=${response.total}`);
    res.status(StatusCode.OK).json(response);
  });
  
  
  blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    logger.warn(`Admin attempting to block user | userId=${userId}`);
    await this._adminClientService.blockUser(userId);
    logger.warn(`User blocked successfully | userId=${userId}`);
    res.status(StatusCode.OK).json({ success: true, message: "User blocked successfully"});
  });
  
  
  unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    logger.info(`Admin attempting to unblock user | userId=${userId}`);
    await this._adminClientService.unblockUser(userId);
    logger.info(`User unblocked successfully | userId=${userId}`);
    res.status(StatusCode.OK).json({ success: true, message: "User unblocked successfully"});
  });


}
