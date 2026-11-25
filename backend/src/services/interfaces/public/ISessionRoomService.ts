import type { SessionRoomDetailsResponseDTO } from "../../../dtos/public/session/session-room-details-response.dto";
import type { SessionRoomJoinResponseDTO } from "../../../dtos/public/session/session-room-join-response.dto";

export interface ISessionRoomService {
  getSessionRoomDetails(
    userId: string,
    roomId: string,
  ): Promise<SessionRoomDetailsResponseDTO>;

  joinSession(
    userId: string,
    roomId: string,
  ): Promise<SessionRoomJoinResponseDTO>;

  startSession(userId: string, roomId: string): Promise<void>;

  endSession(userId: string, roomId: string): Promise<void>;
}