export type NutriDashboardActivityType =
  | "plan_purchase"
  | "program_joined"
  | "program_completed"
  | "meeting_booked"
  | "meeting_cancelled"
  | "session_scheduled"
  | "session_completed"
  | "review_received"
  | "plan_published"
  | "resource_published";

export interface INutriDashboardRecentActivityItemProjection {
  id: string;
  type: NutriDashboardActivityType;
  title: string;
  description: string;
  createdAt: Date;
  actor?: {
    id: string;
    name: string;
    avatar?: string;
  };
  resource?: {
    id: string;
    name: string;
    href: string;
  };
}
