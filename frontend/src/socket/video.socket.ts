import type { Socket } from "socket.io-client";

export interface OfferPayload {
  roomId: string;
  offer: RTCSessionDescriptionInit;
}

export interface AnswerPayload {
  roomId: string;
  answer: RTCSessionDescriptionInit;
}

export interface IceCandidatePayload {
  roomId: string;
  candidate: RTCIceCandidateInit;
}

export interface SendChatPayload {
  roomId: string;
  text: string;
}

export interface ChatMessagePayload {
  id: string;
  senderId: string;
  text: string;
  sentAt: string;
}

export type Unsubscribe = () => void;


export const notifyVideoCallConnected = (
  socket: Socket,
  roomId: string,
): void => {
  socket.emit("video_call_connected", roomId);
};

const subscribe = <T>(
  socket: Socket,
  event: string,
  handler: (payload: T) => void,
): Unsubscribe => {
  socket.on(event, handler);
  return () => {
    socket.off(event, handler);
  };
};

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

export const sendIceCandidate = (
  socket: Socket,
  payload: IceCandidatePayload,
) => {
  socket.emit("ice-candidate", payload);
};

/* CHAT */

export const sendChatMessage = (socket: Socket, payload: SendChatPayload) => {
  socket.emit("video_chat_message", payload);
};

/* LISTENERS */

export const onOffer = (socket: Socket, cb: (p: OfferPayload) => void) =>
  subscribe(socket, "offer", cb);

export const onAnswer = (socket: Socket, cb: (p: AnswerPayload) => void) =>
  subscribe(socket, "answer", cb);

export const onIceCandidate = (
  socket: Socket,
  cb: (p: IceCandidatePayload) => void,
) => subscribe(socket, "ice-candidate", cb);

export const onCallReady = (socket: Socket, cb: () => void) =>
  subscribe<void>(socket, "ready_for_call", cb);

export const onJoinedAsSecond = (socket: Socket, cb: () => void) =>
  subscribe<void>(socket, "joined_as_second", cb);

export const onWaitingForPeer = (socket: Socket, cb: () => void) =>
  subscribe<void>(socket, "waiting_for_peer", cb);

export const onPeerLeft = (socket: Socket, cb: () => void) =>
  
  subscribe<void>(socket, "user_left", cb);

export const onRoomFull = (socket: Socket, cb: () => void) =>
  subscribe<void>(socket, "room_full", cb);

export const onChatMessage = (
  socket: Socket,
  cb: (p: ChatMessagePayload) => void,
) => subscribe(socket, "video_chat_message", cb);
