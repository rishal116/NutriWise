export interface IAdminDashboardOverviewProjection {
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
    users: Array<{
      date: string;
      value: number;
    }>;
    revenue: Array<{
      date: string;
      value: number;
    }>;
    nutritionists: Array<{
      date: string;
      value: number;
    }>;
  };

  attention: Array<{
    type: "nutritionist_application" | "challenge" | "user" | "payment";
    title: string;
    count: number;
    action: string;
  }>;

  recentActivity: Array<{
    type:
      | "user_registered"
      | "nutritionist_application"
      | "nutritionist_approved"
      | "challenge_published"
      | "purchase_completed";
    title: string;
    createdAt: Date;
  }>;
}
