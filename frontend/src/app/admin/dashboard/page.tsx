import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get("adminRefreshToken");

  if (!adminToken) {
    redirect("/admin/login");
  }

  return <div>Admin Dashboard</div>;
}
