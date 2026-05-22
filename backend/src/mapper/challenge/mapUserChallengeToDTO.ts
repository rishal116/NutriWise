import { IUserChallenge } from "../../models/userChallenge.model";
import { UserChallengeDTO } from "../../dtos/user/user-challenge.dto";

export function mapUserChallengeToDTO(
    doc: IUserChallenge,
): UserChallengeDTO {
    return {
        id: doc._id.toString(),

        userId: doc.userId.toString(),
        challengeId: doc.challengeId.toString(),

        startDate: doc.startDate.toISOString(),
        endDate: doc.endDate ? doc.endDate.toISOString() : null,

        currentDay: doc.currentDay,

        completedDays: doc.completedDays ?? [],

        streak: doc.streak,
        longestStreak: doc.longestStreak,

        status: doc.status,

        completionPercentage: doc.completionPercentage,

        joinedAt: doc.joinedAt.toISOString(),
        lastActivityAt: doc.lastActivityAt
            ? doc.lastActivityAt.toISOString()
            : null,

        totalTasksCompleted: doc.totalTasksCompleted,
        totalTasksSkipped: doc.totalTasksSkipped,

        notes: doc.notes ?? null,

        remindersEnabled: doc.remindersEnabled,


        createdAt: doc.createdAt.toISOString(),
        updatedAt: doc.updatedAt.toISOString(),
    };
}