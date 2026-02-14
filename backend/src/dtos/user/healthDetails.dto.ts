export class HealthDetailsRequestDTO {
  height!: number;
  weight!: number;
  activityLevel!: string;
  dietType!: string;
  dailyWaterIntake!: number;
  sleepDuration!: string;
  goal!: string;
  targetWeight!: number;
  preferredTimeline!: string;
  focusArea!: string;
}

export class HealthDetailsResponseDTO {
  id!: string;
  height!: number;
  weight!: number;
  bmi!: number;
  activityLevel!: string;
  dietType!: string;
  dailyWaterIntake!: number;
  sleepDuration!: string;
  goal!: string;
  targetWeight!: number;
  preferredTimeline!: string;
  focusArea!: string;
  createdAt!: Date;
  updatedAt!: Date;

  constructor(entity: any) {
    this.id = entity._id;
    this.height = entity.height;
    this.weight = entity.weight;
    this.bmi = entity.bmi;
    this.activityLevel = entity.activityLevel;
    this.dietType = entity.dietType;
    this.dailyWaterIntake = entity.dailyWaterIntake;
    this.sleepDuration = entity.sleepDuration;
    this.goal = entity.goal;
    this.targetWeight = entity.targetWeight;
    this.preferredTimeline = entity.preferredTimeline;
    this.focusArea = entity.focusArea;
    this.createdAt = entity.createdAt;
    this.updatedAt = entity.updatedAt;
  }
}
