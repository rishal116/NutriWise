import React from "react";
import AdminLoginForm from "@/components/auth/AdminLogin";

export const metadata = {
  title: "NutriWise – Admin Login",
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-cyan-50 via-teal-50 to-emerald-50 px-4 py-12 sm:py-16">
      <AdminLoginForm />
    </main>
  );
}