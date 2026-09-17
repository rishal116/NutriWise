import { PublicChallengeCardDTO } from "./public-challenge-card.dto";

export class PublicChallengeSectionDTO {
  key: string;
  title: string;
  items: PublicChallengeCardDTO[];

  constructor(data: {
    key: string;
    title: string;
    items: PublicChallengeCardDTO[];
  }) {
    this.key = data.key;
    this.title = data.title;
    this.items = data.items;
  }
}