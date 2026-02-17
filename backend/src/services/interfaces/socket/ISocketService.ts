import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";
export interface ISocketService {
  emitToRoom(roomId: string, event: string, data: MessageResponseDTO): void;
}
