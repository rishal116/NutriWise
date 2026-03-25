import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriMeetingsService } from "../../interfaces/nutritionist/INutriMeetingsService";
import { INutriMeetingsRepository } from "../../../repositories/interfaces/nutritionist/INutriMeetingsRepository";
import { CreateMeetingDTO } from "../../../dtos/nutritionist/createMeeting.dto";
import { MeetingResponseDTO } from "../../../dtos/nutritionist/meetingResponse.dto";
import { MeetingMapper } from "../../../mapper/nutritionist/meeting.mapper";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import { IMeeting, MeetingStatus, MeetingType } from "../../../models/meeting.model";
import { CustomError } from "../../../utils/customError";
import { StatusCode } from "../../../enums/statusCode.enum";
import logger from "../../../utils/logger";

@injectable()
export class NutriMeetingsService implements INutriMeetingsService {
  constructor(
    @inject(TYPES.INutriMeetingsRepository)
    private _nutriMeetingsRepository: INutriMeetingsRepository
  ) {}
  
  async getMeetings(userId: string): Promise<MeetingResponseDTO[]> {
    logger.info("Fetching meetings", { userId });
    const meetings = await this._nutriMeetingsRepository.findByNutritionistId(userId);
    if (!meetings || meetings.length === 0) {
      logger.warn("No meetings found", { userId });
      throw new CustomError("No meetings found", StatusCode.NOT_FOUND);
    }
    logger.info("Meetings fetched successfully", {
      userId,
      count: meetings.length,
    });
    return MeetingMapper.toResponseDTOList(meetings);
  }
  
  async createMeeting(data: CreateMeetingDTO): Promise<MeetingResponseDTO> {
    const roomId = uuidv4();
    logger.info("Creating meeting", {
      title: data.title,
      nutritionistId: data.nutritionistId,
      userId: data.userId,
      roomId,
    });
    await this._nutriMeetingsRepository.createMeeting({
      title: data.title,
      roomId,
      scheduledAt: new Date(data.scheduledAt),
      durationInMinutes: data.durationInMinutes,
      type: data.type as MeetingType,
      userId: new Types.ObjectId(data.userId),
      nutritionistId: new Types.ObjectId(data.nutritionistId),
      status: MeetingStatus.SCHEDULED,
    });
    const populatedMeeting =await this._nutriMeetingsRepository.findByRoomId(roomId);
    if (!populatedMeeting) {
      logger.error("Meeting not found after creation", { roomId });
      throw new CustomError("Meeting not found after creation",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    logger.info("Meeting created successfully", {
      roomId,
      status: populatedMeeting.status,
    });
    return MeetingMapper.toResponseDTO(populatedMeeting);
  }
  
  async updateMeetingStatus(roomId: string,status: MeetingStatus): Promise<MeetingResponseDTO> {
    logger.info("Updating meeting status", { roomId, newStatus: status });
    const existingMeeting = await this._nutriMeetingsRepository.findByRoomId(roomId);
    if (!existingMeeting) {
      logger.warn("Meeting not found for update", { roomId });
      throw new CustomError("Meeting not found", StatusCode.NOT_FOUND);
    }
    logger.info("Meeting status transition", {
      roomId,
      from: existingMeeting.status,
      to: status,
    });
    if (existingMeeting.status === MeetingStatus.SCHEDULED &&status === MeetingStatus.COMPLETED) {
      logger.warn("Invalid status transition attempted", {
        roomId,
        from: existingMeeting.status,
        to: status,
      });
      throw new CustomError("Cannot complete a meeting before it starts",StatusCode.BAD_REQUEST);
    }
    const updateData: Partial<IMeeting> = { status };
    if (status === MeetingStatus.ONGOING) {
      updateData.startedAt = new Date();
    }
    if (status === MeetingStatus.COMPLETED) {
      updateData.endedAt = new Date();
    }
    if (status === MeetingStatus.CANCELLED) {
      updateData.isCancelledByNutritionist = true;
    }
    const updatedMeeting = await this._nutriMeetingsRepository.updateStatusByRoomId(
      roomId,
      status,
      updateData
    );
    if (!updatedMeeting) {
      logger.error("Failed to update meeting status", { roomId, status });
      throw new CustomError("Failed to update meeting status",
        StatusCode.INTERNAL_SERVER_ERROR
      );
    }
    const populatedMeeting = await this._nutriMeetingsRepository.findByRoomId(roomId);
    if (!populatedMeeting) {
      logger.error("Meeting not found after update", { roomId });
      throw new CustomError("Meeting not found after update",
        StatusCode.NOT_FOUND
      );
    }
    logger.info("Meeting status updated successfully", {
      roomId,
      finalStatus: populatedMeeting.status,
    });
    return MeetingMapper.toResponseDTO(populatedMeeting);
  }
}