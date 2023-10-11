import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { User } from 'src/common/decorators/user.decorator';
import { CustomSuccessRes } from 'src/common/dto/response.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { LikesService } from './likes.service';

@ApiTags('/likes')
@Controller('likes')
@UseGuards(JwtAuthGuard)
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  // * 단골가게 등록 및 삭제
  @ApiOperation({ summary: '단골가게 등록' })
  @ApiResponse({
    status: 200,
    type: CustomSuccessRes,
    description: '단골가게 등록 여부에 따라 등록하거나 삭제합니다.',
  })
  @Post(':storeId')
  async createOrDeleteFavoriteStore(
    @User() user: Users,
    @Param('storeId') storeId: number,
  ): Promise<void> {
    return await this.likesService.createOrDeleteFavoriteStore(
      user.userId,
      storeId,
    );
  }
}
