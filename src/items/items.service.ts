import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { GetItemDto } from './dto/get-item.dto';
import { ItemsRepository } from './items.repository';

// * storeId, user 정보에서 받아올 수 있게 수정
@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  // startTime -> 현재시간 + 입력시간
  async createItem(createItemDto: CreateItemDto): Promise<{ message: string }> {
    const now = new Date();
    const startTime = new Date(
      now.getTime() + createItemDto.startTime * 60 * 60 * 1000,
    );
    const endTime = new Date(
      now.getTime() + createItemDto.endTime * 60 * 60 * 1000,
    );
    return await this.itemsRepository.createItem(
      createItemDto,
      endTime,
      startTime,
    );
  }

  async updateItem(itemId: number, updateItemDto: UpdateItemDto) {
    return await this.itemsRepository.updateItem(itemId, updateItemDto);
  }

  async remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
