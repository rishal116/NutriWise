import { adminNotificationService } from "@/services/admin/adminNotification.service";
import NotificationsPage from "@/components/admin/Notification";

export const metadata = {
  title: "NutriWise – Admin Notification",
};

export default async function Page() {
  const initialData = await adminNotificationService.getAllNotifications(1, 2, "");
  
  
  
  return <NotificationsPage initialData={initialData} />;
}
