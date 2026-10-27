import { ClientSession, Types } from "mongoose";
import { injectable } from "inversify";
import { BaseRepository } from "../common/base.repository";
import { IPostViewRepository } from "../../interfaces/post/IPostViewRepository";
import { IPostView, PostViewModel } from "../../../models/postView.schema";

@injectable()
export class PostViewRepository
  extends BaseRepository<IPostView>
  implements IPostViewRepository
{
  constructor() {
    super(PostViewModel);
  }

  async findByPostAndUser(
    postId: Types.ObjectId,
    userId: Types.ObjectId,
    session?: ClientSession,
  ): Promise<IPostView | null> {
    const query = this._model.findOne({ postId, userId });

    if (session) {
      query.session(session);
    }

    return query.lean<IPostView | null>().exec();
  }
}
