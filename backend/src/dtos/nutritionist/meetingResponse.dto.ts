export interface MeetingResponseDTO {
  id: string;
  title: string;
  roomId: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
  nutritionistId: string;
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
