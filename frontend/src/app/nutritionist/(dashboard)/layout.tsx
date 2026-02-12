import NutritionistSidebar from "@/components/nutritionist/NutritionistSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-4rem)] sm:min-h-[calc(100vh-5rem)]">
      <NutritionistSidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 lg:ml-72 transition-all duration-300">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}