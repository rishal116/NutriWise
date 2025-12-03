import { FilterQuery, UpdateQuery } from "mongoose";

export interface IBaseRepository<T> {
  create(data: Partial<T>): Promise<T>;
  findOne(filter: FilterQuery<T>): Promise<T | null>;
  findById(id: string): Promise<T | null>;
  findAll(filter: FilterQuery<T>): Promise<T[]>;
  updateOne(filter: FilterQuery<T>, update: UpdateQuery<T>): Promise<number>;
  updateById(id: string, update: UpdateQuery<T>): Promise<T | null>;
  deleteOne(filter: FilterQuery<T>): Promise<number>;
}
