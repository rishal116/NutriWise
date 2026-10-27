import { inject, injectable } from "inversify";
import { Request, Response } from "express";
import { TYPES } from "../../../types/types";
import { StatusCode } from "../../../enums/statusCode.enum";
import { asyncHandler } from "../../../utils/asyncHandler";
import { IPostViewService } from "../../../services/interfaces/post/IPostViewService";
import { IPostViewController } from "../../interfaces/post/IPostViewController";

@injectable()
export class PostViewController implements IPostViewController {
  constructor(
    @inject(TYPES.IPostViewService)
    private readonly _postViewService: IPostViewService,
  ) {}

  viewPost = asyncHandler(async (req: Request, res: Response) => {
    const { postId } = req.params;
    const userId = req.user!.userId;

    await this._postViewService.viewPost(postId, userId);

    res.status(StatusCode.OK).json({
      success: true,
      message: "Post viewed successfully",
    });
  });
}
