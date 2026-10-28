import type { RequestHandler } from "express";

export interface IAdminResourceController {
  getResources: RequestHandler;
  deleteResource: RequestHandler;
}