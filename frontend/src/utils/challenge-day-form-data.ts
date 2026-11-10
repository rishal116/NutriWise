import type { FormValues } from "@/components/admin/challenge-day/form/validation/challenge-day-form.schema";

export function createChallengeDayFormData(values: FormValues): FormData {
  const formData = new FormData();

  formData.append("dayNumber", String(values.dayNumber));
  formData.append("title", values.title.trim());
  formData.append("description", values.description.trim());

  const activities = values.activities.map((activity, index) => ({
    id: activity.id,
    type: activity.type,
    title: activity.title.trim(),
    description: activity.description.trim() || undefined,
    instructions: activity.instructions.trim() || undefined,
    valueType: activity.valueType,
    targetValue: activity.targetValue,
    maxValue: activity.maxValue,
    unit: activity.unit.trim() || undefined,
    estimatedDurationMinutes: activity.estimatedDurationMinutes,
    isRequired: activity.isRequired,
    order: index,
    removeImage: activity.removeImage || undefined,
    removeVideo: activity.removeVideo || undefined,
  }));

  formData.append("activities", JSON.stringify(activities));

  values.activities.forEach((activity, index) => {
    if (activity.imageFile) {
      formData.append("activityImages", activity.imageFile);
    }

    if (activity.videoFile) {
      formData.append("activityVideos", activity.videoFile);
    }

    formData.append(
      "activityMediaIndexes",
      JSON.stringify({
        index,
        hasImage: Boolean(activity.imageFile),
        hasVideo: Boolean(activity.videoFile),
      }),
    );
  });

  return formData;
}
