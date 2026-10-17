import { clientApi } from "@/lib/axios/clientApi";
import { PUBLIC_SESSION_ROUTES } from "@/routes/public/session.routes";
import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { GetPublicSessionsQueryDTO } from "@/dtos/public/session/public-session-list-query.dto";
import type { PublicSessionListItemResponseDTO } from "@/dtos/public/session/public-session-list-response.dto";
import type { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import type { SessionRoomJoinResponseDTO } from "@/dtos/public/session/session-room-join-response.dto";

export const publicSessionService = {
  async getSessions(
    query?: GetPublicSessionsQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<PublicSessionListItemResponseDTO>>
  > {
    const { data } = await clientApi.get<
      ApiResponseDTO<
        InfiniteScrollResponseDTO<PublicSessionListItemResponseDTO>
      >
    >(PUBLIC_SESSION_ROUTES.LIST, {
      params: query,
    });

    return data;
  },

  async getSessionDetails(
    sessionId: string,
  ): Promise<ApiResponseDTO<PublicSessionDetailsResponseDTO>> {
    const { data } = await clientApi.get<
      ApiResponseDTO<PublicSessionDetailsResponseDTO>
    >(PUBLIC_SESSION_ROUTES.DETAILS(sessionId));

    return data;
  },

  async joinSession(
    sessionId: string,
  ): Promise<ApiResponseDTO<SessionRoomJoinResponseDTO>> {
    const { data } = await clientApi.post<
      ApiResponseDTO<SessionRoomJoinResponseDTO>
    >(PUBLIC_SESSION_ROUTES.JOIN(sessionId));

    return data;
  },

  async startSession(sessionId: string): Promise<ApiResponseDTO<null>> {
    const { data } = await clientApi.post<ApiResponseDTO<null>>(
      PUBLIC_SESSION_ROUTES.START(sessionId),
    );

    return data;
  },

  async endSession(sessionId: string): Promise<ApiResponseDTO<null>> {
    const { data } = await clientApi.post<ApiResponseDTO<null>>(
      PUBLIC_SESSION_ROUTES.END(sessionId),
    );

    return data;
  },
};
