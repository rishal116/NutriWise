import bcrypt from "bcryptjs";
import { IAdminAuthService } from "../../interfaces/admin/IAdminAuthService";
import { IAdminAuthRepository } from "../../../repositories/interfaces/admin/IAdminAuthRepository";
import { generateTokens } from "../../../utils/jwt";
import { OtpModel } from "../../../models/otp.model";
import { sendOtpEmail } from "../../../utils/sendOtp";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import {AdminLoginDto,AdminForgotPasswordDto,AdminLoginResponseDto,} from "../../../dtos/admin/adminAuth.dto";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { validateDto } from "../../../middlewares/validateDto.middleware";

@injectable()
export class AdminAuthService implements IAdminAuthService {
  constructor(
    @inject(TYPES.IAdminAuthRepository)
    private _adminAuthRepository: IAdminAuthRepository
  ) {}

  
  async login(dto: AdminLoginDto) {
    await validateDto(AdminLoginDto, dto);
    const { email, password } = dto;
    const admin = await this._adminAuthRepository.findByEmail(email);
    if (!admin) throw new CustomError("Invalid credentials", 401);
    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) throw new CustomError("Invalid credentials", 401);
    const { accessToken, refreshToken } = generateTokens(admin._id.toString(), "admin");
    return new AdminLoginResponseDto(admin, accessToken, refreshToken);
  }


  async forgotPassword(dto: AdminForgotPasswordDto) {
    const { email } = dto;
    const admin = await this._adminAuthRepository.findByEmail(email!);
    if (!admin){
      throw new CustomError("Email not found", StatusCode.NOT_FOUND);
    }
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000);
    await OtpModel.findOneAndUpdate(
      { email },
      { email, otp: otpCode, expiresAt },
      { upsert: true, new: true }
    );
    await sendOtpEmail(email!, otpCode);
    return { message: "OTP sent to email" };
  }


}
