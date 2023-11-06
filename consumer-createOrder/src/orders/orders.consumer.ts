import { Injectable } from '@nestjs/common';
import { Redis } from 'ioredis';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CreateOrderStreamConsumer {
  private readonly createOrderStream: Redis;

  private createRedisClient(port: number): Redis {
    const client = new Redis({ port, host: process.env.REDIS_HOST });
    client.on('error', (err) => {
      console.error(`Redis error on port ${port}:`, err);
    });
    return client;
  }

  onModuleInit() {
    this.consumeCreateOrderStream();
  }

  constructor(private readonly prisma: PrismaService) {
    this.createOrderStream = this.createRedisClient(7004);
  }

  async consumeCreateOrderStream() {
    const streamName = 'createOrderStream';
    let lastId = '$';

    while (true) {
      try {
        const messages = await this.createOrderStream.xread(
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
            const userIdIndex = messageFields.indexOf('userId');
            const detailsIndex = messageFields.indexOf('details');

            if (userIdIndex !== -1 && detailsIndex !== -1) {
              const userId = parseInt(messageFields[userIdIndex + 1], 10);
              const details = JSON.parse(messageFields[detailsIndex + 1]);

              await this.createOrderAndOrderItems(userId, details);
            }

            lastId = messageId;
          }
        }
      } catch (error) {
        console.error('스트림 처리 중 오류가 발생했습니다:', error);
      }
    }
  }

  private async createOrderAndOrderItems(userId: number, details: any) {
    const { discount, storeId, totalPrice, items } = details;

    const order = await this.prisma.orders.create({
      data: {
        userId,
        storeId,
        discount,
        totalPrice,
      },
    });

    const orderItemsData = items.map((item: any) => ({
      orderId: order.orderId,
      itemId: item.itemId,
      count: item.count,
    }));

    await this.prisma.ordersItems.createMany({
      data: orderItemsData,
    });
  }
}
