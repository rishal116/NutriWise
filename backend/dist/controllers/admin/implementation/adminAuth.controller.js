"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminAuthController = void 0;
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const adminAuth_dtos_1 = require("../../../dtos/admin/adminAuth.dtos");
class AdminAuthController {
    constructor(_adminAuthService) {
        this._adminAuthService = _adminAuthService;
    }
    async login(req, res, next) {
        try {
            const dto = (0, class_transformer_1.plainToInstance)(adminAuth_dtos_1.AdminLoginDto, req.body);
            const errors = await (0, class_validator_1.validate)(dto);
            if (errors.length > 0) {
                res.status(400).json({
                    message: "Validation failed",
                    errors: errors.map(err => Object.values(err.constraints ?? {})).flat(),
                });
                return;
            }
            const result = await this._adminAuthService.login(dto);
            console.log(result);
            res.status(200).json(result);
        }
        catch (error) {
            next(error);
        }
    }
}
exports.AdminAuthController = AdminAuthController;
