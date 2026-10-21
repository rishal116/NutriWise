import type { Socket } from "socket.io-client";
import { sendOffer } from "@/socket/video.socket";

export const sendNewOffer = async (
  socket: Socket,
  peer: RTCPeerConnection,
  roomId: string,
  iceRestart = false,
): Promise<void> => {
  const offer = await peer.createOffer({ iceRestart });
  await peer.setLocalDescription(offer);
  sendOffer(socket, { roomId, offer });
};

export const flushPendingIce = async (
  peer: RTCPeerConnection,
  queue: RTCIceCandidateInit[],
): Promise<void> => {
  for (const candidate of queue.splice(0)) {
    try {
      await peer.addIceCandidate(candidate);
    } catch {
      // Stale candidate from a previous session; safe to drop.
    }
  }
};