import { Socket } from "socket.io-client";

interface OfferPayload {
  roomId: string;
  offer: RTCSessionDescriptionInit;
}

interface AnswerPayload {
  roomId: string;
  answer: RTCSessionDescriptionInit;
}

interface IceCandidatePayload {
  roomId: string;
  candidate: RTCIceCandidateInit;
}

/* ROOM */

export const joinVideoRoom = (socket: Socket, roomId: string) => {
  socket.emit("join_video_room", roomId);
};

export const leaveVideoRoom = (socket: Socket, roomId: string) => {
  socket.emit("leave_video_room", roomId);
};

/* SIGNALING */

export const sendOffer = (socket: Socket, payload: OfferPayload) => {
  socket.emit("offer", payload);
};

export const sendAnswer = (socket: Socket, payload: AnswerPayload) => {
  socket.emit("answer", payload);
};

export const sendIceCandidate = (socket: Socket, payload: IceCandidatePayload) => {
  socket.emit("ice-candidate", payload);
};

/* LISTENERS */

export const onOffer = (
  socket: Socket,
  callback: (payload: OfferPayload) => void
) => {
  socket.off("offer");
  socket.on("offer", callback);
};

export const onAnswer = (
  socket: Socket,
  callback: (payload: AnswerPayload) => void
) => {
  socket.off("answer");
  socket.on("answer", callback);
};

export const onIceCandidate = (
  socket: Socket,
  callback: (payload: IceCandidatePayload) => void
) => {
  socket.off("ice-candidate");
  socket.on("ice-candidate", callback);
};

export const onCallReady = (socket: Socket, callback: () => void) => {
  socket.off("ready_for_call");
  socket.on("ready_for_call", callback);
};