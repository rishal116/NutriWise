import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../../types/types";

import { IUserChallengeService } from "../../../interfaces/user/challenge/IUserChallengeService";

import { IUserChallengeRepository } from "../../../../repositories/interfaces/user/challenge/IUserChallengeRepository";

import { IPublicChallengeRepository } from "../../../../repositories/interfaces/public/IPublicChallengeRepository";

import { CustomError } from "../../../../utils/customError";
import { StatusCode } from "../../../../enums/statusCode.enum";
import logger from "../../../../utils/logger";

import { validateDto } from "../../../../middlewares/validateDto.middleware";

import { UserChallengeDTO } from "../../../../dtos/user/challenge/user-challenge.dto";
import { UserChallengeDetailsDTO } from "../../../../dtos/user/challenge/user-challenge-details.dto";
import { UserChallengeListQueryDTO } from "../../../../dtos/user/challenge/user-challenge-list-query.dto";
import { InfiniteScrollResponseDTO } from "../../../../dtos/common/infinite-scroll-response.dto";

import { toUserChallengeDTO } from "../../../../mappers/user/challenge/user-challenge.mapper";

import { toUserChallengeCardDTO } from "../../../../mappers/user/challenge/user-challenge-card.mapper";
import { toUserChallengeDetailsDTO } from "../../../../mappers/user/challenge/user-challenge-details.mapper";
import { UserChallengeCardDTO } from "../../../../dtos/user/challenge/user-challenge-card.dto";

@injectable()
export class UserChallengeService implements IUserChallengeService {
  constructor(
    @inject(TYPES.IUserChallengeRepository)
    private readonly _userChallengeRepository: IUserChallengeRepository,

    @inject(TYPES.IPublicChallengeRepository)
    private readonly _publicChallengeRepository: IPublicChallengeRepository,
  ) {}

  private validateId(id: string, fieldName: string): void {
    if (!id?.trim()) {
      throw new CustomError(`${fieldName} is required`, StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(`Invalid ${fieldName}`, StatusCode.BAD_REQUEST);
    }
  }

  async joinChallenge(
    userId: string,
    challengeId: string,
  ): Promise<UserChallengeDTO> {
    logger.info("Joining challenge", {
      userId,
      challengeId,
    });

    this.validateId(userId, "User ID");
    this.validateId(challengeId, "Challenge ID");

    const challenge =
      await this._publicChallengeRepository.findChallengeById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const existingChallenge =
      await this._userChallengeRepository.findByUserAndChallenge(
        userId,
        challengeId,
      );

    if (existingChallenge) {
      throw new CustomError(
        "You have already joined this challenge",
        StatusCode.CONFLICT,
      );
    }

    if (challenge.accessType === "premium") {
      throw new CustomError(
        "Premium access verification is not configured",
        StatusCode.FORBIDDEN,
      );
    }

    const userChallenge = await this._userChallengeRepository.create({
      userId: new Types.ObjectId(userId),
      challengeId: new Types.ObjectId(challengeId),
      status: "active",
      joinedAt: new Date(),
      startedAt: new Date(),
      currentDay: 1,
      progressPercentage: 0,
      currentStreak: 0,
      longestStreak: 0,
    });

    logger.info("Challenge joined successfully", {
      userId,
      challengeId,
      userChallengeId: userChallenge._id.toString(),
    });
    return toUserChallengeDTO(userChallenge);
  }

  async browseChallenges(
    userId: string,
    query: UserChallengeListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserChallengeCardDTO>> {
    logger.info("Browsing user challenges", {
      userId,
      query,
    });

    this.validateId(userId, "User ID");

    const validatedQuery = await validateDto(UserChallengeListQueryDTO, query);

    const result = await this._userChallengeRepository.browseChallenges(
      userId,
      validatedQuery,
    );

    const items = result.items.map(toUserChallengeCardDTO);

    logger.info("User challenges fetched successfully", {
      userId,
      count: items.length,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getChallenge(
    userId: string,
    userChallengeId: string,
  ): Promise<UserChallengeDetailsDTO> {
    logger.info("Fetching user challenge", {
      userId,
      userChallengeId,
    });

    this.validateId(userId, "User ID");
    this.validateId(userChallengeId, "User challenge ID");

    const result = await this._userChallengeRepository.findByIdAndUser(
      userChallengeId,
      userId,
    );

    if (!result) {
      throw new CustomError("User challenge not found", StatusCode.NOT_FOUND);
    }
    return toUserChallengeDetailsDTO(result);
  }
}
