export interface AdminDashboardTrendDTO {
  date: string;
  value: number;
}

export interface AdminDashboardAttentionDTO {
  type: "nutritionist_application" | "challenge" | "user" | "payment";
  title: string;
  count: number;
  action: string;
}

export interface AdminDashboardActivityDTO {
  type:
    | "user_registered"
    | "nutritionist_application"
    | "nutritionist_approved"
    | "challenge_published"
    | "purchase_completed";
  title: string;
  createdAt: string;
}

export interface AdminDashboardOverviewDTO {
  summary: {
    totalUsers: number;
    totalNutritionists: number;
    pendingNutritionistApplications: number;
    totalPurchases: number;
    totalRevenue: number;
  };

  nutritionists: {
    approved: number;
    pending: number;
    rejected: number;
    blocked: number;
  };

  challenges: {
    total: number;
    published: number;
    draft: number;
    archived: number;
  };

  coaching: {
    publishedPlans: number;
    purchases: number;
    activePrograms: number;
  };

  trends: {
    users: AdminDashboardTrendDTO[];
    revenue: AdminDashboardTrendDTO[];
    nutritionists: AdminDashboardTrendDTO[];
  };

  attention: AdminDashboardAttentionDTO[];

  recentActivity: AdminDashboardActivityDTO[];
}
