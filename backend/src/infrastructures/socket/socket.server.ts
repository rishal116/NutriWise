import { IncomingMessage, Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { jwtConfig } from "../../configs/jwt.config";
import { UserRole } from "../../enums/userRole.enum";
import { registerChatSocket } from "./chat.socket";
import { registerVideoSocket } from "./video.socket";

let io: Server;

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

function getCookie(request: IncomingMessage, name: string): string | undefined {
  const cookieHeader = request.headers.cookie;

  if (!cookieHeader) {
    return undefined;
  }

  const cookies = cookieHeader.split(";");

  for (const cookie of cookies) {
    const [key, ...value] = cookie.trim().split("=");

    if (key === name) {
      return decodeURIComponent(value.join("="));
    }
  }

  return undefined;
}

export const initializeSocket = (server: HTTPServer) => {
  io = new Server(server, {
    cors: {
      origin: process.env.FRONTEND_URL,
      credentials: true,
    },
  });

  io.use((socket: Socket, next) => {
    try {
      const accessToken = getCookie(socket.request, "accessToken");

      if (!accessToken) {
        return next(new Error("ACCESS_TOKEN_MISSING"));
      }

      const decoded = jwt.verify(
        accessToken,
        jwtConfig.accessToken.secret,
      ) as JwtPayload;

      socket.data.user = {
        userId: decoded.userId,
        activeRole: decoded.activeRole,
      };

      next();
    } catch (error) {
      if (error instanceof TokenExpiredError) {
        return next(new Error("ACCESS_TOKEN_EXPIRED"));
      }

      if (error instanceof JsonWebTokenError) {
        return next(new Error("INVALID_TOKEN"));
      }

      return next(new Error("SOCKET_AUTH_FAILED"));
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
