import NutritionistProfileSidebar from "@/components/nutritionist/profile/NutritionistProfileSidebar";

export default function NutritionistProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar */}
      <NutritionistProfileSidebar />

      {/* Main Content */}
      <main className="pt-10 pl-72">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
