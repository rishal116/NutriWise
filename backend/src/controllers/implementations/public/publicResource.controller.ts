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
      const userId = req.user?.userId;

      const resource =
        await this._publicResourceService.getPublicResourceDetails(
          resourceId,
          userId,
        );

      res.status(StatusCode.OK).json({
        success: true,
        data: resource,
      });
    },
  );

  recordResourceView = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const userId = req.user?.userId;

    await this._publicResourceService.recordResourceView(resourceId, userId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });

  likeResource = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const userId = req.user!.userId;

    await this._publicResourceService.likeResource(resourceId, userId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });

  unlikeResource = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const userId = req.user!.userId;

    await this._publicResourceService.unlikeResource(resourceId, userId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });

  bookmarkResource = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const userId = req.user!.userId;

    await this._publicResourceService.bookmarkResource(resourceId, userId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });

  unbookmarkResource = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const userId = req.user!.userId;

    await this._publicResourceService.unbookmarkResource(resourceId, userId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });

  addResourceComment = asyncHandler(async (req: Request, res: Response) => {
    const { resourceId } = req.params;
    const { content } = req.body;
    const userId = req.user!.userId;

    await this._publicResourceService.addResourceComment(
      resourceId,
      userId,
      content,
    );

    res.status(StatusCode.OK).json({
      success: true,
    });
  });

  deleteResourceComment = asyncHandler(async (req: Request, res: Response) => {
    const { commentId } = req.params;
    const userId = req.user!.userId;

    await this._publicResourceService.deleteResourceComment(commentId, userId);

    res.status(StatusCode.OK).json({
      success: true,
    });
  });
}
