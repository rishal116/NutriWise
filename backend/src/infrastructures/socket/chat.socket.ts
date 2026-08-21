import { Server, Socket } from "socket.io";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IConversationMemberRepository } from "../../repositories/interfaces/chat/IConversationMemberRepository";
import { IMessageService } from "../../services/interfaces/chat/IMessageService";
import { SendMessageDTO } from "../../dtos/chat/sendMessage.dto";
import { MessageResponseDTO } from "../../dtos/chat/messageResponse.dto";
import { getOnlineUserIds } from "./socket.server";
import logger from "../../utils/logger";

type SendMessagePayload = Omit<SendMessageDTO, "senderId">;

interface AckResponse<T = undefined> {
  success: boolean;
  error?: string;
  data?: T;
}

interface TypingPayload {
  conversationId: string;
}

const getErrorMessage = (err: unknown): string => {
  if (err instanceof Error) return err.message;
  if (typeof err === "string") return err;
  return "UNKNOWN_ERROR";
};

export const registerChatSocket = (io: Server, socket: Socket) => {
  const memberRepo = container.get<IConversationMemberRepository>(
    TYPES.IConversationMemberRepository,
  );
  const messageService = container.get<IMessageService>(TYPES.IMessageService);

  socket.on(
    "join_chat",
    async (
      conversationId: string,
      callback?: (response: AckResponse) => void,
    ) => {
      try {
        const userId = socket.data.user?.userId as string | undefined;
        if (!userId || !conversationId) {
          if (callback)
            callback({ success: false, error: "INVALID_PARAMETERS" });
          return;
        }

        const member = await memberRepo.findMember(conversationId, userId);
        if (member && member.status === "active") {
          socket.join(`chat:${conversationId}`);
          logger.info("Socket joined conversation room", {
            socketId: socket.id,
            userId,
            conversationId,
          });
          if (callback) callback({ success: true });
        } else {
          logger.warn("Unauthorized room join attempt", {
            socketId: socket.id,
            userId,
            conversationId,
          });
          if (callback)
            callback({ success: false, error: "NOT_CONVERSATION_MEMBER" });
        }
      } catch (err: unknown) {
        logger.error("Error joining chat room", {
          error: getErrorMessage(err),
        });
        if (callback) callback({ success: false, error: "JOIN_FAILED" });
      }
    },
  );

  socket.on("leave_chat", (conversationId: string) => {
    if (conversationId) {
      socket.leave(`chat:${conversationId}`);
    }
  });

  socket.on(
    "message:send",
    async (
      data: SendMessagePayload,
      callback?: (response: AckResponse<MessageResponseDTO>) => void,
    ) => {
      try {
        const senderId = socket.data.user?.userId as string | undefined;
        if (!senderId) {
          if (callback) callback({ success: false, error: "UNAUTHENTICATED" });
          return;
        }

        if (!data.conversationId || !data.messageType) {
          if (callback)
            callback({ success: false, error: "INVALID_PARAMETERS" });
          return;
        }

        // NOTE: message:send trusts data.conversationId with no membership
        // check here, unlike join_chat. Confirm IMessageService.sendMessage
        // enforces membership internally — otherwise add a memberRepo check
        // before calling it, same as join_chat does.
        const message = await messageService.sendMessage({
          conversationId: data.conversationId,
          senderId,
          text: data.text,
          attachments: data.attachments,
          messageType: data.messageType,
        });

        // NOTE: this only acks the sender. Other participants in
        // `chat:${data.conversationId}` are never notified of the new
        // message. If IMessageService doesn't emit internally, add:
        // io.to(`chat:${data.conversationId}`).emit("message:new", message);
        if (callback) callback({ success: true, data: message });
      } catch (error: unknown) {
        logger.warn("Socket message:send failed", {
          error: getErrorMessage(error),
          userId: socket.data.user?.userId,
        });
        if (callback) {
          callback({
            success: false,
            error: getErrorMessage(error) || "MESSAGE_SEND_FAILED",
          });
        }
      }
    },
  );

  socket.on("typing", ({ conversationId }: TypingPayload) => {
    if (conversationId && socket.rooms.has(`chat:${conversationId}`)) {
      socket.to(`chat:${conversationId}`).emit("userTyping", {
        userId: socket.data.user?.userId,
        conversationId,
      });
    }
  });

  socket.on("stop_typing", ({ conversationId }: TypingPayload) => {
    if (conversationId && socket.rooms.has(`chat:${conversationId}`)) {
      socket.to(`chat:${conversationId}`).emit("userStoppedTyping", {
        userId: socket.data.user?.userId,
        conversationId,
      });
    }
  });

  socket.on(
    "presence:get_online",
    (callback?: (data: { onlineUserIds: string[] }) => void) => {
      if (callback) {
        callback({ onlineUserIds: getOnlineUserIds() });
      }
    },
  );
};
