import { Metadata } from "next";
import AdminChallengeDetails from "@/components/admin/AdminChallengeDetails";
interface PageProps {
  params: Promise<{ id: string }>;
}
export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  return {
    title: `Challenge Details | Admin Dashboard`,
    description: `View and manage challenge ${id} in NutriWise admin dashboard.`,
    robots: { index: false, follow: false },
  };
}
export default async function ChallengeDetailsPage({ params }: PageProps) {
  const { id } = await params;
  return <AdminChallengeDetails id={id} />;
}
