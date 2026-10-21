import { randomUUID } from "crypto";
import { Server, Socket } from "socket.io";
import { MeetingStatus } from "../../models/meeting.model";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { INutriMeetingService } from "../../services/interfaces/nutritionist/INutriMeetingService";

const ROOM_PREFIX = "video:";
const COMPLETION_GRACE_MS = 60_000;
const CHAT_MAX_LENGTH = 500;

const completionTimers = new Map<string, NodeJS.Timeout>();

interface OfferPayload {
  roomId: string;
  offer: unknown;
}
interface AnswerPayload {
  roomId: string;
  answer: unknown;
}
interface IcePayload {
  roomId: string;
  candidate: unknown;
}
interface ChatPayload {
  roomId: string;
  text: unknown;
}

export const registerVideoSocket = (io: Server, socket: Socket) => {
  const meetingService = container.get<INutriMeetingService>(
    TYPES.INutriMeetingService,
  );

  const roomName = (roomId: string) => `${ROOM_PREFIX}${roomId}`;
  const isMember = (roomId: string) =>
    typeof roomId === "string" && socket.rooms.has(roomName(roomId));
  const roomSize = (name: string) =>
    io.sockets.adapter.rooms.get(name)?.size ?? 0;

  const cancelCompletion = (roomId: string) => {
    const timer = completionTimers.get(roomId);
    if (timer) clearTimeout(timer);
    completionTimers.delete(roomId);
  };

  const scheduleCompletion = (roomId: string) => {
    cancelCompletion(roomId);
    completionTimers.set(
      roomId,
      setTimeout(async () => {
        completionTimers.delete(roomId);
        if (roomSize(roomName(roomId)) > 0) return;
        try {
          await meetingService.updateMeetingStatus(
            roomId,
            MeetingStatus.COMPLETED,
          );
        } catch (err) {
          console.error("Error completing meeting:", err);
        }
      }, COMPLETION_GRACE_MS),
    );
  };

  const handleLeave = (roomId: string) => {
    if (!isMember(roomId)) return;

    const name = roomName(roomId);
    socket.leave(name);
    socket.to(name).emit("user_left");

    if (roomSize(name) === 0) scheduleCompletion(roomId);
  };

  socket.on("join_video_room", (roomId: string) => {
    if (typeof roomId !== "string" || !roomId || isMember(roomId)) return;

    // TODO(auth): verify this user is a participant of the meeting before joining.
    const name = roomName(roomId);
    const size = roomSize(name);

    if (size >= 2) {
      socket.emit("room_full");
      return;
    }

    cancelCompletion(roomId);
    socket.join(name);

    if (size === 0) socket.emit("waiting_for_peer");
    if (size === 1) {
      socket.emit("joined_as_second");
      socket.to(name).emit("ready_for_call");
    }
  });

  socket.on("video_call_connected", async (roomId: string) => {
    if (!isMember(roomId)) return;

    cancelCompletion(roomId);

    try {
      await meetingService.updateMeetingStatus(roomId, MeetingStatus.ONGOING);
    } catch (error: unknown) {
      console.error("Error starting meeting:", error);
    }
  });

  socket.on("offer", ({ roomId, offer }: OfferPayload) => {
    if (!isMember(roomId)) return;
    socket.to(roomName(roomId)).emit("offer", { roomId, offer });
  });

  socket.on("answer", ({ roomId, answer }: AnswerPayload) => {
    if (!isMember(roomId)) return;
    socket.to(roomName(roomId)).emit("answer", { roomId, answer });
  });

  socket.on("ice-candidate", ({ roomId, candidate }: IcePayload) => {
    if (!isMember(roomId)) return;
    socket.to(roomName(roomId)).emit("ice-candidate", { roomId, candidate });
  });

  // In-memory relay only: nothing is stored.
  socket.on("video_chat_message", ({ roomId, text }: ChatPayload) => {
    if (!isMember(roomId) || typeof text !== "string") return;

    const trimmed = text.trim().slice(0, CHAT_MAX_LENGTH);
    if (!trimmed) return;

    io.in(roomName(roomId)).emit("video_chat_message", {
      id: randomUUID(),
      senderId: socket.id,
      text: trimmed,
      sentAt: new Date().toISOString(),
    });
  });

  socket.on("leave_video_room", handleLeave);

  socket.on("disconnecting", () => {
    socket.rooms.forEach((name) => {
      if (name.startsWith(ROOM_PREFIX)) {
        handleLeave(name.slice(ROOM_PREFIX.length));
      }
    });
  });
};
