import { RequestHandler } from "express";

export interface IResourceCommentController {
  addComment: RequestHandler;
  getComments: RequestHandler;
  deleteComment: RequestHandler;
}
