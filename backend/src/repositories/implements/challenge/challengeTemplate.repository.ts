import { BaseRepository } from "../common/base.repository";
import { IChallengeTemplateRepository } from "../../interfaces/challenge/IChallengeTemplateRepository";
import ChallengeTemplateModel, {
  IChallengeTemplate,
} from "../../../models/challengeTemplate.model";

export class ChallengeTemplateRepository
  extends BaseRepository<IChallengeTemplate>
  implements IChallengeTemplateRepository
{
  constructor() {
    super(ChallengeTemplateModel);
  }

  async findAllActive(): Promise<IChallengeTemplate[]> {
    return this._model
      .find({ isActive: true })
      .sort({ createdAt: -1 });
  }

  async findAllPaginated(
    page: number,
    limit: number
  ): Promise<{ data: IChallengeTemplate[]; total: number }> {
    const skip = (page - 1) * limit;

    const query = { isActive: true };

    const [data, total] = await Promise.all([
      this._model
        .find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit),

      this._model.countDocuments(query),
    ]);

    return { data, total };
  }

  async findByDifficultyAndType(
    difficulty: string,
    type: string
  ): Promise<IChallengeTemplate[]> {
    return this._model.find({
      difficulty,
      type,
      isActive: true,
    });
  }

  async findByIdActive(
    templateId: string
  ): Promise<IChallengeTemplate | null> {
    return this._model.findOne({
      _id: templateId,
      isActive: true,
    });
  }

  async deactivate(
    templateId: string
  ): Promise<IChallengeTemplate | null> {
    return this._model.findByIdAndUpdate(
      templateId,
      { isActive: false },
      { new: true }
    );
  }
}