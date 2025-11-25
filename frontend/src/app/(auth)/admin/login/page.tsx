import React from "react";
import  AdminLoginForm  from "@/components/auth/AdminLogin";

export const metadata = {
  title: "NutriWise - AdminLogin",
};

export default function AdminLoginPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 px-4 py-12 sm:py-16">
      <AdminLoginForm />
    </div>
  );
}
