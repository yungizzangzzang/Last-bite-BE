import { Injectable } from '@nestjs/common';
import { Likes } from '@prisma/client';
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
  ): Promise<void> {
    // * 존재하는 가게인지 확인
    await this.storesRepository.selectOneStore(storeId);

    // * 이미 단골가게로 등록되어 있는지 확인
    const like: Likes[] = await this.likesRepository.checkRelation(
      userId,
      storeId,
    );
    if (like.length === 0) {
      // * 단골가게로 등록되어 있지 않은 경우
      await this.likesRepository.createFavoriteStore(userId, storeId);
    } else {
      // * 단골가게로 등록되어 있는 경우
      await this.likesRepository.deleteFavoriteStore(like[0].likeId);
    }
  }
}
