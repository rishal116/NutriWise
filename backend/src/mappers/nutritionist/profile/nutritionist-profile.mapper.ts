import { IExperience } from "../../../models/nutritionistProfile.model";

export class NutritionistProfileMapper {
  static toTotalExperienceYears(experiences: IExperience[]): number {
    return experiences.reduce(
      (total, experience) => total + experience.durationYears,
      0,
    );
  }
}
