import UserTable from "@/components/admin/UserTable";
import { adminUserService } from "@/services/admin/Adminuser.service";

export const metadata = {
  title: "Admin – NutriWise User List",
  description: "Manage all users of NutriWise",
};

export default async function UsersPage() {
  const response = await adminUserService.getAllUsers(1, 5);

return (
<div className="min-h-screen bg-gray-50 mt-[90px] px-4">
  <UserTable initialData={response} />
</div>
);

}
