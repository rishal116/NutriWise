"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/admin/UserTable";
import { adminUserService } from "@/services/admin/adminUser.service";
import Loading from "@/app/admin/loading";

interface UserDTO {
  id: string;
  fullName: string;
  email: string;
  role: string;
  isBlocked: boolean;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  total: number;
}
export default function UsersPage() {
  const [users, setUsers] = useState<PaginatedResponse<UserDTO> | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await adminUserService.getAllUsers(1, 10);

        console.log("API RESPONSE:", res);

        setUsers(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUsers();
  }, []);

  if (isLoading) return <Loading />;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
        <p className="text-sm text-slate-500 font-medium">
          View and manage NutriWise community members.
        </p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {users && <UserTable initialData={users} />}
      </div>
    </div>
  );
}
