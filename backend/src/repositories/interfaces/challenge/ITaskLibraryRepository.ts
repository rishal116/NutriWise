import { ITaskLibrary } from "../../../models/taskLibrary.model";
import { IBaseRepository } from "../common/IBaseRepository";

export interface ITaskLibraryRepository
  extends IBaseRepository<ITaskLibrary> {

  findAllActive(): Promise<ITaskLibrary[]>;

  findAllPaginated(
    page: number,
    limit: number
  ): Promise<{ data: ITaskLibrary[]; total: number }>;

  findByType(type: string): Promise<ITaskLibrary[]>;

  findByCategory(category: string): Promise<ITaskLibrary[]>;

  search(query: string): Promise<ITaskLibrary[]>;

  findByIdActive(id: string): Promise<ITaskLibrary | null>;

  deactivate(id: string): Promise<ITaskLibrary | null>;
}