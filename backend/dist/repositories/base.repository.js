"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(_model) {
        this._model = _model;
    }
    async create(data) {
        const document = new this._model(data);
        return document.save();
    }
    async findOne(filter) {
        return this._model.findOne(filter);
    }
    async findById(id) {
        return this._model.findById(id);
    }
    async findAll(filter = {}) {
        return this._model.find(filter);
    }
    async updateOne(filter, update) {
        const result = await this._model.updateOne(filter, update);
        return result.modifiedCount;
    }
    async updateById(id, update) {
        return this._model.findByIdAndUpdate(id, update, { new: true });
    }
    async deleteOne(filter) {
        const result = await this._model.deleteOne(filter);
        return result.deletedCount ?? 0;
    }
}
exports.BaseRepository = BaseRepository;
