import { Socket } from "socket.io-client";

export const joinVideoRoom = (socket: Socket, conversationId: string) => {
  socket.emit("join_video_room", conversationId);
};

export const leaveVideoRoom = (socket: Socket, conversationId: string) => {
  socket.emit("leave_video_room", conversationId);
};

export const sendOffer = (socket: Socket, conversationId: string, offer: any) => {
  socket.emit("offer", { conversationId, offer });
};

export const sendAnswer = (socket: Socket, conversationId: string, answer: any) => {
  socket.emit("answer", { conversationId, answer });
};

export const sendIceCandidate = (
  socket: Socket,
  conversationId: string,
  candidate: any
) => {
  socket.emit("ice-candidate", { conversationId, candidate });
};

export const onOffer = (socket: Socket, callback: any) => {
  socket.on("offer", callback);
};

export const onAnswer = (socket: Socket, callback: any) => {
  socket.on("answer", callback);
};

export const onIceCandidate = (socket: Socket, callback: any) => {
  socket.on("ice-candidate", callback);
};

export const onCallReady = (socket: Socket, callback: any) => {
  socket.on("ready_for_call", callback);
};