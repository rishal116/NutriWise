import { NutritionistListFilter, NutritionistUserSideDTO } from "../../../dtos/user/nutritionistUser.dto";


export interface INutritionistService {
    getAll(filters: NutritionistListFilter): Promise<{
        data: NutritionistUserSideDTO[];
        total: number;
        page: number;
        totalPages: number;
    }>;
    getById(id: string): Promise<any | null>;
    getPlansByNutritionist(id:string): Promise<any|null>
}