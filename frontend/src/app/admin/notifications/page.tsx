import { adminNotificationService } from "@/services/admin/adminNotification.service";
import NotificationsPage from "@/components/admin/Notification";

export const metadata = {
  title: "NutriWise – Admin Notification",
};

export default async function Page() {
  const initialData = await adminNotificationService.getAllNotifications(1, 10, "");
  console.log("data: ",initialData);
  
  return <NotificationsPage initialData={initialData} />;
}
