import { UserChallengeStatus } from "../../../models/userChallenge.model";

export interface PublicChallengeParticipationResult {
  userChallengeId: string;
  status: UserChallengeStatus;
  currentDay: number;
  progressPercentage: number;
  currentStreak: number;
  longestStreak: number;
}