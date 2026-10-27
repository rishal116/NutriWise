import { RequestHandler } from "express";

export interface IUserLikedPostController {
  browseMyLikedPosts: RequestHandler;
  findMyLikedPostDetails: RequestHandler;
}