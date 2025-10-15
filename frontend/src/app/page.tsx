"use client";

import { usePathname } from "next/navigation";
import AdminLoginForm from "@/app/(auth)/admin/login/page";
import AdminDashboard from '@/app/admin/dashboard/page'
import UserSignup from '@/app/(auth)/user/signup/page'
export default function Home() {
  const pathname = usePathname();

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">NutriWise Frontend</h1>
      {pathname === "/admin/login" && <AdminLoginForm />}
      {pathname === "/admin/dashboard" && <AdminDashboard/>}
      {pathname === "/user/signup" && <UserSignup/>}
    </div>
  );
}
