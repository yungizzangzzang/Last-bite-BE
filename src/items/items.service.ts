import { Injectable } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { GetItemDto } from './dto/get-item.dto';
import { ItemsRepository } from './items.repository';

@Injectable()
export class ItemsService {
  constructor(private readonly itemsRepository: ItemsRepository) {}

  create(createItemDto: CreateItemDto) {
    return 'This action adds a new item';
  }

  async getAllitems(itemId: number): Promise<GetItemDto[]> {
    return await this.itemsRepository.selectAllItems(itemId)
  }

  findOne(id: number) {
    return `This action returns a #${id} item`;
  }

  update(id: number, updateItemDto: UpdateItemDto) {
    return `This action updates a #${id} item`;
  }

  remove(id: number) {
    return `This action removes a #${id} item`;
  }
}

