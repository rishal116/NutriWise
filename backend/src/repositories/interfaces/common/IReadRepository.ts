import type { FilterQuery, Types } from "mongoose";

export interface IReadRepository<T> {
  findOne(filter: FilterQuery<T>): Promise<T | null>;

  findById(id: string | Types.ObjectId): Promise<T | null>;

  find(filter: FilterQuery<T>): Promise<T[]>;

  countDocuments(filter: FilterQuery<T>): Promise<number>;

  exists(filter: FilterQuery<T>): Promise<boolean>;
}
