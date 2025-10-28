import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsEnum } from "class-validator";

export class UserRegisterDto {
  @IsNotEmpty({ message: "Full name is required" })
  @IsString()
  fullName!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Phone number is required" })
  @Matches(/^[0-9]{10}$/, { message: "Phone number must be 10 digits" })
  phone!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 6 characters" })
  password!: string;
  
  @IsNotEmpty({ message: "Confirm password is required" })
  @MinLength(8, { message: "Confirm password must be at least 8 characters" })
  confirmPassword!: string;
}

// ✅ OTP Request
export class RequestOtpDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
}

// ✅ OTP Verification
export class VerifyOtpDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "OTP is required" })
  @Matches(/^[0-9]{6}$/, { message: "OTP must be 6 digits" })
  otp!: string;
}

export class ResendOtpDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
}

// ✅ Role Selection
export class UserRoleDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Role is required" })
  @IsEnum(["user", "admin", "nutritionist"], { message: "Role must be one of: user, trainer, nutritionist" })
  role!: "user" | "admin" | "nutritionist";
}

// ✅ Response DTOs
export class RegisterResponseDto {
  constructor(
    public success: boolean,
    public message: string
  ) {}
}

export class LoginResponseDto {
  constructor(
    public success: boolean,
    public message: string,
    public user?: any,
    public accessToken?: string,
    public refreshToken?: string
  ) {}
}
