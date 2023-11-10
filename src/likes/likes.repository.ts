import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Likes, Stores } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { GetStoreResData } from 'src/stores/dto/store.response.dto';

@Injectable()
export class LikesRepository {
  constructor(private readonly prisma: PrismaService) {}

  // * 유저와 가게의 관계 확인
  async checkRelation(userId: number, storeId: number): Promise<Likes[]> {
    const like: { Likes: Likes[] } | null = await this.prisma.users.findUnique({
      where: { userId },
      select: { Likes: { where: { storeId } } },
    });

    if (!like) {
      throw new HttpException(
        { message: '서버에 알 수 없는 문제가 발생했습니다.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return like.Likes;
    }
  }

  // * 단골가게 등록
  async createFavoriteStore(
    userId: number,
    storeId: number,
  ): Promise<{ message: string }> {
    await this.prisma.likes.create({
      data: {
        userId,
        storeId,
      },
    });
    return { message: '좋아요 등록 성공' };
  }

  // * 단골가게 삭제
  async deleteFavoriteStore(likeId: number): Promise<{ message: string }> {
    await this.prisma.likes.delete({ where: { likeId } });
    return { message: '좋아요 취소 성공' };
  }

  // * 단골가게 조회
  async selectAllFavoriteStore(userId: number): Promise<GetStoreResData[]> {
    const stores: { Likes: { Store: Stores }[] } | null =
      await this.prisma.users.findUnique({
        where: { userId },
        select: {
          Likes: {
            where: { Store: { deletedAt: null } },
            select: { Store: true },
          },
        },
      });

    if (!stores) {
      throw new HttpException(
        { message: '서버에 알 수 없는 문제가 발생했습니다.' },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    } else {
      return stores.Likes.map((store) => {
        return {
          storeId: store.Store.storeId,
          ownerId: store.Store.ownerId,
          name: store.Store.name,
          longitude: store.Store.longitude,
          latitude: store.Store.latitude,
          address: store.Store.address,
          storePhoneNumber: store.Store.storePhoneNumber,
          category: store.Store.category,
          imgUrl: store.Store.imgUrl,
        };
      });
    }
  }
}
