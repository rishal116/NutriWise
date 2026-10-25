import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { IAdminChallengeDayService } from "../../interfaces/admin/IAdminChallengeDayService";
import { IAdminChallengeDayRepository } from "../../../repositories/interfaces/admin/IAdminChallengeDayRepository";
import { IAdminChallengeRepository } from "../../../repositories/interfaces/admin/IAdminChallengeRepository";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { AdminChallengeDayListQueryDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-query.dto";
import { AdminChallengeDayListItemDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-item.dto";
import { AdminChallengeDayDetailsDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-details.dto";
import { CreateChallengeDayDTO } from "../../../dtos/admin/challenge-day/create-challenge-day.dto";
import { UpdateChallengeDayDTO } from "../../../dtos/admin/challenge-day/update-challenge-day.dto";
import { IChallengeDay } from "../../../models/challengeDay.model";
import { ChallengeDayUploadedFiles } from "../../../types/admin/challenge-day/challenge-day-files.types";
import {
  buildActivities,
  parseActivities,
  parseMediaIndexes,
  deleteChallengeDayMedia,
  cleanupUploadedMedia,
  getActivityMediaIds,
} from "../../../helpers/admin/challenge-day/challenge-day-media.helper";
import {
  validateChallengeDayId,
  validateChallengeDayNumber,
  validateChallengeDayOwnership,
} from "../../../helpers/admin/challenge-day/challenge-day-validation.helper";
import {
  toAdminChallengeDayDetailsDTO,
  toAdminChallengeDayListItemDTO,
} from "../../../mappers/admin/challenge/admin-challenge-day.mapper";

@injectable()
export class AdminChallengeDayService implements IAdminChallengeDayService {
  constructor(
    @inject(TYPES.IAdminChallengeDayRepository)
    private readonly _challengeDayRepository: IAdminChallengeDayRepository,

    @inject(TYPES.IAdminChallengeRepository)
    private readonly _challengeRepository: IAdminChallengeRepository,
  ) {}

  private validateId(id: string, fieldName: string): void {
    if (!id?.trim()) {
      throw new CustomError(`${fieldName} is required`, StatusCode.BAD_REQUEST);
    }

    if (!Types.ObjectId.isValid(id)) {
      throw new CustomError(`Invalid ${fieldName}`, StatusCode.BAD_REQUEST);
    }
  }

  async createDay(
    challengeId: string,
    data: CreateChallengeDayDTO,
    files?: ChallengeDayUploadedFiles,
  ): Promise<void> {
    logger.info("Creating challenge day", {
      challengeId,
      dayNumber: data.dayNumber,
    });

    validateChallengeDayId(challengeId, "Challenge ID");

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const validatedData = await validateDto(CreateChallengeDayDTO, {
      dayNumber: data.dayNumber,
      title: data.title,
      description: data.description,
    });

    validateChallengeDayNumber(validatedData.dayNumber, challenge.durationDays);

    const challengeObjectId = new Types.ObjectId(challengeId);

    const existingDay = await this._challengeDayRepository.findOne({
      challengeId: challengeObjectId,
      dayNumber: validatedData.dayNumber,
    });

    if (existingDay) {
      throw new CustomError(
        `Day ${validatedData.dayNumber} already exists for this challenge`,
        StatusCode.CONFLICT,
      );
    }

    const rawActivities = parseActivities(data.activities);
    const mediaIndexes = parseMediaIndexes(data.activityMediaIndexes);

    const { activities, newlyUploadedMedia } = await buildActivities(
      rawActivities,
      mediaIndexes,
      files,
    );

    let createdDay: IChallengeDay;

    try {
      createdDay = await this._challengeDayRepository.create({
        challengeId: challengeObjectId,
        dayNumber: validatedData.dayNumber,
        title: validatedData.title,
        description: validatedData.description,
        activities,
      });
    } catch (error) {
      if (newlyUploadedMedia.length > 0) {
        await cleanupUploadedMedia(newlyUploadedMedia);
      }
      throw error;
    }

    logger.info("Challenge day created successfully", {
      challengeId,
      dayId: createdDay._id.toString(),
      dayNumber: createdDay.dayNumber,
    });
  }

  async browseDays(
    challengeId: string,
    query: AdminChallengeDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO>> {
    logger.info("Browsing challenge days", {
      challengeId,
      query,
    });

    this.validateId(challengeId, "Challenge ID");

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const validatedQuery = await validateDto(
      AdminChallengeDayListQueryDTO,
      query,
    );

    const result = await this._challengeDayRepository.findDays(
      challengeId,
      validatedQuery,
    );

    return new InfiniteScrollResponseDTO(
      result.items.map(toAdminChallengeDayListItemDTO),
      result.nextCursor,
      result.hasMore,
    );
  }

  async getDay(
    challengeId: string,
    dayId: string,
  ): Promise<AdminChallengeDayDetailsDTO> {
    logger.info("Fetching challenge day", {
      challengeId,
      dayId,
    });

    this.validateId(challengeId, "Challenge ID");
    this.validateId(dayId, "Day ID");

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const day = await this._challengeDayRepository.findDayById(
      challengeId,
      dayId,
    );

    if (!day) {
      throw new CustomError("Challenge day not found", StatusCode.NOT_FOUND);
    }

    return toAdminChallengeDayDetailsDTO(day);
  }

  async updateDay(
    challengeId: string,
    dayId: string,
    data: UpdateChallengeDayDTO,
    files?: ChallengeDayUploadedFiles,
  ): Promise<void> {
    logger.info("Updating challenge day", {
      challengeId,
      dayId,
    });

    validateChallengeDayId(challengeId, "Challenge ID");
    validateChallengeDayId(dayId, "Day ID");

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const existingDay = await this._challengeDayRepository.findById(dayId);

    if (!existingDay) {
      throw new CustomError("Challenge day not found", StatusCode.NOT_FOUND);
    }

    validateChallengeDayOwnership(existingDay.challengeId, challengeId);

    const validatedData = await validateDto(UpdateChallengeDayDTO, {
      title: data.title,
      description: data.description,
      activities: data.activities,
      activityMediaIndexes: data.activityMediaIndexes,
    });

    const updateData: Partial<IChallengeDay> = {};

    if (validatedData.title !== undefined) {
      updateData.title = validatedData.title;
    }

    if (validatedData.description !== undefined) {
      updateData.description = validatedData.description;
    }

    const replacingActivities = validatedData.activities !== undefined;
    let newlyUploadedMedia: {
      publicId: string;
      resourceType: "image" | "video";
    }[] = [];
    let mediaToDelete: {
      publicId: string;
      resourceType: "image" | "video";
    }[] = [];

    if (replacingActivities) {
      const rawActivities = parseActivities(validatedData.activities);
      const mediaIndexes = parseMediaIndexes(
        validatedData.activityMediaIndexes,
      );

      const buildResult = await buildActivities(
        rawActivities,
        mediaIndexes,
        files,
        existingDay.activities,
        true,
      );

      updateData.activities = buildResult.activities;
      newlyUploadedMedia = buildResult.newlyUploadedMedia;

      const referencedPublicIds = new Set<string>();
      for (const activity of buildResult.activities) {
        if (activity.imagePublicId) {
          referencedPublicIds.add(activity.imagePublicId);
        }
        if (activity.videoPublicId) {
          referencedPublicIds.add(activity.videoPublicId);
        }
      }

      const oldMedia = getActivityMediaIds(existingDay.activities);
      mediaToDelete = oldMedia.filter(
        (media) => !referencedPublicIds.has(media.publicId),
      );
    }

    let updatedDay: IChallengeDay | null;

    try {
      updatedDay = await this._challengeDayRepository.updateById(
        dayId,
        updateData,
      );
    } catch (error) {
      if (newlyUploadedMedia.length > 0) {
        await cleanupUploadedMedia(newlyUploadedMedia);
      }
      throw error;
    }

    if (!updatedDay) {
      if (newlyUploadedMedia.length > 0) {
        await cleanupUploadedMedia(newlyUploadedMedia);
      }

      throw new CustomError(
        "Failed to update challenge day",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    if (mediaToDelete.length > 0) {
      await cleanupUploadedMedia(mediaToDelete);
    }

    logger.info("Challenge day updated successfully", {
      challengeId,
      dayId,
    });
  }

  async deleteDay(challengeId: string, dayId: string): Promise<void> {
    logger.info("Deleting challenge day", {
      challengeId,
      dayId,
    });

    this.validateId(challengeId, "Challenge ID");

    this.validateId(dayId, "Day ID");

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const existingDay = await this._challengeDayRepository.findById(dayId);

    if (!existingDay) {
      throw new CustomError("Challenge day not found", StatusCode.NOT_FOUND);
    }

    if (existingDay.challengeId.toString() !== challengeId) {
      throw new CustomError(
        "Challenge day does not belong to this challenge",
        StatusCode.BAD_REQUEST,
      );
    }

    const deleted = await this._challengeDayRepository.deleteOne({
      _id: new Types.ObjectId(dayId),
      challengeId: new Types.ObjectId(challengeId),
    });

    if (!deleted) {
      throw new CustomError(
        "Failed to delete challenge day",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    await deleteChallengeDayMedia(existingDay.activities);

    logger.info("Challenge day deleted successfully", {
      challengeId,
      dayId,
    });
  }
}
