export interface PublicChallengeCardDTO {
  id: string;
  title: string;
  description: string;
  thumbnailUrl?: string;
  category: string;
  difficulty: string;
  accessType: string;
  durationDays: number;
}