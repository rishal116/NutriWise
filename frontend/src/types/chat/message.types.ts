export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  VIDEO = "video",
  AUDIO = "audio",
  SYSTEM = "system",
}

export type MessageStatus = "active" | "edited" | "deleted";
