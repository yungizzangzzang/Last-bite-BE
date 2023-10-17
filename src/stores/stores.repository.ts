import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateStoreReqDto } from './dto/store.request.dto';
import { GetStoreResData } from './dto/store.response.dto';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

  // * 반경 10km 이내 가게 조회
  async selectAllStoreWithInRadius(
    userLongitude: number,
    userLatitude: number,
  ): Promise<GetStoreResData[]> {
    const stores: GetStoreResData[] = await this.prisma.$queryRawUnsafe<
      GetStoreResData[]
    >(
      `SELECT *
      FROM Stores
      WHERE ST_DISTANCE_SPHERE(POINT(${userLongitude}, ${userLatitude}), POINT(longitude, latitude)) <= 10000`,
    );

    return stores;
  }

  // * 가게 상세 조회
  async selectOneStore(storeId: number): Promise<GetStoreResData> {
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
