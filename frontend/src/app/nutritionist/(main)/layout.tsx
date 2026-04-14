import NutritionistHeader from "@/components/nutritionist/NutritionistHeader";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-emerald-50/30">
      <NutritionistHeader />
      {children}
    </div>
  );
}