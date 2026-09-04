import { clientApi } from "@/lib/axios/clientApi";

import { ApiResponseDTO } from "@/dtos/common/api-response.dto";

import { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";

import { PUBLIC_SESSION_ROUTES } from "@/routes/public/session.routes";

import { GetPublicSessionsQueryDTO } from "@/dtos/public/session/public-session-list-query.dto";

import { PublicSessionListItemResponseDTO } from "@/dtos/public/session/public-session-list-response.dto";

import { PublicSessionDetailsResponseDTO } from "@/dtos/public/session/public-session-details-response.dto";
import { SessionRoomJoinResponseDTO } from "@/dtos/public/session/session-room-join-response.dto";

export const publicSessionService = {
  getSessions: async (
    query?: GetPublicSessionsQueryDTO,
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<PublicSessionListItemResponseDTO>>
  > => {
    const res = await clientApi.get<
      ApiResponseDTO<
        InfiniteScrollResponseDTO<PublicSessionListItemResponseDTO>
      >
    >(PUBLIC_SESSION_ROUTES.LIST, {
      params: query,
    });

    return res.data;
  },

  getSessionDetails: async (
    sessionId: string,
  ): Promise<ApiResponseDTO<PublicSessionDetailsResponseDTO>> => {
    const res = await clientApi.get<
      ApiResponseDTO<PublicSessionDetailsResponseDTO>
    >(PUBLIC_SESSION_ROUTES.DETAILS(sessionId));

    return res.data;
  },

  joinSession: async (
    sessionId: string,
  ): Promise<ApiResponseDTO<SessionRoomJoinResponseDTO>> => {
    const res = await clientApi.post<
      ApiResponseDTO<SessionRoomJoinResponseDTO>
    >(PUBLIC_SESSION_ROUTES.JOIN(sessionId));

    return res.data;
  },
};
