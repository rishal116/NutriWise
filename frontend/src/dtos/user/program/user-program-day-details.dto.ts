import {
  ActivityValueType,
  ProgramActivityCategory,
  UserActivityTrackingStatus,
  UserDayTrackingStatus,
} from "@/types/user/program/user-program-day.types";

export interface UserProgramDayActivityResponseDTO {
  _id: string;

  category: ProgramActivityCategory;
  title: string;
  description?: string;
  instructions?: string;

  valueType: ActivityValueType;
  targetValue?: number;
  unit?: string;
  estimatedDurationMinutes?: number;
  scheduledTime?: string;

  isRequired: boolean;
  order: number;

  tracking: {
    status: UserActivityTrackingStatus;

    recordedValue?: number;
    actualDurationMinutes?: number;
    score?: number;

    evidence: string[];

    skippedReason?: string;
    notes?: string;
    nutritionistFeedback?: string;

    startedAt: string | null;
    completedAt: string | null;
  };
}

export interface UserProgramDayDetailsResponseDTO {
  _id: string;
  dayNumber: number;

  tracking: {
    _id: string;
    date: string;

    status: UserDayTrackingStatus;
    isLocked: boolean;

    totalActivities: number;
    completedActivities: number;
    skippedActivities: number;

    overallCompletionPercentage: number;
    adherenceScore: number;

    startedAt: string | null;
    completedAt: string | null;
    lastActivityAt: string | null;

    userNotes?: string;
    nutritionistNotes?: string;
  };

  activities: UserProgramDayActivityResponseDTO[];
}