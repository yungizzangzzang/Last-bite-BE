import { Controller, Get, Param } from '@nestjs/common';
import { StoresService } from './stores.service';
import { GetStoreDto } from './dto/get.store.dto';

@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  @Get()
  async getAllStores(): Promise<{ stores: GetStoreDto[] }> {
    return { stores: await this.storesService.getAllStores() };
  }

  @Get(':storeId')
  async getOneStore(
    @Param('storeId') storeId: number,
  ): Promise<{ store: GetStoreDto | null }> {
    return { store: await this.storesService.getOneStore(storeId) };
  }
}
