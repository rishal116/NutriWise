import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { TYPES } from "../../../types/types";
import { IAdminChallengeDayService } from "../../interfaces/admin/IAdminChallengeDayService";
import { IAdminChallengeDayRepository } from "../../../repositories/interfaces/admin/IAdminChallengDayRepository";
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
} from "../../../helpers/admin/challenge-day/challenge-day-media.helper";

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

  private validateDayNumber(dayNumber: number, durationDays: number): void {
    if (dayNumber < 1) {
      throw new CustomError(
        "Day number must be at least 1",
        StatusCode.BAD_REQUEST,
      );
    }

    if (dayNumber > durationDays) {
      throw new CustomError(
        `Day number cannot be greater than the challenge duration of ${durationDays} days`,
        StatusCode.BAD_REQUEST,
      );
    }
  }

  async createDay(
    challengeId: string,
    data: CreateChallengeDayDTO,
    files?: ChallengeDayUploadedFiles,
  ): Promise<AdminChallengeDayDetailsDTO> {
    logger.info("Creating challenge day", {
      challengeId,
      dayNumber: data.dayNumber,
    });

    this.validateId(challengeId, "Challenge ID");

    const challenge = await this._challengeRepository.findById(challengeId);

    if (!challenge) {
      throw new CustomError("Challenge not found", StatusCode.NOT_FOUND);
    }

    const validatedData = await validateDto(CreateChallengeDayDTO, {
      dayNumber: data.dayNumber,
      title: data.title,
      description: data.description,
    });

    this.validateDayNumber(validatedData.dayNumber, challenge.durationDays);

    const existingDay = await this._challengeDayRepository.findOne({
      challengeId: new Types.ObjectId(challengeId),
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

    const activities = await buildActivities(
      rawActivities,
      mediaIndexes,
      files,
    );

    const createdDay = await this._challengeDayRepository.create({
      challengeId: new Types.ObjectId(challengeId),
      dayNumber: validatedData.dayNumber,
      title: validatedData.title,
      description: validatedData.description,
      activities,
    });

    const result = await this._challengeDayRepository.findDayById(
      challengeId,
      createdDay._id.toString(),
    );

    if (!result) {
      throw new CustomError(
        "Challenge day created but could not be retrieved",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Challenge day created successfully", {
      challengeId,
      dayId: createdDay._id.toString(),
      dayNumber: createdDay.dayNumber,
    });

    return result;
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
      result.items,
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

    return day;
  }

  async updateDay(
    challengeId: string,
    dayId: string,
    data: UpdateChallengeDayDTO,
    files?: ChallengeDayUploadedFiles,
  ): Promise<AdminChallengeDayDetailsDTO> {
    logger.info("Updating challenge day", {
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

    let newActivitiesCreated = false;

    if (validatedData.activities !== undefined) {
      const rawActivities = parseActivities(validatedData.activities);

      const mediaIndexes = parseMediaIndexes(
        validatedData.activityMediaIndexes,
      );

      updateData.activities = await buildActivities(
        rawActivities,
        mediaIndexes,
        files,
      );

      newActivitiesCreated = true;
    }

    const uploadedMediaIds = newActivitiesCreated
      ? (updateData.activities?.flatMap((activity) => {
          const media = [];

          if (activity.imagePublicId) {
            media.push({
              publicId: activity.imagePublicId,
              resourceType: "image" as const,
            });
          }

          if (activity.videoPublicId) {
            media.push({
              publicId: activity.videoPublicId,
              resourceType: "video" as const,
            });
          }

          return media;
        }) ?? [])
      : [];

    const updatedDay = await this._challengeDayRepository.updateById(
      dayId,
      updateData,
    );

    if (!updatedDay) {
      await cleanupUploadedMedia(uploadedMediaIds);

      throw new CustomError(
        "Failed to update challenge day",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    if (newActivitiesCreated) {
      await deleteChallengeDayMedia(existingDay.activities);
    }

    const result = await this._challengeDayRepository.findDayById(
      challengeId,
      dayId,
    );

    if (!result) {
      throw new CustomError(
        "Updated challenge day could not be retrieved",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Challenge day updated successfully", {
      challengeId,
      dayId,
    });

    return result;
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
