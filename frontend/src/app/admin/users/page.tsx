"use client";

import { useState, useEffect } from "react";
import UserTable from "@/components/admin/UserTable";
import { adminUserService } from "@/services/admin/adminUser.service";

export default function UsersPage() {
  const [users, setUsers] = useState(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await adminUserService.getAllUsers(1, 5);
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchUsers(); // ✅ only called once
  }, []); // empty dependency array prevents loop

  return (
    <div className="min-h-screen bg-gray-950 px-4 py-8">
      {users && <UserTable initialData={users} />}
    </div>
  );
}
