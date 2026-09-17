import {
  ChallengeAccessType,
  ChallengeCategory,
  ChallengeDifficulty,
} from "../../../models/challenge.model";

import { PublicChallengeDayListItem } from "../../../types/public/challenge-day/public-challenge-day-result.type";

export type PublicChallengeParticipationStatus =
  | "not_joined"
  | "active"
  | "completed"
  | "abandoned";

export class PublicChallengeDetailsDTO {
  id: string;
  title: string;
  description: string;
  instructions?: string;
  coverImageUrl?: string;
  category: ChallengeCategory;
  difficulty: ChallengeDifficulty;
  accessType: ChallengeAccessType;
  durationDays: number;
  days: PublicChallengeDayListItem[];

  participation: {
    userChallengeId?: string;
    status: PublicChallengeParticipationStatus;
    currentDay?: number;
    progressPercentage?: number;
    currentStreak?: number;
    longestStreak?: number;
  };

  constructor(data: {
    id: string;
    title: string;
    description: string;
    instructions?: string;
    coverImageUrl?: string;
    category: ChallengeCategory;
    difficulty: ChallengeDifficulty;
    accessType: ChallengeAccessType;
    durationDays: number;
    days: PublicChallengeDayListItem[];
    participation: {
      userChallengeId?: string;
      status: PublicChallengeParticipationStatus;
      currentDay?: number;
      progressPercentage?: number;
      currentStreak?: number;
      longestStreak?: number;
    };
  }) {
    this.id = data.id;
    this.title = data.title;
    this.description = data.description;
    this.instructions = data.instructions;
    this.coverImageUrl = data.coverImageUrl;
    this.category = data.category;
    this.difficulty = data.difficulty;
    this.accessType = data.accessType;
    this.durationDays = data.durationDays;
    this.days = data.days;
    this.participation = data.participation;
  }
}