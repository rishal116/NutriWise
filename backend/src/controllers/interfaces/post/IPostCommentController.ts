import { RequestHandler } from "express";

export interface IPostCommentController {
  createComment: RequestHandler;
  getComments: RequestHandler;
  deleteComment: RequestHandler;
}