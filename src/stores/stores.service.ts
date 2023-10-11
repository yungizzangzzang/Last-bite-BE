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
  ): Promise<{ store: GetStoreDto; items: GetItemDto[] }> {
    const store: GetStoreDto = await this.storesRepository.selectOneStore(
      storeId,
    );
    const items: GetItemDto[] = await this.itemsRepository.selectAllItems(
      storeId,
    );

    return { store, items };
  }

  // * 가게 수정
  async updateStore(
    storeId: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<void> {
    const store: GetStoreDto = await this.storesRepository.selectOneStore(
      storeId,
    );
    // ! 수정 권한이 없는 경우
    // if () {
    // throw new HttpException(
    //   { message: '수정 권한이 없습니다.' },
    //   HttpStatus.FORBIDDEN,
    // );
    // }

    return await this.storesRepository.updateStore(storeId, updateStoreDto);
  }

  // * 가게 삭제
  async deleteStore(storeId: number): Promise<void> {
    const store: GetStoreDto = await this.storesRepository.selectOneStore(
      storeId,
    );
    // ! 삭제 권한이 없는 경우
    // if () {
    // throw new HttpException(
    //   { message: '삭제 권한이 없습니다.' },
    //   HttpStatus.FORBIDDEN,
    // );
    // }
    return await this.storesRepository.deleteStore(storeId);
  }
}
