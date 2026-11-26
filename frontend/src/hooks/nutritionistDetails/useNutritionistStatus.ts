import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { nutritionistApplicationService } from "@/services/nutritionist/nutriApplication.service";

export const useNutritionistStatus = () => {
  const router = useRouter();
  const [status, setStatus] = useState<"pending" | "approved" | null>(null);

  useEffect(() => {
    const check = async () => {
      const res = await nutritionistApplicationService.getApplicationStatus();

      if (res.data === "approved") {
        router.replace("/nutritionist/dashboard");
        return;
      }

      if (res.data === "pending") {
        setStatus("pending");
      }
    };

    check();
  }, [router]);

  return status;
};
