import { Server, Socket } from "socket.io";
import { Server as HTTPServer } from "http";
import jwt from "jsonwebtoken";

import { jwtConfig } from "../../configs/jwt";
import { ROLES, Role } from "../../types/role";
import { registerChatSocket } from "./chat.socket";
import { registerVideoSocket } from "./video.socket";

let io: Server;

interface JwtPayload {
  userId: string;
  role: Role;
}

export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  // 🔐 Socket Authentication Middleware
  io.use((socket: Socket, next) => {
    try {
      const token = socket.handshake.auth?.token;

      if (!token) {
        return next(new Error("ACCESS_TOKEN_MISSING"));
      }

      const decoded = jwt.verify(
        token,
        jwtConfig.accessToken.secret
      ) as JwtPayload;

      if (!ROLES.includes(decoded.role)) {
        return next(new Error("INVALID_ROLE"));
      }

      // Attach verified user to socket
      socket.data.user = {
        userId: decoded.userId,
        role: decoded.role,
      };

      next();
    } catch (error: any) {
      if (error.name === "TokenExpiredError") {
        return next(new Error("ACCESS_TOKEN_EXPIRED"));
      }

      return next(new Error("INVALID_TOKEN"));
    }
  });

  io.on("connection", (socket: Socket) => {
    console.log("Client connected:", socket.id);
    console.log("Authenticated User:", socket.data.user);

    registerChatSocket(io, socket);
    registerVideoSocket(io, socket);

    socket.on("disconnect", () => {
      console.log("Client disconnected:", socket.id);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket not initialized");
  }
  return io;
};