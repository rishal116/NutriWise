import { injectable, inject } from "inversify";
import { Request, Response, NextFunction } from "express";
import bcrypt from "bcryptjs";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../interfaces/user/IUserAuthService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IOTPService } from "../../interfaces/IOtpService";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { OAuth2Client } from "google-auth-library";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { ResendOtpDto, UserRegisterDto, VerifyOtpDto ,LoginDto} from "../../../dtos/user/UserAuth.dto";
import { generateTokens } from "../../../utils/jwt";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../../../utils/sendOtp";


@injectable()
export class UserAuthService implements IUserAuthService {
  private _googleClient: OAuth2Client;
  constructor(
    @inject(TYPES.IUserRepository)
    private _userRepository: IUserRepository,

    @inject(TYPES.IOTPService)
    private _otpService: IOTPService
  ) {this._googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);}


  async signup(req: Request, data: UserRegisterDto): Promise<{ message: string }> {
    await validateDto(UserRegisterDto, data);
    const { fullName, email, password,confirmPassword, role } = data;
    logger.info(`Signup request initiated for ${email}`);
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError("User already exists", 409);
    }
    req.session.tempUser = { fullName, email, password, role };
    console.log(req.session.tempUser)
    const response = await this._otpService.requestOtp(email);
    logger.info(`OTP sent successfully for ${email}`);
    return { message: "OTP sent successfully. Please verify your email." };
  }


  async verifyOtp(req: Request, data: VerifyOtpDto): Promise<{ message: string; accessToken: string,refreshToken:string,role: string;  }>{
    await validateDto(VerifyOtpDto, data);
    const { email, otp } = data;
    logger.info(`Verifying OTP for ${email}`);
    const isValid = await this._otpService.verifyOtp(email, otp);
    if (!isValid) {
      throw new CustomError("Invalid or expired OTP", StatusCode.BAD_REQUEST);
    }
    const tempUser = req.session.tempUser; 
    if (!tempUser) {
      throw new CustomError("Temporary user data not found", StatusCode.NOT_FOUND);
    }
    const hashedPassword = await bcrypt.hash(tempUser.password, 10);
    const userData: any = {
      fullName: tempUser.fullName,
      email: tempUser.email,
      password: hashedPassword,
      role: tempUser.role,
    };

    const newUser = await this._userRepository.create(userData);
    logger.info(`User verified and registered successfully: ${email}`);
    const { accessToken, refreshToken } = generateTokens(newUser._id!.toString(), newUser.role || "client");
    delete req.session.tempUser
    return { message: "Signup successful",accessToken, refreshToken, role: newUser.role };
  }
  

  async resendOtp(data: ResendOtpDto): Promise<{ message: string }> {
    await validateDto(ResendOtpDto, data);
    const { email } = data;
    logger.info(`Resending OTP for ${email}`);
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError("Account already verified", StatusCode.BAD_REQUEST);
    }
    const response = await this._otpService.requestOtp(email);
    logger.info(`New OTP sent to ${email}`);
    return { message: response };
  }
  
  async login(data: LoginDto): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const { email, password } = data;
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    if (!user.password) {
      throw new CustomError("This account is registered with Google. Please login with Google",400);
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new CustomError("Invalid password", 401);
    }
    const { accessToken, refreshToken } = generateTokens(user._id!.toString(), user.role);
    const safeUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      isBlocked: user.isBlocked,
    };
    return { user: safeUser, accessToken, refreshToken };
  }
  
  
  async googleLogin(payload: { credential: string; role: "client" | "nutritionist" }) {
    const { credential, role } = payload;
    const ticket = await this._googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const tokenPayload = ticket.getPayload();
    if (!tokenPayload) throw new Error("Invalid Google token");
    let user = await this._userRepository.findByGoogleId(tokenPayload.sub!);
    if (!user) {
      user = await this._userRepository.create({
        fullName: tokenPayload.name || "",
        email: tokenPayload.email || "",
        googleId: tokenPayload.sub!,
        role,
      });
    }
    const { accessToken, refreshToken } = generateTokens(user._id!.toString(), user.role);
    const safeUser = {
      id: user._id,
      fullName: user.fullName,
      email: user.email,
      role: user.role,
    };
    return { user: safeUser, accessToken, refreshToken };
  }
  
  async requestPasswordReset(email: string): Promise<{ message: string }> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);
    const token = crypto.randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await this._userRepository.setResetToken(email, token, expires);
    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    await sendResetPasswordEmail(email, resetLink);

    logger.info(`Password reset token generated and sent to ${email}`);
    return { message: "Password reset link sent to your email." };
  }

  async resetPassword(token: string, newPassword: string): Promise<{ message: string }> {
    const user = await this._userRepository.findByResetToken(token);
    if (!user) throw new CustomError("Invalid or expired token", StatusCode.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updatePassword(user.email, hashedPassword);
    await this._userRepository.setResetToken(user.email, "", new Date(0));

    logger.info(`Password reset successfully for ${user.email}`);
    return { message: "Password reset successfully." };
  }
  
  
  async googleSignin({ credential }: { credential: string }) {
    const ticket = await this._googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    const email = payload?.email;
    if (!email) throw new CustomError("Google email not found", 400);
    const user = await this._userRepository.findByEmail(email);
    if (!user) {
      throw new CustomError( "Account not found. Please sign up first with Google.", 404 );
    }
    const { accessToken, refreshToken } = generateTokens(
      user._id!.toString(),
      user.role
    );
    return {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    };
  }
  
  async getMe(userId: string) {
    const user = await this._userRepository.findById(userId);
    if (!user) {
      throw new CustomError("User not found", 404);
    }
    return {
      id: user._id!.toString(),
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      nutritionistStatus: user.nutritionistStatus ?? "not_submitted",
    };
  }


}
