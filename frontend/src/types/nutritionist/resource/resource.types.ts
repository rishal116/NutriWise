export const RESOURCE_TYPES = [
  "article",
  "pdf",
  "video",
  "infographic",
] as const;

export type ResourceType = (typeof RESOURCE_TYPES)[number];

export const RESOURCE_CATEGORIES = [
  "nutrition",
  "fitness",
  "wellness",
  "recipes",
] as const;

export type ResourceCategory = (typeof RESOURCE_CATEGORIES)[number];

export const RESOURCE_STATUSES = ["draft", "published", "archived"] as const;

export type ResourceStatus = (typeof RESOURCE_STATUSES)[number];
