"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TYPES = void 0;
exports.TYPES = {
    // 🧩 User
    IUserAuthController: Symbol.for("IUserAuthController"),
    IUserAuthService: Symbol.for("IUserAuthService"),
    IUserRepository: Symbol.for("IUserRepository"),
    IOTPService: Symbol.for("IOTPService"),
    IOtpRepository: Symbol.for("IOtpRepository"),
    // 🧑‍💼 Admin
    IAdminAuthController: Symbol.for("IAdminAuthController"),
    IAdminAuthService: Symbol.for("IAdminAuthService"),
    IAdminRepository: Symbol.for("IAdminRepository"),
};
