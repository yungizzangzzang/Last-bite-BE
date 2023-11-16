import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UpdateItemCountStreamConsumer {
  private readonly updateItemCountStream: Redis;

  private createRedisClient(port: number): Redis {
    const client = new Redis({ port, host: process.env.REDIS_HOST });
    client.on('error', (err) => {
      console.error(`${port}번 포트 연결 실패`, err);
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

    try {
      while (true) {
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
            const versionIndex = messageFields.indexOf('version');
            console.log(streamMessages);

            if (
              itemIdIndex !== -1 &&
              countIndex !== -1 &&
              versionIndex !== -1
            ) {
              try {
                const itemId = parseInt(messageFields[itemIdIndex + 1], 10);
                const count = parseInt(messageFields[countIndex + 1], 10);
                const version = parseInt(messageFields[versionIndex + 1], 10);

                await this.handleUpdateItemCount({
                  itemId: itemId,
                  count: count,
                  version: version,
                });

                await this.updateItemCountStream.xack(
                  streamName,
                  groupName,
                  messageId,
                );
              } catch (error) {
                console.error(`메시지 처리 실패 - ${messageId}:`, error);
                await this.requeueMessage(streamName, messageFields);
              }
            }
          }
        }

        await new Promise((resolve) => setImmediate(resolve));
      }
    } catch (error) {
      console.error('스트림 처리 중 오류가 발생했습니다:', error);
    }
  }

  async handleUpdateItemCount(jobData: {
    itemId: number;
    count: number;
    version: number;
  }) {
    const { itemId, count, version } = jobData;

    try {
      const item = await this.prisma.items.findUnique({
        where: { itemId: itemId },
      });

      if (item && item.version < version) {
        await this.prisma.items.update({
          where: { itemId: itemId },
          data: {
            count: {
              decrement: count,
            },
            version: {
              increment: 1,
            },
          },
        });
      }
    } catch (error) {
      throw error;
    }
  }

  private async requeueMessage(streamName: string, messageFields: any[]) {
    try {
      await this.updateItemCountStream.xadd(streamName, '*', ...messageFields);
    } catch (error) {
      console.error('메시지 재큐 실패:', error);
    }
  }
}
