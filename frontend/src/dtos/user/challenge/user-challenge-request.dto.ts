import {
  UserChallengeStatus,
} from "@/types/user/challenge/user-challenge.types";

export interface UserChallengeListQuery {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: UserChallengeStatus;
  sortBy?: "newest" | "oldest";
}