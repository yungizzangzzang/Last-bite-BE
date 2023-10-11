import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Likes } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

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
  async createFavoriteStore(userId: number, storeId: number): Promise<void> {
    await this.prisma.likes.create({
      data: {
        userId,
        storeId,
      },
    });
  }

  // * 단골가게 삭제
  async deleteFavoriteStore(likeId: number): Promise<void> {
    await this.prisma.likes.delete({ where: { likeId } });
  }
}
