
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

// SHARED SUBSCRIPTION

const subscribe = <T>(
  socket: Socket,
  event: string,
  callback: (payload: T) => void,
): Unsubscribe => {
  socket.on(event, callback);

  return () => {
    socket.off(event, callback);
  };
};

// NOTIFICATIONS

export const notifyVideoCallConnected = (
  socket: Socket,
  roomId: string,
): void => {
  socket.emit("video_call_connected", roomId);
};

// ROOM

export const joinVideoRoom = (
  socket: Socket,
  roomId: string,
): void => {
  socket.emit("join_video_room", roomId);
};

export const leaveVideoRoom = (
  socket: Socket,
  roomId: string,
): void => {
  socket.emit("leave_video_room", roomId);
};

// SIGNALING

export const sendOffer = (
  socket: Socket,
  payload: OfferPayload,
): void => {
  socket.emit("offer", payload);
};

export const sendAnswer = (
  socket: Socket,
  payload: AnswerPayload,
): void => {
  socket.emit("answer", payload);
};

export const sendIceCandidate = (
  socket: Socket,
  payload: IceCandidatePayload,
): void => {
  socket.emit("ice-candidate", payload);
};

// CHAT

export const sendChatMessage = (
  socket: Socket,
  payload: SendChatPayload,
): void => {
  socket.emit("video_chat_message", payload);
};

// LISTENERS

export const onOffer = (
  socket: Socket,
  callback: (payload: OfferPayload) => void,
): Unsubscribe => subscribe(socket, "offer", callback);

export const onAnswer = (
  socket: Socket,
  callback: (payload: AnswerPayload) => void,
): Unsubscribe => subscribe(socket, "answer", callback);

export const onIceCandidate = (
  socket: Socket,
  callback: (payload: IceCandidatePayload) => void,
): Unsubscribe => subscribe(socket, "ice-candidate", callback);

export const onCallReady = (
  socket: Socket,
  callback: () => void,
): Unsubscribe => subscribe<void>(
  socket,
  "ready_for_call",
  callback,
);

export const onJoinedAsSecond = (
  socket: Socket,
  callback: () => void,
): Unsubscribe => subscribe<void>(
  socket,
  "joined_as_second",
  callback,
);

export const onWaitingForPeer = (
  socket: Socket,
  callback: () => void,
): Unsubscribe => subscribe<void>(
  socket,
  "waiting_for_peer",
  callback,
);

export const onPeerLeft = (
  socket: Socket,
  callback: () => void,
): Unsubscribe => subscribe<void>(
  socket,
  "user_left",
  callback,
);

export const onRoomFull = (
  socket: Socket,
  callback: () => void,
): Unsubscribe => subscribe<void>(
  socket,
  "room_full",
  callback,
);

export const onChatMessage = (
  socket: Socket,
  callback: (payload: ChatMessagePayload) => void,
): Unsubscribe => subscribe(socket, "video_chat_message", callback);
