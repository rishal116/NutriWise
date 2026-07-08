import { Express } from "express";

export interface NutritionistFiles {
  resume?: Express.Multer.File[];
  certifications?: Express.Multer.File[];
}
