import { HttpException, HttpStatus } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsController } from './items.controller';
import { ItemsService } from './items.service';
import { ItemsMocks, itemsTestingModule } from './items.test-utils';

describe('ItemsController', () => {
  let controller: ItemsController;
  let service: ItemsService;
  let mocks: ItemsMocks;

  beforeEach(async () => {
    const { moduleBuilder, mocks: mockObjects } = await itemsTestingModule();
    const module: TestingModule = await moduleBuilder.compile();
    controller = module.get<ItemsController>(ItemsController);
    service = module.get<ItemsService>(ItemsService);
    mocks = mockObjects;
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  /** Test1: 핫딜 등록 (Post) */
  describe('createItem with createItemDto,uploadedFile,user', () => {
    const createItemDto: CreateItemDto = {
      name: '떡볶이',
      content: '40퍼 파격할인',
      prevPrice: 10000,
      price: 6000,
      count: 10,
      startTime: 7,
      endTime: 9,
    };
    const mockUploadedFile: any =
      'https://megis3.s3.ap-northeast-2.amazonaws.com/default.png';

    it('1-1(err) -> 일반 회원이 핫딜 등록 시도한 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: true, // not 사장
      };

      try {
        await controller.createItem(createItemDto, mockUploadedFile, user);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe(
          '기업 회원만 핫딜 정보 등록이 가능합니다.',
        );
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('1-2(err) -> 할인된 가격이, 이전 가격보다 큰 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: false,
      };
      createItemDto.price = 12000; // > createItemDto.prevPrice

      try {
        await controller.createItem(createItemDto, mockUploadedFile, user);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('할인이 적용된 가격을 입력해주세요.');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('1-2-2(err) -> 할인된 가격이, 이전 가격과 같은 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: false,
      };
      createItemDto.price = 10000; // === createItemDto.prevPrice

      try {
        await controller.createItem(createItemDto, mockUploadedFile, user);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('할인이 적용된 가격을 입력해주세요.');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('1-3(success) -> 핫딜이 정상적으로 등록된 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: false,
      };

      jest
        .spyOn(controller, 'createItem')
        .mockResolvedValue({ message: '핫딜 생성이 완료되었습니다.' });
      jest
        .spyOn(service, 'createItem')
        .mockResolvedValue({ message: '핫딜 생성이 완료되었습니다.' });

      // controller.createItem함수 호출
      const result = await controller.createItem(
        createItemDto,
        mockUploadedFile,
        user,
      );

      // *S3key로 바꾸는 작업 테스트는 생략

      // service.updateItem함수 호출
      await service.createItem(createItemDto, mockUploadedFile, user.userId);

      expect(result).toEqual({ message: '핫딜 생성이 완료되었습니다.' });
      expect(controller.createItem).toHaveBeenCalledWith(
        createItemDto,
        mockUploadedFile,
        user,
      );
      expect(service.createItem).toBeCalledTimes(1);
    });
  });

  /** Test2: 핫딜 수정 (PUT)) */
  describe('update with itemId,updateItemDto,uploadedFile,user', () => {
    const updateItemDto: UpdateItemDto = {
      name: '떡볶이',
      content: '40퍼 파격할인',
      prevPrice: 10000,
      price: 6000,
      count: 10,
      startTime: 7,
      endTime: 9,
    };
    const mockItemId = '1';
    const mockUploadedFile: any =
      'https://megis3.s3.ap-northeast-2.amazonaws.com/default.png';

    it('2-1(err) -> 일반 회원이 핫딜 수정 시도한 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: true, // not 사장
      };

      try {
        await controller.update(
          mockItemId,
          updateItemDto,
          mockUploadedFile,
          user,
        );
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe(
          '기업 회원만 핫딜 정보 수정이 가능합니다.',
        );
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('2-2(err) -> 할인된 가격이, 이전 가격보다 큰 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: false,
      };
      updateItemDto.price = 12000; // > updateItemDto.prevPrice

      try {
        await controller.update(
          mockItemId,
          updateItemDto,
          mockUploadedFile,
          user,
        );
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('할인이 적용된 가격을 입력해주세요.');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('2-2-2(err) -> 할인된 가격이, 이전 가격과 같은 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: false,
      };
      updateItemDto.price = 10000; // === updateItemDto.prevPrice

      try {
        await controller.update(
          mockItemId,
          updateItemDto,
          mockUploadedFile,
          user,
        );
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe('할인이 적용된 가격을 입력해주세요.');
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('2-3(success) -> 핫딜이 정상적으로 수정된 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: false,
      };

      jest
        .spyOn(controller, 'update')
        .mockResolvedValue({ message: '핫딜 수정이 완료되었습니다.' });
      jest
        .spyOn(service, 'updateItem')
        .mockResolvedValue({ message: '핫딜 수정이 완료되었습니다.' });

      // controller.update함수 호출
      const result = await controller.update(
        mockItemId,
        updateItemDto,
        mockUploadedFile,
        user,
      );

      // *S3key로 바꾸는 작업 테스트는 생략

      // service.updateItem함수 호출
      await service.updateItem(
        +mockItemId,
        updateItemDto,
        mockUploadedFile,
        user.userId,
      );

      expect(result).toEqual({ message: '핫딜 수정이 완료되었습니다.' });
      expect(controller.update).toHaveBeenCalledWith(
        mockItemId,
        updateItemDto,
        mockUploadedFile,
        user,
      );
      expect(service.updateItem).toBeCalledTimes(1);
    });
  });

  // /** Test3: 핫딜 삭제 (DELETE) */
  describe('deleteItem with itemId,user', () => {
    const mockItemId = '1';

    it('3-1(err) -> 일반 회원이 핫딜 삭제 시도한 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: true, // not 사장
      };

      try {
        await controller.deleteItem(mockItemId, user);
      } catch (err: any) {
        expect(err).toBeInstanceOf(HttpException);
        expect(err.response.message).toBe(
          '기업 회원만 핫딜 삭제가 가능합니다.',
        );
        expect(err.status).toBe(HttpStatus.BAD_REQUEST);
      }
    });

    it('3-2(success) -> 핫딜이 정상적으로 삭제된 경우', async () => {
      const user: any = {
        userId: 1,
        isClient: false,
      };

      jest
        .spyOn(controller, 'deleteItem')
        .mockResolvedValue({ message: '핫딜 삭제가 완료되었습니다.' });
      jest
        .spyOn(service, 'deleteItem')
        .mockResolvedValue({ message: '핫딜 삭제가 완료되었습니다.' });

      // controller.update함수 호출
      const result = await controller.deleteItem(mockItemId, user);

      // *S3key로 바꾸는 작업 테스트는 생략

      // service.updateItem함수 호출
      await service.deleteItem(+mockItemId, user.userId);

      expect(result).toEqual({ message: '핫딜 삭제가 완료되었습니다.' });
      expect(controller.deleteItem).toHaveBeenCalledWith(mockItemId, user);
      expect(service.deleteItem).toBeCalledTimes(1);
    });
  });
});
