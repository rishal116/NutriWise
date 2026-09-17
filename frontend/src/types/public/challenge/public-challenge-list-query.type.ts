export type PublicChallengeSort = "newest" | "oldest";

export interface PublicChallengeListQuery {
  search?: string;
  category?: string;
  difficulty?: string;
  accessType?: string;
  sortBy?: PublicChallengeSort;
  cursor?: string;
  limit?: number;
}
