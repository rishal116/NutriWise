import { Server, Socket } from "socket.io";

export const registerChatSocket = (io: Server, socket: Socket) => {

  socket.on("join_chat", (conversationId: string) => {
    socket.join(`chat:${conversationId}`);
  });

  socket.on("leave_chat", (conversationId: string) => {
    socket.leave(`chat:${conversationId}`);
  });

  socket.on("sendMessage", ({ conversationId, ...message }) => {
    io.to(`chat:${conversationId}`).emit("receiveMessage", message);
  });

  socket.on("editMessage", ({ conversationId, messageId, newText }) => {
  io.to(`chat:${conversationId}`).emit("messageEdited", {
    messageId,
    content: newText,
  });
});

  socket.on("deleteMessage", ({ conversationId, messageId }) => {
    io.to(`chat:${conversationId}`).emit("messageDeleted", {
      messageId,
    });
  });

  socket.on("typing", ({ conversationId }) => {
    socket.to(`chat:${conversationId}`).emit("userTyping", {
      userId: socket.data.user.userId,
    });
  });

  socket.on("stop_typing", ({ conversationId }) => {
    socket.to(`chat:${conversationId}`).emit("userStoppedTyping", {
      userId: socket.data.user.userId,
    });
  });

};