import { Server, Socket } from "socket.io";
import { MeetingStatus } from "../../models/meeting.model"; // adjust path
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { INutriMeetingsService } from "../../services/interfaces/nutritionist/INutriMeetingsService";

export const registerVideoSocket = (io: Server, socket: Socket) => {
  const meetingService = container.get<INutriMeetingsService>(TYPES.INutriMeetingsService);
  
  const handleLeave = async (roomId: string) => {
    const socketRoomId = `video:${roomId}`;
    socket.leave(socketRoomId);
    socket.to(socketRoomId).emit("user_left");
    const room = io.sockets.adapter.rooms.get(socketRoomId);
    const size = room ? room.size : 0;
    console.log(`Room ${socketRoomId} size:`, size);
    if (size === 0) {
      try {
        await meetingService.updateMeetingStatus(
          roomId,
          MeetingStatus.COMPLETED
        );
        console.log("Meeting marked as COMPLETED");
      } catch (err) {
        console.error("Error updating meeting:", err);
      }
    }
  };
  
  socket.on("join_video_room", (roomId: string) => {
    const socketRoomId  = `video:${roomId}`;
    const room = io.sockets.adapter.rooms.get(socketRoomId);
    const size = room ? room.size : 0;
    if (size >= 2) {
      socket.emit("room_full");
      return;
    }
    socket.join(socketRoomId);
    if (size === 0) socket.emit("waiting_for_peer");
    if (size === 1) {
      socket.emit("joined_as_second");
      socket.to(socketRoomId).emit("ready_for_call");
    }
  });
  
  socket.on("offer", ({ roomId, offer }) => {
    socket.to(`video:${roomId}`).emit("offer", { roomId, offer });
  });
  
  socket.on("answer", ({ roomId, answer }) => {
    socket.to(`video:${roomId}`).emit("answer", { roomId, answer });
  });
  
  socket.on("ice-candidate", ({ roomId, candidate }) => {
    socket.to(`video:${roomId}`).emit("ice-candidate", { roomId, candidate });
  });
  
  socket.on("leave_video_room", handleLeave);

  socket.on("disconnecting", () => {
    socket.rooms.forEach((socketRoomId) => {
      if (socketRoomId.startsWith("video:")) {
        const roomId = socketRoomId.replace("video:", "");
        handleLeave(roomId);
      }
    });
  });

};