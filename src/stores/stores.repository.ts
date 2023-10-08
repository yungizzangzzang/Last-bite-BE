import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetStoreDto } from './dto/get.store.dto';

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
}
