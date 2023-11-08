import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UpdateItemCountStreamConsumer {
  private readonly updateItemCountStream: Redis;

  private createRedisClient(port: number): Redis {
    const client = new Redis({ port, host: process.env.REDIS_HOST });
    client.on('error', (err) => {
      console.error(`Redis error on port ${port}:`, err);
    });
    return client;
  }

  constructor(private readonly prisma: PrismaService) {
    this.updateItemCountStream = this.createRedisClient(7005);
    this.consumeItemCountStream();
  }

  async consumeItemCountStream() {
    const consumerName = process.env.HOST as string;
    const groupName = 'updateItemGroup';
    const streamName = 'updateItemCountStream';

    while (true) {
      try {
        const messages: any = await this.updateItemCountStream.xreadgroup(
          'GROUP',
          groupName,
          consumerName,
          'COUNT',
          '1',
          'BLOCK',
          '1000',
          'STREAMS',
          streamName,
          '>',
        );

        if (!messages || messages.length === 0 || messages[0][1].length === 0) {
          continue;
        }

        for (const [, streamMessages] of messages) {
          for (const [messageId, messageFields] of streamMessages) {
            const itemIdIndex = messageFields.indexOf('itemId');
            const countIndex = messageFields.indexOf('count');

            if (itemIdIndex !== -1 && countIndex !== -1) {
              const itemId = parseInt(messageFields[itemIdIndex + 1], 10);
              const count = parseInt(messageFields[countIndex + 1], 10);

              await this.handleUpdateItemCount(itemId, count);

              await this.updateItemCountStream.xack(
                streamName,
                groupName,
                messageId,
              );
            }
          }
        }
      } catch (error) {
        console.error('스트림 처리 중 오류가 발생했습니다:', error);
      }
    }
  }

  async handleUpdateItemCount(itemId: number, count: number) {
    await this.prisma.items.update({
      where: { itemId },
      data: {
        count: {
          decrement: count,
        },
      },
    });
  }
}
