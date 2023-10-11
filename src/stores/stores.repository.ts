import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetStoreDto } from './dto/get-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  // * 가게 전체 조회
  async selectAllStores(): Promise<GetStoreDto[]> {
    const stores: GetStoreDto[] = await this.prisma.stores.findMany({
      select: {
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
  async selectOneStore(storeId: number): Promise<GetStoreDto> {
    const store: GetStoreDto | null = await this.prisma.stores.findUnique({
      where: {
        storeId,
      },
      select: {
        ownerId: true,
        name: true,
        longitude: true,
        latitude: true,
        address: true,
        storePhoneNumber: true,
        category: true,
      },
    });

    // ! 해당하는 가게가 존재하지 않는 경우
    if (!store) {
      throw new HttpException(
        { message: '해당하는 가게가 존재하지 않습니다.' },
        HttpStatus.NOT_FOUND,
      );
    }

    return store;
  }

  // * 가게 수정
  async updateStore(
    storeId: number,
    updateStoreDto: UpdateStoreDto,
  ): Promise<void> {
    await this.prisma.stores.update({
      where: {
        storeId,
      },
      data: {
        ...updateStoreDto,
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
