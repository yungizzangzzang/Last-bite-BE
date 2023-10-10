import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AlarmsRepository {
  constructor(private readonly prisma: PrismaService) {}

  /** 1. checkAndUpdate  */
  // (1)잔금체크 -> (ok) -> (2)재고 체크 -> (ok) -> (3)잔금차감 및 재고차감 업데이트
  // transaction안에서는 this.prisma x -> prisma.tables
  // *재고가 없는 경우? -> 각 모든 상품의 경우 재고를 일일이 비교 해야 한다 -> 한개라도 x면 주문 통째로 취소
  async checkAndUpdate(userId: number, sumPoint: number, itemList: any) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // a. 잔금체크
        const user: any = await prisma.users.findUnique({
          where: { userId },
        });
        const remainedPoint = user.point - sumPoint;
        if (remainedPoint < 0) {
          throw new UnauthorizedException('tx실패1: 잔금이 부족합니다');
        }
        // b.(물품 구매 시작)각 아이템의 재고 체크(순회)
        const cntList: any = []; // 아래 c에서 쓸 것
        for (const key in itemList) {
          // b-1: 각 아이템 찾고,
          const item: any = await prisma.items.findUnique({
            where: { itemId: Number(key) },
          });
          cntList.push(item.count);
          // b-2: 각 아이템의 재고수 확인
          if (item.count - itemList[key] < 0) {
            throw new UnauthorizedException( // break개념
              `tx실패2: ${item.name}의 재고가 부족합니다`,
            );
          }
        }
        cntList.reverse(); // shift <<< pop
        // c. 여기까지 통과했다면, user포인트 & item재고(count) 업데이트하기
        const changedItemCnt: any = {};
        await prisma.users.update({
          where: { userId },
          data: { point: remainedPoint },
        });
        for (const key in itemList) {
          await prisma.items.update({
            where: { itemId: Number(key) },
            data: { count: cntList.at(-1) - itemList[key] },
          });
          changedItemCnt[Number(key)] = cntList.at(-1) - itemList[key];
          cntList.pop();
        }
        return changedItemCnt;
      });
      return result;
    } catch (err) {
      console.error(err);
      throw new HttpException('서버에러', 500);
    }
  }

  /** 2. 구매내역 생성 */
  // Orders먼저 만들고 -> OrdersItems만들기
  async createdBothOrderTable(
    userId: number,
    storeId: number,
    totalPrice: number,
    discount: number,
    itemList: any,
  ) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // (1)Orders
        const createdOrder = await prisma.orders.create({
          data: {
            userId,
            storeId,
            totalPrice,
            discount,
          },
        });
        const orderId = createdOrder.orderId; // 테이블 id명 orderId맞는지 체크
        // (2)OrdersItems
        const orderItemsList: any = [];
        for (const key in itemList) {
          const createdOrderItems = await prisma.ordersItems.create({
            data: {
              itemId: Number(key),
              count: itemList[key],
              orderId,
            },
          });
          orderItemsList.push(createdOrderItems);
        }
        return [createdOrder, orderItemsList];
      });
      return result;
    } catch (err) {
      console.error(err);
      throw new HttpException('서버에러', 500);
    }
  }

  // 3. 사장id 찾기 - for socket.to(ownerId).emit
  async findOwnerId(StoreId: number) {
    try {
      const store = await this.prisma.stores.findUnique({
        where: { storeId: StoreId },
      });

      return store?.ownerId; // *스키마 바뀌면 OwnerId로(대문자)
    } catch (err) {
      console.error(err);
      throw new HttpException('서버에러', 500);
    }
  }

  // 4. 사장님의 핫딜 상품 등록
  async createItem(
    name: string,
    storeId: number, // 대문자 - 스키마확인
    prevPrice: number,
    price: number,
    count: number,
    startTime: Date,
    endTime: Date,
    content: string,
  ) {
    try {
      const createdItem = await this.prisma.items.create({
        data: {
          name,
          storeId, // 대문자 - 스키마확인, StoreId: storeId..
          prevPrice,
          price,
          count,
          startTime,
          endTime,
          content,
        },
      });

      return createdItem;
    } catch (err) {
      console.error(err);
      throw new HttpException('서버에러', 500);
    }
  }

  // 5. 해당 가게를 단골등록한 유저들의 리스트 뽑기
  async findFavoriteUsers(StoreId: number) {
    try {
      const likes = await this.prisma.likes.findMany({
        where: { storeId: StoreId },
      });
      // console.log(likes);
      const users = likes.map((row) => row.userId); // 대소문자
      console.log(users);

      return users;
    } catch (err) {
      console.error(err);
      throw new HttpException('서버에러', 500);
    }
  }

  // 6. 사장님의 수동 알람1 - 알람 생성
  async createAlarm(title: string, content: string, storeId: number) {
    try {
      const createdAlarm = this.prisma.alarms.create({
        data: {
          title,
          content,
          storeId,
        },
      });
      return createdAlarm;
    } catch (err) {
      console.error(err);
      throw new HttpException('서버에러', 500);
    }
  }
}

/* 백업 코드
다른 모듈에 코드를 작성하게 된다면, imports에 alarmsModule추가(providers x)
import { xxModel } from '../xxs/xxs.model';
import { xxModel } from '../xxs/xxs.model';
import { xxDto } from '~';
io.of(`/ws-${url}`) ===
  this.eventsGateway.server
      .to(`/ws-${url}-${chatWithUser.ChannelId}`)
      .emit('message', chatWithUser);
  }
*/
