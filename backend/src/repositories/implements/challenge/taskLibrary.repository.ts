import { BaseRepository } from "../common/base.repository";
import { ITaskLibraryRepository } from "../../interfaces/challenge/ITaskLibraryRepository";
import TaskLibraryModel, {
  ITaskLibrary,
} from "../../../models/taskLibrary.model";

export class TaskLibraryRepository
  extends BaseRepository<ITaskLibrary>
  implements ITaskLibraryRepository
{
  constructor() {
    super(TaskLibraryModel);
  }

  async findAllActive(): Promise<ITaskLibrary[]> {
    return this._model
      .find({ isActive: true })
      .sort({ createdAt: -1 });
  }

  async findAllPaginated(
    page: number,
    limit: number
  ): Promise<{ data: ITaskLibrary[]; total: number }> {
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

  async findByType(type: string): Promise<ITaskLibrary[]> {
    return this._model.find({
      type,
      isActive: true,
    });
  }

  async findByCategory(category: string): Promise<ITaskLibrary[]> {
    return this._model.find({
      category,
      isActive: true,
    });
  }

  async search(query: string): Promise<ITaskLibrary[]> {
    return this._model.find({
      $text: { $search: query },
      isActive: true,
    });
  }

  async findByIdActive(id: string): Promise<ITaskLibrary | null> {
    return this._model.findOne({
      _id: id,
      isActive: true,
    });
  }

  async deactivate(id: string): Promise<ITaskLibrary | null> {
    return this._model.findByIdAndUpdate(
      id,
      { isActive: false },
      { new: true }
    );
  }
}