import type { RequestHandler } from "express";

export interface IAdminPostController {
  getPosts: RequestHandler;
  deletePost: RequestHandler;
}