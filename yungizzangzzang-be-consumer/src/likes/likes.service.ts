import { Injectable, NotFoundException } from '@nestjs/common';
import { Likes } from '@prisma/client';
import { GetStoreResData } from 'src/stores/dto/store.response.dto';
import { StoresRepository } from 'src/stores/stores.repository';
import { LikesRepository } from './likes.repository';

@Injectable()
export class LikesService {
  constructor(
    private readonly likesRepository: LikesRepository,
    private readonly storesRepository: StoresRepository,
  ) {}

  // * 단골가게 등록 및 삭제
  async createOrDeleteFavoriteStore(
    userId: number,
    storeId: number,
  ): Promise<{ message: string }> {
    // * 존재하는 가게인지 확인
    const store = await this.storesRepository.selectOneStore(storeId);
    if (!store) {
      throw new NotFoundException({
        message: '해당하는 가게가 존재하지 않습니다.',
      });
    }
    // * 이미 단골가게로 등록되어 있는지 확인
    const like: Likes[] = await this.likesRepository.checkRelation(
      userId,
      storeId,
    );
    if (like.length === 0) {
      // * 단골가게로 등록되어 있지 않은 경우
      const result = await this.likesRepository.createFavoriteStore(
        userId,
        storeId,
      );
      return result;
    } else {
      // * 단골가게로 등록되어 있는 경우
      const result = await this.likesRepository.deleteFavoriteStore(
        like[0].likeId,
      );
      return result;
    }
  }

  // * 단골가게 조회
  async getAllFavoriteStore(userId: number): Promise<GetStoreResData[]> {
    return await this.likesRepository.selectAllFavoriteStore(userId);
  }
}
