"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = void 0;
const customError_1 = require("../utils/customError");
const statusCode_enum_1 = require("../enums/statusCode.enum");
const errorMiddleware = (err, req, res, next) => {
    console.error("Global Error Middleware:", err);
    const status = err instanceof customError_1.CustomError ? err.statusCode : statusCode_enum_1.StatusCode.INTERNAL_SERVER_ERROR;
    const message = err instanceof customError_1.CustomError ? err.message : "Something went wrong";
    res.status(status).json({
        success: false,
        message,
    });
};
exports.errorMiddleware = errorMiddleware;
