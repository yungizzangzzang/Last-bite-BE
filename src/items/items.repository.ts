import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetItemDto } from './dto/get-item.dto';

@Injectable()
export class ItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async selectAllItems(itemId: number): Promise<GetItemDto[]> {
    const items: GetItemDto[] = await this.prisma.items.findMany({
        where: {
            itemId,
        },
        select: {
            name: true,
            content: true,
            prevPrice: true,
            price: true,
            count: true,
            startTime: true,
            endTime: true,
            imgUrl: true,
        }
    });

    return items;
  }
}

