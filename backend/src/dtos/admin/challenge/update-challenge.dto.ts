import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from "class-validator";

import {
  CHALLENGE_ACCESS_TYPES,
  CHALLENGE_CATEGORIES,
  CHALLENGE_DIFFICULTIES,
  type ChallengeAccessType,
  type ChallengeCategory,
  type ChallengeDifficulty,
} from "../../../models/challenge.model";

export class UpdateChallengeDTO {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: "Title cannot contain only whitespace" })
  @MaxLength(150)
  title?: string;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: "Description cannot contain only whitespace" })
  @MaxLength(3000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  instructions?: string;

  @IsOptional()
  @IsEnum(CHALLENGE_CATEGORIES)
  category?: ChallengeCategory;

  @IsOptional()
  @IsEnum(CHALLENGE_DIFFICULTIES)
  difficulty?: ChallengeDifficulty;

  @IsOptional()
  @IsEnum(CHALLENGE_ACCESS_TYPES)
  accessType?: ChallengeAccessType;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(365)
  durationDays?: number;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty({ message: "At least one challenge goal is required" })
  @IsString({ each: true })
  goals?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @IsOptional()
  @IsBoolean()
  removeThumbnail?: boolean;
}
