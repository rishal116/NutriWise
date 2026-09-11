import { inject, injectable } from "inversify";
import { Types } from "mongoose";
import { randomUUID } from "crypto";
import { TYPES } from "../../../types/types";
import { INutriMeetingService } from "../../interfaces/nutritionist/INutriMeetingService";
import { INutriMeetingRepository } from "../../../repositories/interfaces/nutritionist/INutriMeetingRepository";
import { CreateMeetingDTO } from "../../../dtos/nutritionist/meeting/create-meeting.dto";
import { MeetingMapper } from "../../../mappers/nutritionist/meeting/meeting-list.mapper";
import { IMeeting, MeetingStatus } from "../../../models/meeting.model";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";
import { MeetingListQueryDTO } from "../../../dtos/nutritionist/meeting/meeting-list-query.dto";
import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { MeetingCardResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-card-response.dto";
import { MeetingDetailsResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-details-response.dto";
import { MeetingDetailsMapper } from "../../../mappers/nutritionist/meeting/meeting-details.mapper";
import { validateDto } from "../../../middlewares/validateDto.middleware";

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
    logger.debug("Fetching nutritionist meetings", {
      nutritionistId,
      query,
    });

    const validatedQuery = await validateDto(MeetingListQueryDTO, query);

    const result = await this._nutriMeetingRepository.findByNutritionistId(
      nutritionistId,
      validatedQuery,
    );

    const items = MeetingMapper.toCardResponseDTOList(result.items);

    return new InfiniteScrollResponseDTO(
      items,
      result.nextCursor,
      result.hasMore,
    );
  }

  async getMeetingDetails(
    nutritionistId: string,
    meetingId: string,
  ): Promise<MeetingDetailsResponseDTO> {
    logger.debug("Fetching meeting details", {
      nutritionistId,
      meetingId,
    });

    if (!Types.ObjectId.isValid(meetingId)) {
      throw new CustomError("Invalid meeting ID.", StatusCode.BAD_REQUEST);
    }

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
    data: CreateMeetingDTO,
  ): Promise<MeetingDetailsResponseDTO> {
    const roomId = randomUUID();

    const scheduledAt = new Date(data.scheduledAt);

    if (Number.isNaN(scheduledAt.getTime())) {
      throw new CustomError("Invalid meeting date.", StatusCode.BAD_REQUEST);
    }

    if (scheduledAt <= new Date()) {
      throw new CustomError(
        "Meeting must be scheduled for a future date.",
        StatusCode.BAD_REQUEST,
      );
    }

    logger.info("Creating nutritionist meeting", {
      nutritionistId: data.nutritionistId,
      userId: data.userId,
      roomId,
      scheduledAt,
      durationInMinutes: data.durationInMinutes,
      type: data.type,
    });

    await this._nutriMeetingRepository.create({
      title: data.title.trim(),
      roomId,
      scheduledAt,
      durationInMinutes: data.durationInMinutes,
      type: data.type,
      userId: new Types.ObjectId(data.userId),
      nutritionistId: new Types.ObjectId(data.nutritionistId),
      status: MeetingStatus.SCHEDULED,
    });

    const meeting = await this._nutriMeetingRepository.findByRoomId(roomId);

    if (!meeting) {
      logger.error("Created meeting could not be retrieved", {
        roomId,
      });

      throw new CustomError(
        "Meeting could not be retrieved after creation.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Nutritionist meeting created", {
      meetingId: meeting._id.toString(),
      roomId: meeting.roomId,
    });

    return MeetingDetailsMapper.toResponseDTO(meeting);
  }

  async updateMeetingStatus(
    roomId: string,
    status: MeetingStatus,
  ): Promise<MeetingDetailsResponseDTO> {
    logger.info("Updating meeting status", {
      roomId,
      status,
    });

    const existingMeeting =
      await this._nutriMeetingRepository.findByRoomId(roomId);

    if (!existingMeeting) {
      throw new CustomError("Meeting not found.", StatusCode.NOT_FOUND);
    }

    this.validateStatusTransition(existingMeeting.status, status);

    const updateData: Partial<IMeeting> = {
      status,
    };

    if (status === MeetingStatus.ONGOING) {
      updateData.startedAt = existingMeeting.startedAt ?? new Date();
    }

    if (status === MeetingStatus.COMPLETED) {
      updateData.endedAt = existingMeeting.endedAt ?? new Date();
    }

    if (status === MeetingStatus.CANCELLED) {
      updateData.isCancelledByNutritionist = true;
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

    const populatedMeeting =
      await this._nutriMeetingRepository.findByRoomId(roomId);

    if (!populatedMeeting) {
      logger.error("Meeting not found after status update", {
        roomId,
      });

      throw new CustomError(
        "Meeting not found after status update.",
        StatusCode.INTERNAL_SERVER_ERROR,
      );
    }

    logger.info("Meeting status updated", {
      roomId,
      from: existingMeeting.status,
      to: populatedMeeting.status,
    });

    return MeetingDetailsMapper.toResponseDTO(populatedMeeting);
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

    const allowedNextStatuses = allowedTransitions[currentStatus];

    if (!allowedNextStatuses.includes(nextStatus)) {
      throw new CustomError(
        `Cannot change meeting status from ${currentStatus} to ${nextStatus}.`,
        StatusCode.BAD_REQUEST,
      );
    }
  }
}
