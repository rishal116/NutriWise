"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomError = void 0;
exports.handleRepositoryError = handleRepositoryError;
const statusCode_enum_1 = require("../enums/statusCode.enum");
class CustomError extends Error {
    constructor(message, statusCode = statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR) {
        super(message);
        this.name = "CustomError";
        this.statusCode = statusCode;
        Object.setPrototypeOf(this, CustomError.prototype);
    }
}
exports.CustomError = CustomError;
function handleRepositoryError(error, message) {
    if (error instanceof CustomError)
        throw error;
    console.error("Repository error:", error);
    throw new CustomError(message, statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR);
}
