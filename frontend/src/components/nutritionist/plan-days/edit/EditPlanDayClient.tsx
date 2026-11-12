"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { nutritionistPlanDayService } from "@/services/nutritionist/nutri-plan-day.service";

import type {
  UpdateNutritionistPlanDayDTO,
} from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-request.dto";

import type { NutritionistPlanDayDetailsDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-details.dto"; 

import type { ProgramActivityCategory } from "@/constants/user/program/program-activity-category.constants";
import type { ActivityValueType } from "@/constants/user/program/activity-value-type.constants";

import {
  createPlanDaySchema,
  type CreatePlanDayFormInput,
  type CreatePlanDayFormValues,
} from "@/schemas/nutritionist/plan-day/nutritionist-plan-day.schema";

import {
  NEEDS_ESTIMATED_DURATION,
  NEEDS_TARGET_AND_UNIT,
} from "@/constants/nutritionist/plan-day/plan-day-form.constants";

import { getErrorMessage } from "@/utils/getErrorMessage";

import PlanDayForm from "../shared/form/PlanDayForm";
import { EditPlanDayHeader } from "./EditPlanDayHeader";
import { EditPlanDayActions } from "./EditPlanDayActions";

interface EditPlanDayClientProps {
  planId: string;
  dayNumber: string;
}

function mapDetailsToForm(
  day: NutritionistPlanDayDetailsDTO,
): CreatePlanDayFormInput {
  return {
    dayNumber: day.dayNumber,
    title: day.title ?? "",
    description: day.description ?? "",
    activities: day.activities.map((activity) => ({
      category: activity.category,
      title: activity.title,
      description: activity.description ?? "",
      instructions: activity.instructions ?? "",
      valueType: activity.valueType,
      targetValue: activity.targetValue,
      unit: activity.unit ?? "",
      estimatedDurationMinutes: activity.estimatedDurationMinutes,
      scheduledTime: activity.scheduledTime ?? "",
      isRequired: activity.isRequired,
      order: activity.order,
    })),
  };
}

export function EditPlanDayClient({
  planId,
  dayNumber,
}: EditPlanDayClientProps) {
  const router = useRouter();
  const parsedDayNumber = Number(dayNumber);

  const isValidDayNumber =
    Number.isInteger(parsedDayNumber) && parsedDayNumber > 0;

  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const {
    register,
    control,
    watch,
    setValue,
    reset,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePlanDayFormInput, unknown, CreatePlanDayFormValues>({
    resolver: zodResolver(createPlanDaySchema),
    defaultValues: {
      dayNumber: parsedDayNumber,
      title: "",
      description: "",
      activities: [],
    },
  });

  const fieldArray = useFieldArray({
    control,
    name: "activities",
  });

  const goBack = useCallback(() => {
    router.push(
      `/nutritionist/plans/${planId}/days/${parsedDayNumber}`,
    );
  }, [planId, parsedDayNumber, router]);

  useEffect(() => {
    if (!planId || !isValidDayNumber) {
      setLoading(false);
      return;
    }

    let isActive = true;

    const fetchPlanDay = async () => {
      try {
        setLoading(true);
        setLoadError(false);

        const day = await nutritionistPlanDayService.getPlanDayDetails(
          planId,
          parsedDayNumber,
        );

        if (isActive) {
          reset(mapDetailsToForm(day));
        }
      } catch (error: unknown) {
        if (isActive) {
          setLoadError(true);
          toast.error(
            getErrorMessage(error) || "Couldn't load this plan day.",
          );
        }
      } finally {
        if (isActive) {
          setLoading(false);
        }
      }
    };

    void fetchPlanDay();

    return () => {
      isActive = false;
    };
  }, [planId, parsedDayNumber, isValidDayNumber, reset]);

  const applyValueTypeChange = useCallback(
    (index: number, valueType: ActivityValueType) => {
      if (!NEEDS_TARGET_AND_UNIT.includes(valueType)) {
        setValue(`activities.${index}.targetValue`, undefined, {
          shouldDirty: true,
        });

        setValue(`activities.${index}.unit`, "", {
          shouldDirty: true,
        });
      }

      if (!NEEDS_ESTIMATED_DURATION.includes(valueType)) {
        setValue(
          `activities.${index}.estimatedDurationMinutes`,
          undefined,
          { shouldDirty: true },
        );
      }
    },
    [setValue],
  );

  const applyCategoryChange = useCallback(
    (index: number, category: ProgramActivityCategory) => {
      setValue(`activities.${index}.category`, category, {
        shouldDirty: true,
        shouldValidate: true,
      });
    },
    [setValue],
  );

  const onSubmit = async (values: CreatePlanDayFormValues) => {
    try {
      const activities = values.activities.map((activity, index) => {
        if (!activity.category || !activity.valueType) {
          throw new Error(
            `Please select a category and response type for activity ${index + 1}.`,
          );
        }

        const showTargetAndUnit = NEEDS_TARGET_AND_UNIT.includes(
          activity.valueType,
        );

        const showEstimatedDuration = NEEDS_ESTIMATED_DURATION.includes(
          activity.valueType,
        );

        return {
          category: activity.category,
          title: activity.title.trim(),
          description: activity.description?.trim() || undefined,
          instructions: activity.instructions?.trim() || undefined,
          valueType: activity.valueType,
          targetValue: showTargetAndUnit
            ? activity.targetValue
            : undefined,
          unit: showTargetAndUnit
            ? activity.unit?.trim() || undefined
            : undefined,
          estimatedDurationMinutes: showEstimatedDuration
            ? activity.estimatedDurationMinutes
            : undefined,
          scheduledTime: activity.scheduledTime || undefined,
          isRequired: activity.isRequired,
          order: index,
        };
      });

      const payload: UpdateNutritionistPlanDayDTO = {
        title: values.title?.trim() || undefined,
        description: values.description?.trim() || undefined,
        activities,
      };

      await nutritionistPlanDayService.updatePlanDay(
        planId,
        parsedDayNumber,
        payload,
      );

      toast.success(`Day ${parsedDayNumber} updated successfully.`);
      goBack();
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error) ||
          (error instanceof Error
            ? error.message
            : "Couldn't update this plan day. Please try again."),
      );
    }
  };

  const onInvalid = () => {
    toast.error("Please fix the validation errors before submitting.");
  };

  if (!planId || !isValidDayNumber) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="text-center">
          <h2 className="text-xl font-bold text-slate-900">
            Invalid plan day
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            The requested plan day is invalid.
          </p>
          <button
            type="button"
            onClick={() => router.push(`/nutritionist/plans/${planId}/days`)}
            className="mt-5 rounded-xl bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-emerald-700"
          >
            Back to plan days
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70">
      <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <EditPlanDayHeader
          dayNumber={parsedDayNumber}
          onBack={goBack}
        />

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
            Loading plan day...
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-rose-200 bg-white p-8 text-center">
            <p className="text-sm font-medium text-rose-600">
              Unable to load this plan day.
            </p>
            <button
              type="button"
              onClick={() => router.refresh()}
              className="mt-4 rounded-xl bg-emerald-700 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800"
            >
              Try again
            </button>
          </div>
        ) : (
          <PlanDayForm
            control={control}
            register={register}
            watch={watch}
            errors={errors}
            fieldArray={fieldArray}
            submitting={isSubmitting}
            onCategoryChange={applyCategoryChange}
            onValueTypeChange={applyValueTypeChange}
            onSubmit={handleSubmit(onSubmit, onInvalid)}
            actions={
              <EditPlanDayActions
                onCancel={goBack}
                isSubmitting={isSubmitting}
              />
            }
          />
        )}
      </div>
    </div>
  );
}