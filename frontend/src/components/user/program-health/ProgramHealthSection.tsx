"use client";

import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ClipboardList } from "lucide-react";
import { toast } from "sonner";

import { userProgramHealthService } from "@/services/user/program-health.service";
import type { ProgramHealthResponseDTO } from "@/dtos/user/program-health/program-health-response.dto";

import ProgramHealthSummary from "./ProgramHealthSummary";

const ProgramHealthFormDialog = dynamic(
  () => import("./ProgramHealthFormDialog"),
  {
    loading: () => (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/40">
        <div className="rounded-xl bg-white px-5 py-3 text-sm text-gray-600 shadow-lg">
          Loading form...
        </div>
      </div>
    ),
  },
);

interface ProgramHealthSectionProps {
  programId: string;
}

export default function ProgramHealthSection({
  programId,
}: ProgramHealthSectionProps) {
  const [health, setHealth] = useState<ProgramHealthResponseDTO | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const fetchHealth = useCallback(async () => {
    try {
      setIsLoading(true);

      const response =
        await userProgramHealthService.getProgramHealth(programId);

      setHealth(response.data ?? null);
    } catch {
      toast.error("Unable to load program health information.");
    } finally {
      setIsLoading(false);
    }
  }, [programId]);

  useEffect(() => {
    void fetchHealth();
  }, [fetchHealth]);

  const handleSuccess = async () => {
    setIsDialogOpen(false);
    toast.success("Program health information saved successfully.");
    await fetchHealth();
  };

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-gray-900">
          Program health information
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Your health information helps your nutritionist personalize your
          coaching program.
        </p>
      </div>

      {isLoading ? (
        <div className="animate-pulse rounded-2xl border border-gray-200 bg-white p-6">
          <div className="h-5 w-48 rounded bg-gray-200" />
          <div className="mt-4 h-4 w-full max-w-md rounded bg-gray-100" />
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="h-20 rounded-xl bg-gray-100" />
            <div className="h-20 rounded-xl bg-gray-100" />
          </div>
        </div>
      ) : health ? (
        <ProgramHealthSummary
          data={health}
          onEdit={() => setIsDialogOpen(true)}
        />
      ) : (
        <div className="rounded-2xl border border-dashed border-gray-300 bg-white px-5 py-8 text-center sm:px-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
            <ClipboardList size={23} />
          </div>

          <h3 className="mt-4 font-semibold text-gray-900">
            Complete your health information
          </h3>

          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
            Share your measurements, activity level, dietary preferences, and
            other health information with your nutritionist.
          </p>

          <button
            type="button"
            onClick={() => setIsDialogOpen(true)}
            className="mt-5 rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700"
          >
            Complete health details
          </button>
        </div>
      )}

      {isDialogOpen && (
        <ProgramHealthFormDialog
          programId={programId}
          initialData={health}
          onClose={() => setIsDialogOpen(false)}
          onSuccess={handleSuccess}
        />
      )}
    </section>
  );
}
