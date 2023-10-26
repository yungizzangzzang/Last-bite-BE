import { TestingModule } from '@nestjs/testing';
import { CreateItemDto } from './dto/create-item.dto';
import { GetItemDto } from './dto/get-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsRepository } from './items.repository';
import { ItemsService } from './items.service';
import { ItemsMocks, itemsTestingModule } from './items.test-utils';

describe('ItemsService', () => {
  let service: ItemsService;
  let repository: ItemsRepository;
  let mocks: ItemsMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await itemsTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    service = module.get<ItemsService>(ItemsService);
    repository = module.get<ItemsRepository>(ItemsRepository);
    mocks = mockObjects;
  });

  /** Test1,2: 핫딜 등록, 수정 */
  describe('createItem with createItemDto, urlByS3Key, userId', () => {
    const createItemDto: CreateItemDto = {
      name: '떡볶이',
      content: '40퍼 파격할인',
      prevPrice: 10000,
      price: 6000,
      count: 10,
      startTime: 7,
      endTime: 9,
    };
    const updateItemDto: UpdateItemDto = {
      name: '떡볶이',
      content: '40퍼 파격할인',
      prevPrice: 10000,
      price: 6000,
      count: 10,
      startTime: 8, // 수정
      endTime: 10, // 수정
    };
    const mockStartTime = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      createItemDto.endTime,
    );
    const mockEndTime = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      new Date().getDate(),
      createItemDto.endTime,
    );

    const urlByS3Key =
      'https://megis3.s3.ap-northeast-2.amazonaws.com/default.png';
    const userId = 1;

    it('test1 - 핫딜 생성', async () => {
      jest
        .spyOn(service, 'createItem')
        .mockResolvedValue({ message: '핫딜 생성이 완료되었습니다.' });
      jest
        .spyOn(repository, 'createItem')
        .mockResolvedValue({ message: '핫딜 생성이 완료되었습니다.' });

      const result = await service.createItem(
        createItemDto,
        urlByS3Key,
        userId,
      );
      await repository.createItem(
        createItemDto,
        urlByS3Key,
        mockStartTime,
        mockEndTime,
        userId,
      );

      expect(result).toEqual({ message: '핫딜 생성이 완료되었습니다.' });
      expect(service.createItem).toHaveBeenCalledWith(
        createItemDto,
        urlByS3Key,
        userId,
      );
      expect(repository.createItem).toBeCalledTimes(1);
    });

    it('test2 - 핫딜 수정', async () => {
      const mockItemId = 1;
      jest
        .spyOn(service, 'updateItem')
        .mockResolvedValue({ message: '핫딜 수정이 완료되었습니다.' });
      jest
        .spyOn(repository, 'updateItem')
        .mockResolvedValue({ message: '핫딜 수정이 완료되었습니다.' });

      const result = await service.updateItem(
        mockItemId,
        updateItemDto,
        urlByS3Key,
        userId,
      );
      await repository.updateItem(
        mockItemId,
        updateItemDto,
        urlByS3Key,
        mockStartTime,
        mockEndTime,
        userId,
      );

      expect(result).toEqual({ message: '핫딜 수정이 완료되었습니다.' });
      expect(service.updateItem).toHaveBeenCalledWith(
        mockItemId,
        updateItemDto,
        urlByS3Key,
        userId,
      );
      expect(repository.updateItem).toBeCalledTimes(1);
    });
  });

  /** Test3: 핫딜 삭제 */
  describe('deleteItem with itemId, userId', () => {
    const mockItemId = 1;
    const mockUserId = 1;

    it('test3', async () => {
      jest
        .spyOn(service, 'deleteItem')
        .mockResolvedValue({ message: '핫딜 삭제가 완료되었습니다.' });
      jest
        .spyOn(repository, 'deleteItem')
        .mockResolvedValue({ message: '핫딜 삭제가 완료되었습니다.' });

      const result = await service.deleteItem(mockItemId, mockUserId);
      await repository.deleteItem(mockItemId, mockUserId);

      expect(result).toEqual({ message: '핫딜 삭제가 완료되었습니다.' });
      expect(service.deleteItem).toHaveBeenCalledWith(mockItemId, mockUserId);
      expect(repository.deleteItem).toBeCalledTimes(1);
    });
  });

  /** Test4: getOneItem */
  describe('getOneItem with itemId', () => {
    const mockItem: GetItemDto = {
      itemId: 1,
      name: '떡볶이',
      content: '파격할인',
      prevPrice: 12000,
      price: 10000,
      count: 2,
      startTime: new Date(),
      endTime: new Date(),
      imgUrl: 'asd',
      deletedAt: new Date(),
    };

    it('test4', async () => {
      jest.spyOn(service, 'getOneItem').mockResolvedValue(mockItem);
      jest.spyOn(repository, 'getOneItem').mockResolvedValue(mockItem);

      const result = await service.getOneItem(mockItem.itemId);
      await repository.getOneItem(mockItem.itemId);

      expect(result).toEqual(mockItem);
      expect(service.getOneItem).toHaveBeenCalledWith(mockItem.itemId);
      expect(repository.getOneItem).toBeCalledTimes(1);
    });
  });
});
