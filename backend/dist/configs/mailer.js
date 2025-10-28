"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mailTransporter = exports.mailerConfig = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.mailerConfig = {
    service: "gmail",
    port: Number(process.env.MAIL_PORT),
    secure: false,
    auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASS,
    },
};
exports.mailTransporter = nodemailer_1.default.createTransport({
    service: exports.mailerConfig.service,
    port: exports.mailerConfig.port,
    secure: exports.mailerConfig.port === 465,
    auth: exports.mailerConfig.auth,
});
