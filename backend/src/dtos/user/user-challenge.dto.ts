export interface UserChallengeDTO {
    id: string;
    userId: string;
    challengeId: string;

    startDate: string;
    endDate?: string | null;

    currentDay: number;

    completedDays: number[];

    streak: number;
    longestStreak: number;

    status: "active" | "completed" | "failed" | "paused";

    completionPercentage: number;

    joinedAt: string;
    lastActivityAt?: string | null;

    totalTasksCompleted: number;
    totalTasksSkipped: number;

    remindersEnabled: boolean;

    notes?: string | null;

    createdAt: string;
    updatedAt: string;
}