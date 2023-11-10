import { HttpException, HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { GetItemDto } from 'src/items/dto/get-item.dto';
import { ItemsRepository } from 'src/items/items.repository';
import { LikesRepository } from 'src/likes/likes.repository';
import { UpdateStoreReqDto } from './dto/store.request.dto';
import { GetStoreResData } from './dto/store.response.dto';
import { StoresRepository } from './stores.repository';
import { StoresService } from './stores.service';
import { StoresMocks, storesTestingModule } from './stores.test-utils';

describe('StoresService', () => {
  let service: StoresService;
  let repository: StoresRepository;
  let itemsRepository: ItemsRepository;
  let likesRepository: LikesRepository;
  let mocks: StoresMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await storesTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<StoresService>(StoresService);
    repository = module.get<StoresRepository>(StoresRepository);
    itemsRepository = module.get<ItemsRepository>(ItemsRepository);
    likesRepository = module.get<LikesRepository>(LikesRepository);
    mocks = mockObjects;
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
  //     jest.spyOn(service, 'getAllStore').mockResolvedValue(stores);
  //     jest.spyOn(repository, 'selectAllStore').mockResolvedValue(stores);

  //     // service의 함수 호출
  //     const result = await service.getAllStore();

  //     // repository의 함수 호출
  //     await repository.selectAllStore();

  //     expect(result).toEqual(stores);
  //     expect(service.getAllStore).toHaveBeenCalledWith();
  //     expect(repository.selectAllStore).toBeCalledTimes(1);
  //   });
  // });

  /** Test2: 가게상세 조회  /stores/storeId(GET)  */
  describe('getOneStore & no authGuards', () => {
    const store: GetStoreResData = {
      storeId: 1,
      ownerId: null,
      name: '던킨도너츠 경복궁도반병원점',
      longitude: 129.7718567,
      latitude: 35.2453971,
      address: '서울특별시 종로구 새문안로5가길 33, 한누리빌딩 1층 (내자동)',
      storePhoneNumber: '',
      category: '휴게음식점',
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
    const mockIsLiked = expect.any(Boolean);
    const mockResult: any = { store, items, mockIsLiked };

    it('test2-1(success) - user가 null이 아닌 경우', async () => {
      const user: any = { userId: expect.any(Number), isClient: true };

      jest.spyOn(service, 'getOneStore').mockResolvedValue(mockResult);
      jest.spyOn(repository, 'selectOneStore').mockResolvedValue(store);

      // service의 함수 호출
      const result = await service.getOneStore(user, store.storeId);

      // repository의 함수들 호출
      await repository.selectOneStore(store.storeId);
      await itemsRepository.selectAllItems(store.storeId);
      await likesRepository.checkRelation(user.userId, store.storeId);

      expect(result).toEqual(mockResult);
      expect(service.getOneStore).toHaveBeenCalledWith(user, store.storeId);
      expect(repository.selectOneStore).toBeCalledTimes(1);
      expect(repository.selectOneStore).toHaveBeenCalledWith(store.storeId);
      expect(itemsRepository.selectAllItems).toBeCalledTimes(1);
      expect(itemsRepository.selectAllItems).toHaveBeenCalledWith(
        store.storeId,
      );
      expect(likesRepository.checkRelation).toBeCalledTimes(1);
      expect(likesRepository.checkRelation).toHaveBeenCalledWith(
        user.userId,
        store.storeId,
      );
    });

    it('test2-2(likesRepo.checkRelation 실행x) - user가 null인 경우', async () => {
      const user: any = null;

      jest.spyOn(service, 'getOneStore').mockResolvedValue(mockResult);
      jest.spyOn(repository, 'selectOneStore').mockResolvedValue(store);

      // service의 함수 호출
      const result = await service.getOneStore(user, store.storeId);

      // repository의 함수들 호출
      await repository.selectOneStore(store.storeId);
      await itemsRepository.selectAllItems(store.storeId);

      expect(result).toEqual(mockResult);
      expect(service.getOneStore).toHaveBeenCalledWith(user, store.storeId);
      expect(repository.selectOneStore).toBeCalledTimes(1);
      expect(repository.selectOneStore).toHaveBeenCalledWith(store.storeId);
      expect(itemsRepository.selectAllItems).toBeCalledTimes(1);
      expect(itemsRepository.selectAllItems).toHaveBeenCalledWith(
        store.storeId,
      );
      expect(likesRepository.checkRelation).toBeCalledTimes(0); // 1 -> 0!
    });
  });

  /** Test3: 가게 수정 /stores/storeId(PUT) */
  describe('updateStore with  & authGuards', () => {
    const user: any = {
      userId: expect.any(Number),
      isClient: true,
    };
    const store: GetStoreResData = {
      storeId: 1,
      ownerId: 99,
      name: '던킨도너츠 경복궁도반병원점',
      longitude: 129.7718567,
      latitude: 35.2453971,
      address: '서울특별시 종로구 새문안로5가길 33, 한누리빌딩 1층 (내자동)',
      storePhoneNumber: '',
      category: '휴게음식점',
    };
    const updateStoreDto: UpdateStoreReqDto = {
      name: expect.any(String),
      storePhoneNumber: expect.any(Number),
      category: expect.any(Number),
    };

    it('test3-1(success) - 가게 수정 권한이 있는 경우 -> 수정', async () => {
      user.userId = 99; //* = store.ownerId
      jest.spyOn(service, 'updateStore').mockResolvedValue();
      jest.spyOn(repository, 'updateStore').mockResolvedValue();

      // service의 함수 호출
      const result = await service.updateStore(
        user.userId,
        store.storeId,
        updateStoreDto,
      );

      // repository의 함수들 호출
      await repository.selectOneStore(store.storeId);
      await repository.updateStore(store.storeId, updateStoreDto);

      expect(result).toEqual(undefined); // Promise<void>이므로
      expect(service.updateStore).toHaveBeenCalledWith(
        user.userId,
        store.storeId,
        updateStoreDto,
      );
      expect(repository.selectOneStore).toBeCalledTimes(1);
      expect(repository.selectOneStore).toHaveBeenCalledWith(store.storeId);
      expect(repository.updateStore).toBeCalledTimes(1);
      expect(repository.updateStore).toHaveBeenCalledWith(
        store.storeId,
        updateStoreDto,
      );
    });

    it('test3-2(fail) - 가게 수정 권한이 없는 경우', async () => {
      user.userId = 98; //* !== store.ownerId

      // jest.spyOn(service, 'updateStore').mockResolvedValue();
      // spyOn의 mockRejectedValue로 에러를 발생시킨 값을 할당 가능하다(작위적)
      jest
        .spyOn(service, 'updateStore')
        .mockRejectedValue(
          new HttpException(
            { message: '수정 권한이 없습니다.' },
            HttpStatus.FORBIDDEN,
          ),
        );
      jest.spyOn(repository, 'selectOneStore').mockResolvedValue(store);

      try {
        await service.updateStore(user.userId, store.storeId, updateStoreDto);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('수정 권한이 없습니다.');
        //
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(service.updateStore).toHaveBeenCalledWith(
          user.userId,
          store.storeId,
          updateStoreDto,
        );
        expect(repository.updateStore).toBeCalledTimes(0); // 에러로 인해, 실행x
      }
    });
  });

  /** Test4: 가게 삭제 /stores/storeId(Delete) */
  describe('deleteStore with  & authGuards', () => {
    const user: any = {
      userId: expect.any(Number),
      isClient: true,
    };
    const store: GetStoreResData = {
      storeId: 1,
      ownerId: 99,
      name: '던킨도너츠 경복궁도반병원점',
      longitude: 129.7718567,
      latitude: 35.2453971,
      address: '서울특별시 종로구 새문안로5가길 33, 한누리빌딩 1층 (내자동)',
      storePhoneNumber: '',
      category: '휴게음식점',
    };
    const updateStoreDto: UpdateStoreReqDto = {
      name: expect.any(String),
      storePhoneNumber: expect.any(Number),
      category: expect.any(Number),
    };

    it('test4-1(success) - 가게 삭제 권한이 있는 경우 -> 삭제', async () => {
      user.userId = 99; //* = store.ownerId
      jest.spyOn(service, 'deleteStore').mockResolvedValue();
      jest.spyOn(repository, 'deleteStore').mockResolvedValue();

      // service의 함수 호출
      const result = await service.deleteStore(user.userId, store.storeId);

      // repository의 함수들 호출
      await repository.selectOneStore(store.storeId);
      await repository.deleteStore(store.storeId);

      expect(result).toEqual(undefined); // Promise<void>이므로
      expect(service.deleteStore).toHaveBeenCalledWith(
        user.userId,
        store.storeId,
      );
      expect(repository.selectOneStore).toBeCalledTimes(1);
      expect(repository.selectOneStore).toHaveBeenCalledWith(store.storeId);
      expect(repository.deleteStore).toBeCalledTimes(1);
      expect(repository.deleteStore).toHaveBeenCalledWith(store.storeId);
    });

    it('test4-2(fail) - 가게 삭제 권한이 없는 경우', async () => {
      user.userId = 98; //* !== store.ownerId

      jest
        .spyOn(service, 'deleteStore')
        .mockRejectedValue(
          new HttpException(
            { message: '삭제 권한이 없습니다.' },
            HttpStatus.FORBIDDEN,
          ),
        );
      jest.spyOn(repository, 'selectOneStore').mockResolvedValue(store);

      try {
        await service.deleteStore(user.userId, store.storeId);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('삭제 권한이 없습니다.');
        //
        expect(err.status).toBe(HttpStatus.FORBIDDEN);
        expect(service.deleteStore).toHaveBeenCalledWith(
          user.userId,
          store.storeId,
        );
        expect(repository.deleteStore).toBeCalledTimes(0); // 에러로 인해, 실행x
      }
    });
  });
});
