import { Injectable } from '@nestjs/common';
import { GetStoreDto } from './dto/get.store.dto';
import { StoresRepository } from './stores.repository';
import { UpdateStoreDto } from './dto/update.store.dto';

@Injectable()
export class StoresService {
  constructor(private readonly storesRepository: StoresRepository) {}

  async getAllStores(): Promise<GetStoreDto[] | null> {
    return await this.storesRepository.selectAllStores();
  }

  async getOneStore(storeId: number): Promise<GetStoreDto | null> {
    return await this.storesRepository.selectOneStore(storeId);
  }

  async updateStore(
    storeId: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<void> {
    return await this.storesRepository.updateStore(storeId, updateStoreDto);
  }

  async deleteStore(storeId: number): Promise<void> {
    return await this.storesRepository.deleteStore(storeId);
  }
}
