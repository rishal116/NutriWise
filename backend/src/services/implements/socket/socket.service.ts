import { injectable } from "inversify";
import { getIO } from "../../../infrastructures/socket/socket.server";
import { ISocketService } from "../../interfaces/socket/ISocketService";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";

@injectable()
export class SocketService implements ISocketService {
  emitToRoom(roomId: string, event: string, data: MessageResponseDTO): void {
    try {
      const io = getIO();

      
      io.to(roomId).emit(event, data);
    } catch (error) {
      console.error("Socket emission failed:", error);
    }
  }
}
