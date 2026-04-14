export interface ProgramResponseDTO {
  id: string;
  user: {
    id: string;
    fullName: string;
    email: string;
  };

  planId: string;
  userPlanId: string;
  nutritionistId: string;

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


export interface CreateProgramDTO {
  userId: string;
  planId: string;
  userPlanId: string;
  nutritionistId:string;

  goal: string;
  focusAreas?: string[];
  dietType?: string;
  activityLevel?: string;

  startDate: Date;
  endDate: Date;
  durationDays: number;

  notes?: string;

  // optional snapshots
  healthProfileSnapshot?: {
    age?: number;
    gender?: string;
    height?: number;
    weight?: number;
    medicalConditions?: string[];
    allergies?: string[];
  };

  planSnapshot?: {
    title?: string;
    price?: number;
    currency?: string;
    durationInDays?: number;
  };
}


export interface ProgramDayResponseDTO {
  id: string;
  userProgramId: string;
  dayNumber: number;

  meals?: {
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    title: string;
    description?: string;
    calories?: number;
  }[];

  workouts?: {
    title: string;
    duration: number;
    instructions?: string;
  }[];

  habits?: {
    title: string;
    targetValue?: number;
    unit?: string;
  }[];

  createdAt: Date;
  updatedAt: Date;
}

export interface CreateProgramDayDTO {
  userProgramId: string;
  dayNumber: number;

  meals?: {
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    title: string;
    description?: string;
    calories?: number;
  }[];

  workouts?: {
    title: string;
    duration: number;
    instructions?: string;
  }[];

  habits?: {
    title: string;
    targetValue?: number;
    unit?: string;
  }[];
}

export interface UpdateProgramDayDTO {
  meals?: {
    mealType: "breakfast" | "lunch" | "dinner" | "snack";
    title: string;
    description?: string;
    calories?: number;
  }[];

  workouts?: {
    title: string;
    duration: number;
    instructions?: string;
  }[];

  habits?: {
    title: string;
    targetValue?: number;
    unit?: string;
  }[];
}