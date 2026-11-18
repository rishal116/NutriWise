import type {
  ProgramActivityCategory,
  ActivityValueType,
} from "@/types/program-activity.types";

export const CATEGORY_LABELS: Record<ProgramActivityCategory, string> = {
  meal: "Meal",
  exercise: "Exercise",
  habit: "Habit",
  water: "Water",
  supplement: "Supplement",
  meditation: "Meditation",
  sleep: "Sleep",
  reading: "Reading",
  appointment: "Appointment",
  measurement: "Measurement",
  task: "Task",
};

export const VALUE_TYPE_LABELS: Record<ActivityValueType, string> = {
  boolean: "Yes / No",
  number: "Number",
  duration: "Duration",
  photo: "Photo",
  text: "Text",
};