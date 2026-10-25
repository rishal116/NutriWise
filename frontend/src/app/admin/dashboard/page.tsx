import type { Metadata } from "next";
import AdminDashboard from "@/components/admin/dashboard/AdminDashboard";

export const metadata: Metadata = {
  title: "Admin Dashboard | NutriWise",
  robots: { index: false, follow: false },
};

export default function AdminDashboardPage() {
  return <AdminDashboard />;
}
