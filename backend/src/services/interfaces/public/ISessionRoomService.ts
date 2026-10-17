import { SessionRoomJoinResponseDTO } from "../../../dtos/public/session/session-room-join-response.dto";

export interface ISessionRoomService {
  joinSession(
    userId: string,
    sessionId: string,
  ): Promise<SessionRoomJoinResponseDTO>;

  startSession(userId: string, sessionId: string): Promise<void>;

  endSession(userId: string, sessionId: string): Promise<void>;
}
