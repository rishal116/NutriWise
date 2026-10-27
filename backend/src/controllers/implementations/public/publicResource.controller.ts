import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { IPublicResourceController } from "../../interfaces/public/IPublicResourceController";
import { IPublicResourceService } from "../../../services/interfaces/public/IPublicResourceService";
import { PublicResourceListQueryDTO } from "../../../dtos/public/resource/public-resource-list-query.dto";

@injectable()
export class PublicResourceController implements IPublicResourceController {
  constructor(
    @inject(TYPES.IPublicResourceService)
    private readonly _publicResourceService: IPublicResourceService,
  ) {}

  getPublicResources = asyncHandler(async (req: Request, res: Response) => {
    const query: PublicResourceListQueryDTO = {
      limit: Number(req.query.limit) || 12,
      cursor: req.query.cursor as string | undefined,
      search: req.query.search as string | undefined,
      type: req.query.type as PublicResourceListQueryDTO["type"],
      category: req.query.category as PublicResourceListQueryDTO["category"],
      sortBy: req.query.sortBy as PublicResourceListQueryDTO["sortBy"],
    };

    const resources = await this._publicResourceService.getPublicResources(
      query,
      req.user?.userId,
    );

    res.status(StatusCode.OK).json({
      success: true,
      message: "Public resources retrieved successfully",
      data: resources,
    });
  });

  getPublicResourceDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const { resourceId } = req.params;

      const resource =
        await this._publicResourceService.getPublicResourceDetails(
          resourceId,
          req.user?.userId,
        );

      res.status(StatusCode.OK).json({
        success: true,
        message: "Public resource details retrieved successfully",
        data: resource,
      });
    },
  );
}
