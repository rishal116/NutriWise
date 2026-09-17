import { IsEnum, IsInt, IsOptional, IsString, Max, Min } from "class-validator";

import {
  USER_CHALLENGE_STATUSES,
  UserChallengeStatus,
} from "../../../models/userChallenge.model";

export const USER_CHALLENGE_SORT_OPTIONS = ["newest", "oldest"] as const;

export type UserChallengeSort = (typeof USER_CHALLENGE_SORT_OPTIONS)[number];

export class UserChallengeListQueryDTO {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(USER_CHALLENGE_STATUSES)
  status?: UserChallengeStatus;

  @IsOptional()
  @IsEnum(USER_CHALLENGE_SORT_OPTIONS)
  sortBy?: UserChallengeSort;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  limit?: number;
}
