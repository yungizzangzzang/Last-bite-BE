import { InjectQueue } from '@nestjs/bull';
import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { Queue } from 'bull';
import { ItemsRepository } from 'src/items/items.repository';
import { OrderItemsRepository } from 'src/order-items/order-items.repository';
import { AuthService } from 'src/users/auth/auth.service';
import { CreateOrderOrderItemDto } from './dto/create-order.dto';
import { OneOrderDTO } from './dto/get-one-order.dto';
import { UserOrdersDTO } from './dto/get-user-orders.dto';
import { OrdersRepository } from './orders.repository';

@Injectable()
export class OrdersService {
  constructor(
    @InjectQueue('ordersQueue') private ordersQueue: Queue, // bullqueue DI
    private readonly ordersRepository: OrdersRepository,
    private readonly orderItemsRepository: OrderItemsRepository,
    private readonly authService: AuthService,
    private readonly eventEmitter: EventEmitter2,
    private readonly itemsRepository: ItemsRepository,
  ) {}

  // * return에서 {} 감싸도 create 혹은 완료 메세지 출력에 이상 없는지 확인!

  async createOrder(
    createOrderOrderItemDto: CreateOrderOrderItemDto,
    userId: number,
  ): Promise<{ message: string }> {
    const results: (string | undefined)[] = await Promise.all(
      createOrderOrderItemDto.items.map(async (orderItem) => {
        const itemId = orderItem.itemId;
        const item = await this.itemsRepository.getOneItem(itemId);

        // Items.count < OrderItems.count 일때 주문 불가
        if (orderItem.count > item.count) {
          return `${item.name}의 주문 가능 수량은 ${item.count}개 입니다.`;
        }
      }),
    );

    // if 문 true 일 때 반환되는 undefined 제거
    const filteredResults = results.filter((result) => result !== undefined);

    // 에러 메세지 반환
    if (filteredResults.length > 0) {
      throw new HttpException(
        { message: filteredResults },
        HttpStatus.BAD_REQUEST,
      );
    }

    const order = await this.ordersRepository.createOrder(
      createOrderOrderItemDto,
      userId,
    );

    await this.orderItemsRepository.createOrderItem(
      order.orderId,
      createOrderOrderItemDto.items,
    );

    const orderId = order.orderId;
    // ! itemId는 배열로 받아오면 힘들 것 같아 임시로 지정함. 나중에 바꿔주기.
    const itemId = 40;

    // 각 주문에 대한 unique한 eventName 생성
    const eventName = `Orders-${orderId}-${
      Math.floor(Math.random() * 99999) + 1
    }`;
    console.log('1. eventName: ', eventName);

    // ordersQueue에 해당 event를 orderId와 userId를 함께 보내줌
    console.log('2. ordersQueue에 job 추가');
    await this.ordersQueue.add(
      'addToOrdersQueue',
      {
        orderId,
        userId,
        itemId,
      },
      {
        attempts: 2,
        removeOnComplete: true,
        removeOnFail: true,
      },
    );

    // 1. 주문 요청을 queue에 넣는 메서드
    // 대기열 큐에 job을 넣은 후, service 내에서 waitingForJobCompleted() 함수로 해당 job을 넘겨줌
    console.log(' 3. waitingForJobCompleted() 호출');
    const addToOdersQueue = await this.waitingForJobCompleted(
      eventName,
      2,
      order,
    );

    return { message: '예약이 완료되었습니다.' };
  }

  // 2. 해당 요청에 대한 비즈니스로직 (sendRequest())이 완료될 때까지 대기 후 결과를 반환하는 메소드
  async waitingForJobCompleted(
    eventName: string,
    time: number,
    user: object,
  ): Promise<object> {
    console.log('waitingForJobCompleted() 진입');
    return new Promise((resolve, reject) => {
      console.log('5. Promise 진입');

      // wait으로 들어와 2초를 기다리는 setTimeout() 함수 실행
      const wait = setTimeout(() => {
        console.log('** setTimeout() 진입');
        this.eventEmitter.removeAllListeners(eventName);
        resolve({
          message: '다시 시도해주세요',
        });
      }, time * 1000);

      // wait과 동시에 this.eventEmitter에 전달받은 eventName에 대해 콜백함수로 세팅된다.
      const listeningCallback = ({
        success,
        exception,
      }: {
        success: boolean;
        exception?: HttpException;
      }) => {
        console.log('7. listenFn 진입');
        clearTimeout(wait);
        this.eventEmitter.removeAllListeners(eventName);
        success ? resolve({ user }) : reject(exception); // 비즈니스로직이 성공했다면 resolve, 실패했을 경우 reject
      };
      console.log('6. this.eventEmitter.addListener 세팅');
      // sendRequest()에서 전달해준 비즈니스 로직이 성공이든, 실패든,
      // 기다리고 있던 waitingForJobCompleted()의 이벤트 리스너가 이벤트를 전달받아, 클라이언트에 응답을 보내줄 수 있다.
      this.eventEmitter.addListener(eventName, listeningCallback);
    });
  }

  // 3. 주문 요청에 대한 비즈니스 로직을 수행하는 메소드
  async sendRequest(
    orderId: number,
    userId: number,
    itemId: number,
    eventName: string,
  ) {
    console.log('*2 sendRequest 진입');
    try {
      const item = await this.itemsRepository.getOneItem(itemId);
      const availableOrders = item?.count;
      if (availableOrders === 0) {
        throw new HttpException(
          '주문이 마감되었습니다. 다른 상품을 알아보시는 건 어떨까요?',
          HttpStatus.SERVICE_UNAVAILABLE,
        );
      }

      // 비즈니스로직이 완료되었음을 이벤트 리스너에게 알림
      return this.eventEmitter.emit(eventName, { success: true });
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }

      // 비즈니스로직이 실패했음을 이벤트 리스너에게 알림
      return this.eventEmitter.emit(eventName, {
        success: false,
        exception: error,
      });
    }
  }

  async getUserOrders(userId: number) {
    const result: UserOrdersDTO[] = await this.ordersRepository.getUserOrders(
      userId,
    );
    return result;
  }

  async getOneOrder(orderId: number) {
    const result: OneOrderDTO = await this.ordersRepository.getOneOrder(
      orderId,
    );
    return result;
  }
  // bullqueue UI dashboard를 위한 메소드
  getRequestQueueForBoard(): Queue {
    return this.ordersQueue;
  }
}
