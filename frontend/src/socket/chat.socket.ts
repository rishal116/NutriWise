import { Socket } from "socket.io-client";

/* ---------- TYPES ---------- */

interface Attachment {
  url: string;
  fileName: string;
}

interface Message {
  id: string;
  senderId: string;

  senderFullName: string;
  senderProfileImage?: string;

  content:string
  createdAt: string;

  status?: "sent" | "delivered" | "read";
  type: "text" | "file";

  isEdited?: boolean;
  editedAt?: Date;

  attachments?: Attachment[];
}


export interface TypingEvent {
  conversationId: string;
  userId: string;
}

export interface DeleteEvent {
  messageId: string;
  conversationId: string;
}

export interface EditEvent {
  messageId: string;
  conversationId: string;
  content: string;
}

interface ChatHandlers {
  onReceive?: (message: Message) => void;
  onTyping?: (data: TypingEvent) => void;
  onStopTyping?: (data: TypingEvent) => void;
  onDelete?: (data: DeleteEvent) => void;
  onEdit?: (data: EditEvent) => void;
}

/* ---------- SOCKET ---------- */

export const chatSocket = {
  join(socket: Socket, conversationId: string) {
    socket.emit("join_chat", conversationId);
  },

  leave(socket: Socket, conversationId: string) {
    socket.emit("leave_chat", conversationId);
  },

  sendMessage(
    socket: Socket,
    conversationId: string,
    message: Omit<Message, "id" | "createdAt" | "conversationId">,
  ) {
    socket.emit("sendMessage", { conversationId, ...message });
  },

  editMessage(
    socket: Socket,
    conversationId: string,
    messageId: string,
    newText: string,
  ) {
    socket.emit("editMessage", { conversationId, messageId, newText });
  },

  deleteMessage(socket: Socket, conversationId: string, messageId: string) {
    socket.emit("deleteMessage", { conversationId, messageId });
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

    return () => {
      if (handlers.onReceive) socket.off("receiveMessage", handlers.onReceive);
      if (handlers.onTyping) socket.off("userTyping", handlers.onTyping);
      if (handlers.onStopTyping)
        socket.off("userStoppedTyping", handlers.onStopTyping);
      if (handlers.onDelete) socket.off("messageDeleted", handlers.onDelete);
      if (handlers.onEdit) socket.off("messageEdited", handlers.onEdit);
    };
  },
};
