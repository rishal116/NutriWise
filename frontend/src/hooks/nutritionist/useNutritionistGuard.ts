"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { userAuthService } from "@/services/user/userAuth.service";

export const useNutritionistGuard = () => {
  const router = useRouter();

  useEffect(() => {
    let mounted = true;

    const checkAccess = async () => {
      try {
        const res = await userAuthService.getMe();

        if (!mounted) return;

        if (!res.success || !res.user) {
          router.replace("/login");
          return;
        }

        const user = res.user;

        if (!user.roles?.includes("nutritionist")) {
          router.replace("/unauthorized");
          return;
        }

        switch (user.nutritionistStatus) {
          case "approved":
            return;

          case "pending":
            router.replace("/nutritionist/pending");
            return;

          case "rejected":
            router.replace("/nutritionist/reapply");
            return;

          default:
            router.replace("/nutritionist/details");
            return;
        }
      } catch {
        if (mounted) {
          router.replace("/login");
        }
      }
    };

    checkAccess();

    return () => {
      mounted = false;
    };
  }, [router]);
};