import { IsEmail, IsString, MinLength, Length } from 'class-validator';
import { Transform } from 'class-transformer';
import { BaseResponseDto } from '../base/BaseResponse.dtos';

export class AdminLoginDto {
  @IsEmail({}, { message: "Please provide a valid email address" })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email!: string;

  @IsString({ message: "Password is required" })
  @MinLength(1, { message: "Password cannot be empty" })
  password!: string;
}

export class AdminChangePasswordDto {
  @IsString({ message: 'Old password is required' })
  @MinLength(1, { message: 'Old password cannot be empty' })
  oldPassword: string | undefined;

  @IsString({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string | undefined;
}

export class AdminForgotPasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string | undefined;
}

export class AdminResetPasswordDto {
  @IsEmail({}, { message: 'Please provide a valid email address' })
  @Transform(({ value }) => value?.toLowerCase().trim())
  email: string | undefined;

  @IsString({ message: 'OTP is required' })
  @Length(6, 6, { message: 'OTP must be 6 digits' })
  otp: string | undefined;

  @IsString({ message: 'New password is required' })
  @MinLength(8, { message: 'New password must be at least 8 characters long' })
  newPassword: string | undefined;
}

export class AdminResponseDto {
  _id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
  lastLogin: Date | null;

  constructor(admin: any) {
    this._id = admin._id;
    this.name = admin.name;
    this.email = admin.email;
    this.role = admin.role;
    this.isActive = admin.isActive ?? true;
    this.lastLogin = admin.lastLogin ?? null;
  }
}

export class AdminLoginResponseDto extends BaseResponseDto {
  admin: AdminResponseDto;
  accessToken: string;
  refreshToken: string;

  constructor(
    admin: any,
    accessToken: string,
    refreshToken: string,
    message: string = 'Admin login successful'
  ) {
    super(true, message);
    this.admin = new AdminResponseDto(admin);
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
