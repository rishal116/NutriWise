import UserTable from "@/components/admin/UserTable";
import { adminUserService } from "@/services/admin/Adminuser.service";

export const metadata = {
  title: "Admin – NutriWise User List",
  description: "Manage all users of NutriWise",
};

export default async function UsersPage() {
  const response = await adminUserService.getAllUsers(1, 5);
  console.log(response);

  return (
    <div className="ml-72 mt-24 p-8 min-h-screen bg-gray-50">
      <UserTable initialData={response} />
    </div>
  );
}
