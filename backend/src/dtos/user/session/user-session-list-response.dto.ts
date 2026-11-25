export class UserSessionListResponseDTO {
  registrationId!: string;
  sessionId!: string;
  registrationStatus!: string;
  registeredAt!: string;

  session!: {
    title: string;
    type: string;
    pricing: {
      type: string;
      amount?: number;
      currency?: string;
    };
    scheduledAt: string;
    durationInMinutes: number;
    thumbnailUrl?: string;
    status: string;
  };
}
