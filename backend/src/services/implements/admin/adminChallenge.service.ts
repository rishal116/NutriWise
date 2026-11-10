import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import type { IAdminChallengeService } from "../../interfaces/admin/IAdminChallengeService";
import type { IAdminChallengeRepository } from "../../../repositories/interfaces/admin/IAdminChallengeRepository";
import type { ICloudinaryService } from "../../interfaces/common/ICloudinaryService";
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
import { validateChallengeId } from "../../../utils/adminChallenge.util";
import { parseArrayField } from "../../../utils/challenge-form-data.util";
import { IAdminChallengeDayRepository } from "../../../repositories/interfaces/admin/IAdminChallengeDayRepository";

@injectable()
export class AdminChallengeService implements IAdminChallengeService {
  constructor(
    @inject(TYPES.IAdminChallengeRepository)
    private readonly _adminChallengeRepository: IAdminChallengeRepository,

    @inject(TYPES.IAdminChallengeDayRepository)
    private readonly _adminChallengeDayRepository: IAdminChallengeDayRepository,

    @inject(TYPES.ICloudinaryService)
    private readonly _cloudinaryService: ICloudinaryService,
  ) {}

  async createChallenge(
    data: CreateChallengeDTO,
    adminId: string,
    thumbnailFile?: Express.Multer.File,
  ): Promise<void> {
    logger.info("Creating challenge", {
      hasThumbnail: Boolean(thumbnailFile),
    });

    const transformedData = {
      ...data,
      durationDays: Number(data.durationDays),
      goals: parseArrayField(data.goals, "goals"),
      benefits: parseArrayField(data.benefits, "benefits"),
      tags: parseArrayField(data.tags, "tags"),
    };

    const validatedData = await validateDto(
      CreateChallengeDTO,
      transformedData,
    );

    if (!Types.ObjectId.isValid(adminId)) {
      throw new CustomError("Invalid admin ID", StatusCode.BAD_REQUEST);
    }

    const uploadedAsset = thumbnailFile
      ? await this._cloudinaryService.upload(
          thumbnailFile,
          "nutriwise/challenges",
        )
      : undefined;

    const challenge = await this._adminChallengeRepository.create({
      ...validatedData,
      thumbnailUrl: uploadedAsset?.secureUrl,
      thumbnailPublicId: uploadedAsset?.publicId,
      createdBy: new Types.ObjectId(adminId),
    });

    logger.info("Challenge created successfully", {
      challengeId: challenge._id.toString(),
      hasThumbnail: Boolean(uploadedAsset),
    });
  }

  async browseChallenges(
    query: AdminChallengeListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminChallengeCardDTO>> {
    logger.info("Browsing admin challenges");

    const validatedQuery = await validateDto(AdminChallengeListQueryDTO, query);

    const result =
      await this._adminChallengeRepository.findChallenges(validatedQuery);

    const items = result.items.map((challenge) =>
      toAdminChallengeCardDTO(challenge),
    );

    logger.info("Admin challenges retrieved successfully", {
      count: items.length,
      hasMore: result.hasMore,
    });

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getChallenge(challengeId: string): Promise<AdminChallengeDetailsDTO> {
    logger.info("Fetching challenge details", { challengeId });

    validateChallengeId(challengeId);

    const challenge =
      await this._adminChallengeRepository.findChallengeById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    logger.info("Challenge details retrieved successfully", {
      challengeId,
    });

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

    const transformedData = {
      ...data,
      ...(data.goals !== undefined && {
        goals: parseArrayField(data.goals, "goals"),
      }),
      ...(data.benefits !== undefined && {
        benefits: parseArrayField(data.benefits, "benefits"),
      }),
      ...(data.tags !== undefined && {
        tags: parseArrayField(data.tags, "tags"),
      }),
    };

    const validatedData = await validateDto(
      UpdateChallengeDTO,
      transformedData,
    );

    const existingChallenge =
      await this._adminChallengeRepository.findById(challengeId);

    if (!existingChallenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const { removeThumbnail, ...challengeData } = validatedData;

    const uploadedAsset = thumbnailFile
      ? await this._cloudinaryService.upload(
          thumbnailFile,
          "nutriwise/challenges",
        )
      : undefined;

    const shouldRemoveThumbnail = !thumbnailFile && removeThumbnail;

    const updatedChallenge = await this._adminChallengeRepository.updateById(
      challengeId,
      {
        ...challengeData,
        ...(uploadedAsset
          ? {
              thumbnailUrl: uploadedAsset.secureUrl,
              thumbnailPublicId: uploadedAsset.publicId,
            }
          : shouldRemoveThumbnail
            ? {
                thumbnailUrl: undefined,
                thumbnailPublicId: undefined,
              }
            : {}),
      },
    );

    if (!updatedChallenge) {
      throw new CustomError(
        "Failed to update challenge",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    const thumbnailChanged = Boolean(uploadedAsset) || shouldRemoveThumbnail;

    if (thumbnailChanged && existingChallenge.thumbnailPublicId) {
      await this.cleanupAsset(existingChallenge.thumbnailPublicId);
    }

    logger.info("Challenge updated successfully", {
      challengeId,
      thumbnailChanged,
    });
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

    if (challenge.thumbnailPublicId) {
      await this.cleanupAsset(challenge.thumbnailPublicId);
    }

    logger.info("Challenge deleted successfully", {
      challengeId,
      hadThumbnail: Boolean(challenge.thumbnailPublicId),
    });
  }

  async publishChallenge(challengeId: string): Promise<void> {
    logger.info("Publishing challenge", { challengeId });

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

    const dayNumbers =
      await this._adminChallengeDayRepository.findDayNumbersByChallengeId(
        challengeId,
      );

    const existingDays = new Set(dayNumbers);

    const missingDays = Array.from(
      { length: challenge.durationDays },
      (_, index) => index + 1,
    ).filter((dayNumber) => !existingDays.has(dayNumber));

    if (
      missingDays.length > 0 ||
      dayNumbers.length !== challenge.durationDays
    ) {
      throw new CustomError(
        `Cannot publish challenge. Missing or duplicate challenge days. Expected ${challenge.durationDays} days. Missing days: ${missingDays.join(", ") || "None"}.`,
        StatusCode.BAD_REQUEST,
      );
    }

    const updated = await this._adminChallengeRepository.updateById(
      challengeId,
      { status: "published" },
    );

    if (!updated) {
      throw new CustomError(
        "Failed to publish challenge",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Challenge published successfully", { challengeId });
  }

  private async cleanupAsset(publicId: string): Promise<void> {
    try {
      await this._cloudinaryService.delete(publicId);
    } catch (error) {
      logger.error("Cloudinary asset cleanup failed", {
        publicId,
        error,
      });
    }
  }
}
