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
    const { fullName, email, phone, password } = data;
    logger.info(`Signup request initiated for ${email}`);
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) {
      throw new CustomError("User already exists", 409);
    }
    req.session.tempUser = { fullName, email, phone, password };
    const response = await this._otpService.requestOtp(email);
    logger.info(`OTP sent successfully for ${email}`);
    return { message: "OTP sent successfully. Please verify your email." };
  }


  async verifyOtp(req: Request, data: VerifyOtpDto): Promise<{ message: string; accessToken: string,refreshToken:string }>{
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
     const newUser = await this._userRepository.createUser({
      fullName: tempUser.fullName,
      email: tempUser.email,
      phone: tempUser.phone,
      password: hashedPassword,
      isVerified: true,
      role:"client",
    });
    logger.info(`User verified and registered successfully: ${email}`);
    const { accessToken, refreshToken } = generateTokens(newUser._id.toString(), newUser.role || "client");
    delete req.session.tempUser
    return { message: "Signup successful",accessToken, refreshToken,};
  }
  

  async resendOtp(data: ResendOtpDto): Promise<{ message: string }> {
    await validateDto(ResendOtpDto, data);
    const { email } = data;
    logger.info(`Resending OTP for ${email}`);
    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser && existingUser.isVerified) {
      throw new CustomError("Account already verified", StatusCode.BAD_REQUEST);
    }
    const response = await this._otpService.requestOtp(email);
    logger.info(`New OTP sent to ${email}`);
    return { message: response };
  }


  async login(data: LoginDto): Promise<{ user: any; accessToken: string; refreshToken: string }> {
    const { email, password } = data;
    const user = await this._userRepository.findByEmail( email );
    if (!user) {
      throw new Error("User not found");
    }
    const isMatch = await bcrypt.compare(password, user.password!);
    if (!isMatch) {
      throw new Error("Invalid password");
    }
    const { accessToken, refreshToken } = generateTokens(user._id!.toString(), user.role);
    const safeUser = {
      id: user._id,
      email: user.email,
      role: user.role,
      fullName: user.fullName,
    };
    return { user: safeUser, accessToken, refreshToken };
  }
  
  
  async googleLogin(payload: { credential: string; role: "client" | "nutritionist" | "admin" }) {
    const { credential, role } = payload;
    const ticket = await this._googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const tokenPayload = ticket.getPayload();
    if (!tokenPayload) throw new Error("Invalid Google token");
    let user = await this._userRepository.findByGoogleId(tokenPayload.sub!);
    if (!user) {
      user = await this._userRepository.createUser({
        fullName: tokenPayload.name || "",
        email: tokenPayload.email || "",
        googleId: tokenPayload.sub!,
        role,
        isVerified: true,
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


}
