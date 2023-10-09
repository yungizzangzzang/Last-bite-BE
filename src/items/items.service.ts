import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { GetItemDto } from './dto/get-item.dto';
import { ItemsRepository } from './items.repository';

// * storeId, user 정보에서 받아올 수 있게 수정
@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  async createItem(createItemDto: CreateItemDto): Promise<{ message: string }> {
    return await this.itemsRepository.createItem(createItemDto);
  }

  async getAllitems(itemId: number): Promise<GetItemDto[]> {
    return await this.itemsRepository.selectAllItems(itemId);
  }

  async findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  async update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  async remove(id: number) {
    return `This action removes a #${id} item`;
  }
}
