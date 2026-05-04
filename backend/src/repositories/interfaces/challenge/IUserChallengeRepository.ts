import { IUserChallenge } from "../../../models/userChallenge.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IUserChallengeRepository
  extends IBaseRepository<IUserChallenge> {

  findByUser(userId: string): Promise<IUserChallenge[]>;

  findActiveByUser(userId: string): Promise<IUserChallenge[]>;

  findByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<IUserChallenge | null>;

  joinChallenge(
    userId: string,
    challengeId: string
  ): Promise<IUserChallenge>;

  updateProgress(
    userId: string,
    challengeId: string,
    data: Partial<IUserChallenge>
  ): Promise<IUserChallenge | null>;

  updateStreak(
    userId: string,
    challengeId: string,
    streak: number,
    longestStreak: number
  ): Promise<IUserChallenge | null>;

  updateCompletion(
    userId: string,
    challengeId: string,
    completionPercentage: number
  ): Promise<IUserChallenge | null>;

  markCompleted(
    userId: string,
    challengeId: string
  ): Promise<IUserChallenge | null>;
}