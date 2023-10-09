import { Injectable } from '@nestjs/common';
import { GetStoreDto } from './dto/get.store.dto';
import { StoresRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(private readonly storesRepository: StoresRepository) {}

  async getAllStores(): Promise<GetStoreDto[]> {
    return await this.storesRepository.selectAllStores();
  }

  async getOneStore(storeId: number): Promise<GetStoreDto | null> {
    return await this.storesRepository.selectOneStore(storeId);
  }
}
