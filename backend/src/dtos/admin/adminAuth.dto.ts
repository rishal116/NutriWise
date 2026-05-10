import { IsEmail, IsString, MinLength } from "class-validator";
import { SafeUserDto } from "../user/userAuth.response.dto";

export class AdminLoginDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(6)
  password!: string;
}

export class AdminLoginResponseDto {
  constructor(
    public user: SafeUserDto,
    public accessToken: string,
    public refreshToken: string,
  ) {}
}