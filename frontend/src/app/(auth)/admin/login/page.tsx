import React from "react";
import AdminLoginForm from "@/components/auth/AdminLogin";

export const metadata = {
  title: "Admin Console | NutriWise – Modern Wellness Management",
  description:
    "Access the NutriWise admin console to manage users, nutritionists, challenges, and system configurations. Secure login for authorized administrators.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-[#f0faf6] px-4 py-12 sm:py-16">

      {/* ── Atmospheric background ── */}
      {/* Large soft blobs */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-32 -left-32 h-[480px] w-[480px] rounded-full bg-emerald-200/40 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-32 -right-32 h-[480px] w-[480px] rounded-full bg-teal-200/40 blur-[120px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[320px] w-[320px] rounded-full bg-cyan-100/60 blur-[80px]"
      />

      {/* Subtle dot-grid texture */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage:
            "radial-gradient(circle, #10b98120 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />

      {/* Corner geometric accents */}
      <svg
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 w-48 h-48 text-emerald-300/30"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="0" cy="0" r="80" stroke="currentColor" strokeWidth="1" />
        <circle cx="0" cy="0" r="120" stroke="currentColor" strokeWidth="0.5" />
      </svg>
      <svg
        aria-hidden
        className="pointer-events-none absolute bottom-0 right-0 w-48 h-48 text-teal-300/30"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="200" cy="200" r="80" stroke="currentColor" strokeWidth="1" />
        <circle cx="200" cy="200" r="120" stroke="currentColor" strokeWidth="0.5" />
      </svg>

      {/* ── Form card ── */}
      <div className="relative z-10 w-full max-w-md">
        <AdminLoginForm />
      </div>
    </main>
  );
}