import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UpdateUserPointStreamConsumer {
  private readonly updateUserPointStream: Redis;
  private createRedisClient(port: number): Redis {
    const client = new Redis({ port, host: process.env.REDIS_HOST });
    client.on('error', (err) => {
      console.error(`${port}번 포트 연결 실패`, err);
    });
    return client;
  }

  constructor(private readonly prisma: PrismaService) {
    this.updateUserPointStream = this.createRedisClient(7006);
    this.consumeUserPointStream();
  }

  async consumeUserPointStream() {
    const consumerName = process.env.HOST as string;
    const groupName = 'updateUserPointGroup';
    const streamName = 'updateUserPointStream';

    try {
      while (true) {
        const messages: any = await this.updateUserPointStream.xreadgroup(
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
            const userId = parseInt(messageFields[1]);
            const remainUserPoint = parseInt(messageFields[3]);

            await this.handleUpdateUserPoint({
              userId: userId,
              remainUserPoint: remainUserPoint,
            });

            await this.updateUserPointStream.xack(
              streamName,
              groupName,
              messageId,
            );
          }
        }

        await new Promise((resolve) => setImmediate(resolve));
      }
    } catch (error) {
      console.error('스트림 처리 중 오류가 발생했습니다:', error);
    }
  }

  async handleUpdateUserPoint(jobData: {
    userId: number;
    remainUserPoint: number;
  }) {
    const { userId, remainUserPoint } = jobData;

    await this.prisma.users.update({
      where: { userId },
      data: {
        point: remainUserPoint,
      },
    });
  }
}
