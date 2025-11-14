import { IsEmail, IsNotEmpty, IsString, MinLength, Matches, IsEnum } from "class-validator";

export enum UserRole {
  CLIENT = "client",
  NUTRITIONIST = "nutritionist",
}

export class UserRegisterDto {
  @IsNotEmpty({ message: "Full name is required" })
  @IsString()
  fullName!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
  
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
    message:
      "Password must include uppercase, lowercase, number, and special character",
  })
  password!: string;

  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword!: string;

  @IsEnum(UserRole, { message: "Invalid role. Must be client or nutritionist" })
  role!: UserRole;
}


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

export class LoginDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
  
  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 6 characters" })
  password!: string;
}

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
