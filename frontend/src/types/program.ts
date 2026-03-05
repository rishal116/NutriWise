export interface ProgramResponseDTO {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };
    planSnapshot?: {
    title?: string;
    price?: number;
    currency?: string;
    durationInDays?: number;
  };
  goal: string;
  dietType?: string;
  activityLevel?: string;
  startDate: Date;
  endDate: Date;
  completionPercentage: number;
  status: string;
}