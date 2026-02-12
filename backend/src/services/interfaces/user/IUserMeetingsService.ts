import { UserMeetingResponseDTO } from "../../../dtos/user/userMeetingResponse.dto";

export interface IUserMeetingsService {
  getMeetings(userId: string): Promise<UserMeetingResponseDTO[]>;
}
