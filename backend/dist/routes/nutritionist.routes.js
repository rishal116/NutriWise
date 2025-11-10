"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const inversify_1 = require("../configs/inversify");
const types_1 = require("../types/types");
const multer_1 = __importDefault(require("multer"));
const auth_middleware_1 = require("../middlewares/auth.middleware");
const upload = (0, multer_1.default)({ dest: "uploads/nutritionist_cv/" });
const router = (0, express_1.Router)();
const nutritionistAuthController = inversify_1.container.get(types_1.TYPES.INutritionistAuthController);
router.post("/signup", nutritionistAuthController.register);
router.post("/verify-otp", nutritionistAuthController.verifyOtp);
router.post("/resend-otp", nutritionistAuthController.resendOtp);
router.post("/submit-details", auth_middleware_1.authMiddleware, upload.single("cv"), nutritionistAuthController.submitDetails);
exports.default = router;
