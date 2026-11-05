import type { Metadata } from "next";
import AdminProfile from "@/components/admin/profile/AdminProfile";

export const metadata: Metadata = {
  title: "Admin Profile | NutriWise",
  description: "Manage your NutriWise administrator profile.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AdminProfilePage() {
  return <AdminProfile />;
}
