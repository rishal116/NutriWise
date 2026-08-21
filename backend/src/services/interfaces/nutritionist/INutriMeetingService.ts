import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { CreateMeetingDTO } from "../../../dtos/nutritionist/meeting/create-meeting.dto";
import { MeetingCardResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-card-response.dto";
import { MeetingDetailsResponseDTO } from "../../../dtos/nutritionist/meeting/meeting-details-response.dto";
import { MeetingListQueryDTO } from "../../../dtos/nutritionist/meeting/meeting-list-query.dto";
import { MeetingStatus } from "../../../models/meeting.model";

export interface INutriMeetingService {
  getMeetings(
    nutritionistId: string,
    query: MeetingListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<MeetingCardResponseDTO>>;

  getMeetingDetails(
    nutritionistId: string,
    meetingId: string,
  ): Promise<MeetingDetailsResponseDTO>;

  createMeeting(data: CreateMeetingDTO): Promise<MeetingDetailsResponseDTO>;

  updateMeetingStatus(
    roomId: string,
    status: MeetingStatus,
  ): Promise<MeetingDetailsResponseDTO>;
}
