import { inject, injectable } from "inversify";
import { Types } from "mongoose";

import { TYPES } from "../../../types/types";

import { IPublicChallengeService } from "../../interfaces/public/IPublicChallengeService";
import { IPublicChallengeRepository } from "../../../repositories/interfaces/public/IPublicChallengeRepository";

import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";

import { PublicChallengeDetailsDTO } from "../../../dtos/public/challenge/public-challenge-details.dto";
import { PublicChallengeSectionDTO } from "../../../dtos/public/challenge/public-challenge-section.dto";
import { PublicChallengeDayDetailsDTO } from "../../../dtos/public/challenge-day/public-challenge-day-details.dto";

import { toPublicChallengeCardDTO } from "../../../mappers/public/challenge/public-challenge-list.mapper";
import { toPublicChallengeDetailsDTO } from "../../../mappers/public/challenge/public-challenge-details.mapper";
import { toPublicChallengeDayDetailsDTO } from "../../../mappers/public/challenge-day/public-challenge-day-details.mapper";

import { PublicChallengeSection } from "../../../types/public/challenge/public-challenge-section.type";

interface PublicChallengeSectionConfig {
  key: PublicChallengeSection;
  title: string;
}

export const PUBLIC_CHALLENGE_SECTION_CONFIG: ReadonlyArray<PublicChallengeSectionConfig> =
  [
    {
      key: "trending",
      title: "Trending",
    },
    {
      key: "popular",
      title: "Popular",
    },
    {
      key: "premium",
      title: "Premium",
    },
    {
      key: "free",
      title: "Free",
    },
    {
      key: "new",
      title: "New Challenges",
    },
  ];

@injectable()
export class PublicChallengeService implements IPublicChallengeService {
  constructor(
    @inject(TYPES.IPublicChallengeRepository)
    private readonly _publicChallengeRepository: IPublicChallengeRepository,
  ) {}

  private validateChallengeId(challengeId: string): void {
    if (!challengeId?.trim()) {
      throw new CustomError("Challenge ID is required", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(challengeId)) {
      throw new CustomError("Invalid challenge ID", StatusCode.BAD_REQUEST);
    }
  }

  private validateUserId(userId: string): void {
    if (!userId?.trim()) {
      throw new CustomError("User ID is required", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(userId)) {
      throw new CustomError("Invalid user ID", StatusCode.BAD_REQUEST);
    }
  }

  async getChallengeSections(): Promise<PublicChallengeSectionDTO[]> {
    logger.info("Fetching public challenge sections");

    const sectionQuery = {
      limit: 10,
    };

    const sections = await Promise.all(
      PUBLIC_CHALLENGE_SECTION_CONFIG.map(async ({ key, title }) => {
        const challenges =
          await this._publicChallengeRepository.findChallengeSection(
            key,
            sectionQuery,
          );

        const items = challenges.map((challenge) =>
          toPublicChallengeCardDTO(challenge),
        );

        return new PublicChallengeSectionDTO({
          key,
          title,
          items,
        });
      }),
    );

    logger.info("Public challenge sections fetched successfully", {
      sectionCount: sections.length,
    });

    return sections;
  }

  async getChallenge(
    challengeId: string,
    userId?: string,
  ): Promise<PublicChallengeDetailsDTO> {
    logger.info("Fetching public challenge details", {
      challengeId,
      userId,
    });

    console.log("1. getChallenge input:", {
      challengeId,
      userId,
    });

    this.validateChallengeId(challengeId);

    if (userId) {
      this.validateUserId(userId);
    }

    const challenge =
      await this._publicChallengeRepository.findChallengeById(challengeId);

    console.log("2. challenge found:", !!challenge);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const days =
      await this._publicChallengeRepository.findChallengeDays(challengeId);

    console.log("3. days:", days.length);

    let participation = null;

    if (userId) {
      participation = await this._publicChallengeRepository.findUserChallenge(
        userId,
        challengeId,
      );
    }

    console.log("4. participation:", participation);

    return toPublicChallengeDetailsDTO(challenge, days, participation);
  }

  async getChallengeDay(
    challengeId: string,
    dayId: string,
  ): Promise<PublicChallengeDayDetailsDTO> {
    logger.info("Fetching public challenge day details", {
      challengeId,
      dayId,
    });

    this.validateChallengeId(challengeId);

    if (!dayId?.trim()) {
      throw new CustomError("Day ID is required", StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(dayId)) {
      throw new CustomError("Invalid day ID", StatusCode.BAD_REQUEST);
    }

    const day = await this._publicChallengeRepository.findChallengeDayById(
      challengeId,
      dayId,
    );

    if (!day) {
      throw new CustomError("Challenge day not found", StatusCode.NOT_FOUND);
    }

    return toPublicChallengeDayDetailsDTO(day);
  }
}
