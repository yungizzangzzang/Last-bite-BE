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

  onModuleInit() {
    this.consumeItemCountStream();
  }

  constructor(private readonly prisma: PrismaService) {
    this.updateItemCountStream = this.createRedisClient(7005);
  }

  async consumeItemCountStream() {
    const streamName = 'itemCountStream';
    let lastId = '$';

    while (true) {
      try {
        const messages = await this.updateItemCountStream.xread(
          'BLOCK',
          0,
          'STREAMS',
          streamName,
          lastId,
        );

        if (!messages) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
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
            }

            lastId = messageId;
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
