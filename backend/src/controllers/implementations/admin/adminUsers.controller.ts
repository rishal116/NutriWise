import { NextFunction, Request, Response } from "express";
import { IAdminUsersController } from "../../interfaces/admin/IAdminUsersController";
import { IAdminUsersService } from "../../../services/interfaces/admin/IAdminUsersService";
import {asyncHandler} from "../../../utils/asyncHandler";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";

@injectable()
export class AdminUsersController implements IAdminUsersController {
  constructor(
    @inject(TYPES.IAdminUsersService)
    private _adminUsersService: IAdminUsersService
  ) {}
  
  getAllUsers = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const response = await this._adminUsersService.getAllUsers(page, limit, search);
    res.status(200).json(response);
  });
  
  getAllNutritionist = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const search = req.query.search as string | undefined;
    const response = await this._adminUsersService.getAllNutritionists(page, limit, search);
    res.status(200).json(response);
  });
  
  
  blockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await this._adminUsersService.blockUser(userId);
    res.status(200).json({ success: true, message: "User blocked successfully" });
  });
  
  unblockUser = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    await this._adminUsersService.unblockUser(userId);
    res.status(200).json({ success: true, message: "User unblocked successfully" });
  });
  
  
  getNutritionistDetails = asyncHandler(async (req: Request, res: Response) => {
    const { userId } = req.params;
    console.log(userId)
    const nutritionist = await this._adminUsersService.getNutritionistById(userId);
    if (!nutritionist) {
      return res.status(404).json({ success: false, message: "Nutritionist not found" });
    }
    res.status(200).json({ success: true, nutritionist });
  });



}
