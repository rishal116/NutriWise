import { IsEmail, IsString, MinLength } from "class-validator";

export class AdminLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

export class AdminForgotPasswordDto {
  @IsEmail()
  email!: string;
}

export class AdminLoginResponseDto {
  message: string;
  admin: any;
  accessToken: string;
  refreshToken: string;

  constructor(admin: any, accessToken: string, refreshToken: string) {
    this.message = "Login successful";
    this.admin = {
      id: admin._id,
      email: admin.email,
      name: admin.name,
    };
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
