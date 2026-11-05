import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  Matches,
} from "class-validator";

import { Gender } from "../../../enums/user.enum";

export class UpdateUserProfileDto {
  @IsOptional()
  @IsString()
  @Length(3, 50)
  fullName?: string;

  @IsOptional()
  @IsString()
  @Matches(/^\+?[1-9]\d{7,14}$/, {
    message: "Please provide a valid phone number.",
  })
  phone?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
