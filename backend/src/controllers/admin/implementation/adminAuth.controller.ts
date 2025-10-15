import { Request, Response, NextFunction } from "express";
import { IAdminAuthController } from "../interface/IAdminAuthController.ts";
import { IAdminAuthService } from "../../../services/admin/interface/IAdminAuthService";
import { validate } from "class-validator";
import { plainToInstance } from "class-transformer";
import {
  AdminLoginDto,
  AdminChangePasswordDto,
  AdminForgotPasswordDto,
  AdminResetPasswordDto,
} from "../../../dtos/admin/adminAuth.dtos";

export class AdminAuthController implements IAdminAuthController {
  constructor(private adminAuthService: IAdminAuthService) {}

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

      const result = await this.adminAuthService.login(dto);
      console.log(result)
      res.status(200).json(result);

    } catch (error) {
      next(error);
    }
  }

  async getProfile(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user?.id || "TEMP_ADMIN_ID";
      const result = await this.adminAuthService.getProfile(adminId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async changePassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user?.id || "TEMP_ADMIN_ID";
      const dto = Object.assign(new AdminChangePasswordDto(), req.body);
      const result = await this.adminAuthService.changePassword(adminId, dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const adminId = req.user?.id || "TEMP_ADMIN_ID";
      const result = await this.adminAuthService.logout(adminId);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { token } = req.body;
      const result = await this.adminAuthService.refreshToken(token);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = Object.assign(new AdminForgotPasswordDto(), req.body);
      const result = await this.adminAuthService.forgotPassword(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async verifyOtp(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { email, otp } = req.body;
      const result = await this.adminAuthService.verifyOtp(email, otp);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const dto = Object.assign(new AdminResetPasswordDto(), req.body);
      const result = await this.adminAuthService.resetPassword(dto);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
}
