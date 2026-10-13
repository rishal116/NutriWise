import { injectable } from "inversify";
import { getIO } from "../../../infrastructures/socket/socket.server";
import { ISocketService } from "../../interfaces/socket/ISocketService";
import { MessageResponseDTO } from "../../../dtos/chat/message-response.dto";
import { ConversationUpdatePayload } from "../../../types/socketEvents";

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
    const rooms = [`chat:${conversationId}`, `user:${userId}`];
    io.to(rooms).emit("messagesRead", {
      conversationId,
      userId,
    });
  }

  emitConversationUpdated(
    memberUserIds: string[],
    data: ConversationUpdatePayload
  ): void {
    const io = getIO();
    const rooms = Array.from(new Set(memberUserIds.map((userId) => `user:${userId}`)));
    rooms.push(`chat:${data.conversationId}`);
    io.to(rooms).emit("conversationUpdated", data);
    io.to(rooms).emit("conversation:updated", data);
  }

}