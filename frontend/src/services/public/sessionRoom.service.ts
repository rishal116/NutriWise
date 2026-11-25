import { clientApi } from "@/lib/axios/clientApi";

import type { ApiResponseDTO } from "@/dtos/common/api-response.dto";
import type { SessionRoomJoinResponseDTO } from "@/dtos/public/session/session-room-join-response.dto";
import type { SessionRoomDetailsResponseDTO } from "@/dtos/public/session/session-room-details-response.dto";

import { SESSION_ROOM_ROUTES } from "@/routes/public/session-room.routes";

export const sessionRoomService = {
  async getSessionRoomDetails(
    roomId: string,
  ): Promise<ApiResponseDTO<SessionRoomDetailsResponseDTO>> {
    const { data } = await clientApi.get<
      ApiResponseDTO<SessionRoomDetailsResponseDTO>
    >(SESSION_ROOM_ROUTES.DETAILS(roomId));

    return data;
  },

  async joinSession(
    roomId: string,
  ): Promise<ApiResponseDTO<SessionRoomJoinResponseDTO>> {
    const { data } = await clientApi.post<
      ApiResponseDTO<SessionRoomJoinResponseDTO>
    >(SESSION_ROOM_ROUTES.JOIN(roomId));

    return data;
  },

  async startSession(roomId: string): Promise<ApiResponseDTO<null>> {
    const { data } = await clientApi.post<ApiResponseDTO<null>>(
      SESSION_ROOM_ROUTES.START(roomId),
    );

    return data;
  },

  async endSession(roomId: string): Promise<ApiResponseDTO<null>> {
    const { data } = await clientApi.post<ApiResponseDTO<null>>(
      SESSION_ROOM_ROUTES.END(roomId),
    );

    return data;
  },
};
