import { IBaseRepository } from "../common/IBaseRepository";
import { IChallenge } from "../../../models/challenge.model";
import { PublicChallengeListItem } from "../../../types/public/challenge/public-challenge-list-item.type";
import { PublicChallengeDetailsResult } from "../../../types/public/challenge/public-challenge-details-result.type";
import {
  PublicChallengeDayListItem,
  PublicChallengeDayResult,
} from "../../../types/public/challenge-day/public-challenge-day-result.type";
import { PublicChallengeSection } from "../../../types/public/challenge/public-challenge-section.type";
import { PublicChallengeSectionQuery } from "../../../types/public/challenge/public-challenge-section-query.type";
import { PublicChallengeParticipationResult } from "../../../types/public/challenge/public-challenge-participation-result.type";

export interface IPublicChallengeRepository extends IBaseRepository<IChallenge> {
  findChallengeSection(
    section: PublicChallengeSection,
    query: PublicChallengeSectionQuery,
  ): Promise<PublicChallengeListItem[]>;

  findChallengeById(
    challengeId: string,
  ): Promise<PublicChallengeDetailsResult | null>;

  findChallengeDays(challengeId: string): Promise<PublicChallengeDayListItem[]>;

  findChallengeDayById(
    challengeId: string,
    dayId: string,
  ): Promise<PublicChallengeDayResult | null>;

  findUserChallenge(
    userId: string,
    challengeId: string,
  ): Promise<PublicChallengeParticipationResult | null>;
}
