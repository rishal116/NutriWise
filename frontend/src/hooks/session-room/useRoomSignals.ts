import { useCallback, useEffect, useRef, useState } from "react";
import {
  RoomEvent,
  type Participant,
  type RemoteParticipant,
  type Room,
} from "livekit-client";

const CHAT_TOPIC = "session-chat";
const HAND_TOPIC = "session-hand";
const MAX_TEXT_LENGTH = 500;
const MAX_MESSAGES = 200;

export interface ChatMessage {
  id: string;
  senderIdentity: string;
  senderName: string;
  text: string;
  sentAt: number;
  own: boolean;
}

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function parsePayload(payload: Uint8Array): unknown {
  try {
    return JSON.parse(decoder.decode(payload));
  } catch {
    return null;
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function displayName(participant: Participant): string {
  return participant.name || participant.identity;
}

export function useRoomSignals(room: Room | null, canSendData: boolean) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [raisedHands, setRaisedHands] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const localRaisedRef = useRef(false);

  const setHand = useCallback((identity: string, raised: boolean) => {
    setRaisedHands((prev) => {
      if (prev.has(identity) === raised) return prev;
      const next = new Set(prev);
      if (raised) next.add(identity);
      else next.delete(identity);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!room) return;

    const handleData = (
      payload: Uint8Array,
      participant?: RemoteParticipant,
      _kind?: unknown,
      topic?: string,
    ) => {
      if (!participant) return;
      const data = parsePayload(payload);
      if (!isRecord(data)) return;

      if (topic === CHAT_TOPIC) {
        if (typeof data.text !== "string") return;
        const text = data.text.trim().slice(0, MAX_TEXT_LENGTH);
        if (!text) return;
        setMessages((prev) =>
          [
            ...prev,
            {
              id: crypto.randomUUID(),
              senderIdentity: participant.identity,
              senderName: displayName(participant),
              text,
              sentAt: Date.now(),
              own: false,
            },
          ].slice(-MAX_MESSAGES),
        );
      } else if (topic === HAND_TOPIC) {
        if (typeof data.raised !== "boolean") return;
        setHand(participant.identity, data.raised);
      }
    };

    const handleJoined = (participant: RemoteParticipant) => {
      if (!localRaisedRef.current) return;
      void room.localParticipant
        .publishData(encoder.encode(JSON.stringify({ raised: true })), {
          reliable: true,
          topic: HAND_TOPIC,
          destinationIdentities: [participant.identity],
        })
        .catch(() => undefined);
    };

    const handleLeft = (participant: RemoteParticipant) => {
      setHand(participant.identity, false);
    };

    room
      .on(RoomEvent.DataReceived, handleData)
      .on(RoomEvent.ParticipantConnected, handleJoined)
      .on(RoomEvent.ParticipantDisconnected, handleLeft);

    return () => {
      room
        .off(RoomEvent.DataReceived, handleData)
        .off(RoomEvent.ParticipantConnected, handleJoined)
        .off(RoomEvent.ParticipantDisconnected, handleLeft);
    };
  }, [room, setHand]);

  const sendMessage = useCallback(
    async (raw: string): Promise<boolean> => {
      const text = raw.trim().slice(0, MAX_TEXT_LENGTH);
      if (!room || !canSendData || !text) return false;
      try {
        await room.localParticipant.publishData(
          encoder.encode(JSON.stringify({ text })),
          { reliable: true, topic: CHAT_TOPIC },
        );
      } catch (err) {
        console.error("Failed to send chat message:", err);
        return false;
      }
      const me = room.localParticipant;
      setMessages((prev) =>
        [
          ...prev,
          {
            id: crypto.randomUUID(),
            senderIdentity: me.identity,
            senderName: "You",
            text,
            sentAt: Date.now(),
            own: true,
          },
        ].slice(-MAX_MESSAGES),
      );
      return true;
    },
    [room, canSendData],
  );

  const toggleHand = useCallback(async (): Promise<boolean> => {
    if (!room || !canSendData) return false;
    const next = !localRaisedRef.current;
    try {
      await room.localParticipant.publishData(
        encoder.encode(JSON.stringify({ raised: next })),
        { reliable: true, topic: HAND_TOPIC },
      );
    } catch (err) {
      console.error("Failed to update hand state:", err);
      return false;
    }
    localRaisedRef.current = next;
    setHand(room.localParticipant.identity, next);
    return true;
  }, [room, canSendData, setHand]);

  return { messages, raisedHands, sendMessage, toggleHand };
}
