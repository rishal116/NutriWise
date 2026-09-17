import { PublicChallengeCardDTO } from "./public-challenge-card.dto";

export interface PublicChallengeSectionDTO {
  key: string;
  title: string;
  items: PublicChallengeCardDTO[];
}
