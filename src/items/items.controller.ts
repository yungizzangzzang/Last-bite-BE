import { Body, Controller, Param, Patch, Post } from '@nestjs/common';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';

// * storeId, user 정보에서 받아올 수 있게 수정
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // 핫딜 등록
  @Post()
  async createItem(
    @Body() createItemDto: CreateItemDto,
  ): Promise<{ message: string }> {
    return this.itemsService.createItem(createItemDto);
  }

  // 핫딜 수정
  @Patch(':itemId')
  async update(
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
  ) {
    return this.itemsService.updateItem(+itemId, updateItemDto);
  }

  // 핫딜 삭제 -> deletedAt update 방식으로 진행
  @Patch(':itemId')
  async deleteItem(@Param('itemId') itemId: string) {
    return this.itemsService.deleteItem(+itemId);
  }
}
