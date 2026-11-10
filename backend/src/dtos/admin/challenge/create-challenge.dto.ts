import {
  ArrayNotEmpty,
  IsArray,
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

export class CreateChallengeDTO {
  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: "Title cannot contain only whitespace" })
  @MaxLength(150)
  title!: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/\S/, { message: "Description cannot contain only whitespace" })
  @MaxLength(3000)
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(5000)
  instructions?: string;

  @IsEnum(CHALLENGE_CATEGORIES)
  category!: ChallengeCategory;

  @IsEnum(CHALLENGE_DIFFICULTIES)
  difficulty!: ChallengeDifficulty;

  @IsEnum(CHALLENGE_ACCESS_TYPES)
  accessType!: ChallengeAccessType;

  @IsInt()
  @Min(1)
  @Max(365)
  durationDays!: number;

  @IsArray()
  @ArrayNotEmpty({ message: "At least one challenge goal is required" })
  @IsString({ each: true })
  goals!: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  benefits?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];
}
