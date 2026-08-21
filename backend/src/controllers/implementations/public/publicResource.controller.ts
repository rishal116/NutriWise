import { Request, Response } from "express";

import { inject, injectable } from "inversify";

import { TYPES } from "../../../types/types";

import { asyncHandler } from "../../../utils/asyncHandler";

import { StatusCode } from "../../../enums/statusCode.enum";

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

    const resources =
      await this._publicResourceService.getPublicResources(query);

    res.status(StatusCode.OK).json({
      success: true,
      data: resources,
    });
  });

  getPublicResourceDetails = asyncHandler(
    async (req: Request, res: Response) => {
      const { resourceId } = req.params;

      const resource =
        await this._publicResourceService.getPublicResourceDetails(resourceId);

      res.status(StatusCode.OK).json({
        success: true,
        data: resource,
      });
    },
  );

  recordResourceView = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;

    await this._publicResourceService.recordResourceView(resourceId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });

  recordResourceDownload = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;

    await this._publicResourceService.recordResourceDownload(resourceId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });

  recordResourceShare = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;

    await this._publicResourceService.recordResourceShare(resourceId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });
}
