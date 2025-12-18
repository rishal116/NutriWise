import { IsEmail, IsNotEmpty, MinLength, Matches } from "class-validator";

export class AdminLoginDto {
  @IsEmail({}, { message: "Please enter a valid email address" })
  @IsNotEmpty({ message: "Email is required" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters long" })
  @Matches(/^(?=.*[A-Z])/, { message: "Password must contain at least one uppercase letter" })
  @Matches(/^(?=.*[a-z])/, { message: "Password must contain at least one lowercase letter" })
  @Matches(/^(?=.*\d)/, { message: "Password must contain at least one number" })
  @Matches(/^(?=.*[^A-Za-z0-9])/, { message: "Password must contain at least one special character" })
  password!: string;
}


export class AdminForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class AdminLoginResponseDto {
  admin: any;
  accessToken: string;
  refreshToken: string;

  constructor(admin: any, accessToken: string, refreshToken: string) {
    this.admin = admin;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}

