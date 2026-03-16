import { Socket } from "socket.io-client";

interface ChatHandlers {
  onReceive?: (message: any) => void;
  onTyping?: (data:any) => void;
  onStopTyping?: (data:any) => void;
  onDelete?: (data: any) => void;
  onEdit?: (data: any) => void;
}

export const chatSocket = {

  join(socket: Socket, conversationId: string) {
    socket.emit("join_chat", conversationId);
  },

  leave(socket: Socket, conversationId: string) {
    socket.emit("leave_chat", conversationId);
  },

  sendMessage(socket: Socket, conversationId: string, message: any) {
    socket.emit("sendMessage", { conversationId, ...message });
  },

  editMessage(socket: Socket, conversationId: string, messageId: string, newText: string) {
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
    if (handlers.onStopTyping) socket.on("userStoppedTyping", handlers.onStopTyping);
    if (handlers.onDelete) socket.on("messageDeleted", handlers.onDelete);
    if (handlers.onEdit) socket.on("messageEdited", handlers.onEdit);

    return () => {
      if (handlers.onReceive) socket.off("receiveMessage", handlers.onReceive);
      if (handlers.onTyping) socket.off("userTyping", handlers.onTyping);
      if (handlers.onStopTyping) socket.off("userStoppedTyping", handlers.onStopTyping);
      if (handlers.onDelete) socket.off("messageDeleted", handlers.onDelete);
      if (handlers.onEdit) socket.off("messageEdited", handlers.onEdit);
    };

  }

};