import express from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { IUserProgramController } from "../../controllers/interfaces/user/IUserProgramController";

const router = express.Router();

const controller = container.get<IUserProgramController>(
  TYPES.IUserProgramController,
);

router.use(authMiddleware);

router.get("/", controller.browsePrograms);

router.get("/:programId", controller.getProgramDetails);

export default router;
