import {
  IsArray,
  ArrayMinSize,
  IsOptional,
  IsString,
  MaxLength,
  ValidateNested,
} from "class-validator";
import { Type } from "class-transformer";

import { Language, Specialization } from "../../../types/nutritionist.types";
import { NutritionistFiles } from "../../../types/nutritionist-files.type";

export class QualificationDto {
  @IsString()
  degree!: string;

  @IsString()
  institution!: string;

  year!: number;
}

export class ExperienceDto {
  @IsString()
  role!: string;

  @IsString()
  organization!: string;

  durationYears!: number;
}

export class CertificationDto {
  @IsString()
  name!: string;

  @IsString()
  issuedBy!: string;

  @IsOptional()
  @IsString()
  fileUrl?: string;
}

export class NutritionistFormDto {
  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => QualificationDto)
  qualifications!: QualificationDto[];

  @IsArray()
  @ArrayMinSize(1)
  specializations!: Specialization[];

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => ExperienceDto)
  experiences!: ExperienceDto[];

  @IsArray()
  @ArrayMinSize(1)
  languages!: Language[];

  @IsOptional()
  @IsString()
  @MaxLength(500)
  bio?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications!: CertificationDto[];
}

/**
 * Raw multipart/form-data request
 */
export interface SubmitNutritionistApplicationDto {
  userId: string;
  body: Record<string, string>;
  files?: NutritionistFiles;
}
