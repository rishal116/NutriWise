import { IncomingMessage, Server as HTTPServer } from "http";
import { Server, Socket } from "socket.io";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";

import { jwtConfig } from "../../configs/jwt.config";
import { UserRole } from "../../enums/user.enum";
import { registerChatSocket } from "./chat.socket";
import { registerVideoSocket } from "./video.socket";
import logger from "../../utils/logger";

let io: Server;

// Map userId -> Set of connected socket IDs
const userSocketsMap = new Map<string, Set<string>>();

interface JwtPayload {
  userId: string;
  activeRole: UserRole;
}

export const isUserOnline = (userId: string): boolean => {
  const sockets = userSocketsMap.get(userId);
  return Boolean(sockets && sockets.size > 0);
};

export const getOnlineUserIds = (): string[] => {
  return Array.from(userSocketsMap.keys());
};

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
    const userId = socket.data.user?.userId;
    logger.info("Socket client connected", { socketId: socket.id, userId });

    if (userId) {
      let socketSet = userSocketsMap.get(userId);
      const isFirstConnection = !socketSet || socketSet.size === 0;

      if (!socketSet) {
        socketSet = new Set<string>();
        userSocketsMap.set(userId, socketSet);
      }
      socketSet.add(socket.id);

      // Emit initial presence list to the connected client
      socket.emit("presence:init", { onlineUserIds: Array.from(userSocketsMap.keys()) });

      // Notify others if user transitioned to online
      if (isFirstConnection) {
        logger.info("User is now ONLINE", { userId });
        io.emit("user:online", { userId });
      }
    }

    registerChatSocket(io, socket);
    registerVideoSocket(io, socket);

    socket.on("disconnect", () => {
      logger.info("Socket client disconnected", { socketId: socket.id, userId });

      if (userId) {
        const socketSet = userSocketsMap.get(userId);
        if (socketSet) {
          socketSet.delete(socket.id);
          if (socketSet.size === 0) {
            userSocketsMap.delete(userId);
            logger.info("User is now OFFLINE", { userId });
            io.emit("user:offline", { userId });
          }
        }
      }
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

