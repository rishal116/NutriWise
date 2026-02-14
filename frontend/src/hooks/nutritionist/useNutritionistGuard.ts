"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuthService } from "@/services/user/userAuth.service";

export const useNutritionistGuard = () => {
  const router = useRouter();

  useEffect(() => {
    const checkAccess = async () => {
      try {
        const { user } = await userAuthService.getMe();

        if (user.role !== "nutritionist") {
          router.replace("/unauthorized");
          return;
        }

        switch (user.nutritionistStatus) {
          case "approved":
            return; // allow page
          case "pending":
          case "not_submitted":
            router.replace("/nutritionist/details");
            break;
          case "rejected":
            router.replace("/nutritionist/repply");
            break;
          default:
            router.replace("/nutritionist/details");
        }
      } catch {
        router.replace("/login");
      }
    };

    checkAccess();
  }, [router]);
};
