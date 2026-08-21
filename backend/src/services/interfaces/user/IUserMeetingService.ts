import { InfiniteScrollResponseDTO } from "../../../dtos/common/infinite-scroll-response.dto";
import { UserMeetingDetailsResponseDTO } from "../../../dtos/user/meeting/user-meeting-details-response.dto";
import { UserMeetingListQueryDTO } from "../../../dtos/user/meeting/user-meeting-list-query.dto";
import { UserMeetingListResponseDTO } from "../../../dtos/user/meeting/user-meeting-list-response.dto";

export interface IUserMeetingService {
  getMeetings(
    userId: string,
    query: UserMeetingListQueryDTO,
  ): Promise<InfiniteScrollResponseDTO<UserMeetingListResponseDTO>>;

  getMeetingDetails(
    userId: string,
    meetingId: string,
  ): Promise<UserMeetingDetailsResponseDTO>;
}
