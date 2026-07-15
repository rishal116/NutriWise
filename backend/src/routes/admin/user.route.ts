import { Router } from "express";
import { container } from "../../configs/inversify";
import { TYPES } from "../../types/types";
import { IAdminUserController } from "../../controllers/interfaces/admin/IAdminUserController";

const router = Router();

const adminUserController = container.get<IAdminUserController>(
  TYPES.IAdminUserController,
);

router.get("/", adminUserController.getUsers);

router.patch(
  "/:userId/block-status",
  adminUserController.updateBlockStatus,
);

export default router;