import { UserChallengeStatus } from "../../../models/userChallenge.model";

export class UserChallengeDTO {
  id: string;
  challengeId: string;
  status: UserChallengeStatus;
  joinedAt: Date;
  startedAt: Date;
  currentDay: number;
  progressPercentage: number;
  currentStreak: number;
  longestStreak: number;
  completedAt?: Date;

  constructor(data: {
    id: string;
    challengeId: string;
    status: UserChallengeStatus;
    joinedAt: Date;
    startedAt: Date;
    currentDay: number;
    progressPercentage: number;
    currentStreak: number;
    longestStreak: number;
    completedAt?: Date;
  }) {
    this.id = data.id;
    this.challengeId = data.challengeId;
    this.status = data.status;
    this.joinedAt = data.joinedAt;
    this.startedAt = data.startedAt;
    this.currentDay = data.currentDay;
    this.progressPercentage = data.progressPercentage;
    this.currentStreak = data.currentStreak;
    this.longestStreak = data.longestStreak;
    this.completedAt = data.completedAt;
  }
}
