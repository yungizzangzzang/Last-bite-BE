import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemDto } from './dto/get-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

const DEFAULT_AVAILABLE_ITEMS = 5;

@Injectable()
export class ItemsRepository {
  constructor(private readonly prisma: PrismaService) {}

  async createItem(
    createItemDto: CreateItemDto,
    urlByS3Key: string,
    startTime: Date,
    endTime: Date,
    userId: number,
  ): Promise<{ message: string }> {
    // userId에 해당하는 storeId가 없을 때 업장 생성 문구 호출
    const store = await this.prisma.stores.findUnique({
      where: { ownerId: userId, deletedAt: null },
      select: {
        storeId: true,
      },
    });

    if (!store) {
      throw new HttpException(
        { message: '가게가 존재하지 않습니다. 가게 정보를 생성해주세요.' },
        HttpStatus.NOT_FOUND,
      );
    }

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
        storeId: store.storeId,
      },
    });
    console.log(createdItem);
    return { message: '핫딜 생성이 완료되었습니다.' };
  }

  async selectAllItems(
    storeId: number,
  ): Promise<GetItemDto[] | { message: string }> {
    const items: GetItemDto[] | { message: string } =
      await this.prisma.items.findMany({
        where: {
          storeId,
          deletedAt: null,
          NOT: { count: 0 },
        },
        select: {
          itemId: true,
          name: true,
          content: true,
          prevPrice: true,
          price: true,
          count: true,
          startTime: true,
          endTime: true,
          imgUrl: true,
          deletedAt: true,
        },
      });
    // 진행 중인 핫딜이 없을 때 미진행 문구 리턴
    if (items.length === 0) {
      return { message: '진행 중인 핫딜 정보가 없습니다.' };
    }
    return items;
  }

  async updateItem(
    itemId?: number,
    updateItemDto?: UpdateItemDto,
    urlByS3Key?: string,
    startTime?: Date,
    endTime?: Date,
    userId?: number,
    count?: number,
  ): Promise<{ message: string }> {
    // userId에 해당하는 storeId가 없을 때 업장 생성 문구 호출
    const store = await this.prisma.stores.findUnique({
      where: { ownerId: userId, deletedAt: null },
      select: {
        storeId: true,
      },
    });

    if (!store) {
      throw new HttpException(
        { message: '가게가 존재하지 않습니다. 가게 정보를 생성해주세요.' },
        HttpStatus.NOT_FOUND,
      );
    }
    await this.prisma.items.update({
      where: { itemId },
      data: {
        name: updateItemDto?.name,
        content: updateItemDto?.content,
        prevPrice: updateItemDto?.prevPrice,
        price: updateItemDto?.price,
        count: updateItemDto?.count,
        startTime,
        endTime,
        imgUrl: urlByS3Key,
      },
    });
    return { message: '핫딜 수정이 완료되었습니다.' };
  }

  async deleteItem(
    itemId: number,
    userId: number,
  ): Promise<{ message: string }> {
    // userId에 해당하는 storeId가 없을 때 업장 생성 문구 호출
    const store = await this.prisma.stores.findUnique({
      where: { ownerId: userId, deletedAt: null },
      select: {
        storeId: true,
      },
    });

    if (!store) {
      throw new HttpException(
        { message: '가게가 존재하지 않습니다. 가게 정보를 생성해주세요.' },
        HttpStatus.NOT_FOUND,
      );
    }

    await this.prisma.items.update({
      where: { itemId },
      data: { deletedAt: new Date() },
    });
    return { message: '핫딜 삭제가 완료되었습니다.' };
  }

  async getOneItem(itemId: number): Promise<GetItemDto> {
    const item = await this.prisma.items.findUnique({
      where: { itemId },
    });
    if (!item) {
      throw new HttpException(
        { message: '핫딜 정보가 존재하지 않습니다.' },
        HttpStatus.NOT_FOUND,
      );
    }
    return item;
  }
}
