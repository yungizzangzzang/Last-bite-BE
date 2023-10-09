import { Body, Controller, Get, Param, Put } from '@nestjs/common';
import { StoresService } from './stores.service';
import { GetStoreDto } from './dto/get.store.dto';
import { UpdateStoreDto } from './dto/update.store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async getAllStores(): Promise<{ stores: GetStoreDto[] | null }> {
    return { stores: await this.storesService.getAllStores() };
  }

  @Get(':storeId')
  async getOneStore(
    @Param('storeId') storeId: number,
  ): Promise<{ store: GetStoreDto | null }> {
    return { store: await this.storesService.getOneStore(storeId) };
  }

  @Put(':storeId')
  async updateStore(
    @Param('storeId') storeId: number,
    @Body() updateStoreDto: UpdateStoreDto,
  ): Promise<void> {
    return await this.storesService.updateStore(storeId, updateStoreDto);
  }
}
