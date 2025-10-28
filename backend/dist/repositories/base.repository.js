"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    // ✅ Create a new document
    async create(data) {
        const document = new this.model(data);
        return document.save();
    }
    // ✅ Find one document by filter
    async findOne(filter) {
        return this.model.findOne(filter);
    }
    // ✅ Find by ID
    async findById(id) {
        return this.model.findById(id);
    }
    // ✅ Update one document by filter
    async updateOne(filter, update) {
        await this.model.updateOne(filter, update);
    }
    // ✅ Update by ID and return the updated document
    async updateById(id, update) {
        return this.model.findByIdAndUpdate(id, update, { new: true });
    }
    // ✅ Delete one by filter
    async deleteOne(filter) {
        await this.model.deleteOne(filter);
    }
}
exports.BaseRepository = BaseRepository;
