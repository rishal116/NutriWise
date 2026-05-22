import { BaseRepository } from "../common/base.repository";
import { IChallengeRepository } from "../../interfaces/challenge/IChallengeRepository";
import ChallengeModel, { IChallenge } from "../../../models/challenge.model";
import { ChallengeFilters } from "../../../dtos/challenge/challenge-filter.dto";
import { FilterQuery } from "mongoose";

export class ChallengeRepository
  extends BaseRepository<IChallenge>
  implements IChallengeRepository {
  constructor() {
    super(ChallengeModel);
  }

  async findPaginated(
    page: number,
    limit: number,
    filters: ChallengeFilters,
    options?: {
      publicOnly?: boolean;
    },
  ): Promise<{ data: IChallenge[]; total: number }> {
    const skip = (page - 1) * limit;

    const query: FilterQuery<IChallenge> = {
      isDeleted: false,
    };

    if (options?.publicOnly) {
      query.status = "published";
      query.visibility = "public";
    } else if (filters.status) {
      query.status = filters.status;
    }

    if (filters.search) {
      query.$text = {
        $search: filters.search,
      };
    }

    if (filters.type) {
      query.type = filters.type;
    }

    if (filters.difficulty) {
      query.difficulty = filters.difficulty;
    }

    if (filters.category) {
      query.category = filters.category;
    }

    let sort: Record<string, 1 | -1> = {
      createdAt: -1,
    };

    switch (filters.sortBy) {
      case "oldest":
        sort = { createdAt: 1 };
        break;

      case "title":
        sort = { title: 1 };
        break;

      case "latest":
      default:
        sort = { createdAt: -1 };
        break;
    }

    const [data, total] = await Promise.all([
      this._model.find(query).sort(sort).skip(skip).limit(limit),

      this._model.countDocuments(query),
    ]);

    return {
      data,
      total,
    };
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
        status: "published",
      })
      .sort({ createdAt: -1 });
  }

  async softDelete(
    challengeId: string,
  ): Promise<IChallenge | null> {
    return this._model.findByIdAndUpdate(
      challengeId,
      {
        isDeleted: true,
        deletedAt: new Date(),
      },
      { new: true },
    );
  }

  async findByIdWithTasks(
    challengeId: string,
  ): Promise<IChallenge | null> {
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

  async searchChallenges(
    search: string,
  ): Promise<IChallenge[]> {
    return this._model.find({
      $text: {
        $search: search,
      },
      isDeleted: false,
      visibility: "public",
      status: "published",
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

  async findBySlug(
    slug: string,
  ): Promise<IChallenge | null> {
    return this._model.findOne({
      slug,
    });
  }
}