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
  @Matches(/^\+[1-9]\d{1,14}$/)
  phone?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  birthDate?: string;
}
