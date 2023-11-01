import { Test, TestingModule } from '@nestjs/testing';
import { PrismaClient } from '@prisma/client';
import { mockDeep } from 'jest-mock-extended';
import { PrismaService } from 'src/prisma/prisma.service';
import { AlarmsGateway } from './alarms.gateway';
import { AlarmsRepository } from './alarms.repository';

describe('AlarmsGateway', () => {
  let gateway: AlarmsGateway;
  let repository: AlarmsRepository;
  // let mockPrisma: DeepMockProxy<PrismaClient>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AlarmsGateway, AlarmsRepository, PrismaService],
    })
      .overrideProvider(PrismaService)
      .useValue(mockDeep<PrismaClient>())
      .compile();

    gateway = module.get<AlarmsGateway>(AlarmsGateway);
    repository = module.get<AlarmsRepository>(AlarmsRepository);
    // mockPrisma = module.get(PrismaService);
  });

  /** Test1: 이벤트1-clientOrder */
  it('socket1: clientOrder', async () => {
    const data = {
      nickname: 'Tom',
      totalPrice: 14000, // 총결제금액
      storeId: 2,
      userId: 1,
      itemList: [
        {
          name: '떡',
          price: 7000,
        },
        {
          name: '마라탕',
          price: 7000,
        },
      ],

      createdAt: new Date(new Date().getTime() + 1000 * 60 * 60 * 9),
    };
    // const orderItemsList = [
    //   { ordersitemsId: '1', orderId: '1', itemId: '2', count: '5' },
    //   { ordersitemsId: '2', orderId: '1', itemId: '3', count: '5' },
    // ];

    // jest.spyOn(repository, 'checkAndUpdate').mockResolvedValue(data.itemList);
    // jest
    //   .spyOn(repository, 'createdBothOrderTable')
    //   .mockResolvedValue(orderItemsList);

    const mockSocket: any = {
      id: 'socketId',
      broadcast: {
        emit: jest.fn(),
      },
      to: jest.fn(),
      emit: jest.fn(),
    };

    // socket.to(ownerSocketId)가 undefined인 경우를 처리
    // -> socket.to('socketid').emit(~~) 체크가 가능해짐
    mockSocket.to.mockImplementation((result: any) => {
      if (result !== undefined) {
        return {
          emit: jest.fn(), // 여기서 필요한 emit 메서드 추가
        };
      } else {
        return mockSocket; // 다른 경우에는 mockSocket 그대로 반환
      }
    });

    // socket의 clientOrder event호출
    await gateway.clientOrder(data, mockSocket);

    // expect(repository.checkAndUpdate).toHaveBeenCalledWith(
    //   data.userId,
    //   data.totalPrice,
    //   data.itemList,
    // );
    // expect(repository.createdBothOrderTable).toHaveBeenCalledWith(
    //   data.userId,
    //   data.storeId,
    //   data.totalPrice,
    //   data.discount,
    //   data.itemList,
    // );

    // item수량 변경
    // data.itemList[1] = 3;
    // data.itemList[2] = 5;

    // expect(mockSocket.broadcast.emit).toHaveBeenCalledWith('changedItemCnt', {
    //   '1': 3,
    //   '2': 5,
    // });

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'orderAlarmToOwner',
      expect.objectContaining({
        createdAt: expect.any(Date),
        nickname: data.nickname,
        items: data.itemList,
        totalPrice: data.totalPrice,
      }),
    );
  });

  /** Test2: 이벤트2-itemRegister */
  it('socket2: itemRegister', async () => {
    const data: any = {
      name: '떡볶이',
      storeId: '2',
      prevPrice: '5000',
      price: '3000',
      count: '3',
      startTime: '7',
      endTime: '9',
      content: '떢볶이 40퍼 파격 세일입니다',
    };
    const favoriteUsers: any = [1];

    jest.spyOn(repository, 'createItem').mockResolvedValue(data);
    jest
      .spyOn(repository, 'findFavoriteUsers')
      .mockResolvedValue(favoriteUsers);

    const mockSocket: any = {
      id: 'socketId',
      broadcast: {
        emit: jest.fn(),
      },
      to: jest.fn(),
      emit: jest.fn(),
    };

    mockSocket.to.mockImplementation((result: any) => {
      if (result !== undefined) {
        return {
          emit: jest.fn(),
        };
      } else {
        return mockSocket;
      }
    });

    // socket의 clientOrder event호출
    await gateway.itemRegister(data, mockSocket);

    expect(repository.createItem).toHaveBeenCalledWith(
      data.name,
      data.storeId,
      data.prevPrice,
      data.price,
      data.count,
      data.startTime,
      data.endTime,
      data.content,
    );
    expect(repository.findFavoriteUsers).toHaveBeenCalledWith(data.storeId);

    expect(mockSocket.broadcast.emit).toHaveBeenCalledWith(
      'itemRegistered',
      data,
    );
    expect(mockSocket.emit).toHaveBeenCalledWith(
      'favoriteItemUpdated',
      `undefined번 가게의 핫딜(떡볶이)이 추가되었습니다`, // check
    );
  });

  /** Test3: 이벤트3-alarmToFavoriteClient */
  it('socket3: alarmToFavoriteClient', async () => {
    const data: any = {
      storeId: '2',
      title: '떢볶이 파격세일!',
      content: '무려 40퍼나 세일합니다!',
    };
    const favoriteUsers: any = [1];
    const createdAlarm: any = {
      alarmId: 1,
      storeId: data.storeId,
      title: data.title,
      content: data.content,
    };

    jest.spyOn(repository, 'createAlarm').mockResolvedValue(createdAlarm);
    jest
      .spyOn(repository, 'findFavoriteUsers')
      .mockResolvedValue(favoriteUsers);

    const mockSocket: any = {
      id: 'socketId',
      broadcast: {
        emit: jest.fn(),
      },
      to: jest.fn(),
      emit: jest.fn(),
    };

    mockSocket.to.mockImplementation((result: any) => {
      if (result !== undefined) {
        return {
          emit: jest.fn(),
        };
      } else {
        return mockSocket;
      }
    });

    // socket의 clientOrder event호출
    await gateway.alarmToFavoriteClient(data, mockSocket);

    expect(repository.createAlarm).toHaveBeenCalledWith(
      data.title,
      data.content,
      data.storeId,
    );
    expect(repository.findFavoriteUsers).toHaveBeenCalledWith(data.storeId);

    expect(mockSocket.emit).toHaveBeenCalledWith(
      'alarmToFavoriteClient',
      createdAlarm,
    );
  });
});
