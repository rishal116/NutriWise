"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTransporter = exports.mailerConfig = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
exports.mailerConfig = {
    host: process.env.MAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.MAIL_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.MAIL_USER || "your_email@gmail.com",
        pass: process.env.MAIL_PASS || "your_email_app_password",
    },
};
exports.mailTransporter = nodemailer_1.default.createTransport({
    host: exports.mailerConfig.host,
    port: exports.mailerConfig.port,
    secure: exports.mailerConfig.port === 465,
    auth: exports.mailerConfig.auth,
});
