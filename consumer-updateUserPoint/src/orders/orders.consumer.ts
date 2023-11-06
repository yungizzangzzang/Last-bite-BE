import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UpdateUserPointsStreamConsumer {
  private readonly updateUserPointsStream: Redis;
  private createRedisClient(port: number): Redis {
    const client = new Redis({ port, host: process.env.REDIS_HOST });
    client.on('error', (err) => {
      console.error(`${port}번 포트 연결 실패`, err);
    });
    return client;
  }

  onModuleInit() {
    this.consumeUserPointsStream();
  }

  constructor(private readonly prisma: PrismaService) {
    this.updateUserPointsStream = this.createRedisClient(7006);
  }

  async consumeUserPointsStream() {
    const streamName = 'updateUserPointsStream';
    let lastId = '$';
    try {
      while (true) {
        const messages = await this.updateUserPointsStream.xread(
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
        console.log(messages);
        for (const stream of messages) {
          const [, streamMessages] = stream;
          for (const message of streamMessages) {
            const [messageId, messageFields] = message;
            const userId = parseInt(messageFields[1]);
            const remainUserPoint = parseInt(messageFields[3]);

            await this.handleUpdateUserPoint({
              userId: userId,
              remainUserPoint: remainUserPoint,
            });

            lastId = messageId;
          }
        }

        await new Promise((resolve) => setImmediate(resolve));
      }
    } catch (error) {
      console.error('스트림 처리 중 오류가 발생했습니다:', error);
    }
  }

  // 사용자의 포인트 업데이트
  async handleUpdateUserPoint(jobData) {
    const { userId, remainUserPoint } = jobData;

    await this.prisma.users.update({
      where: { userId },
      data: {
        point: remainUserPoint,
      },
    });
  }

}
