"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

import Logo from "@/components/common/Logo";
import { onboardingService } from "@/services/user/onboarding.service";
import { getErrorMessage } from "@/utils/getErrorMessage";
import { completeProfileSchema } from "@/validations/onboarding.validation";

import PersonalDetailsSection from "./PersonalDetailsSection";
import BodyMetricsSection from "./BodyMetricsSection";
import LifestyleSection from "./LifestyleSection";
import GoalsSection from "./GoalsSection";
import type {
  FormErrors,
  FormFields,
} from "@/types/auth/complete-profile/complete-profile.types";

const initialForm: FormFields = {
  gender: "",
  birthDate: "",
  heightCm: "",
  weightKg: "",
  activityLevel: "moderately_active",
  dietType: "veg",
  goal: "lifestyle_general",
  targetWeightKg: "",
  preferredTimeline: "12_weeks",
};

const numericFields = new Set<keyof FormFields>([
  "heightCm",
  "weightKg",
  "targetWeightKg",
]);

function parseNumber(value: string): number {
  return value.trim() === "" ? Number.NaN : Number(value);
}

function toPayload(form: FormFields) {
  return {
    ...form,
    heightCm: parseNumber(form.heightCm),
    weightKg: parseNumber(form.weightKg),
    targetWeightKg:
      form.targetWeightKg.trim() === ""
        ? undefined
        : parseNumber(form.targetWeightKg),
    preferredTimeline: form.preferredTimeline || undefined,
  };
}

export default function CompleteProfileForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormFields>(initialForm);
  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validateField = (name: keyof FormFields, nextForm: FormFields) => {
    const result = completeProfileSchema.safeParse(toPayload(nextForm));
    const issue = result.success
      ? undefined
      : result.error.issues.find((item) => item.path[0] === name);

    setErrors((previous) => ({
      ...previous,
      [name]: issue?.message ?? "",
    }));
  };

  const handleChange = (
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;
    const field = name as keyof FormFields;
    const nextForm = { ...form, [field]: value };

    setForm(nextForm);

    if (submitted || errors[field]) {
      validateField(field, nextForm);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);

    const payload = toPayload(form);

    const validation = completeProfileSchema.safeParse(payload);

    if (!validation.success) {
      const nextErrors: FormErrors = {};

      for (const issue of validation.error.issues) {
        const field = issue.path[0];

        if (
          typeof field === "string" &&
          field in form &&
          !nextErrors[field as keyof FormFields]
        ) {
          nextErrors[field as keyof FormFields] = issue.message;
        }
      }

      setErrors(nextErrors);
      toast.error("Please correct the highlighted fields.");
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await onboardingService.completeProfile(validation.data);
      toast.success(response.message || "Profile completed!");
      router.push("/");
    } catch (error: unknown) {
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-emerald-50/60 px-4 py-10 sm:py-14">
      <div className="w-full max-w-2xl">
        <div className="rounded-2xl border border-emerald-100 bg-white p-6 shadow-xl shadow-emerald-900/10 sm:p-8 lg:p-10">
          <div className="mb-8 flex flex-col items-center text-center">
            <Logo size="large" linkable={false} />
            <h1 className="mt-5 text-2xl font-bold tracking-tight text-gray-900 sm:text-[28px]">
              Complete your profile
            </h1>
            <p className="mt-1.5 text-sm text-gray-500">
              Help us personalise your wellness journey
            </p>
          </div>

          <form onSubmit={handleSubmit} noValidate className="space-y-6">
            <PersonalDetailsSection
              form={form}
              errors={errors}
              onChange={handleChange}
            />

            <BodyMetricsSection
              form={form}
              errors={errors}
              onChange={handleChange}
            />

            <LifestyleSection
              form={form}
              errors={errors}
              onChange={handleChange}
            />

            <GoalsSection form={form} errors={errors} onChange={handleChange} />

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 transition-colors hover:bg-emerald-700 active:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60 sm:py-3"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving profile...
                </>
              ) : (
                "Save & Continue"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
