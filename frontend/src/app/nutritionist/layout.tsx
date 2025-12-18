import NutritionistHeader from "@/components/nutritionist/NutritionistHeader";

export default function NutritionistLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-50">
      <NutritionistHeader />
      <div className="pt-10">{children}</div>
    </div>
  );
}