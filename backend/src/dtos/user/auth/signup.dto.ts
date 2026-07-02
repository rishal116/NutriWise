import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MaxLength,
  MinLength,
  Matches,
} from "class-validator";

export class UserRegisterDto {
  @IsNotEmpty({ message: "Full name is required" })
  @IsString()
  @MinLength(3, { message: "Full name must be at least 3 characters" })
  @MaxLength(50, { message: "Full name cannot exceed 50 characters" })
  fullName!: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email address" })
  email!: string;

  @IsNotEmpty({ message: "Password is required" })
  @MinLength(8, { message: "Password must be at least 8 characters" })
  @Matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/, {
    message:
      "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
  })
  password!: string;

  @IsNotEmpty({ message: "Confirm password is required" })
  @IsString()
  confirmPassword!: string;
}
