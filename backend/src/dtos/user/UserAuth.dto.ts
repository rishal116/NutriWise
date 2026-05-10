// ==========================================
// userAuth.request.dto.ts
// PRODUCTION-GRADE AUTH REQUEST DTOs
// ==========================================

import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches,
} from "class-validator";

// ================================
// USER REGISTER DTO
// ================================
export class UserRegisterDto {
  @IsNotEmpty({ message: "Full name is required" })
  @IsString({ message: "Full name must be a string" })
  @MinLength(3, { message: "Full name must be at least 3 characters" })
  fullName!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      "Password must include uppercase, lowercase, number, and special character",
  })
  password!: string;

  @IsNotEmpty({ message: "Confirm password is required" })
  @IsString({ message: "Confirm password must be a string" })
  confirmPassword!: string;
}

// ================================
// VERIFY OTP DTO
// ================================
export class VerifyOtpDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "OTP is required" })
  @Matches(/^[0-9]{6}$/, {
    message: "OTP must be exactly 6 digits",
  })
  otp!: string;
}

// ================================
// RESEND OTP DTO
// ================================
export class ResendOtpDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
}

// ================================
// LOGIN DTO
// ================================
export class LoginDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  password!: string;
}

// ================================
// GOOGLE LOGIN DTO
// ================================
export class GoogleLoginRequestDto {
  @IsNotEmpty({ message: "Google credential is required" })
  @IsString({ message: "Credential must be a string" })
  credential!: string;
}

// ================================
// GOOGLE SIGNIN DTO
// ================================
export class GoogleSigninRequestDto {
  @IsNotEmpty({ message: "Google credential is required" })
  @IsString({ message: "Credential must be a string" })
  credential!: string;
}

// ================================
// FORGOT PASSWORD DTO
// ================================
export class ForgotPasswordDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
}

// ================================
// RESET PASSWORD DTO
// ================================
export class ResetPasswordDto {
  @IsNotEmpty({ message: "Reset token is required" })
  @IsString()
  token!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/, {
    message:
      "Password must include uppercase, lowercase, number, and special character",
  })
  password!: string;

  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword!: string;
}
