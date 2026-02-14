export interface UserMeetingResponseDTO {
  id: string;
  title: string;
  roomId: string;
  userId: string;
  nutritionist: {
    id: string;
    fullName: string;
    email: string;
  };
  scheduledAt: Date;
  startedAt?: Date;
  endedAt?: Date;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}
