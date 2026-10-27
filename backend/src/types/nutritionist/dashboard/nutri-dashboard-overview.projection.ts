export interface INutriDashboardOverviewProjection {
  clients: {
    total: number;
    active: number;
  };
  earnings: {
    total: number;
    thisMonth: number;
    currency: string;
  };
  plans: {
    published: number;
    draft: number;
  };
  programs: {
    upcoming: number;
    active: number;
    paused: number;
    completed: number;
    cancelled: number;
  };
  meetings: {
    upcoming: number;
    ongoing: number;
    completed: number;
    cancelled: number;
  };
  sessions: {
    draft: number;
    scheduled: number;
    live: number;
    completed: number;
    cancelled: number;
  };
  reviews: {
    total: number;
    averageRating: number;
  };
  resources: {
    total: number;
    published: number;
    draft: number;
  };
  groups: {
    total: number;
    active: number;
    inactive: number;
  };
}
