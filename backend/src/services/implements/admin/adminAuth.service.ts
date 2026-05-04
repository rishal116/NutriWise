import bcrypt from "bcryptjs";
import { IAdminAuthService } from "../../interfaces/admin/IAdminAuthService";
import { IAdminAuthRepository } from "../../../repositories/interfaces/admin/IAdminAuthRepository";
import { generateTokens } from "../../../utils/jwt";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import {
  AdminLoginDto,
  AdminLoginResponseDto,
} from "../../../dtos/admin/adminAuth.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";


@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.IAdminAuthRepository)
    private _adminAuthRepository: IAdminAuthRepository,
  ) {}

  async login(dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const { email, password } = dto;

    logger.info("Admin login attempt", {
      email,
      action: "LOGIN_ATTEMPT",
    });

    const admin = await this._adminAuthRepository.findByEmail(email);

    if (!admin) {
      logger.warn("Admin login failed", {
        email,
        action: "LOGIN_FAILED",
        reason: "ADMIN_NOT_FOUND",
      });

      throw new CustomError(
        "Invalid email or password",
        StatusCode.UNAUTHORIZED,
      );
    }

    const isValid = await bcrypt.compare(password, admin.password);

    if (!isValid) {
      logger.warn("Admin login failed", {
        adminId: admin._id.toString(),
        email,
        action: "LOGIN_FAILED",
        reason: "INVALID_PASSWORD",
      });

      throw new CustomError(
        "Invalid email or password",
        StatusCode.UNAUTHORIZED,
      );
    }

    const { accessToken, refreshToken } = generateTokens(
      admin._id.toString(),
      "admin",
    );

    logger.info("Admin login successful", {
      adminId: admin._id.toString(),
      email,
      action: "LOGIN_SUCCESS",
    });

    return new AdminLoginResponseDto(
      {
        _id: admin._id.toString(),
        email: admin.email,
        role: admin.role,
      },
      accessToken,
      refreshToken,
    );
  }
}
