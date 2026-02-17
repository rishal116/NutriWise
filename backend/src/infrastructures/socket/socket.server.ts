import { Server } from "socket.io";
import { Server as HTTPServer } from "http";

let io: Server;

export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log("Client connected:", socket.id);

    socket.on("join_room", (roomId: string) => {
      const room = io.sockets.adapter.rooms.get(roomId);
      const size = room ? room.size : 0;

      if (size >= 2) {
        socket.emit("room_full");
        return;
      }

      socket.join(roomId);

      if (size === 0) {
        socket.emit("waiting_for_peer");
      }

      if (size === 1) {
        socket.emit("joined_as_second");
        socket.to(roomId).emit("ready_for_call");
      }

        if (size >= 2) {
    socket.emit("room_full");
  }

      console.log(`Room ${roomId} size: ${size + 1}`);
    });

    socket.on("offer", ({ roomId, offer }) => {
      socket.to(roomId).emit("offer", { offer });
    });

    socket.on("answer", ({ roomId, answer }) => {
      socket.to(roomId).emit("answer", { answer });
    });

    socket.on("ice-candidate", ({ roomId, candidate }) => {
      socket.to(roomId).emit("ice-candidate", { candidate });
    });

    socket.on("leave_room", (roomId: string) => {
      socket.leave(roomId);
      socket.to(roomId).emit("user_left");
    });

    socket.on("disconnecting", () => {
      socket.rooms.forEach((roomId) => {
        if (roomId !== socket.id) {
          socket.to(roomId).emit("user_left");
        }
      });
    });

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) throw new Error("Socket not initialized");
  return io;
};
