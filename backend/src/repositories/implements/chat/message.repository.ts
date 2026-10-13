import { Types } from "mongoose";
import { BaseRepository } from "../common/base.repository";
import { IMessageRepository } from "../../interfaces/chat/IMessageRepository";
import { IMessage, MessageModel } from "../../../models/message.model";
import { CursorPaginationResult } from "../../../types/common/cursor-pagination.types";
import { decodeCursor, encodeCursor } from "../../../utils/cursor.util";
import { IMessageListItem } from "../../../types/chat/message.types";

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
    cursor?: string,
  ): Promise<CursorPaginationResult<IMessageListItem>> {
    const query: {
      conversationId: Types.ObjectId;
      status: { $in: ["active", "edited"] };
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
      status: {
        $in: ["active", "edited"],
      },
    };

    if (cursor) {
      const decodedCursor = decodeCursor(cursor);

      if (decodedCursor) {
        const cursorDate = new Date(decodedCursor.value as string);
        const cursorId = new Types.ObjectId(decodedCursor.id);

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
    }

    const messages = await this._model
      .find(query)
      .select({
        _id: 1,
        conversationId: 1,
        senderId: 1,
        text: 1,
        attachments: 1,
        messageType: 1,
        replyTo: 1,
        status: 1,
        editedAt: 1,
        deletedAt: 1,
        createdAt: 1,
      })
      .sort({
        createdAt: -1,
        _id: -1,
      })
      .limit(limit + 1)
      .lean<IMessageListItem[]>()
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
