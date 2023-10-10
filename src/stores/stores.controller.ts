import { Body, Controller, Delete, Get, Param, Put } from '@nestjs/common';
import { StoresService } from './stores.service';
import { GetStoreDto } from './dto/get-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { GetItemDto } from 'src/items/dto/get-item.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // * 가게 전체 조회
  @Get()
  async getAllStores(): Promise<{ stores: GetStoreDto[] | null }> {
    return { stores: await this.storesService.getAllStores() };
  }

  // * 가게 상세 조회
  @Get(':storeId')
  async getOneStore(
    @Param('storeId') storeId: number,
  ): Promise<{ store: GetStoreDto | null; items: GetItemDto[] | null }> {
    return await this.storesService.getOneStore(storeId);
  }

  // * 가게 수정
  @Put(':storeId')
  async updateStore(
    @Param('storeId') storeId: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<void> {
    return await this.storesService.updateStore(storeId, updateStoreDto);
  }

  // * 가게 삭제
  @Delete(':storeId')
  async deleteStore(@Param('storeId') storeId: number): Promise<void> {
    return await this.storesService.deleteStore(storeId);
  }
}
