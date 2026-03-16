import { injectable } from "inversify";
import { getIO } from "../../../infrastructures/socket/socket.server";
import { ISocketService } from "../../interfaces/socket/ISocketService";
import { MessageResponseDTO } from "../../../dtos/chat/messageResponse.dto";

@injectable()
export class SocketService implements ISocketService {

  emitNewMessage(conversationId: string, message: MessageResponseDTO): void {

    const io = getIO();

    io.to(`chat:${conversationId}`).emit("receiveMessage", message);

  }

  emitMessageEdited(
    conversationId: string,
    messageId: string,
    content: string
  ): void {

    const io = getIO();

    io.to(`chat:${conversationId}`).emit("messageEdited", {
      conversationId,
      messageId,
      content,
    });

  }

  emitMessageDeleted(
    conversationId: string,
    messageId: string
  ): void {

    const io = getIO();

    io.to(`chat:${conversationId}`).emit("messageDeleted", {
      conversationId,
      messageId,
    });

  }

  emitMessagesRead(
    conversationId: string,
    userId: string
  ): void {

    const io = getIO();

    io.to(`chat:${conversationId}`).emit("messagesRead", {
      conversationId,
      userId,
    });

  }

}