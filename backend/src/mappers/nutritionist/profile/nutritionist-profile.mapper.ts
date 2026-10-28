import type {
  IExperience,
} 

export class NutritionistProfileMapper {
  static toTotalExperienceYears(
    experiences: IExperience[],
  ): number {
    return experiences.reduce(
      (total, experience) => total + experience.durationYears,
      0,
    );
  }
}