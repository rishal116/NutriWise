import { clientApi } from "@/lib/axios/clientApi";
import { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import { NUTRITIONIST_MEETING_ROUTES } from "@/routes/nutritionist";
import { MeetingStatus } from "@/enums/nutritionist/meeting/meeting.enum";
import { CreateMeetingDTO } from "@/dtos/nutritionist/meeting/create-meeting.dto";
import { MeetingCardResponseDTO } from "@/dtos/nutritionist/meeting/meeting-card-response.dto";
import { MeetingDetailsResponseDTO } from "@/dtos/nutritionist/meeting/meeting-details-response.dto";
import { MeetingListQueryDTO } from "@/dtos/nutritionist/meeting/meeting-list-query.dto";
import { UpdateMeetingDTO } from "@/dtos/nutritionist/meeting/update-meeting.dto";

export const nutriMeetingService = {
  getMeetings: async (
    query: MeetingListQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<MeetingCardResponseDTO>>
  > => {
    const res = await clientApi.get<
      ApiResponseDTO<InfiniteScrollResponseDTO<MeetingCardResponseDTO>>
    >(NUTRITIONIST_MEETING_ROUTES.LIST, {
      params: query,
    });

    if (!res.data.data) {
      throw new Error("Meetings data is missing from the API response.");
    }

    return res.data;
  },

  getMeetingDetails: async (
    meetingId: string,
  ): Promise<ApiResponseDTO<MeetingDetailsResponseDTO>> => {
    const res = await clientApi.get<ApiResponseDTO<MeetingDetailsResponseDTO>>(
      NUTRITIONIST_MEETING_ROUTES.DETAILS(meetingId),
    );

    if (!res.data.data) {
      throw new Error("Meetings data is missing from the API response.");
    }

    return res.data;
  },

  createMeeting: async (
    data: CreateMeetingDTO,
  ): Promise<ApiResponseDTO<MeetingDetailsResponseDTO>> => {
    const res = await clientApi.post<ApiResponseDTO<MeetingDetailsResponseDTO>>(
      NUTRITIONIST_MEETING_ROUTES.CREATE,
      data,
    );

    return res.data;
  },

  updateMeetingStatus: async (
    roomId: string,
    status: MeetingStatus,
  ): Promise<ApiResponseDTO<MeetingDetailsResponseDTO>> => {
    const res = await clientApi.patch<
      ApiResponseDTO<MeetingDetailsResponseDTO>
    >(NUTRITIONIST_MEETING_ROUTES.UPDATE_STATUS(roomId), {
      status,
    });

    return res.data;
  },

  updateMeeting: async (
    meetingId: string,
    data: UpdateMeetingDTO,
  ): Promise<ApiResponseDTO<MeetingDetailsResponseDTO>> => {
    const res = await clientApi.patch<
      ApiResponseDTO<MeetingDetailsResponseDTO>
    >(NUTRITIONIST_MEETING_ROUTES.UPDATE(meetingId), data);

    return res.data;
  },

  cancelMeeting: async (
    meetingId: string,
    cancellationReason: string,
  ): Promise<ApiResponseDTO> => {
    const res = await clientApi.patch<ApiResponseDTO>(
      NUTRITIONIST_MEETING_ROUTES.CANCEL(meetingId),
      { cancellationReason },
    );

    return res.data;
  },
};
