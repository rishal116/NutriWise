import { IChallenge } from "../../../models/challenge.model";
import { IBaseRepository } from "../common/IBaseRepository";
import { ChallengeFilters } from "../../../dtos/challenge/challenge-filter.dto";

export interface IChallengeRepository
  extends IBaseRepository<IChallenge> {
  findPaginated(
    page: number,
    limit: number,
    filters: ChallengeFilters,
    options?: {
      publicOnly?: boolean;
    },
  ): Promise<{
    data: IChallenge[];
    total: number;
  }>;

  findByStatus(
    status: string,
  ): Promise<IChallenge[]>;

  findByType(
    type: string,
  ): Promise<IChallenge[]>;

  findByIdWithTasks(
    challengeId: string,
  ): Promise<IChallenge | null>;

  updateStatus(
    challengeId: string,
    status: "draft" | "published" | "archived",
  ): Promise<IChallenge | null>;

  softDelete(
    challengeId: string,
  ): Promise<IChallenge | null>;

  findFeaturedChallenges(): Promise<IChallenge[]>;

  searchChallenges(
    query: string,
  ): Promise<IChallenge[]>;

  findBySlug(
    slug: string,
  ): Promise<IChallenge | null>;
}