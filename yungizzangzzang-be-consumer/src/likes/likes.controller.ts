import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { User } from 'src/common/decorators/user.decorator';
import { CustomSuccessRes } from 'src/common/dto/response.dto';
import {
  GetAllStoresResDto,
  GetStoreResData,
} from 'src/stores/dto/store.response.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { LikesService } from './likes.service';

@ApiTags('/likes')
@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // * 단골가게 등록 및 삭제
  @ApiOperation({ summary: '단골가게 등록 및 삭제' })
  @ApiResponse({
    status: 200,
    type: CustomSuccessRes,
    description: '등록 여부에 따라 단골가게를 등록하거나 삭제합니다.',
  })
  @Post(':storeId')
  async createOrDeleteFavoriteStore(
    @User() user: Users,
    @Param('storeId') storeId: number,
  ): Promise<{ message: string }> {
    return await this.likesService.createOrDeleteFavoriteStore(
      user.userId,
      storeId,
    );
  }

  // * 단골가게 조회
  @Get()
  @ApiOperation({ summary: '단골가게 조회' })
  @ApiResponse({
    status: 200,
    type: GetAllStoresResDto,
    description: '단골가게를 전부 조회합니다.',
  })
  async getAllFavoriteStore(
    @User() user: Users,
  ): Promise<{ stores: GetStoreResData[] }> {
    return { stores: await this.likesService.getAllFavoriteStore(user.userId) };
  }
}
