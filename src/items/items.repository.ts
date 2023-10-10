import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemDto } from './dto/get-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // * storeId, user 정보에서 받아올 수 있게 수정
  // ? DB에서 startTime을 빼고, 핫딜 시작 시간을 등록 시점부터 하면 어떨까요??
  async createItem(
    createItemDto: CreateItemDto,
    endTime: Date,
    startTime: Date,
  ): Promise<{ message: string }> {
    await this.prisma.items.create({
      data: {
        name: createItemDto.name,
        content: createItemDto.content,
        prevPrice: createItemDto.prevPrice,
        price: createItemDto.price,
        count: createItemDto.count,
        startTime,
        endTime,
        imgUrl: createItemDto.imgUrl,
        storeId: 1,
      },
    });
    return { message: '핫딜 생성이 완료되었습니다.' };
  }

  // * where에 store request로 받아오기!!
  async selectAllItems(storeId: number): Promise<GetItemDto[]> {
    const items: GetItemDto[] = await this.prisma.items.findMany({
      where: {
        storeId,
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
      },
    });

    return items;
  }

  async updateItem(
    itemId: number,
    updateItemDto: UpdateItemDto,
  ): Promise<{ message: string }> {
    await this.prisma.items.update({
      where: { itemId },
      data: updateItemDto,
    });
    return { message: '핫딜 수정이 완료되었습니다.' };
  }
}
