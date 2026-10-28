import { clientApi } from "@/lib/axios/clientApi";

import { USER_SESSION_ROUTES } from "@/routes/user";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { InfiniteScrollResponseDTO } from "@/dtos/common/infinite-scroll-response.dto";
import type { UserSessionListQueryDTO } from "@/dtos/user/session/user-session-list-query.dto";
import type { UserSessionListItemDTO } from "@/dtos/user/session/user-session.dto";
import type { UserSessionDetailsDTO } from "@/dtos/user/session/user-session-details.dto";

export const userSessionService = {
  async getUserSessions(
    query: UserSessionListQueryDTO = {},
  ): Promise<
    ApiResponseDTO<InfiniteScrollResponseDTO<UserSessionListItemDTO>>
  > {
    const res = await clientApi.get(USER_SESSION_ROUTES.LIST, {
      params: query,
    });

    return res.data;
  },

  async getUserSessionDetails(
    sessionId: string,
  ): Promise<ApiResponseDTO<UserSessionDetailsDTO>> {
    const res = await clientApi.get(USER_SESSION_ROUTES.DETAILS(sessionId));

    return res.data;
  },
};
