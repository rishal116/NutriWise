export interface CreateSessionDTO {
  title: string;
  description?: string;
  type: "free" | "paid";
  price?: number;
  scheduledAt: string;
  durationInMinutes: number;
  maxParticipants?: number;
}

export interface SessionResponseDTO {
  id: string;
  title: string;
  description?: string;
  type: string;
  roomId:string;
  price: number;
  scheduledAt: Date;
  durationInMinutes: number;
  status: string;
  maxParticipants?: number;
  createdAt: Date;
}