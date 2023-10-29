import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateStoreReqDto } from './dto/store.request.dto';
import { GetStoreResData } from './dto/store.response.dto';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  // * 가게 전체 조회
  async selectAllStore(): Promise<GetStoreResData[]> {
    const stores: GetStoreResData[] = await this.prisma.stores.findMany({
      where: {
        deletedAt: null,
      },
      select: {
        storeId: true,
        ownerId: true,
        name: true,
        longitude: true,
        latitude: true,
        address: true,
        storePhoneNumber: true,
        category: true,
      },
    });

    return stores;
  }

  // * 가게 상세 조회
  async selectOneStore(storeId: number): Promise<GetStoreResData | null> {
    const store: GetStoreResData | null = await this.prisma.stores.findUnique({
      where: {
        storeId,
        deletedAt: null,
      },
      select: {
        storeId: true,
        ownerId: true,
        name: true,
        longitude: true,
        latitude: true,
        address: true,
        storePhoneNumber: true,
        category: true,
      },
    });

    return store;
  }

  // * 가게 수정
  async updateStore(
    storeId: number,
    updateStoreReqDto: UpdateStoreReqDto,
  ): Promise<void> {
    await this.prisma.stores.update({
      where: {
        storeId,
      },
      data: {
        ...updateStoreReqDto,
      },
    });
  }

  // * 가게 삭제
  async deleteStore(storeId: number): Promise<void> {
    await this.prisma.stores.update({
      where: {
        storeId,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
