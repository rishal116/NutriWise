import { CreateMeetingDTO } from "../../../dtos/nutritionist/createMeeting.dto";
import { MeetingResponseDTO } from "../../../dtos/nutritionist/meetingResponse.dto";

export interface INutriMeetingsService {
  getMeetings(userId: string): Promise<MeetingResponseDTO[]>;
  createMeeting(data: CreateMeetingDTO): Promise<MeetingResponseDTO>;
}
