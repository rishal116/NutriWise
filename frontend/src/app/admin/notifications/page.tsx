import type { Metadata } from "next";

import NotificationsPage from "@/components/notification/NotificationPage";

export const metadata: Metadata = {
  title: "Notifications | NutriWise",
  description: "View and manage your latest notifications on NutriWise.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function Page() {
  return <NotificationsPage />;
}