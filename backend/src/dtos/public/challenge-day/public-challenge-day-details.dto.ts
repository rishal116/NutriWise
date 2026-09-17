import { PublicChallengeDayResult } from "../../../types/public/challenge-day/public-challenge-day-result.type";

export class PublicChallengeDayDetailsDTO {
  id: string;
  dayNumber: number;
  title?: string;
  description?: string;
  activities: PublicChallengeDayResult["activities"];

  constructor(data: {
    id: string;
    dayNumber: number;
    title?: string;
    description?: string;
    activities: PublicChallengeDayResult["activities"];
  }) {
    this.id = data.id;
    this.dayNumber = data.dayNumber;
    this.title = data.title;
    this.description = data.description;
    this.activities = data.activities;
  }
}
