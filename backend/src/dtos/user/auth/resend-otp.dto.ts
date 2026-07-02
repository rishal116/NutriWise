import { IsEmail, IsNotEmpty } from "class-validator";

export class ResendOtpDto {
  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;
}