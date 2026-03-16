import { Server, Socket } from "socket.io";

export const registerVideoSocket = (io: Server, socket: Socket) => {

  socket.on("join_video_room", (conversationId: string) => {

    const roomId = `video:${conversationId}`;
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

  });

  socket.on(
    "offer",
    ({ conversationId, offer }: { conversationId: string; offer: any }) => {

      const roomId = `video:${conversationId}`;

      socket.to(roomId).emit("offer", { offer });

    }
  );

  socket.on(
    "answer",
    ({ conversationId, answer }: { conversationId: string; answer: any }) => {

      const roomId = `video:${conversationId}`;

      socket.to(roomId).emit("answer", { answer });

    }
  );

  socket.on(
    "ice-candidate",
    ({ conversationId, candidate }: { conversationId: string; candidate: any }) => {

      const roomId = `video:${conversationId}`;

      socket.to(roomId).emit("ice-candidate", { candidate });

    }
  );

  socket.on("leave_video_room", (conversationId: string) => {

    const roomId = `video:${conversationId}`;

    socket.leave(roomId);

    socket.to(roomId).emit("user_left");

  });

  socket.on("disconnecting", () => {

    socket.rooms.forEach((roomId) => {

      if (roomId.startsWith("video:")) {
        socket.to(roomId).emit("user_left");
      }

    });

  });

};