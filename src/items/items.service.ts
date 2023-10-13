import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsRepository } from './items.repository';

// * storeId, user 정보에서 받아올 수 있게 수정
@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  // startTime -> 현재시간 + 입력시간
  async createItem(
    createItemDto: CreateItemDto,
    urlByS3Key: string,
    userId: number
  ): Promise<{ message: string }> {
    const now = new Date();
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      createItemDto.startTime,
    );
    const endTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      createItemDto.endTime,
    );
    return await this.itemsRepository.createItem(
      createItemDto,
      urlByS3Key,
      endTime,
      startTime,
      userId
    );
  }

  async updateItem(
    itemId: number,
    updateItemDto: UpdateItemDto,
    urlByS3Key: string,
    userId: number
  ): Promise<{ message: string }> {
    const now = new Date();
    const startTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      updateItemDto.startTime,
    );
    const endTime = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
      updateItemDto.endTime,
    );
    return await this.itemsRepository.updateItem(
      itemId,
      updateItemDto,
      urlByS3Key,
      startTime,
      endTime,
      userId
    );
  }

  async deleteItem(itemId: number, userId:number): Promise<{ message: string }> {
    return await this.itemsRepository.deleteItem(itemId, userId);
  }

  async getOneItem(itemId: number) {
    const item = await this.itemsRepository.getOneItem(itemId);
    return item;
  }
}
