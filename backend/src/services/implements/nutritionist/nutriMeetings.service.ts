import { injectable, inject } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriMeetingsService } from "../../interfaces/nutritionist/INutriMeetingsService";
import { INutriMeetingsRepository } from "../../../repositories/interfaces/nutritionist/INutriMeetingsRepository";
import { CreateMeetingDTO } from "../../../dtos/nutritionist/createMeeting.dto";
import { MeetingResponseDTO } from "../../../dtos/nutritionist/meetingResponse.dto";
import { MeetingMapper } from "../../../mapper/nutritionist/meeting.mapper";
import { v4 as uuidv4 } from "uuid";
import { Types } from "mongoose";
import { MeetingStatus } from "../../../models/meeting.model";

@injectable()
export class NutriMeetingsService implements INutriMeetingsService {
  constructor(
    @inject(TYPES.INutriMeetingsRepository)
    private _nutriMeetingsRepository: INutriMeetingsRepository
  ) {}

  async getMeetings(userId: string): Promise<MeetingResponseDTO[]> {
    const meetings = await this._nutriMeetingsRepository.findByNutritionistId(userId);
    
    return MeetingMapper.toResponseDTOList(meetings);
  }

async createMeeting(data: CreateMeetingDTO): Promise<MeetingResponseDTO> {
  const roomId = uuidv4();

  await this._nutriMeetingsRepository.createMeeting({
    title: data.title,
    roomId,
    scheduledAt: new Date(data.scheduledAt),
    userId: new Types.ObjectId(data.userId),
    nutritionistId: new Types.ObjectId(data.nutritionistId),
    status: MeetingStatus.SCHEDULED
  });


  const populatedMeeting =
    await this._nutriMeetingsRepository.findByRoomId(roomId);

  if (!populatedMeeting) {
    throw new Error("Meeting not found after creation");
  }

  return MeetingMapper.toResponseDTO(populatedMeeting);
}

}
