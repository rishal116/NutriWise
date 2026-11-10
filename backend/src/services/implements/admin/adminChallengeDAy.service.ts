import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { CustomError } from "../../../utils/customError";
import logger from "../../../utils/logger";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { AdminChallengeDayListQueryDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-query.dto";
import { AdminChallengeDayListItemDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-list-item.dto";
import { AdminChallengeDayDetailsDTO } from "../../../dtos/admin/challenge-day/admin-challenge-day-details.dto";
import { CreateChallengeDayDTO } from "../../../dtos/admin/challenge-day/create-challenge-day.dto";
import { UpdateChallengeDayDTO } from "../../../dtos/admin/challenge-day/update-challenge-day.dto";
import type { IChallengeDay } from "../../../models/challengeDay.model";
import type { ChallengeDayUploadedFiles } from "../../../types/admin/challenge-day/challenge-day-files.types";
import type { IAdminChallengeDayService } from "../../interfaces/admin/IAdminChallengeDayService";
import type { IAdminChallengeDayRepository } from "../../../repositories/interfaces/admin/IAdminChallengeDayRepository";
import type { IAdminChallengeRepository } from "../../../repositories/interfaces/admin/IAdminChallengeRepository";
import type { ICloudinaryService } from "../../interfaces/common/ICloudinaryService";
import {
  getActivityMediaIds,
  deleteChallengeDayMedia,
} from "../../../helpers/admin/challenge-day/challenge-day-media.helper";
import {
  validateChallengeDayId,
  validateChallengeDayNumber,
} from "../../../helpers/admin/challenge-day/challenge-day-validation.helper";
import {
  toAdminChallengeDayDetailsDTO,
  toAdminChallengeDayListItemDTO,
} from "../../../mappers/admin/challenge/admin-challenge-day.mapper";
import { getChallengeOrThrow } from "../../../helpers/admin/challenge-day/challenge-day-service.helper";
import {
  parseActivities,
  parseMediaIndexes,
} from "../../../helpers/admin/challenge-day/challenge-day-media-parser.helper";
import { buildActivities } from "../../../helpers/admin/challenge-day/challenge-day-activity-builder.helper";
import { cleanupUploadedMedia } from "../../../helpers/admin/challenge-day/challenge-day-media-cleanup.helper";

@injectable()
export class AdminChallengeDayService implements IAdminChallengeDayService {
  constructor(
    @inject(TYPES.IAdminChallengeDayRepository)
    private readonly _challengeDayRepository: IAdminChallengeDayRepository,

    @inject(TYPES.IAdminChallengeRepository)
    private readonly _challengeRepository: IAdminChallengeRepository,

    @inject(TYPES.ICloudinaryService)
    private readonly _cloudinaryService: ICloudinaryService,
  ) {}

  async createDay(
    challengeId: string,
    data: CreateChallengeDayDTO,
    files?: ChallengeDayUploadedFiles,
  ): Promise<void> {
    logger.info("Creating challenge day", {
      challengeId,
      dayNumber: data.dayNumber,
    });

    const challenge = await getChallengeOrThrow(
      challengeId,
      this._challengeRepository,
    );

    const validatedData = await validateDto(CreateChallengeDayDTO, data);

    validateChallengeDayNumber(validatedData.dayNumber, challenge.durationDays);

    const existingDay = await this._challengeDayRepository.findOne({
      challengeId: challenge._id,
      dayNumber: validatedData.dayNumber,
    });

    if (existingDay) {
      throw new CustomError(
        `Day ${validatedData.dayNumber} already exists for this challenge`,
        StatusCode.CONFLICT,
      );
    }

    const rawActivities = parseActivities(validatedData.activities);
    const mediaIndexes = parseMediaIndexes(validatedData.activityMediaIndexes);

    const { activities, newlyUploadedMedia } = await buildActivities(
      rawActivities,
      mediaIndexes,
      files,
      this._cloudinaryService,
    );

    try {
      const createdDay = await this._challengeDayRepository.create({
        challengeId: challenge._id,
        dayNumber: validatedData.dayNumber,
        title: validatedData.title,
        description: validatedData.description,
        activities,
      });

      logger.info("Challenge day created successfully", {
        challengeId,
        dayId: createdDay._id.toString(),
        dayNumber: createdDay.dayNumber,
      });
    } catch (error) {
      await cleanupUploadedMedia(newlyUploadedMedia, this._cloudinaryService);

      throw error;
    }
  }

  async browseDays(
    challengeId: string,
    query: AdminChallengeDayListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<AdminChallengeDayListItemDTO>> {
    logger.info("Browsing challenge days", { challengeId, query });

    await getChallengeOrThrow(challengeId, this._challengeRepository);

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
    logger.info("Fetching challenge day", { challengeId, dayId });

    const challenge = await getChallengeOrThrow(
      challengeId,
      this._challengeRepository,
    );
    validateChallengeDayId(dayId, "Day ID");

    const day = await this._challengeDayRepository.findDayById(
      challenge._id.toString(),
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
    logger.info("Updating challenge day", { challengeId, dayId });

    const challenge = await getChallengeOrThrow(
      challengeId,
      this._challengeRepository,
    );

    validateChallengeDayId(dayId, "Day ID");

    const existingDay = await this._challengeDayRepository.findDayById(
      challenge._id.toString(),
      dayId,
    );

    if (!existingDay) {
      throw new CustomError("Challenge day not found", StatusCode.NOT_FOUND);
    }

    const validatedData = await validateDto(UpdateChallengeDayDTO, data);

    const updateData: Partial<IChallengeDay> = {
      ...(validatedData.title !== undefined && {
        title: validatedData.title,
      }),
      ...(validatedData.description !== undefined && {
        description: validatedData.description,
      }),
    };

    let newlyUploadedMedia: Awaited<
      ReturnType<typeof buildActivities>
    >["newlyUploadedMedia"] = [];

    let mediaToDelete: ReturnType<typeof getActivityMediaIds> = [];

    if (validatedData.activities !== undefined) {
      const buildResult = await buildActivities(
        parseActivities(validatedData.activities),
        parseMediaIndexes(validatedData.activityMediaIndexes),
        files,
        this._cloudinaryService,
        existingDay.activities,
        true,
      );

      newlyUploadedMedia = buildResult.newlyUploadedMedia;
      updateData.activities = buildResult.activities;

      const retainedPublicIds = new Set(
        getActivityMediaIds(buildResult.activities).map(
          (media) => media.publicId,
        ),
      );

      mediaToDelete = getActivityMediaIds(existingDay.activities).filter(
        (media) => !retainedPublicIds.has(media.publicId),
      );
    }

    let updatedDay: IChallengeDay | null;

    try {
      updatedDay = await this._challengeDayRepository.updateById(
        existingDay._id.toString(),
        updateData,
      );
    } catch (error) {
      await cleanupUploadedMedia(newlyUploadedMedia, this._cloudinaryService);
      throw error;
    }

    if (!updatedDay) {
      await cleanupUploadedMedia(newlyUploadedMedia, this._cloudinaryService);

      throw new CustomError(
        "Failed to update challenge day",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    await cleanupUploadedMedia(mediaToDelete, this._cloudinaryService);

    logger.info("Challenge day updated successfully", {
      challengeId,
      dayId,
    });
  }

  async deleteDay(challengeId: string, dayId: string): Promise<void> {
    logger.info("Deleting challenge day", { challengeId, dayId });

    const challenge = await getChallengeOrThrow(
      challengeId,
      this._challengeRepository,
    );

    validateChallengeDayId(dayId, "Day ID");

    const existingDay = await this._challengeDayRepository.findDayById(
      challenge._id.toString(),
      dayId,
    );

    if (!existingDay) {
      throw new CustomError("Challenge day not found", StatusCode.NOT_FOUND);
    }

    const deleted = await this._challengeDayRepository.deleteOne({
      _id: existingDay._id,
      challengeId: challenge._id,
    });

    if (!deleted) {
      throw new CustomError(
        "Failed to delete challenge day",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    await deleteChallengeDayMedia(
      existingDay.activities,
      this._cloudinaryService,
    );

    logger.info("Challenge day deleted successfully", {
      challengeId,
      dayId,
    });
  }
}
