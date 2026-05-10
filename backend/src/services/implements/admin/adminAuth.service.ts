import bcrypt from "bcryptjs";
import { inject, injectable } from "inversify";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { generateTokens } from "../../../utils/jwt";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import {
  AdminLoginDto,
  AdminLoginResponseDto,
} from "../../../dtos/admin/adminAuth.dto";
import { TYPES } from "../../../types/types";
import logger from "../../../utils/logger";
import { mapUserToSafeUserDto } from "../../../mapper/user/userAuth.mapper";

@injectable()
export class AdminAuthService {
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,
  ) {}

  async login(dto: AdminLoginDto): Promise<AdminLoginResponseDto> {
    const { email, password } = dto;

    logger.info("Admin login attempt", { email });

    // 1. FIND USER
    const user = await this._userRepository.findByEmail(email);

    if (!user) {
      throw new CustomError(
        "Invalid email or password",
        StatusCode.UNAUTHORIZED,
      );
    }

    // 2. ROLE CHECK (IMPORTANT)
    if (!user.roles.includes("admin")) {
      throw new CustomError(
        "Access denied",
        StatusCode.FORBIDDEN,
      );
    }

    // 3. PASSWORD CHECK
    const isValid = await bcrypt.compare(password, user.password!);

    if (!isValid) {
      throw new CustomError(
        "Invalid email or password",
        StatusCode.UNAUTHORIZED,
      );
    }

    // 4. TOKEN GENERATION
    const { accessToken, refreshToken } = generateTokens(
      user._id.toString(),
      "admin",
      user.roles,
    );

    logger.info("Admin login successful", {
      userId: user._id.toString(),
    });

    // 5. SAFE USER MAPPING
    const safeUser = mapUserToSafeUserDto(user);

    return new AdminLoginResponseDto(
      safeUser,
      accessToken,
      refreshToken,
    );
  }
}