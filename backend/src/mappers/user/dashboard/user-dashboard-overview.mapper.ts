import type { UserDashboardOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-overview.dto";
import type { IUserDashboardOverviewProjection } from "../../../types/user/dashboard/user-dashboard-overview.projection";

export const toUserDashboardOverviewDTO = (
  projection: IUserDashboardOverviewProjection,
): UserDashboardOverviewDTO => ({
  user: {
    fullName: projection.user.fullName,
    profileImage: projection.user.profileImage,
  },

  coaching: {
    activeProgram: projection.coaching.activeProgram
      ? {
          id: projection.coaching.activeProgram.id.toString(),
          title: projection.coaching.activeProgram.title,
          nutritionist: {
            id: projection.coaching.activeProgram.nutritionist.id.toString(),
            fullName: projection.coaching.activeProgram.nutritionist.fullName,
            profileImage:
              projection.coaching.activeProgram.nutritionist.profileImage,
          },
          status: projection.coaching.activeProgram.status,
          currentDay: projection.coaching.activeProgram.currentDay,
          durationDays: projection.coaching.activeProgram.durationDays,
          completionPercentage:
            projection.coaching.activeProgram.completionPercentage,
          startDate: projection.coaching.activeProgram.startDate.toISOString(),
          endDate: projection.coaching.activeProgram.endDate.toISOString(),
        }
      : null,
  },

  summary: {
    activePrograms: projection.summary.activePrograms,
    joinedChallenges: projection.summary.joinedChallenges,
  },
});
