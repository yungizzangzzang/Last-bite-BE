import { Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { AlarmsRepository } from './alarms.repository';
// import { JwtAuthGuard } from 'src/users/guards/jwt-auth.guard';

// @UseGuards(JwtAuthGuard)
@WebSocketGateway({
  cors: {
    origin: '*', // or "http://localhost:xxxx"
    methods: ['GET', 'POST'],
    allowedHeaders: '*',
    credentials: true,
  }, // nsp is here
})
export class AlarmsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private readonly alarmsRepository: AlarmsRepository) {}
  private logger = new Logger('alarm');
  @WebSocketServer() public server: Server;

  afterInit() {
    this.logger.log('socket Init');
  }
  handleConnection(@ConnectedSocket() socket: Socket) {
    this.logger.log(`connected: ${socket.id}`);
  }
  handleDisconnect(@ConnectedSocket() socket: Socket) {
    this.logger.log(`disconnected: ${socket.id}`);
  }

  // Todo: clients에 잘 담기는지, test하기 & dto
  // clients: any = {};
  // clients[userId] = socket.id // useGuards이용

  /** 1. 고객이 주문 */
  // @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('clientOrder') // 이벤트명 - 프론트에서emit한 것을 on받는 것과 같음(=socket.on)
  async clientOrder(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(data, socket.id); // 체크용

    // (1-0)잔금 체크 & 재고 체크 -> 업데이트 (by트랜잭션)
    // *deadlock문제도 생각해보기
    const changedItemCnt = await this.alarmsRepository.checkAndUpdate(
      data.userId,
      data.sumPoint,
      data.itemList,
    );

    // (1-1)Orders, OrdersItems 테이블 생성
    const createdBothOrder = await this.alarmsRepository.createdBothOrderTable(
      data.userId,
      data.discount,
      data.itemList, // {itemId:count, 1:3, 2:5, ...}
    );

    // (2-1)바뀐 재고량 모두에게 emit
    socket.broadcast.emit(
      'changedItemCnt',
      changedItemCnt, // itemId가 key, 변화한 재고량이 value를 요소로 가진 객체
    );
    // (2-2)해당 사장에게'만' 주문 알람 emit
    const findOwnerId = await this.alarmsRepository.findOwnerId(data.storeId);
    console.log(findOwnerId);
    // const ownerSocketId = clients[findOwnerId];
    socket
      .to('Owner의 socketId') // 수정
      .emit('orderAlarmToOwner', createdBothOrder[1]); // [1]가 OrdersItems테이블, [0]는 Orders
  }

  /** 2. 사장이 핫딜상품 등록 */
  // @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('itemRegister')
  async itemRegister(
    @MessageBody() item: any,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(item, socket.id);
    const createdItem = await this.alarmsRepository.createItem(
      item.name,
      item.storeId,
      item.prevPrice,
      item.price,
      item.count,
      item.startTime,
      item.endTime,
      item.content,
    );

    // (emit1)추가된 핫딜 상품 리스트는 "모두에게" 실시간 업데이트
    socket.broadcast.emit('itemRegistered', createdItem);
    // (emit2)해당 가게를 "단골 등록한" 사람"들"에게"만" 알람 -> 이 로직이 3번째 socket함수랑 살짝 겹치는데 흠..
    const favoriteUsers = await this.alarmsRepository.findFavoriteUsers(
      item.storeId,
    );
    console.log(favoriteUsers);
    socket
      .to('users리스트')
      .emit(
        'favoriteItemUpdated',
        `${item.sotreId}번 가게의 핫딜(${item.name})이 추가되었습니다`,
      );
  }

  /** 3. 사장이 단골 고객에게만 보내는 알림*/
  // @UseGuards(AuthGuard('jwt'))
  @SubscribeMessage('alarmToFavoriteClient')
  async AlarmToFavoriteClient(
    @MessageBody() data: any,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log(data, socket.id);
    // (1)
    const createdAlarm = await this.alarmsRepository.createAlarm(
      data.title,
      data.content,
      data.storeId,
    );
    // (2)
    const favoriteUsers = await this.alarmsRepository.findFavoriteUsers(
      data.storeId,
    );
    // (3)emit
    for (const favoriteUser of favoriteUsers) {
      socket
        .to('favoriteUser의 socketId') // clients객체이용해서
        .emit('alarmToFavoriteClient', createdAlarm);
    }
  }
}

// return, nsp
// 각 함수뒤에 type일단 빼놓음
/* item 모듈에 아래 로직?
if (result) {
  const io = req.app.get('io');
  io.of('/board').emit('addColumn', result.column); // .column추가 api
}
*/
