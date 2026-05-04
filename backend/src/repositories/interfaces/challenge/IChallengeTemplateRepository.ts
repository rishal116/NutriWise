import { IChallengeTemplate } from "../../../models/challengeTemplate.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface IChallengeTemplateRepository
  extends IBaseRepository<IChallengeTemplate> {

  findAllActive(): Promise<IChallengeTemplate[]>;

  findAllPaginated(
    page: number,
    limit: number
  ): Promise<{ data: IChallengeTemplate[]; total: number }>;

  findByDifficultyAndType(
    difficulty: string,
    type: string
  ): Promise<IChallengeTemplate[]>;

  findByIdActive(
    templateId: string
  ): Promise<IChallengeTemplate | null>;

  deactivate(templateId: string): Promise<IChallengeTemplate | null>;
}