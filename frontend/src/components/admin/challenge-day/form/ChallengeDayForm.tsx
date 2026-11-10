"use client";

import { useEffect, useState, type ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { adminChallengeDayService } from "@/services/admin/admin-challenge-day.service";
import { createChallengeDayFormData } from "@/utils/challenge-day-form-data";

import {
  challengeDayFormSchema,
  type FormInput,
  type FormValues,
} from "./validation/challenge-day-form.schema";

import type { ChallengeDayFormProps } from "./challenge-day-form.types";

import {
  createEmptyActivity,
  IMAGE_ACCEPTED_TYPES,
  IMAGE_MAX_SIZE,
  VIDEO_ACCEPTED_TYPES,
  VIDEO_MAX_SIZE,
  MAX_VIDEO_DURATION_SECONDS,
  getVideoDuration,
} from "./helper/challenge-day-form.helpers";

import ChallengeDayHeader from "./components/challenge-day-header";
import DayInformationSection from "./components/day-information-section";
import ActivitiesSection from "./components/activities-section";
import FormFooter from "./components/form-footer";
import ImageCropModal from "./components/image-crop-modal";
import { getErrorMessage } from "@/utils/getErrorMessage";

interface CropSource {
  index: number;
  url: string;
  file: File;
}

export default function ChallengeDayForm({
  mode,
  challengeId,
  dayId,
  initialValues,
}: ChallengeDayFormProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [cropSource, setCropSource] = useState<CropSource | null>(null);
  const [maxDurationDays, setMaxDurationDays] = useState<number | null>(null);
  const [durationLoaded, setDurationLoaded] = useState(false);

  const {
    control,
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormInput, unknown, FormValues>({
    resolver: zodResolver(challengeDayFormSchema),
    defaultValues: {
      dayNumber: initialValues?.dayNumber ?? 1,
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      activities: initialValues?.activities?.length
        ? initialValues.activities.map((activity) => {
            const existingActivity = activity as {
              id?: string;
              _id?: string;
              imageUrl?: string;
              videoUrl?: string;
            };

            return {
              ...createEmptyActivity(),
              ...activity,
              id: existingActivity.id ?? existingActivity._id,
              description: activity.description ?? "",
              instructions: activity.instructions ?? "",
              unit: activity.unit ?? "",
              imageFile: activity.imageFile ?? null,
              videoFile: activity.videoFile ?? null,
              existingImageUrl:
                activity.existingImageUrl ?? existingActivity.imageUrl,
              existingVideoUrl:
                activity.existingVideoUrl ?? existingActivity.videoUrl,
              removeImage: false,
              removeVideo: false,
            };
          })
        : [createEmptyActivity()],
    },
  });

  const { fields, append, remove, move } = useFieldArray({
    control,
    name: "activities",
  });

  const watchedActivities = watch("activities");
  const titleLength = watch("title").length;
  const descriptionLength = watch("description").length;
  const activityCount = watchedActivities.length;

  useEffect(() => {
    const storageKey = `challenge-duration-${challengeId}`;
    const savedDuration = sessionStorage.getItem(storageKey);

    if (savedDuration === null || savedDuration.trim() === "") {
      setMaxDurationDays(null);
      setDurationLoaded(true);
      return;
    }

    const duration = Number(savedDuration);

    setMaxDurationDays(
      Number.isSafeInteger(duration) && duration > 0 ? duration : null,
    );

    setDurationLoaded(true);
  }, [challengeId]);

  useEffect(() => {
    return () => {
      if (cropSource) {
        URL.revokeObjectURL(cropSource.url);
      }
    };
  }, [cropSource]);

  const handleImageChange = (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) return;

    if (!(IMAGE_ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WEBP image.");
      return;
    }

    if (file.size > IMAGE_MAX_SIZE) {
      toast.error("Image must be 5MB or smaller.");
      return;
    }

    const url = URL.createObjectURL(file);

    setCropSource((previous) => {
      if (previous) {
        URL.revokeObjectURL(previous.url);
      }

      return {
        index,
        url,
        file,
      };
    });
  };

  const handleCroppedImage = (file: File) => {
    if (!cropSource) return;

    setValue(`activities.${cropSource.index}.imageFile`, file, {
      shouldDirty: true,
      shouldValidate: true,
    });

    setValue(`activities.${cropSource.index}.removeImage`, false, {
      shouldDirty: true,
    });

    URL.revokeObjectURL(cropSource.url);
    setCropSource(null);
  };

  const handleVideoChange = async (
    index: number,
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0] ?? null;
    event.target.value = "";

    if (!file) return;

    if (!(VIDEO_ACCEPTED_TYPES as readonly string[]).includes(file.type)) {
      toast.error("Please select an MP4, WEBM, or MOV video.");
      return;
    }

    if (file.size > VIDEO_MAX_SIZE) {
      toast.error("Video must be 50MB or smaller.");
      return;
    }

    try {
      const duration = await getVideoDuration(file);

      if (!Number.isFinite(duration) || duration <= 0) {
        toast.error("Unable to determine video duration.");
        return;
      }

      if (duration > MAX_VIDEO_DURATION_SECONDS) {
        toast.error("Video must be 2 minutes or shorter.");
        return;
      }

      setValue(`activities.${index}.videoFile`, file, {
        shouldDirty: true,
        shouldValidate: true,
      });

      setValue(`activities.${index}.removeVideo`, false, {
        shouldDirty: true,
      });
    } catch {
      toast.error("Unable to read the selected video.");
    }
  };

  const removeImage = (index: number) => {
    setValue(`activities.${index}.imageFile`, null, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.existingImageUrl`, undefined, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.removeImage`, true, {
      shouldDirty: true,
    });
  };

  const removeVideo = (index: number) => {
    setValue(`activities.${index}.videoFile`, null, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.existingVideoUrl`, undefined, {
      shouldDirty: true,
    });

    setValue(`activities.${index}.removeVideo`, true, {
      shouldDirty: true,
    });
  };

  const goBack = () => {
    if (saving) return;

    router.push(`/admin/challenges/${challengeId}/days`);
  };

  const onSubmit = async (values: FormValues) => {
    if (values.activities.length === 0) {
      toast.error("Add at least one activity.");
      return;
    }

    if (mode === "create") {
      if (!durationLoaded) {
        toast.error("Challenge duration is still loading.");
        return;
      }

      if (maxDurationDays === null) {
        toast.error(
          "Challenge duration is unavailable. Open challenge details and try again.",
        );
        return;
      }

      if (values.dayNumber > maxDurationDays) {
        toast.error(`This challenge allows only ${maxDurationDays} days.`);
        return;
      }
    }

    setSaving(true);

    try {
      const formData = createChallengeDayFormData(values);

      if (mode === "create") {
        await adminChallengeDayService.createDay(challengeId, formData);

        toast.success(`Day ${values.dayNumber} created successfully.`);
      } else {
        if (!dayId) {
          throw new Error("Day ID is required for editing.");
        }

        await adminChallengeDayService.updateDay(challengeId, dayId, formData);

        toast.success(`Day ${values.dayNumber} updated successfully.`);
      }

      router.push(`/admin/challenges/${challengeId}/days`);
      router.refresh();
    } catch (error) {
      console.error("Failed to save challenge day:", error);

      const message = getErrorMessage(error);

      toast.error(
        message ||
          (mode === "create"
            ? "Failed to create challenge day."
            : "Failed to update challenge day."),
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <div className="mx-auto max-w-5xl pb-24">
        <ChallengeDayHeader
          mode={mode}
          activityCount={activityCount}
          saving={saving}
          onBack={goBack}
        />

        <form onSubmit={handleSubmit(onSubmit)} className="mt-8 space-y-6">
          <DayInformationSection
            register={register}
            errors={errors}
            mode={mode}
            saving={saving}
            durationLoaded={durationLoaded}
            maxDurationDays={maxDurationDays}
            titleLength={titleLength}
            descriptionLength={descriptionLength}
          />

          <ActivitiesSection
            fields={fields}
            activities={watchedActivities}
            control={control}
            register={register}
            errors={errors}
            setValue={setValue}
            saving={saving}
            onAdd={() => append(createEmptyActivity())}
            onRemove={remove}
            onMove={move}
            onImageChange={handleImageChange}
            onVideoChange={handleVideoChange}
            onRemoveImage={removeImage}
            onRemoveVideo={removeVideo}
          />

          <FormFooter
            saving={saving}
            mode={mode}
            activityCount={activityCount}
            onCancel={goBack}
          />
        </form>
      </div>

      {cropSource && (
        <ImageCropModal
          source={{
            url: cropSource.url,
            file: cropSource.file,
          }}
          onCancel={() => {
            URL.revokeObjectURL(cropSource.url);
            setCropSource(null);
          }}
          onComplete={handleCroppedImage}
        />
      )}
    </>
  );
}
