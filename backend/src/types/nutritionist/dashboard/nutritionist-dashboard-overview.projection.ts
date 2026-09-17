export interface INutritionistDashboardOverviewProjection {
  summary: {
    totalClients: number;
    activeClients: number;
    totalPrograms: number;
    activePrograms: number;
    publishedPlans: number;
    totalPlanPurchases: number;
    totalGroups: number;
    publishedResources: number;
  };

  programs: {
    upcoming: number;
    active: number;
    paused: number;
    completed: number;
    cancelled: number;
  };

  groups: {
    total: number;
    totalMembers: number;
  };

  resources: {
    published: number;
    totalViews: number;
    totalDownloads: number;
  };

  recentActivity: INutritionistDashboardActivityProjection[];
}

export interface INutritionistDashboardActivityProjection {
  type:
    | "client_joined"
    | "program_started"
    | "program_completed"
    | "plan_purchased"
    | "group_created"
    | "resource_published";

  title: string;
  createdAt: Date;
}
