import { TestingModule } from '@nestjs/testing';
import { GetItemDto } from 'src/items/dto/get-item.dto';
import { UpdateStoreReqDto } from './dto/store.request.dto';
import { GetStoreResData } from './dto/store.response.dto';
import { StoresController } from './stores.controller';
import { StoresService } from './stores.service';
import { storesTestingModule } from './stores.test-utils';

describe('StoresController', () => {
  let controller: StoresController;
  let service: StoresService;

  beforeEach(async () => {
    const { moduleBuilder } = await storesTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<StoresController>(StoresController);
    service = module.get<StoresService>(StoresService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test1: 가게 전체 조회  /stores(GET)  */
  // describe('getAllStore & no authGuards', () => {
  //   const stores: GetStoreResData[] = [
  //     {
  //       storeId: 1,
  //       ownerId: 1,
  //       name: '떡',
  //       longitude: 12,
  //       latitude: 23,
  //       address: '경기도',
  //       storePhoneNumber: '123-123-123-123',
  //       category: '분식',
  //     },
  //   ];

  //   it('test1 - 가게 전체 조회', async () => {
  //     jest.spyOn(controller, 'getAllStore').mockResolvedValue({ stores });
  //     jest.spyOn(service, 'getAllStore').mockResolvedValue(stores);

  //     // controller의 함수 호출
  //     const result = await controller.getAllStore();

  //     // service의 함수 호출
  //     await service.getAllStore();

  //     expect(result).toEqual({ stores });
  //     expect(controller.getAllStore).toHaveBeenCalledWith();
  //     expect(service.getAllStore).toBeCalledTimes(1);
  //   });
  // });

  /** Test2: 가게 상세 조회 /stores/storeId(GET)  */
  describe('getOneStore with  & authGuards', () => {
    const user: any = { userId: expect.any(Number), isClient: true };
    const store: GetStoreResData = {
      storeId: 1,
      ownerId: null,
      name: '던킨도너츠 경복궁도반병원점',
      longitude: 129.7718567,
      latitude: 35.2453971,
      address: '서울특별시 종로구 새문안로5가길 33, 한누리빌딩 1층 (내자동)',
      storePhoneNumber: '',
      category: '휴게음식점',
      imgUrl: 'http://s3',
    };
    const items: GetItemDto[] = [
      {
        itemId: 40,
        name: '마라탕',
        content: '푸주 맛있어용',
        prevPrice: 20000,
        price: 10000,
        count: 17690,
        startTime: new Date('2023-10-23T17:00:00.000Z'),
        endTime: new Date('2023-10-23T22:25:00.000Z'),
        imgUrl: null,
        deletedAt: null,
        version: 100,
      },
    ];
    const mockResult1: any = { store, items };
    const mockResult2: any = { store, items, isLiked: true };

    it('test2 - 가게 상세 조회', async () => {
      jest.spyOn(controller, 'getOneStore').mockResolvedValue(mockResult1);
      jest.spyOn(service, 'getOneStore').mockResolvedValue(mockResult2);

      // controller의 함수 호출
      const result = await controller.getOneStore(user, store.storeId);

      // service의 함수 호출
      await service.getOneStore(user, store.storeId);

      expect(result).toEqual(mockResult1);
      expect(controller.getOneStore).toHaveBeenCalledWith(user, store.storeId);
      expect(service.getOneStore).toBeCalledTimes(1);
    });
  });

  /** Test3: 가게 수정 /stores/storeId(PUT) with authGuards  */
  describe('updateStore with  & authGuards', () => {
    const userId = expect.any(Number);
    const storeId = expect.any(Number);
    const updateStoreDto: UpdateStoreReqDto = {
      name: expect.any(String),
      storePhoneNumber: expect.any(Number),
      category: expect.any(Number),
    };

    it('test3 - 가게 수정', async () => {
      jest.spyOn(controller, 'updateStore').mockResolvedValue();
      jest.spyOn(service, 'updateStore').mockResolvedValue();

      // controller의 함수 호출
      const result = await controller.updateStore(
        userId,
        storeId,
        updateStoreDto,
      );

      // service의 함수 호출
      await service.updateStore(userId, storeId, updateStoreDto);

      expect(result).toEqual(undefined); // Promise<void>이므로
      expect(controller.updateStore).toHaveBeenCalledWith(
        userId,
        storeId,
        updateStoreDto,
      );
      expect(service.updateStore).toBeCalledTimes(1);
    });
  });

  /** Test4: 가게 삭제 /stores/storeId(Delete) with authGuards  */
  describe('deleteStore with  & authGuards', () => {
    const userId = expect.any(Number);
    const storeId = expect.any(Number);

    it('test4 - 가게 삭제', async () => {
      jest.spyOn(controller, 'deleteStore').mockResolvedValue();
      jest.spyOn(service, 'deleteStore').mockResolvedValue();

      // controller의 호출
      const result = await controller.deleteStore(userId, storeId);

      // service의 호출
      await service.deleteStore(userId, storeId);

      expect(result).toEqual(undefined); // Promise<void>이므로
      expect(controller.deleteStore).toHaveBeenCalledWith(userId, storeId);
      expect(service.deleteStore).toBeCalledTimes(1);
    });
  });
});
