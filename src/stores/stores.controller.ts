import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { User } from 'src/common/decorators/user.decorator';
import { CustomSuccessRes } from 'src/common/dto/response.dto';
import { GetItemDto } from 'src/items/dto/get-item.dto';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import {
  GetAllStoreWithInRadiusReqDto,
  UpdateStoreReqDto,
} from './dto/store.request.dto';
import {
  GetAllStoresResDto,
  GetOneStoreResDto,
  GetStoreResData,
} from './dto/store.response.dto';
import { StoresService } from './stores.service';

@ApiTags('/stores')
@Controller('stores')
export class StoresController {
  constructor(private readonly storesService: StoresService) {}

  // * 반경 10km 이내 가게 조회
  @ApiOperation({ summary: '반경 10km 이내 가게 조회' })
  @ApiResponse({
    status: 200,
    type: GetAllStoresResDto,
    description: '반경 10km 이내 가게를 조회합니다.',
  })
  @Get()
  async getAllStoreWithInRadius(
    @Body() getAllStoreWithInRadiusReqDto: GetAllStoreWithInRadiusReqDto,
  ): Promise<{ stores: GetStoreResData[] }> {
    const userLongitude = getAllStoreWithInRadiusReqDto.longitude;
    const userLatitude = getAllStoreWithInRadiusReqDto.latitude;

    return await {
      stores: await this.storesService.getAllStoreWithInRadius(
        userLongitude,
        userLatitude,
      ),
    };
  }

  // * 가게 상세 조회
  @ApiOperation({ summary: '가게 상세 조회' })
  @ApiResponse({
    status: 200,
    type: GetOneStoreResDto,
    description:
      '특정 가게를 조회하면서 그 가게에서 진행중인 핫딜 정보도 조회합니다.',
  })
  @Get(':storeId')
  async getOneStore(
    @User() user: Users,
    @Param('storeId') storeId: number,
  ): Promise<{
    store: GetStoreResData;
    items: GetItemDto[] | { message: string };
  }> {
    return await this.storesService.getOneStore(user, storeId);
  }

  // * 가게 수정
  @ApiOperation({ summary: '가게 수정' })
  @ApiResponse({
    status: 200,
    type: CustomSuccessRes,
    description: '특정 가게의 데이터를 일부 변경합니다.',
  })
  @Put(':storeId')
  async updateStore(
    @User() user: Users,
    @Param('storeId') storeId: number,
    @Body() updateStoreDto: UpdateStoreReqDto,
  ): Promise<void> {
    return await this.storesService.updateStore(
      user.userId,
      storeId,
      updateStoreDto,
    );
  }

  // * 가게 삭제
  @ApiOperation({ summary: '가게 삭제' })
  @ApiResponse({
    status: 200,
    type: CustomSuccessRes,
    description: '특정 가게의 데이터를 전부 삭제합니다.',
  })
  @UseGuards(JwtAuthGuard)
  @Delete(':storeId')
  async deleteStore(
    @User() user: Users,
    @Param('storeId') storeId: number,
  ): Promise<void> {
    return await this.storesService.deleteStore(user.userId, storeId);
  }
}
