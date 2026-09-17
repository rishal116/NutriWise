import { PublicChallengeDetailsDTO } from "../../../dtos/public/challenge/public-challenge-details.dto";
import { PublicChallengeSectionDTO } from "../../../dtos/public/challenge/public-challenge-section.dto";
import { PublicChallengeDayDetailsDTO } from "../../../dtos/public/challenge-day/public-challenge-day-details.dto";

export interface IPublicChallengeService {
  getChallengeSections(): Promise<PublicChallengeSectionDTO[]>;

  getChallenge(
    challengeId: string,
    userId?: string,
  ): Promise<PublicChallengeDetailsDTO>;

  getChallengeDay(
    challengeId: string,
    dayId: string,
  ): Promise<PublicChallengeDayDetailsDTO>;
}