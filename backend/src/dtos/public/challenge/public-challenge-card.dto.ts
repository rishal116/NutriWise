import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../../../models/challenge.model";

export class PublicChallengeCardDTO {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;

  constructor(data: {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;
    accessType: ChallengeAccessType;
    durationDays: number;
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.thumbnailUrl = data.thumbnailUrl;
    this.category = data.category;
    this.difficulty = data.difficulty;
    this.accessType = data.accessType;
    this.durationDays = data.durationDays;
  }
}
