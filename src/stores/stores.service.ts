import { Injectable } from '@nestjs/common';
import { GetItemDto } from 'src/items/dto/get-item.dto';
import { ItemsRepository } from 'src/items/items.repository';
import { GetStoreDto } from './dto/get-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { StoresRepository } from './stores.repository';

@Injectable()
export class StoresService {
  constructor(
    private readonly storesRepository: StoresRepository,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  // * 가게 전체 조회
  async getAllStores(): Promise<GetStoreDto[] | null> {
    return await this.storesRepository.selectAllStores();
  }

  // * 가게 상세 조회
  async getOneStore(
    storeId: number,
  ): Promise<{ store: GetStoreDto | null; items: GetItemDto[] | null }> {
    const store = await this.storesRepository.selectOneStore(storeId);
    const items = await this.itemsRepository.selectAllItems(storeId);

    return { store, items };
  }

  // * 가게 수정
  async updateStore(
    storeId: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<void> {
    return await this.storesRepository.updateStore(storeId, updateStoreDto);
  }

  // * 가게 삭제
  async deleteStore(storeId: number): Promise<void> {
    return await this.storesRepository.deleteStore(storeId);
  }
}
