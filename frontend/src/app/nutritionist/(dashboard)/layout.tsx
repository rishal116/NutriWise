import NutritionistSidebar from "@/components/nutritionist/NutritionistSidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-[calc(100vh-80px)]">
      <NutritionistSidebar />
      <main className="flex-1 p-6 ml-0 md:ml-72 transition-all duration-500">
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}