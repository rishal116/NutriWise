import type { IAdminSubscriptionPlanRepository } from "../repositories/interfaces/admin/IAdminSubscriptionPlanRepository";
import type { SubscriptionAudience } from "../constants/common/subscription.constants";

export const generateUniqueSubscriptionPlanSlug = async (
  repository: IAdminSubscriptionPlanRepository,
  audience: SubscriptionAudience,
  name: string,
): Promise<string> => {
  const baseSlug =
    name
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "subscription-plan";

  let slug = baseSlug;
  let counter = 2;

  while (await repository.exists({ audience, slug })) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }

  return slug;
};
