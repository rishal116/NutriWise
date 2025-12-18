import {
  IsString,
  IsNumber,
  IsIn,
  Min,
  IsOptional,
} from "class-validator";

/* ================= CREATE ================= */

export class CreatePlanDto {
  @IsString()
  title!: string;

  @IsString()
  category!: string;

  @IsIn([30, 90, 180])
  durationInDays!: 30 | 90 | 180;

  @IsNumber()
  @Min(1)
  price!: number;

  @IsString()
  description!: string;
}

/* ================= UPDATE ================= */

export class UpdatePlanDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsIn([30, 90, 180])
  durationInDays?: 30 | 90 | 180;

  @IsOptional()
  @IsNumber()
  @Min(1)
  price?: number;

  @IsOptional()
  @IsString()
  description?: string;
}

/* ================= ADMIN ================= */

export class ApprovePlanDto {
  @IsString()
  planId!: string;
}

export class RejectPlanDto {
  @IsString()
  planId!: string;

  @IsString()
  reason!: string;
}

export interface ICreatePlanDTO {
  title: string;
  category: string;
  durationInDays: 30 | 90 | 180;
  price: number;
  description: string;
}

export interface IUpdatePlanDTO {
  title?: string;
  category?: string;
  durationInDays?: 30 | 90 | 180;
  price?: number;
  description?: string;
}


export interface PlanDTO {
  id: string;
  title: string;
  category: string;
  durationInDays: number;
  price: number;
  description: string;
  status: "draft" | "published";
  approvalStatus: "pending" | "approved" | "rejected";
  rejectionReason?: string | null;
  createdAt: Date;
  updatedAt: Date;
}