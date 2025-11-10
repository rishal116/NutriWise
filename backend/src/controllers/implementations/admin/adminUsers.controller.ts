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
  
  
  getAllClients = asyncHandler(async (req: Request, res: Response) => {
    const clients = await this._adminUsersService.getAllClients();
    res.status(200).json({ success: true, clients });
  });

  getAllNutritionist = asyncHandler(async(req: Request, res: Response) => {
    const nutritionists = await this._adminUsersService.getAllNutritionists();
    res.status(200).json({success:true,nutritionists})
  })
  
  
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
