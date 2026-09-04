import { PlanStatus } from "../../../models/nutritionistPlan.model";

import { Specialization } from "../../../types/nutritionist.types";

import { Currency } from "../../../constants/currency.constants";

export class PlanDTO {
  id!: string;

  title!: string;

  specialization!: Specialization;

  description!: string;

  durationDays!: number;

  price!: number;

  currency!: Currency;

  features!: string[];

  status!: PlanStatus;

  createdAt!: Date;

  updatedAt!: Date;
}