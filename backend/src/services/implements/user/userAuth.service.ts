import { injectable, inject } from "inversify";
import { Request } from "express";
import bcrypt from "bcryptjs";
import { TYPES } from "../../../types/types";
import { IUserAuthService } from "../../interfaces/user/IUserAuthService";
import { IUserRepository } from "../../../repositories/interfaces/user/IUserRepository";
import { IOTPService } from "../../interfaces/common/IOtpService";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { OAuth2Client } from "google-auth-library";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { ResendOtpDto, UserRegisterDto, VerifyOtpDto, LoginDto } from "../../../dtos/user/UserAuth.dto";
import { generateTokens } from "../../../utils/jwt";
import crypto from "crypto";
import { sendResetPasswordEmail } from "../../../utils/sendOtp";

import {
  SignupResponseDto,
  VerifyOtpResponseDto,
  LoginResponseDto,
  GoogleLoginRequestDto,
  GoogleLoginResponseDto,
  GoogleSigninRequestDto,
  MessageResponseDto,
  GetMeResponseDto,
} from "../../../dtos/user/userAuth.response.dto";

import { mapUserToSafeUserDto, mapUserToGetMeDto, UserEntity } from "../../../mapper/user/userAuth.mapper";

type TempUserSession = {
  fullName: string;
  email: string;
  password: string;
  role: "client" | "nutritionist" | "admin";
};

// If your express-session typing isn't extended, you can keep this local safe access helper:
const getTempUser = (req: Request): TempUserSession | undefined => {
  const sessionObj = req.session as unknown as { tempUser?: TempUserSession };
  return sessionObj.tempUser;
};

const deleteTempUser = (req: Request) => {
  const sessionObj = req.session as unknown as { tempUser?: TempUserSession };
  delete sessionObj.tempUser;
};

@injectable()
export class UserAuthService implements IUserAuthService {
  private _googleClient: OAuth2Client;

  constructor(
    @inject(TYPES.IUserRepository) private _userRepository: IUserRepository,
    @inject(TYPES.IOTPService) private _otpService: IOTPService
  ) {
    this._googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
  }

  async signup(req: Request, data: UserRegisterDto): Promise<SignupResponseDto> {
    await validateDto(UserRegisterDto, data);

    const { fullName, email, password, role } = data;
    logger.info("Signup request", { email, role });

    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) throw new CustomError("User already exists", 409);

    // store temp user in session
    (req.session as unknown as { tempUser?: TempUserSession }).tempUser = {
      fullName,
      email,
      password,
      role,
    };

    await this._otpService.requestOtp(email);
    return { message: "OTP sent successfully. Please verify your email." };
  }

  async verifyOtp(req: Request, data: VerifyOtpDto): Promise<VerifyOtpResponseDto> {
    await validateDto(VerifyOtpDto, data);

    const { email, otp } = data;
    logger.info("Verify OTP", { email });

    const isValid = await this._otpService.verifyOtp(email, otp);
    if (!isValid) throw new CustomError("Invalid or expired OTP", StatusCode.BAD_REQUEST);

    const tempUser = getTempUser(req);
    if (!tempUser) throw new CustomError("Temporary user data not found", StatusCode.NOT_FOUND);

    const hashedPassword = await bcrypt.hash(tempUser.password, 10);

    // NO any: define a proper create payload type
    const createPayload: {
      fullName: string;
      email: string;
      password: string;
      role: TempUserSession["role"];
    } = {
      fullName: tempUser.fullName,
      email: tempUser.email,
      password: hashedPassword,
      role: tempUser.role,
    };

    const newUser = (await this._userRepository.create(createPayload)) as unknown as UserEntity;

    const { accessToken, refreshToken } = generateTokens(
      // mapper already handles id but token generator needs string id
      (newUser._id as { toString: () => string }).toString(),
      newUser.role || "client"
    );

    deleteTempUser(req);

    return {
      message: "Signup successful",
      accessToken,
      refreshToken,
      role: mapUserToSafeUserDto(newUser).role,
    };
  }

  async resendOtp(data: ResendOtpDto): Promise<MessageResponseDto> {
    await validateDto(ResendOtpDto, data);

    const { email } = data;
    logger.info("Resend OTP", { email });

    const existingUser = await this._userRepository.findByEmail(email);
    if (existingUser) throw new CustomError("Account already verified", StatusCode.BAD_REQUEST);

    const response = await this._otpService.requestOtp(email);
    return { message: response };
  }

  async login(data: LoginDto): Promise<LoginResponseDto> {
    await validateDto(LoginDto, data);

    const { email, password } = data;
    logger.info("Login request", { email });

    const user = (await this._userRepository.findByEmail(email)) as unknown as (UserEntity & { password?: string });
    if (!user) throw new CustomError("User not found", 404);

    if (!user.password) {
      throw new CustomError("This account is registered with Google. Please login with Google", 400);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new CustomError("Invalid password", 401);

    const { accessToken, refreshToken } = generateTokens(
      (user._id as { toString: () => string }).toString(),
      user.role
    );

    return {
      user: mapUserToSafeUserDto(user),
      accessToken,
      refreshToken,
    };
  }

  async googleLogin(payload: GoogleLoginRequestDto): Promise<GoogleLoginResponseDto> {
    const { credential, role } = payload;

    const ticket = await this._googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const tokenPayload = ticket.getPayload();
    if (!tokenPayload) throw new Error("Invalid Google token");

    let user = (await this._userRepository.findByGoogleId(tokenPayload.sub!)) as unknown as UserEntity;

    if (!user) {
      user = (await this._userRepository.create({
        fullName: tokenPayload.name || "",
        email: tokenPayload.email || "",
        googleId: tokenPayload.sub!,
        role,
      })) as unknown as UserEntity;
    }

    const { accessToken, refreshToken } = generateTokens(
      (user._id as { toString: () => string }).toString(),
      user.role
    );

    return { user: mapUserToSafeUserDto(user), accessToken, refreshToken };
  }

  async requestPasswordReset(email: string): Promise<MessageResponseDto> {
    const user = await this._userRepository.findByEmail(email);
    if (!user) throw new CustomError("User not found", StatusCode.NOT_FOUND);

    const token = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000);

    await this._userRepository.setResetToken(email, hashedToken, expires);

    const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;
    console.log(resetLink);
    
    await sendResetPasswordEmail(email, resetLink);

    return { message: "Password reset link sent to your email." };
  }

  async resetPassword(token: string, newPassword: string): Promise<MessageResponseDto> {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const user = await this._userRepository.findByResetToken(hashedToken);
    if (!user) throw new CustomError("Invalid or expired token", StatusCode.BAD_REQUEST);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await this._userRepository.updatePasswordByEmail(user.email, hashedPassword);
    await this._userRepository.setResetToken(user.email, "", new Date(0));

    return { message: "Password reset successfully." };
  }

  async googleSignin(payload: GoogleSigninRequestDto): Promise<GoogleLoginResponseDto> {
    const { credential } = payload;

    const ticket = await this._googleClient.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const googlePayload = ticket.getPayload();
    const email = googlePayload?.email;
    if (!email) throw new CustomError("Google email not found", 400);

    const user = (await this._userRepository.findByEmail(email)) as unknown as UserEntity;
    if (!user) throw new CustomError("Account not found. Please sign up first with Google.", 404);

    const { accessToken, refreshToken } = generateTokens(
      (user._id as { toString: () => string }).toString(),
      user.role
    );

    return { user: mapUserToSafeUserDto(user), accessToken, refreshToken };
  }

  async getMe(userId: string): Promise<GetMeResponseDto> {
    const user = (await this._userRepository.findById(userId)) as unknown as UserEntity;
    if (!user) throw new CustomError("User not found", 404);

    return mapUserToGetMeDto(user);
  }
}
