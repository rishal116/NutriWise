export enum MessageType {
  TEXT = "text",
  IMAGE = "image",
  FILE = "file",
  VIDEO = "video",
  SYSTEM = "system",
}

export type MessageStatus = "active" | "edited" | "deleted";