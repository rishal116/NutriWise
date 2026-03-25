export interface ProgramResponseDTO {
  id: string;
  userId:string;

  planId: string;
  userPlanId: string;
  nutritionist: {
    id:string;
    fullName:string;
    email:string
  },
  goal: string;
  focusAreas?: string[];
  dietType?: string;
  activityLevel?: string;

  startDate: Date;
  endDate: Date;
  durationDays: number;
  currentDay: number;
  completionPercentage: number;
  status: string;

  planSnapshot?: {
    title?: string;
    price?: number;
    currency?: string;
    durationInDays?: number;
  };

  notes?: string;

  createdAt: Date;
  updatedAt: Date;
}


export interface ProgramDayResponseDTO {
  id: string;
  userProgramId: string;
  dayNumber: number;

  meals?: {
    _id: string;
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    title: string;
    description?: string;
    calories?: number;
  }[];

  workouts?: {
    _id: string;
    title: string;
    duration: number;
    instructions?: string;
  }[];

  habits?: {
    _id: string;
    title: string;
    targetValue?: number;
    unit?: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}