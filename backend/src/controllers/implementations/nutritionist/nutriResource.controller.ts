import { Request, Response } from "express";
import { inject, injectable } from "inversify";
import { TYPES } from "../../../types/types";
import { INutriResourceController } from "../../interfaces/nutritionist/INutriResourceController";
import { INutriResourceService } from "../../../services/interfaces/nutritionist/INutriResourceService";
import { CreateNutriResourceDTO } from "../../../dtos/nutritionist/resource/create-resource.dto";
import { UpdateNutriResourceDTO } from "../../../dtos/nutritionist/resource/update-resource.dto";
import { GetNutriResourceParamsDTO } from "../../../dtos/nutritionist/resource/resource-params.dto";
import {
  GetNutriResourcesQueryDTO,
  NutriResourceSortBy,
} from "../../../dtos/nutritionist/resource/resource-list-query.dto";
import {
  RESOURCE_STATUSES,
  RESOURCE_TYPES,
} from "../../../models/resource.model";
import { asyncHandler } from "../../../utils/asyncHandler";
import { StatusCode } from "../../../enums/statusCode.enum";

@injectable()
export class NutriResourceController implements INutriResourceController {
  constructor(
    @inject(TYPES.INutriResourceService)
    private readonly _nutriResourceService: INutriResourceService,
  ) {}

  createResource = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const dto: CreateNutriResourceDTO = req.body;

    const files = req.files as {
      file?: Express.Multer.File[];
      thumbnail?: Express.Multer.File[];
    };

    const file = files?.file?.[0];
    const thumbnail = files?.thumbnail?.[0];

    const resource = await this._nutriResourceService.createResource(
      nutritionistId,
      dto,
      file,
      thumbnail,
    );

    res.status(StatusCode.CREATED).json({
      success: true,
      data: resource,
    });
  });

  getResources = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const query: GetNutriResourcesQueryDTO = {
      search: req.query.search as string | undefined,
      status: req.query.status as
        | (typeof RESOURCE_STATUSES)[number]
        | undefined,
      type: req.query.type as (typeof RESOURCE_TYPES)[number] | undefined,
      category: req.query.category as string | undefined,
      sortBy: req.query.sortBy as NutriResourceSortBy | undefined,
      cursor: req.query.cursor as string | undefined,
      limit: req.query.limit ? Number(req.query.limit) : undefined,
    };

    const resources = await this._nutriResourceService.getResources(
      nutritionistId,
      query,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: resources,
    });
  });

  getResourceDetails = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const params: GetNutriResourceParamsDTO = {
      resourceId: req.params.resourceId,
    };

    const resource = await this._nutriResourceService.getResourceDetails(
      nutritionistId,
      params,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: resource,
    });
  });

  updateResource = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const params: GetNutriResourceParamsDTO = {
      resourceId: req.params.resourceId,
    };

    const dto: UpdateNutriResourceDTO = req.body;

    const resource = await this._nutriResourceService.updateResource(
      nutritionistId,
      params,
      dto,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: resource,
    });
  });

  publishResource = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const params: GetNutriResourceParamsDTO = {
      resourceId: req.params.resourceId,
    };

    const resource = await this._nutriResourceService.publishResource(
      nutritionistId,
      params,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: resource,
    });
  });

  archiveResource = asyncHandler(async (req: Request, res: Response) => {
    const nutritionistId = req.user!.userId;

    const params: GetNutriResourceParamsDTO = {
      resourceId: req.params.resourceId,
    };

    const resource = await this._nutriResourceService.archiveResource(
      nutritionistId,
      params,
    );

    res.status(StatusCode.OK).json({
      success: true,
      data: resource,
    });
  });
}
