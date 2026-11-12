"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { nutritionistPlanDayService } from "@/services/nutritionist/nutri-plan-day.service";
import type { CreateNutritionistPlanDayDTO } from "@/dtos/nutritionist/plan-day/nutritionist-plan-day-request.dto";

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

import CreatePlanDayHeader from "./CreatePlanDayHeader";
import PlanDayForm from "../shared/form/PlanDayForm";
import CreatePlanDayActions from "./CreatePlanDayActions";

interface CreatePlanDayClientProps {
  planId: string;
}

export default function CreatePlanDayClient({
  planId,
}: CreatePlanDayClientProps) {
  const router = useRouter();

  const {
    register,
    control,
    watch,
    setValue,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CreatePlanDayFormInput, unknown, CreatePlanDayFormValues>({
    resolver: zodResolver(createPlanDaySchema),
    defaultValues: {
      dayNumber: 1,
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
    router.push(`/nutritionist/plans/${planId}/days`);
  }, [planId, router]);

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
        setValue(`activities.${index}.estimatedDurationMinutes`, undefined, {
          shouldDirty: true,
        });
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
          targetValue: showTargetAndUnit ? activity.targetValue : undefined,
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

      const payload: CreateNutritionistPlanDayDTO = {
        dayNumber: values.dayNumber,
        title: values.title?.trim() || undefined,
        description: values.description?.trim() || undefined,
        activities,
      };

      await nutritionistPlanDayService.createPlanDay(planId, payload);

      toast.success(`Day ${values.dayNumber} created successfully.`);
      router.push(`/nutritionist/plans/${planId}/days`);
    } catch (error: unknown) {
      toast.error(
        getErrorMessage(error) ||
          "Couldn't create this plan day. Please try again.",
      );
    }
  };

  const onInvalid = () => {
    toast.error("Please fix the validation errors before submitting.");
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      <div className="mx-auto max-w-4xl space-y-6 px-4 py-6 sm:px-6 lg:px-8">
        <CreatePlanDayHeader planId={planId} />

        <PlanDayForm
          control={control}
          register={register}
          watch={watch}
          errors={errors}
          fieldArray={fieldArray}
          submitting={isSubmitting}
          showDayNumber
          onCategoryChange={applyCategoryChange}
          onValueTypeChange={applyValueTypeChange}
          onSubmit={handleSubmit(onSubmit, onInvalid)}
          actions={
            <CreatePlanDayActions submitting={isSubmitting} onCancel={goBack} />
          }
        />
      </div>
    </div>
  );
}
