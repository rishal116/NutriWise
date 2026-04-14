import { CreateMeetingDTO } from "../../../dtos/nutritionist/createMeeting.dto";
import { MeetingResponseDTO } from "../../../dtos/nutritionist/meetingResponse.dto";
import { MeetingStatus } from "../../../models/meeting.model";

export interface INutriMeetingsService {
  getMeetings(userId: string): Promise<MeetingResponseDTO[]>;
  createMeeting(data: CreateMeetingDTO): Promise<MeetingResponseDTO>;
  updateMeetingStatus(roomId: string,status: MeetingStatus): Promise<MeetingResponseDTO>;
}