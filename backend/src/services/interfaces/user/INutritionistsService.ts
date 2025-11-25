import { Request } from "express";

export interface INutritionistService {
    getAll(): Promise<any[]>;
    getById(id: string): Promise<any | null>;
}