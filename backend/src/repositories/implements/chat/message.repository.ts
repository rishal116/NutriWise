import { Types } from "mongoose";

import { BaseRepository } from "../common/base.repository";
import { IMessageRepository } from "../../interfaces/chat/IMessageRepository";

import { IMessage, MessageModel } from "../../../models/message.model";

import { CursorData } from "../../../types/cursor.types";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { encodeCursor } from "../../../utils/cursor.util";

export class MessageRepository
  extends BaseRepository<IMessage>
  implements IMessageRepository
{
  constructor() {
    super(MessageModel);
  }

  async findMessagesByConversation(
    conversationId: string,
    limit: number,
    cursor?: CursorData,
  ): Promise<CursorPaginationResult<IMessage>> {
    const query: {
      conversationId: Types.ObjectId;
      status: { $ne: "deleted" };
      $or?: Array<
        | {
            createdAt: { $lt: Date };
          }
        | {
            createdAt: Date;
            _id: { $lt: Types.ObjectId };
          }
      >;
    } = {
      conversationId: new Types.ObjectId(conversationId),
      status: { $ne: "deleted" },
    };

    if (cursor) {
      const cursorDate = new Date(cursor.value as string);
      const cursorId = new Types.ObjectId(cursor.id);

      query.$or = [
        {
          createdAt: {
            $lt: cursorDate,
          },
        },
        {
          createdAt: cursorDate,
          _id: {
            $lt: cursorId,
          },
        },
      ];
    }

    const messages = await this._model
      .find(query)
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit + 1)
      .lean<IMessage[]>()
      .exec();

    const hasMore = messages.length > limit;

    const items = hasMore ? messages.slice(0, limit) : messages;

    const lastMessage = items[items.length - 1];

    const nextCursor =
      hasMore && lastMessage
        ? encodeCursor({
            value: lastMessage.createdAt,
            id: lastMessage._id.toString(),
          })
        : null;

    return {
      items,
      nextCursor,
      hasMore,
    };
  }

  async deleteById(id: string): Promise<void> {
    await this._model.findByIdAndUpdate(id, {
      status: "deleted",
      deletedAt: new Date(),
    });
  }
}
