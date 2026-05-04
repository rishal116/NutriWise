import { FilterQuery, UpdateQuery, ClientSession } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>, session?: ClientSession): Promise<T>;

  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findByIds(ids: string[]): Promise<T[]>;
  findAll(filter: FilterQuery<T>): Promise<T[]>;

  updateOne(
    filter: FilterQuery<T>,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<number>;

  updateById(
    id: string,
    update: UpdateQuery<T>,
    session?: ClientSession,
  ): Promise<T | null>;

  deleteOne(filter: FilterQuery<T>, session?: ClientSession): Promise<number>;

  deleteById(id: string, session?: ClientSession): Promise<number>;
}
