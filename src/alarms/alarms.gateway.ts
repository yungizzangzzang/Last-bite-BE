import { AlarmsRepository } from './alarms.repository';
import { Logger } from '@nestjs/common';
import { Socket } from 'socket.io';
// import { Prisma } from '@prisma/client';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  WebSocketGateway,
} from '@nestjs/websockets';

@WebSocketGateway() // nsp is here
export class AlarmsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly alarmsRepository: AlarmsRepository) {}
  private logger = new Logger('alarm');
  afterInit() {
    this.logger.log('socket Init');
  }
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}`);
  }

  /** 1. 고객 주문 */
  @SubscribeMessage('clientOrder') // 이벤트명 - 프론트에서emit한 것을 on받는 것과 같음
  async clientOrder(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    //data:(Histories)itemId, UserId, count, createdAt
    console.log(data, socket.id); // 체크용

    // *(0)잔금 체크 한번 더 -> 필요한가?
    const checkedPoint = await this.alarmsRepository.checkPoint(data.userId);
    // if (checkedPoint < 0) {
    //   throw new UnauthorizedException('남은 포이트가 없습니다')
    // }

    // (1)해당 상품 재고수 감소 및 '모두에게' 알람
    const itemHistoryUpdated = await this.alarmsRepository.itemHistoryUpdate(
      data,
    );
    const itemUpdated = await this.alarmsRepository.itemHistoryUpdate(data);
    socket.broadcast.emit(
      'itemCountDecreased',
      '모두에게 감소된 수량 업데이트',
    );

    // (2)해당 사장에게'만' 주문 알람 - a)접속중일 때, b)접속x일 때
    const findOwnerId = await this.alarmsRepository.findOwnerId(OwnerId);
    socket
      .to('socket.OwnerId')
      .emit('orderAlarmToOwner', '사장에게 알림 보내기');

    console.log(itemHistoryUpdated, itemUpdated, findOwnerId);
  }

  /** 2. 사장이 핫딜상품 등록 */
  @SubscribeMessage('itemRegister')
  async itemRegister(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(data, socket.id);
    const createdItem = await this.alarmsRepository.createItem(data);

    // (0)추가된 핫딜 상품 리스트는 모두에게 실시간 업데이트
    socket.broadcast.emit('itemRegister', createdItem);
    // (1)해당 가게를 "단골 등록한" 사람"들"에게"만" 알람
    socket.to('users리스트').emit('favoriteItemUpdated', '단골들에게만 알람');
  }
}

// return, nsp
// 각 함수뒤에 type일단 빼놓음
/* item, history 모듈에 아래 로직?
if (result) {
  const io = req.app.get('io');
  io.of('/board').emit('addColumn', result.column); // .column추가 api
}
*/
