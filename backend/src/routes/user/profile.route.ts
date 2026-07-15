import express from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IUserProfileController } from "../../controllers/interfaces/user/IUserProfileController";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { upload } from "../../middlewares/multer.middleware";

const router = express.Router();

const profileController = container.get<IUserProfileController>(
  TYPES.IUserProfileController,
);

router.get("/", authMiddleware, profileController.getProfile);

router.put("/", authMiddleware, profileController.updateProfile);

router.patch(
  "/image",
  authMiddleware,
  upload.single("image"),
  profileController.updateProfileImage,
);

export default router;
