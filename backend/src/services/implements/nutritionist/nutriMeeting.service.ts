import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { randomUUID } from "crypto";
import { TYPES } from "../../../types/types";
import { INutriMeetingService } from "../../interfaces/nutritionist/INutriMeetingService";
import { INutriMeetingRepository } from "../../../repositories/interfaces/nutritionist/INutriMeetingRepository";
import { CreateMeetingDTO } from "../../../dtos/nutritionist/meeting/create-meeting.dto";
import { MeetingMapper } from "../../../mappers/nutritionist/meeting/meeting-list.mapper";
import {
  IMeeting,
  MeetingCancelledBy,
  MeetingStatus,
} from "../../../models/meeting.model";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { MeetingListQueryDTO } from "../../../dtos/nutritionist/meeting/meeting-list-query.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { MeetingCardResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-card-response.dto";
import { MeetingDetailsResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-details-response.dto";
import { MeetingDetailsMapper } from "../../../mappers/nutritionist/meeting/meeting-details.mapper";
import { validateDto } from "../../../middlewares/validateDto.middleware";
import { UpdateMeetingDTO } from "../../../dtos/nutritionist/meeting/update-meeting.dto";

@injectable()
export class NutriMeetingService implements INutriMeetingService {
  constructor(
    @inject(TYPES.INutriMeetingRepository)
    private readonly _nutriMeetingRepository: INutriMeetingRepository,
  ) {}

  async getMeetings(
    nutritionistId: string,
    query: MeetingListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<MeetingCardResponseDTO>> {
    this.validateObjectId(nutritionistId, "nutritionist");

    logger.debug("Fetching nutritionist meetings", {
      nutritionistId,
      query,
    });

    const validatedQuery = await validateDto(MeetingListQueryDTO, query);

    const { items, nextCursor, hasMore } =
      await this._nutriMeetingRepository.findByNutritionistId(
        nutritionistId,
        validatedQuery,
      );

    return new InfiniteScrollResponseDTO(
      MeetingMapper.toCardResponseDTOList(items),
      nextCursor,
      hasMore,
    );
  }

  async getMeetingDetails(
    nutritionistId: string,
    meetingId: string,
  ): Promise<MeetingDetailsResponseDTO> {
    this.validateObjectId(nutritionistId, "nutritionist");
    this.validateObjectId(meetingId, "meeting");

    logger.debug("Fetching meeting details", {
      nutritionistId,
      meetingId,
    });

    const meeting = await this._nutriMeetingRepository.findMeetingDetailsById(
      nutritionistId,
      meetingId,
    );

    if (!meeting) {
      logger.warn("Meeting not found", {
        nutritionistId,
        meetingId,
      });

      throw new CustomError("Meeting not found.", StatusCode.NOT_FOUND);
    }

    logger.info("Meeting details fetched", {
      nutritionistId,
      meetingId,
    });

    return MeetingDetailsMapper.toResponseDTO(meeting);
  }

  async createMeeting(
    nutritionistId: string,
    data: CreateMeetingDTO,
  ): Promise<void> {
    this.validateObjectId(nutritionistId, "nutritionist");

    const validatedData = await validateDto(CreateMeetingDTO, data);

    this.validateObjectId(validatedData.userId, "user");

    const scheduledAt = new Date(validatedData.scheduledAt);

    this.validateFutureDate(scheduledAt);

    const roomId = randomUUID();

    await this._nutriMeetingRepository.create({
      title: validatedData.title.trim(),
      roomId,
      scheduledAt,
      durationInMinutes: validatedData.durationInMinutes,
      userId: new Types.ObjectId(validatedData.userId),
      nutritionistId: new Types.ObjectId(nutritionistId),
      status: MeetingStatus.SCHEDULED,
    });

    logger.info("Nutritionist meeting created", {
      nutritionistId,
      userId: validatedData.userId,
      roomId,
    });
  }

  async updateMeetingStatus(
    roomId: string,
    status: MeetingStatus,
  ): Promise<void> {
    logger.info("Updating meeting status", {
      roomId,
      status,
    });

    const existingMeeting =
      await this._nutriMeetingRepository.findMeetingByRoomId(roomId);

    if (!existingMeeting) {
      throw new CustomError("Meeting not found.", StatusCode.NOT_FOUND);
    }

    this.validateStatusTransition(existingMeeting.status, status);

    const updateData: Partial<IMeeting> = { status };

    if (status === MeetingStatus.ONGOING) {
      updateData.startedAt = existingMeeting.startedAt ?? new Date();
    }

    if (status === MeetingStatus.COMPLETED) {
      updateData.endedAt = existingMeeting.endedAt ?? new Date();
    }

    if (status === MeetingStatus.CANCELLED) {
      updateData.cancelledBy = MeetingCancelledBy.NUTRITIONIST;
    }

    const updatedMeeting =
      await this._nutriMeetingRepository.updateStatusByRoomId(
        roomId,
        status,
        updateData,
      );

    if (!updatedMeeting) {
      logger.error("Meeting status update failed", {
        roomId,
        status,
      });

      throw new CustomError(
        "Failed to update meeting status.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Meeting status updated", {
      roomId,
      from: existingMeeting.status,
      to: updatedMeeting.status,
    });
  }

  async updateMeeting(
    nutritionistId: string,
    meetingId: string,
    data: UpdateMeetingDTO,
  ): Promise<void> {
    this.validateObjectId(nutritionistId, "nutritionist");
    this.validateObjectId(meetingId, "meeting");

    const validatedData = await validateDto(UpdateMeetingDTO, data);
    const scheduledAt = new Date(validatedData.scheduledAt);

    this.validateFutureDate(scheduledAt);

    const updatedMeeting = await this._nutriMeetingRepository.updateMeetingById(
      nutritionistId,
      meetingId,
      {
        title: validatedData.title.trim(),
        scheduledAt,
        durationInMinutes: validatedData.durationInMinutes,
      },
    );

    if (!updatedMeeting) {
      const existingMeeting =
        await this._nutriMeetingRepository.findMeetingDetailsById(
          nutritionistId,
          meetingId,
        );

      if (!existingMeeting) {
        throw new CustomError("Meeting not found.", StatusCode.NOT_FOUND);
      }

      if (existingMeeting.status !== MeetingStatus.SCHEDULED) {
        throw new CustomError(
          "Only scheduled meetings can be updated.",
          StatusCode.BAD_REQUEST,
        );
      }

      throw new CustomError(
        "Failed to update meeting.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Nutritionist meeting updated", {
      nutritionistId,
      meetingId,
      scheduledAt,
      durationInMinutes: validatedData.durationInMinutes,
    });
  }

  async cancelMeeting(
    nutritionistId: string,
    meetingId: string,
    cancellationReason: string,
  ): Promise<void> {
    this.validateObjectId(nutritionistId, "nutritionist");
    this.validateObjectId(meetingId, "meeting");

    if (typeof cancellationReason !== "string" || !cancellationReason.trim()) {
      throw new CustomError(
        "Cancellation reason is required.",
        StatusCode.BAD_REQUEST,
      );
    }

    const trimmedReason = cancellationReason.trim();

    if (trimmedReason.length > 500) {
      throw new CustomError(
        "Cancellation reason cannot exceed 500 characters.",
        StatusCode.BAD_REQUEST,
      );
    }

    const existingMeeting =
      await this._nutriMeetingRepository.findMeetingDetailsById(
        nutritionistId,
        meetingId,
      );

    if (!existingMeeting) {
      throw new CustomError("Meeting not found.", StatusCode.NOT_FOUND);
    }

    if (existingMeeting.status !== MeetingStatus.SCHEDULED) {
      throw new CustomError(
        "Only scheduled meetings can be cancelled.",
        StatusCode.BAD_REQUEST,
      );
    }

    const updateData: Partial<IMeeting> = {
      status: MeetingStatus.CANCELLED,
      cancelledBy: MeetingCancelledBy.NUTRITIONIST,
      cancellationReason: trimmedReason,
    };

    const updatedMeeting =
      await this._nutriMeetingRepository.updateStatusByRoomId(
        existingMeeting.roomId,
        MeetingStatus.CANCELLED,
        updateData,
      );

    if (!updatedMeeting) {
      logger.error("Meeting cancellation failed", {
        nutritionistId,
        meetingId,
      });

      throw new CustomError(
        "Failed to cancel meeting.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Nutritionist cancelled meeting", {
      nutritionistId,
      meetingId,
      roomId: existingMeeting.roomId,
    });
  }

  private validateObjectId(value: string, label: string): void {
    if (!Types.ObjectId.isValid(value)) {
      throw new CustomError(`Invalid ${label} ID.`, StatusCode.BAD_REQUEST);
    }
  }

  private validateFutureDate(date: Date): void {
    if (Number.isNaN(date.getTime()) || date <= new Date()) {
      throw new CustomError(
        "Meeting must be scheduled for a valid future date.",
        StatusCode.BAD_REQUEST,
      );
    }
  }

  private validateStatusTransition(
    currentStatus: MeetingStatus,
    nextStatus: MeetingStatus,
  ): void {
    if (currentStatus === nextStatus) {
      throw new CustomError(
        `Meeting is already ${currentStatus}.`,
        StatusCode.BAD_REQUEST,
      );
    }

    const allowedTransitions: Record<MeetingStatus, MeetingStatus[]> = {
      [MeetingStatus.SCHEDULED]: [
        MeetingStatus.ONGOING,
        MeetingStatus.CANCELLED,
      ],
      [MeetingStatus.ONGOING]: [MeetingStatus.COMPLETED],
      [MeetingStatus.COMPLETED]: [],
      [MeetingStatus.CANCELLED]: [],
    };

    if (!allowedTransitions[currentStatus].includes(nextStatus)) {
      throw new CustomError(
        `Cannot change meeting status from ${currentStatus} to ${nextStatus}.`,
        StatusCode.BAD_REQUEST,
      );
    }
  }
}
