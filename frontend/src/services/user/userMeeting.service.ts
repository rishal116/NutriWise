import { clientApi } from "@/lib/axios/clientApi";
import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import { UserMeetingListQueryDTO } from "@/dtos/user/meeting/user-meeting-list-query.dto";
import { UserMeetingListResponseDTO } from "@/dtos/user/meeting/user-meeting-list-response.dto";
import { UserMeetingDetailsResponseDTO } from "@/dtos/user/meeting/user-meeting-details-response.dto";
import { USER_MEETING_ROUTES } from "@/routes/user";

export const userMeetingService = {
  getMeetings: async (
    query?: UserMeetingListQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<UserMeetingListResponseDTO>>
  > => {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<UserMeetingListResponseDTO>>
    >(USER_MEETING_ROUTES.MEETINGS, {
      params: query,
    });

    if (!res.data.data) {
      throw new Error("Meetings data is missing from the API response.");
    }

    return res.data;
  },

  getMeetingDetails: async (
    meetingId: string,
  ): Promise<ApiResponseDTO<UserMeetingDetailsResponseDTO>> => {
    const res = await clientApi.get<
      ApiResponseDTO<UserMeetingDetailsResponseDTO>
    >(USER_MEETING_ROUTES.MEETING_DETAILS(meetingId));

    return res.data;
  },

  cancelMeeting: async (
    meetingId: string,
    cancellationReason: string,
  ): Promise<ApiResponseDTO<UserMeetingDetailsResponseDTO>> => {
    const res = await clientApi.patch<
      ApiResponseDTO<UserMeetingDetailsResponseDTO>
    >(USER_MEETING_ROUTES.CANCEL_MEETING(meetingId), {
      cancellationReason,
    });

    return res.data;
  },
};
