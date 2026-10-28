export interface AdminDashboardSummary {
  totalUsers: number;
  newUsers: number;
  blockedUsers: number;
  deletedUsers: number;
  unverifiedUsers: number;
  totalNutritionists: number;
  pendingNutritionistApplications: number;
  totalPurchases: number;
  totalRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  commissionEarned: number;
}

export interface AdminDashboardNutritionistStats {
  approved: number;
  pending: number;
  rejected: number;
  blocked: number;
}

export interface AdminDashboardChallengeStats {
  total: number;
  published: number;
  draft: number;
  archived: number;
}

export interface AdminDashboardCoachingStats {
  publishedPlans: number;
  purchases: number;
  activePrograms: number;
  upcomingPrograms: number;
  pausedPrograms: number;
  completedPrograms: number;
  cancelledPrograms: number;
}

export interface AdminDashboardTrend {
  date: string;
  value: number;
}

export interface AdminDashboardTrends {
  users: AdminDashboardTrend[];
  revenue: AdminDashboardTrend[];
  nutritionists: AdminDashboardTrend[];
}

export interface AdminDashboardAttentionItem {
  type: "nutritionist_application" | "challenge" | "user" | "payment";
  title: string;
  count: number;
  action: string;
}

export interface AdminDashboardActivityItem {
  type:
    | "user_registered"
    | "nutritionist_application"
    | "nutritionist_approved"
    | "challenge_published"
    | "purchase_completed";
  title: string;
  createdAt: Date;
}

export interface AdminDashboardOverview {
  summary: AdminDashboardSummary;
  nutritionists: AdminDashboardNutritionistStats;
  challenges: AdminDashboardChallengeStats;
  coaching: AdminDashboardCoachingStats;
  trends: AdminDashboardTrends;
  attention: AdminDashboardAttentionItem[];
  recentActivity: AdminDashboardActivityItem[];
}

export interface AdminDashboardRegistrationTrend {
  date: string;
  count: number;
}

export interface AdminDashboardRevenueTrend {
  date: string;
  grossRevenue: number;
  refundedAmount: number;
  netRevenue: number;
  commissionEarned: number;
  paymentCount: number;
}

export interface AdminDashboardRecentUser {
  id: string;
  fullName: string;
  username: string;
  email: string;
  createdAt: Date;
  isBlocked: boolean;
}

export interface AdminDashboardPendingNutritionist {
  id: string;
  userId: string;
  fullName: string;
  email: string;
  applicationStatus: "pending";
  createdAt: Date;
}

export interface AdminDashboardRecentPayment {
  id: string;
  userId: string;
  customerName: string;
  amount: number;
  currency: string;
  status: "pending" | "paid" | "failed" | "refunded";
  createdAt: Date;
}
