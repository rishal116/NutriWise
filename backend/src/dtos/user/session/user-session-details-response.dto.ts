export class UserSessionDetailsResponseDTO {
  registrationId!: string;
  sessionId!: string;
  registrationStatus!: string;
  registeredAt!: string;
  cancelledAt!: string | null;
  attendedAt!: string | null;

  session!: {
    nutritionistId: string;
    title: string;
    description: string;
    type: string;
    pricing: {
      type: string;
      amount?: number;
      currency?: string;
    };
    scheduledAt: string;
    durationInMinutes: number;
    maxParticipants: number;
    roomId: string;
    thumbnailUrl?: string;
    status: string;
  };
}
