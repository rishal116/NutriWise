import type { IReadRepository } from "./IReadRepository";
import type { IWriteRepository } from "./IWriteRepository";

export interface IBaseRepository<T>
  extends IReadRepository<T>, IWriteRepository<T> {}
