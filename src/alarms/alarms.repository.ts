// import { xxModel } from '../xxs/xxs.model';
// import { xxModel } from '../xxs/xxs.model';
// import { xxDto } from '~';
// import { Prisma } from @prisma/client
import { Injectable } from '@nestjs/common';

@Injectable()
export class AlarmsRepository {
  // constructor(private readonly prisma: Prisma) {}

  // 0. 잔금체크
  async checkPoint(data: any) {}

  // 1. 재고 감소(cnt)
  async itemUpdate(data: any) {}

  // 2. 구매내역 생성
  async itemHistoryUpdate(data: any) {}

  // 3. 사장id 찾기 - for socket.to(ownerId).emit
  async findOwnerId(OwnerId: any) {}

  // 4. 사장님의 핫딜 상품 등록
  async createItem(dd: any) {}
}
