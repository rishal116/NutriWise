import type {
  IUserDashboardStats,
  IUserDashboardProgramProjection,
  IUserDashboardTodayTrackingProjection,
  IUserDashboardWeeklyProgressProjection,
  IUserDashboardConsultationProjection,
  IUserDashboardPaymentOverviewProjection,
} from "../../../types/user/dashboard/user-dashboard.projection";

import type { UserDashboardOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-overview.dto";
import type { UserDashboardProgramsDTO } from "../../../dtos/user/dashboard/user-dashboard-programs.dto";
import type { UserDashboardTodayTrackingDTO } from "../../../dtos/user/dashboard/user-dashboard-today-tracking.dto";
import type { UserDashboardWeeklyProgressDTO } from "../../../dtos/user/dashboard/user-dashboard-weekly-progress.dto";
import type { UserDashboardConsultationsDTO } from "../../../dtos/user/dashboard/user-dashboard-consultations.dto";
import type { UserDashboardPaymentOverviewDTO } from "../../../dtos/user/dashboard/user-dashboard-payment-overview.dto";

export function toUserDashboardOverviewDTO(
  overview: IUserDashboardStats,
): UserDashboardOverviewDTO {
  return { ...overview };
}

export function toUserDashboardProgramsDTO(
  programs: IUserDashboardProgramProjection[],
): UserDashboardProgramsDTO {
  return programs.map((program) => ({
    ...program,
    nutritionist: { ...program.nutritionist },
    progress: program.progress ? { ...program.progress } : null,
  }));
}

export function toUserDashboardTodayTrackingDTO(
  tracking: IUserDashboardTodayTrackingProjection[],
): UserDashboardTodayTrackingDTO {
  return tracking.map((item) => ({ ...item }));
}

export function toUserDashboardWeeklyProgressDTO(
  progress: IUserDashboardWeeklyProgressProjection,
): UserDashboardWeeklyProgressDTO {
  return {
    ...progress,
    dailyProgress: progress.dailyProgress.map((item) => ({ ...item })),
  };
}

export function toUserDashboardConsultationsDTO(
  consultations: IUserDashboardConsultationProjection[],
): UserDashboardConsultationsDTO {
  return consultations.map((consultation) => ({ ...consultation }));
}

export function toUserDashboardPaymentOverviewDTO(
  overview: IUserDashboardPaymentOverviewProjection,
): UserDashboardPaymentOverviewDTO {
  return {
    ...overview,
    monthlySpending: overview.monthlySpending.map((item) => ({ ...item })),
  };
}
