import { Body, Controller, Delete, Param, Post, Put } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreateItemDto } from './dto/create-item.dto';
import {
  CreateItemDtoResponse,
  DeleteItemDtoResponse,
  UpdateItemDtoResponse,
} from './dto/item-response.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';

// * storeId, user 정보에서 받아올 수 있게 수정
@Controller('items')
@ApiTags('items')
export class ItemsController {
  constructor(private readonly itemsService: ItemsService) {}

  // 핫딜 등록
  @Post()
  @ApiOperation({ summary: '핫딜 등록', description: '핫딜(아이템) 정보 등록' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateItemDtoResponse,
  })
  async createItem(
    @Body() createItemDto: CreateItemDto,
  ): Promise<{ message: string }> {
    return this.itemsService.createItem(createItemDto);
  }

  // 핫딜 수정
  @Put(':itemId')
  @ApiOperation({ summary: '핫딜 수정', description: '핫딜(아이템) 정보 수정' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UpdateItemDtoResponse,
  })
  async update(
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
  ): Promise<{ message: string }> {
    return this.itemsService.updateItem(+itemId, updateItemDto);
  }

  // 핫딜 삭제 -> deletedAt update 방식으로 진행
  @Delete(':itemId')
  @ApiOperation({
    summary: '핫딜 삭제',
    description: 'items 테이블, deletedTime 업데이트',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DeleteItemDtoResponse,
  })
  async deleteItem(
    @Param('itemId') itemId: string,
  ): Promise<{ message: string }> {
    return this.itemsService.deleteItem(+itemId);
  }
}
