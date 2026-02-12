import { Server } from "socket.io";
import { Server as HttpServer } from "http";

let io: Server;

export const initSocket = (server: HttpServer): Server => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join_room", (roomId: string) => {
      socket.join(roomId);
      console.log(`${socket.id} joined room ${roomId}`);
    });

    socket.on("offer", ({ roomId, offer, senderId }) => {
      socket.to(roomId).emit("offer", { offer, senderId });
    });

    socket.on("answer", ({ roomId, answer, senderId }) => {
      socket.to(roomId).emit("answer", { answer, senderId });
    });

    socket.on("ice-candidate", ({ roomId, candidate, senderId }) => {
      socket.to(roomId).emit("ice-candidate", { candidate, senderId });
    });

    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
      console.log(`${socket.id} left room ${roomId}`);
    });

    socket.on("ping", (data) => {
      console.log("Ping received:", data);
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = (): Server => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};
