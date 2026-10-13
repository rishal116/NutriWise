import { Socket } from "socket.io-client";
import { AttachmentDTO, MessageResponseDTO } from "@/dtos/chat/message-response.dto";
import { MessageStatus, MessageType } from "@/types/chat/message.types";

export interface IncomingMessagePayload {
  id: string;
  conversationId: string;
  senderId: string;
  text?: string;
  content?: string;
  attachments?: AttachmentDTO[];
  messageType?: MessageType;
  type?: MessageType;
  replyTo?: string;
  status?: MessageStatus;
  createdAt?: string | Date;
}

export interface TypingSocketPayload {
  userId: string;
}

export interface DeleteSocketPayload {
  messageId: string;
  conversationId?: string;
}

export interface EditSocketPayload {
  messageId: string;
  content?: string;
  text?: string;
  conversationId?: string;
}

export interface MessagesReadSocketPayload {
  conversationId: string;
  userId: string;
}

export interface ChatHandlers {
  onReceive?: (message: IncomingMessagePayload) => void;
  onTyping?: (data: TypingSocketPayload) => void;
  onStopTyping?: (data: TypingSocketPayload) => void;
  onDelete?: (data: DeleteSocketPayload) => void;
  onEdit?: (data: EditSocketPayload) => void;
  onMessagesRead?: (data: MessagesReadSocketPayload) => void;
}

export interface SendMessagePayload {
  conversationId: string;
  text?: string;
  attachments?: MessageResponseDTO["attachments"];
  messageType: MessageResponseDTO["messageType"];
}

interface SendMessageAck {
  success: boolean;
  data?: MessageResponseDTO;
  error?: string;
}

export const chatSocket = {
  join(socket: Socket, conversationId: string) {
    socket.emit("join_chat", conversationId);
  },

  leave(socket: Socket, conversationId: string) {
    socket.emit("leave_chat", conversationId);
  },

  sendMessage(
    socket: Socket,
    payload: SendMessagePayload,
  ): Promise<MessageResponseDTO> {
    return new Promise((resolve, reject) => {
      socket.emit("message:send", payload, (res: SendMessageAck) => {
        if (res && res.success && res.data) {
          resolve(res.data);
        } else {
          reject(new Error(res?.error || "Failed to send message"));
        }
      });
    });
  },

  typing(socket: Socket, conversationId: string) {
    socket.emit("typing", { conversationId });
  },

  stopTyping(socket: Socket, conversationId: string) {
    socket.emit("stop_typing", { conversationId });
  },

  register(socket: Socket, handlers: ChatHandlers) {
    if (handlers.onReceive) socket.on("receiveMessage", handlers.onReceive);
    if (handlers.onTyping) socket.on("userTyping", handlers.onTyping);
    if (handlers.onStopTyping)
      socket.on("userStoppedTyping", handlers.onStopTyping);

    if (handlers.onDelete) socket.on("messageDeleted", handlers.onDelete);
    if (handlers.onEdit) socket.on("messageEdited", handlers.onEdit);
    if (handlers.onMessagesRead)
      socket.on("messagesRead", handlers.onMessagesRead);

    return () => {
      if (handlers.onReceive) socket.off("receiveMessage", handlers.onReceive);
      if (handlers.onTyping) socket.off("userTyping", handlers.onTyping);
      if (handlers.onStopTyping)
        socket.off("userStoppedTyping", handlers.onStopTyping);
      if (handlers.onDelete) socket.off("messageDeleted", handlers.onDelete);
      if (handlers.onEdit) socket.off("messageEdited", handlers.onEdit);
      if (handlers.onMessagesRead)
        socket.off("messagesRead", handlers.onMessagesRead);
    };
  },
};
