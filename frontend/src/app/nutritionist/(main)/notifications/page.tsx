import type { Metadata } from "next";
import NotificationPage from "@/components/notification/NotificationPage";

export const metadata: Metadata = {
  title: "Notifications | NutriWise",
  description: "View your NutriWise notifications.",
};

export default function NutritionistNotificationsPage() {
  return <NotificationPage />;
}
