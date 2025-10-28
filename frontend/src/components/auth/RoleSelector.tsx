"use client";
import { useState } from "react";
import RoleCard from "@/components/ui/RoleCards";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { userAuthService } from "@/services/user/user.service";
import { string } from "zod";

export default function RoleSelector() {
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const router = useRouter();
  const { email } = useSelector((state: RootState) => state.auth);

   const handleContinue = async () => {
    if (!selectedRole) return alert("Please select a role!");
    if (!email) return alert("Email not found. Please log in again.");

    try {
      // ✅ Send role and email to backend
      await userAuthService.selectRole({ email, role: selectedRole });
      // ✅ Redirect based on role
      if (selectedRole === "user") router.push("/home");
      else router.push("/nutritionist/home");
    } catch (error: any) {
      console.error("Error selecting role:", error);
      alert(error?.response?.data?.message || "Failed to select role");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-green-100">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Choose Your Role</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-10">
        <RoleCard
          title="Continue as Member"
          image="/images/member.svg"
          selected={selectedRole === "user"}
          onSelect={() => setSelectedRole("user")}
        />
        <RoleCard
          title="Continue as Nutritionist"
          image="/images/nutritionist.svg"
          selected={selectedRole === "nutritionist"}
          onSelect={() => setSelectedRole("nutritionist")}
        />
      </div>

      <button
        onClick={handleContinue}
        className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-full text-lg shadow-md transition-all"
      >
        Continue
      </button>
    </div>
  );
}
