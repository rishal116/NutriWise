"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateDto = exports.validateDtoMiddleware = void 0;
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const customError_1 = require("../utils/customError");
const validateDtoMiddleware = (DtoClass) => {
    return async (req, res, next) => {
        console.log(req.body);
        const dtoInstance = (0, class_transformer_1.plainToInstance)(DtoClass, req.body);
        const errors = await (0, class_validator_1.validate)(dtoInstance);
        if (errors.length > 0) {
            const messages = errors
                .flatMap((err) => Object.values(err.constraints || {}))
                .join(", ");
            throw new customError_1.CustomError(messages, 400);
        }
        next();
    };
};
exports.validateDtoMiddleware = validateDtoMiddleware;
const validateDto = async (DtoClass, data) => {
    const dtoInstance = (0, class_transformer_1.plainToInstance)(DtoClass, data);
    const errors = await (0, class_validator_1.validate)(dtoInstance);
    if (errors.length > 0) {
        const messages = errors
            .flatMap((err) => Object.values(err.constraints || {}))
            .join(", ");
        throw new customError_1.CustomError(messages, 400);
    }
};
exports.validateDto = validateDto;
