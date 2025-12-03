import Sidebar from "@/components/nutritionist/NutritionistSidebar";

export default function NutritionistLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Sidebar />
      <div className="ml-64 p-6">{children}</div>
    </div>
  );
}

