import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nutritionistAuthService } from "@/services/nutritionist/nutritionistAuth.service";

export const useNutritionistStatus = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "approved" | null>(null);

  useEffect(() => {
    const check = async () => {
      const res = await nutritionistAuthService.getProfileStatus();

      if (res.status === "approved") {
        router.replace("/nutritionist/dashboard");
        return;
      }

      if (res.status === "pending") {
        setStatus("pending");
      }
    };

    check();
  }, [router]);

  return status;
};
