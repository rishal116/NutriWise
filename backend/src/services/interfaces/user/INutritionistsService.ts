import { Request } from "express";

export interface INutritionistService {
    getAll(filters?: any): Promise<any[]>;
    getById(id: string): Promise<any | null>;
}