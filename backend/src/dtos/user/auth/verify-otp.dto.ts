import { IsEmail, IsNotEmpty, Matches } from "class-validator";

export class VerifyOtpDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "OTP is required" })
  @Matches(/^\d{6}$/, {
    message: "OTP must be exactly 6 digits",
  })
  otp!: string;
}