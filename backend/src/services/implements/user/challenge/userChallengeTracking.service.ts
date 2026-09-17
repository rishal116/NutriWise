import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../types/types";

import { IUserChallengeTrackingService } from "../../../interfaces/user/challenge/IUserChallengeTrackingService";

import { IUserChallengeRepository } from "../../../../repositories/interfaces/user/challenge/IUserChallengeRepository";

import { IUserChallengeProgressRepository } from "../../../../repositories/interfaces/user/challenge/IUserChallengeProgressRepository";

import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";

import { UserChallengeDetailsDTO } from "../../../../dtos/user/challenge/user-challenge-details.dto";

import { toUserChallengeDetailsDTO } from "../../../../mappers/user/challenge/user-challenge-details.mapper";

@injectable()
export class UserChallengeTrackingService implements IUserChallengeTrackingService {
  constructor(
    @inject(TYPES.IUserChallengeRepository)
    private readonly _userChallengeRepository: IUserChallengeRepository,

    @inject(TYPES.IUserChallengeProgressRepository)
    private readonly _userChallengeProgressRepository: IUserChallengeProgressRepository,
  ) {}

  private validateId(id: string, fieldName: string): void {
    if (!id?.trim()) {
      throw new CustomError(`${fieldName} is required`, StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(`Invalid ${fieldName}`, StatusCode.BAD_REQUEST);
    }
  }

  private async validateUserChallenge(
    userId: string,
    userChallengeId: string,
  ): Promise<void> {
    const userChallenge = await this._userChallengeRepository.findByIdAndUser(
      userChallengeId,
      userId,
    );

    if (!userChallenge) {
      throw new CustomError("User challenge not found", StatusCode.NOT_FOUND);
    }

    if (userChallenge.status !== "active") {
      throw new CustomError(
        "This challenge is not active",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private async validateActivity(
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<void> {
    const userChallenge = await this._userChallengeRepository.findByIdAndUser(
      userChallengeId,
      "",
    );

    if (!userChallenge) {
      throw new CustomError("User challenge not found", StatusCode.NOT_FOUND);
    }

    const day = userChallenge.days.find((item) => item.id === challengeDayId);

    if (!day) {
      throw new CustomError(
        "Challenge day does not belong to this challenge",
        StatusCode.BAD_REQUEST,
      );
    }

    const activity = day.activities.find((item) => item.id === activityId);

    if (!activity) {
      throw new CustomError(
        "Activity does not belong to this challenge day",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  async completeActivity(
    userId: string,
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<UserChallengeDetailsDTO> {
    logger.info("Completing challenge activity", {
      userId,
      userChallengeId,
      challengeDayId,
      activityId,
    });

    this.validateId(userId, "User ID");
    this.validateId(userChallengeId, "User challenge ID");
    this.validateId(challengeDayId, "Challenge day ID");
    this.validateId(activityId, "Activity ID");

    await this.validateUserChallenge(userId, userChallengeId);

    const existingProgress =
      await this._userChallengeProgressRepository.findByUserChallengeDayAndActivity(
        userChallengeId,
        challengeDayId,
        activityId,
      );

    if (existingProgress) {
      throw new CustomError(
        "Activity is already completed",
        StatusCode.CONFLICT,
      );
    }

    await this._userChallengeProgressRepository.create({
      userChallengeId: new Types.ObjectId(userChallengeId),
      challengeDayId: new Types.ObjectId(challengeDayId),
      activityId: new Types.ObjectId(activityId),
      completedAt: new Date(),
    });

    const updatedChallenge =
      await this._userChallengeRepository.findByIdAndUser(
        userChallengeId,
        userId,
      );

    if (!updatedChallenge) {
      throw new CustomError(
        "Updated challenge could not be retrieved",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return toUserChallengeDetailsDTO(updatedChallenge);
  }

  async uncompleteActivity(
    userId: string,
    userChallengeId: string,
    challengeDayId: string,
    activityId: string,
  ): Promise<UserChallengeDetailsDTO> {
    logger.info("Uncompleting challenge activity", {
      userId,
      userChallengeId,
      challengeDayId,
      activityId,
    });

    this.validateId(userId, "User ID");
    this.validateId(userChallengeId, "User challenge ID");
    this.validateId(challengeDayId, "Challenge day ID");
    this.validateId(activityId, "Activity ID");

    await this.validateUserChallenge(userId, userChallengeId);

    const deleted =
      await this._userChallengeProgressRepository.deleteByUserChallengeDayAndActivity(
        userChallengeId,
        challengeDayId,
        activityId,
      );

    if (!deleted) {
      throw new CustomError("Activity is not completed", StatusCode.NOT_FOUND);
    }

    const updatedChallenge =
      await this._userChallengeRepository.findByIdAndUser(
        userChallengeId,
        userId,
      );

    if (!updatedChallenge) {
      throw new CustomError(
        "Updated challenge could not be retrieved",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    return toUserChallengeDetailsDTO(updatedChallenge);
  }
}
