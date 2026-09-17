import { UserChallengeStatus } from "../../../models/userChallenge.model";

export type UserChallengeSort = "newest" | "oldest";

export interface UserChallengeListQuery {
  cursor?: string;
  limit?: number;
  search?: string;
  status?: UserChallengeStatus;
  sortBy?: UserChallengeSort;
}
