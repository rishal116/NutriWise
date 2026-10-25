import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { IAdminChallengeService } from "../../interfaces/admin/IAdminChallengeService";
import { IAdminChallengeRepository } from "../../../repositories/interfaces/admin/IAdminChallengeRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { AdminChallengeListQueryDTO } from "../../../dtos/admin/challenge/admin-challenge-list-query.dto";
import { AdminChallengeCardDTO } from "../../../dtos/admin/challenge/admin-challenge-card.dto";
import { AdminChallengeDetailsDTO } from "../../../dtos/admin/challenge/admin-challenge-details.dto";
import { CreateChallengeDTO } from "../../../dtos/admin/challenge/create-challenge.dto";
import { UpdateChallengeDTO } from "../../../dtos/admin/challenge/update-challenge.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { toAdminChallengeCardDTO } from "../../../mappers/admin/challenge/admin-challenge-list.mapper";
import { toAdminChallengeDetailsDTO } from "../../../mappers/admin/challenge/admin-challenge-details.mapper";
import { uploadToCloudinary } from "../../../utils/cloudinaryUploads.util";
import {
  deleteChallengeImage,
  validateChallengeId,
} from "../../../utils/adminChallenge.util";

@injectable()
export class AdminChallengeService implements IAdminChallengeService {
  constructor(
    @inject(TYPES.IAdminChallengeRepository)
    private readonly _adminChallengeRepository: IAdminChallengeRepository,
  ) {}

  async createChallenge(
    data: CreateChallengeDTO,
    adminId: string,
    thumbnailFile?: Express.Multer.File,
  ): Promise<void> {
    logger.info("Creating challenge", {
      title: data.title,
      adminId,
      hasThumbnail: Boolean(thumbnailFile),
    });

    const validatedData = await validateDto(CreateChallengeDTO, data);

    if (!Types.ObjectId.isValid(adminId)) {
      throw new CustomError("Invalid admin ID", StatusCode.BAD_REQUEST);
    }

    let thumbnailUrl: string | undefined;

    if (thumbnailFile) {
      const uploadResult = await uploadToCloudinary(
        thumbnailFile,
        "nutriwise/challenges",
      );

      thumbnailUrl = uploadResult.secureUrl;
    }

    const challenge = await this._adminChallengeRepository.create({
      ...validatedData,
      thumbnailUrl,
      createdBy: new Types.ObjectId(adminId),
    });

    logger.info("Challenge created successfully", {
      challengeId: challenge._id.toString(),
    });
  }

  async browseChallenges(
    query: AdminChallengeListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminChallengeCardDTO>> {
    logger.info("Browsing admin challenges", {
      query,
    });

    const validatedQuery = await validateDto(AdminChallengeListQueryDTO, query);

    const result =
      await this._adminChallengeRepository.findChallenges(validatedQuery);

    const items = result.items.map((challenge) =>
      toAdminChallengeCardDTO(challenge),
    );

    logger.info("Admin challenges fetched successfully", {
      count: items.length,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getChallenge(challengeId: string): Promise<AdminChallengeDetailsDTO> {
    logger.info("Fetching challenge details", {
      challengeId,
    });

    validateChallengeId(challengeId);

    const challenge =
      await this._adminChallengeRepository.findChallengeById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    return toAdminChallengeDetailsDTO(challenge);
  }

  async updateChallenge(
    challengeId: string,
    data: UpdateChallengeDTO,
    thumbnailFile?: Express.Multer.File,
  ): Promise<void> {
    logger.info("Updating challenge", {
      challengeId,
      hasThumbnail: Boolean(thumbnailFile),
      removeThumbnail: data.removeThumbnail,
    });

    validateChallengeId(challengeId);

    const validatedData = await validateDto(UpdateChallengeDTO, data);

    const existingChallenge =
      await this._adminChallengeRepository.findById(challengeId);

    if (!existingChallenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    let thumbnailUrl = existingChallenge.thumbnailUrl;

    if (thumbnailFile) {
      const uploadResult = await uploadToCloudinary(
        thumbnailFile,
        "nutriwise/challenges",
      );

      thumbnailUrl = uploadResult.secureUrl;
    } else if (validatedData.removeThumbnail) {
      thumbnailUrl = undefined;
    }

    const { removeThumbnail: _removeThumbnail, ...challengeData } =
      validatedData;

    const updatedChallenge = await this._adminChallengeRepository.updateById(
      challengeId,
      {
        ...challengeData,
        thumbnailUrl,
      },
    );

    if (!updatedChallenge) {
      throw new CustomError(
        "Failed to update challenge",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    if (
      existingChallenge.thumbnailUrl &&
      existingChallenge.thumbnailUrl !== thumbnailUrl
    ) {
      await deleteChallengeImage(existingChallenge.thumbnailUrl);
    }

    logger.info("Challenge updated successfully", { challengeId });
  }

  async deleteChallenge(challengeId: string): Promise<void> {
    logger.info("Deleting challenge", { challengeId });

    validateChallengeId(challengeId);

    const challenge =
      await this._adminChallengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    if (challenge.status === "published") {
      throw new CustomError(
        "Published challenges cannot be deleted",
        StatusCode.BAD_REQUEST,
      );
    }

    const deleted = await this._adminChallengeRepository.deleteOne({
      _id: challenge._id,
    });

    if (!deleted) {
      throw new CustomError(
        "Failed to delete challenge",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    if (challenge.thumbnailUrl) {
      await deleteChallengeImage(challenge.thumbnailUrl);
    }

    logger.info("Challenge deleted successfully", { challengeId });
  }
  

  async publishChallenge(challengeId: string): Promise<void> {
    logger.info("Publishing challenge", {
      challengeId,
    });

    validateChallengeId(challengeId);

    const challenge =
      await this._adminChallengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    if (challenge.status === "archived") {
      throw new CustomError(
        "Archived challenges cannot be published",
        StatusCode.BAD_REQUEST,
      );
    }

    if (challenge.status === "published") {
      throw new CustomError(
        "Challenge is already published",
        StatusCode.BAD_REQUEST,
      );
    }

    const updated = await this._adminChallengeRepository.updateById(
      challengeId,
      {
        status: "published",
      },
    );

    if (!updated) {
      throw new CustomError(
        "Failed to publish challenge",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Challenge published successfully", {
      challengeId,
    });
  }
}
