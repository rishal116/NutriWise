"use client";

import { X } from "lucide-react";

import ProgramHealthForm from "./ProgramHealthForm";

import type { ProgramHealthResponseDTO } from "@/dtos/user/program-health/program-health-response.dto";

interface ProgramHealthFormDialogProps {
  programId: string;
  initialData?: ProgramHealthResponseDTO | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProgramHealthFormDialog({
  programId,
  initialData,
  onClose,
  onSuccess,
}: ProgramHealthFormDialogProps) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-950/50 p-3 backdrop-blur-sm sm:p-6"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="program-health-title"
        className="flex max-h-[92vh] w-full max-w-3xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl"
      >
        <div className="flex items-start justify-between border-b border-gray-100 px-5 py-4 sm:px-7">
          <div>
            <h2
              id="program-health-title"
              className="text-lg font-bold text-gray-900"
            >
              {initialData ? "Update health details" : "Complete health details"}
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Help your nutritionist personalize your program.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close dialog"
            className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        <div className="overflow-y-auto px-5 py-6 sm:px-7">
          <ProgramHealthForm
            programId={programId}
            initialData={initialData}
            onCancel={onClose}
            onSuccess={onSuccess}
          />
        </div>
      </div>
    </div>
  );
}