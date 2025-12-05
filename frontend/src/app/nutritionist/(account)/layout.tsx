import NutritionistProfileSidebar from "@/components/nutritionist/profile/NutritionistProfileSidebar";

export default function NutritionistProfileLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <NutritionistProfileSidebar />
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
