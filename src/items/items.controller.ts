import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // 핫딜 등록
  @Post()
  create(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  // 핫딜 예약
  @Post(':itemId')
  createReservation(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.create(createItemDto);
  }

  // 핫딜 조회
  @Get(':itemId')
  async getAllItems(@Param('itemId') itemId: string) {
    return this.itemsService.getAllitems(+itemId);
  }

  // 핫딜 수정
  @Patch(':itemId')
  update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  // 핫딜 삭제
  @Delete(':itemId')
  remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }
}

