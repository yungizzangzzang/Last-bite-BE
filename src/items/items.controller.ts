import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { ItemsService } from './items.service';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

// * storeId, user 정보에서 받아올 수 있게 수정
@Controller('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // 핫딜 등록
  @Post()
  async createItem(@Body() createItemDto: CreateItemDto) {
    return this.itemsService.createItem(createItemDto);
  }

  // 핫딜 조회
  @Get(':itemId')
  async getAllItems(@Param('itemId') itemId: string) {
    return this.itemsService.getAllitems(+itemId);
  }

  // 핫딜 수정
  @Patch(':itemId')
  async update(@Param('id') id: string, @Body() updateItemDto: UpdateItemDto) {
    return this.itemsService.update(+id, updateItemDto);
  }

  // 핫딜 삭제 -> deletedAt update 방식으로 진행
  @Delete(':itemId')
  async remove(@Param('id') id: string) {
    return this.itemsService.remove(+id);
  }

  // // 핫딜 예약 (등록)
  // @Post(':itemId')
  // async  createReservation(@Body() createItemDto: CreateItemDto) {
  //   return this.itemsService.create(createItemDto);
  // }
}
