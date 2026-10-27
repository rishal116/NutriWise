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

export interface NutriDashboardActivityActorDTO {
  id: string;
  name: string;
  avatar?: string;
}

export interface NutriDashboardActivityResourceDTO {
  id: string;
  name: string;
  href: string;
}

export interface NutriDashboardRecentActivityItemDTO {
  id: string;
  type: NutriDashboardActivityType;
  title: string;
  description: string;
  createdAt: string;
  actor?: NutriDashboardActivityActorDTO;
  resource?: NutriDashboardActivityResourceDTO;
}