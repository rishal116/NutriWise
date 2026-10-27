import type { NutriDashboardOverviewDTO } from "../../../dtos/nutritionist/dashboard/nutri-dashboard-overview.dto";
import type { INutriDashboardOverviewProjection } from "../../../types/nutritionist/dashboard/nutri-dashboard-overview.projection";

export const toNutriDashboardOverviewDTO = (
  projection: INutriDashboardOverviewProjection,
): NutriDashboardOverviewDTO => ({
  clients: {
    total: projection.clients.total,
    active: projection.clients.active,
  },

  earnings: {
    total: projection.earnings.total,
    thisMonth: projection.earnings.thisMonth,
    currency: projection.earnings.currency,
  },

  plans: {
    published: projection.plans.published,
    draft: projection.plans.draft,
  },

  programs: {
    upcoming: projection.programs.upcoming,
    active: projection.programs.active,
    paused: projection.programs.paused,
    completed: projection.programs.completed,
    cancelled: projection.programs.cancelled,
  },

  meetings: {
    upcoming: projection.meetings.upcoming,
    ongoing: projection.meetings.ongoing,
    completed: projection.meetings.completed,
    cancelled: projection.meetings.cancelled,
  },

  sessions: {
    draft: projection.sessions.draft,
    scheduled: projection.sessions.scheduled,
    live: projection.sessions.live,
    completed: projection.sessions.completed,
    cancelled: projection.sessions.cancelled,
  },

  reviews: {
    total: projection.reviews.total,
    averageRating: projection.reviews.averageRating,
  },

  resources: {
    total: projection.resources.total,
    published: projection.resources.published,
    draft: projection.resources.draft,
  },

  groups: {
    total: projection.groups.total,
    active: projection.groups.active,
    inactive: projection.groups.inactive,
  },
});
