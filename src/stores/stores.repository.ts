import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetStoreDto } from './dto/get.store.dto';
import { UpdateStoreDto } from './dto/update.store.dto';

@Injectable()
export class StoresRepository {
  constructor(private readonly prisma: PrismaService) {}

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

  async selectOneStore(storeId: number): Promise<GetStoreDto | null> {
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

    return store;
  }

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

  async deleteStore(storeId: number): Promise<void> {
    await this.prisma.stores.delete({
      where: {
        storeId,
      },
    });
  }
}
