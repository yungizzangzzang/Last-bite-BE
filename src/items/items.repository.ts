import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemDto } from './dto/get-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class ItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  // * storeId, user 정보에서 받아올 수 있게 수정ㅋ
  async createItem(
    createItemDto: CreateItemDto,
    urlByS3Key: string,
    startTime: Date,
    endTime: Date,
  ): Promise<{ message: string }> {
    const createdItem = await this.prisma.items.create({
      data: {
        name: createItemDto.name,
        content: createItemDto.content,
        prevPrice: createItemDto.prevPrice,
        price: createItemDto.price,
        count: createItemDto.count,
        startTime,
        endTime,
        imgUrl: urlByS3Key,
        storeId: 1,
      },
    });
    console.log(createdItem);
    return { message: '핫딜 생성이 완료되었습니다.' };
  }

  // * where에 store request로 받아오기!!
  async selectAllItems(storeId: number): Promise<GetItemDto[]> {
    const items: GetItemDto[] = await this.prisma.items.findMany({
      where: {
        storeId,
        deletedAt: null,
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
    urlByS3Key: string,
    startTime: Date,
    endTime: Date,
  ): Promise<{ message: string }> {
    await this.prisma.items.update({
      where: { itemId },
      data: {
        name: updateItemDto.name,
        content: updateItemDto.content,
        prevPrice: updateItemDto.prevPrice,
        price: updateItemDto.price,
        count: updateItemDto.count,
        startTime,
        endTime,
        imgUrl: urlByS3Key,
      },
    });
    return { message: '핫딜 수정이 완료되었습니다.' };
  }

  async deleteItem(itemId: number): Promise<{ message: string }> {
    await this.prisma.items.update({
      where: { itemId },
      data: { deletedAt: new Date() },
    });
    return { message: '핫딜 삭제가 완료되었습니다.' };
  }

  async getOneItem(itemId: number) {
    const item = await this.prisma.items.findUnique({
      where: { itemId },
    });
    return item;
  }
}
