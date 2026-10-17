export interface SessionRoomJoinResponseDTO {
  roomId: string;
  token: string;
  serverUrl: string;
  canPublish: boolean;
  role: "host" | "participant";
}
