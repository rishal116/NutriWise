import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Practitioner Details | NutriWise Admin",
  description: "View and manage professional nutritionist applications and profiles on the NutriWise platform.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function NutritionistDetailsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
