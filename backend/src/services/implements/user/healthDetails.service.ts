import { injectable, inject } from "inversify";
import { IHealthDetailsService } from "../../interfaces/user/IHealthDetailsService";
import { IHealthDetailsRepository } from "../../../repositories/interfaces/user/IHealthDetailsRepository";
import { TYPES } from "../../../types/types";
import {HealthDetailsRequestDTO,HealthDetailsResponseDTO} from "../../../dtos/user/healthDetails.dto";

@injectable()
export class HealthDetailsService implements IHealthDetailsService {
    constructor(
        @inject(TYPES.IHealthDetailsRepository)
        private  _healthDetailsRepository : IHealthDetailsRepository
    ) {}
    
    async getMyDetails(userId: string): Promise<HealthDetailsResponseDTO | null> {
        const entity = await this._healthDetailsRepository.findByUserId(userId);
        return entity ? new HealthDetailsResponseDTO(entity) : null;
    }
    
    async saveDetails(userId: string,payload: HealthDetailsRequestDTO): Promise<HealthDetailsResponseDTO> {
        const bmi = payload.weight / Math.pow(payload.height / 100, 2);
        const saved = await this._healthDetailsRepository.upsertByUserId(userId, {
            ...payload,
            bmi: Number(bmi.toFixed(2)),
        });
        return new HealthDetailsResponseDTO(saved);
    }
    
}
