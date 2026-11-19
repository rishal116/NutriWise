
export class PublicHomeSessionDTO {
  id!: string;
  title!: string;
  description?: string;
  type!: string;
  thumbnailUrl?: string;
  scheduledAt!: string;
  durationInMinutes!: number;
  maxParticipants!: number;

  pricing!: {
    type: string;
    amount: number;
    currency: string;
  };

  nutritionist!: {
    fullName: string;
    username: string;
    profileImage?: string;
  };
}
