"use client";
import { usePathname } from "next/navigation";
import NutritionistSidebar from "@/components/nutritionist/NutritionistSidebar";
import NutritionistHeader from "@/components/nutritionist/NutritionistHeader";

export default function NutritionistLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // paths that belong to (account)
  const isAccountPage = pathname.startsWith("/nutritionist/profile") ||
                        pathname.startsWith("/nutritionist/settings") ||
                        pathname.startsWith("/nutritionist/certifications") ||
                        pathname.startsWith("/nutritionist/availability") ||
                        pathname.startsWith("/nutritionist/consultation");

  return (
    <div className="min-h-screen bg-gray-50">
      <NutritionistHeader />

      <div className="flex">
        {/* Show big sidebar ONLY on dashboard pages */}
        {!isAccountPage && (
          <div className="w-64">
            <NutritionistSidebar />
          </div>
        )}

        <main className={`flex-1 ${isAccountPage ? "p-8" : "p-6"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}
