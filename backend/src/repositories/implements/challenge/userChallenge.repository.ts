import { BaseRepository } from "../common/base.repository";
import { IUserChallengeRepository } from "../../interfaces/challenge/IUserChallengeRepository";
import UserChallengeModel, {
  IUserChallenge,
} from "../../../models/userChallenge.model";

export class UserChallengeRepository
  extends BaseRepository<IUserChallenge>
  implements IUserChallengeRepository
{
  constructor() {
    super(UserChallengeModel);
  }

  async findByUser(userId: string): Promise<IUserChallenge[]> {
    return this._model
      .find({ userId })
      .sort({ createdAt: -1 });
  }

  async findActiveByUser(userId: string): Promise<IUserChallenge[]> {
    return this._model.find({
      userId,
      status: "active",
    });
  }

  async findByUserAndChallenge(
    userId: string,
    challengeId: string
  ): Promise<IUserChallenge | null> {
    return this._model.findOne({
      userId,
      challengeId,
    });
  }

  async joinChallenge(
    userId: string,
    challengeId: string
  ): Promise<IUserChallenge> {
    return this._model.create({
      userId,
      challengeId,
      currentDay: 1,
      completedDays: [],
      streak: 0,
      longestStreak: 0,
      status: "active",
      completionPercentage: 0,
    });
  }

  async updateProgress(
    userId: string,
    challengeId: string,
    data: Partial<IUserChallenge>
  ): Promise<IUserChallenge | null> {
    return this._model.findOneAndUpdate(
      { userId, challengeId },
      data,
      { new: true }
    );
  }

  async updateStreak(
    userId: string,
    challengeId: string,
    streak: number,
    longestStreak: number
  ): Promise<IUserChallenge | null> {
    return this._model.findOneAndUpdate(
      { userId, challengeId },
      { streak, longestStreak },
      { new: true }
    );
  }

  async updateCompletion(
    userId: string,
    challengeId: string,
    completionPercentage: number
  ): Promise<IUserChallenge | null> {
    return this._model.findOneAndUpdate(
      { userId, challengeId },
      { completionPercentage },
      { new: true }
    );
  }

  async markCompleted(
    userId: string,
    challengeId: string
  ): Promise<IUserChallenge | null> {
    return this._model.findOneAndUpdate(
      { userId, challengeId },
      { status: "completed" },
      { new: true }
    );
  }
}