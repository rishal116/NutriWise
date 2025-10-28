import { Request, Response, NextFunction } from "express";
import { IAdminAuthController } from "../interface/IAdminAuthController.ts";
import { IAdminAuthService } from "../../../services/interfaces/admin/IAdminAuthService.js";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import {
  AdminLoginDto,
  AdminChangePasswordDto,
  AdminForgotPasswordDto,
  AdminResetPasswordDto,
} from "../../../dtos/admin/adminAuth.dtos";

export class AdminAuthController implements IAdminAuthController {
  constructor(private _adminAuthService: IAdminAuthService) {}

async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = plainToInstance(AdminLoginDto, req.body);
      const errors = await validate(dto);
      if (errors.length > 0) {
        res.status(400).json({
          message: "Validation failed",
          errors: errors.map(err => Object.values(err.constraints ?? {})).flat(),
        });
        return;
      }

      const result = await this._adminAuthService.login(dto);
      console.log(result)
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }





}
