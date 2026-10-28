import { inject, injectable } from "inversify";
import type { Request, Response } from "express";

import { TYPES } from "../../../types/types";
import type { IAdminResourceController } from "../../interfaces/admin/IAdminResourceController";
import type { IAdminResourceService } from "../../../services/interfaces/admin/IAdminResourceService";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class AdminResourceController implements IAdminResourceController {
  constructor(
    @inject(TYPES.IAdminResourceService)
    private readonly adminResourceService: IAdminResourceService,
  ) {}

  getResources = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      const resources = await this.adminResourceService.getResources({
        limit: Number(req.query.limit ?? 10),
        cursor: req.query.cursor as string | undefined,
      });

      res.status(StatusCode.OK).json({
        success: true,
        message: "Admin resources fetched successfully",
        data: resources,
      });
    },
  );

  deleteResource = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
      await this.adminResourceService.deleteResource(req.params.resourceId);

      res.status(StatusCode.OK).json({
        success: true,
        message: "Resource deleted successfully",
      });
    },
  );
}