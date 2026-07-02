import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ResetPasswordDto {
  @IsNotEmpty({ message: "Token is required" })
  @IsString()
  token!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, {
    message: "Password must be at least 8 characters",
  })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/, {
    message:
      "Password must contain uppercase, lowercase, number and special character",
  })
  newPassword!: string;

  @IsNotEmpty({ message: "Confirm password is required" })
  confirmPassword!: string;
}
