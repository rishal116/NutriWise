import { BaseRepository } from "../common/base.repository";
import { IChallengeRepository } from "../../interfaces/challenge/IChallengeRepository";
import ChallengeModel, { IChallenge } from "../../../models/challenge.model";

export class ChallengeRepository
  extends BaseRepository<IChallenge>
  implements IChallengeRepository
{
  constructor() {
    super(ChallengeModel);
  }

  async findAllPaginated(
    page: number,
    limit: number,
  ): Promise<{ data: IChallenge[]; total: number }> {
    const skip = (page - 1) * limit;

    const filter = { isDeleted: false };

    const [data, total] = await Promise.all([
      this._model.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit),

      this._model.countDocuments(filter),
    ]);

    return { data, total };
  }
  async findByStatus(status: string): Promise<IChallenge[]> {
    return this._model
      .find({
        status,
        isDeleted: false,
      })
      .sort({ createdAt: -1 });
  }

  async findByType(type: string): Promise<IChallenge[]> {
    return this._model
      .find({
        type,
        isDeleted: false,
        visibility: "public",
      })
      .sort({ createdAt: -1 });
  }

  async softDelete(challengeId: string): Promise<IChallenge | null> {
    return this._model.findByIdAndUpdate(
      challengeId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true },
    );
  }

  async findByIdWithTasks(challengeId: string): Promise<IChallenge | null> {
    return this._model.findById(challengeId);
  }

  async findFeaturedChallenges(): Promise<IChallenge[]> {
    return this._model.find({
      isFeatured: true,
      status: "published",
      visibility: "public",
      isDeleted: false,
    });
  }

  async searchChallenges(query: string): Promise<IChallenge[]> {
    return this._model.find({
      $text: { $search: query },
      isDeleted: false,
      visibility: "public",
    });
  }

  async updateStatus(
    challengeId: string,
    status: "draft" | "published" | "archived",
  ): Promise<IChallenge | null> {
    return this._model.findByIdAndUpdate(
      challengeId,
      { status },
      { new: true },
    );
  }

  async findBySlug(slug: string): Promise<IChallenge | null> {
    return await this._model.findOne({
      slug,
      isDeleted: false,
    });
  }
}
