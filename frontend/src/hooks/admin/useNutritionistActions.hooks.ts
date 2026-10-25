"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";

import { NutritionistLevel } from "@/enums/admin/nutritionist.enum";
import { adminNutritionistService } from "@/services/admin/admin-nutri.service";
import { adminNutritionistApplicationService } from "@/services/admin/adminNutriApplication.service";
import type { CoachLevel } from "@/types/nutritionist.types";

export function useNutritionistActions(
  userId: string,
  onSuccess: () => Promise<void>,
) {
  const [isUpdatingLevel, setIsUpdatingLevel] = useState(false);
  const [isActionLoading, setIsActionLoading] = useState(false);

  const updateCoachLevel = useCallback(
    async (level: CoachLevel) => {
      setIsUpdatingLevel(true);

      try {
        // TODO: type updateCoachLevel to accept CoachLevel and drop this cast.
        await adminNutritionistService.updateCoachLevel(
          userId,
          level as unknown as NutritionistLevel,
        );
        toast.success(`Coach level updated to ${level.replaceAll("_", " ")}`);
        await onSuccess();
      } catch {
        toast.error("Coach level update failed");
      } finally {
        setIsUpdatingLevel(false);
      }
    },
    [userId, onSuccess],
  );

  const updateApplication = useCallback(
    async (status: "approved" | "rejected", reason?: string) => {
      setIsActionLoading(true);

      try {
        await adminNutritionistApplicationService.updateApplicationStatus(
          userId,
          status,
          reason,
        );
        toast.success(`Application ${status}`);
        await onSuccess();
        return true;
      } catch {
        toast.error(status === "approved" ? "Approval failed" : "Rejection failed");
        return false;
      } finally {
        setIsActionLoading(false);
      }
    },
    [userId, onSuccess],
  );

  const approve = useCallback(
    () => updateApplication("approved"),
    [updateApplication],
  );

  const reject = useCallback(
    (reason: string) => updateApplication("rejected", reason),
    [updateApplication],
  );

  return { isUpdatingLevel, isActionLoading, updateCoachLevel, approve, reject };
}