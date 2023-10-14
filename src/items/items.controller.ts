import {
  Body,
  Controller,
  Delete,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Users } from '@prisma/client';
import { User } from 'src/common/decorators/user.decorator';
import { JwtAuthGuard } from 'src/users/guards/jwt.guard';
import { AwsService } from './aws.service';
import { CreateItemDto } from './dto/create-item.dto';
import {
  CreateItemDtoResponse,
  DeleteItemDtoResponse,
  UpdateItemDtoResponse,
} from './dto/item-response.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { ItemsService } from './items.service';

// * storeId, user 정보에서 받아올 수 있게 수정
@ApiTags('items')
@Controller('items')
@ApiTags('items')
export class ItemsController {
  constructor(
    private readonly itemsService: ItemsService,
    private readonly awsService: AwsService,
  ) {}

  // 핫딜 등록
  @Post()
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '핫딜 등록', description: '핫딜(아이템) 정보 등록' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: CreateItemDtoResponse,
  })
  @UseGuards(JwtAuthGuard)
  async createItem(
    @Body() createItemDto: CreateItemDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: Users,
  ): Promise<{ message: string }> {
    // 일반 회원(isclient===true)이 접근한 경우
    if (user.isClient !== false) {
      throw new HttpException(
        { message: '기업 회원만 핫딜 정보 등록이 가능합니다.' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // 할인 가격이 기존 가격 이상인 경우
    if (createItemDto.prevPrice <= createItemDto.price) {
      throw new HttpException(
        { message: '할인이 적용된 가격을 입력해주세요.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // count 는 0 초과

    // 이미지 파일 안 넣은 경우는 default이미지로 대체
    if (!file) {
      const defaultUrlS3 =
        'https://megis3.s3.ap-northeast-2.amazonaws.com/default.png';
      return this.itemsService.createItem(
        createItemDto,
        defaultUrlS3,
        user.userId,
      );
    }
    // 이미지 파일 넣은 경우는 아래 로직
    const s3 = await this.awsService.uploadFileToS3('items', file);
    const urlByS3Key = this.awsService.getAwsS3FileUrl(s3.key);
    return this.itemsService.createItem(createItemDto, urlByS3Key, user.userId);
  }

  // 핫딜 수정 - 원래 있던 s3 이미지 제거 -> 새 이미지를 upload & db변경
  @Put(':itemId')
  @UseInterceptors(FileInterceptor('image'))
  @ApiOperation({ summary: '핫딜 수정', description: '핫딜(아이템) 정보 수정' })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: UpdateItemDtoResponse,
  })
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('itemId') itemId: string,
    @Body() updateItemDto: UpdateItemDto,
    @UploadedFile() file: Express.Multer.File,
    @User() user: Users,
  ): Promise<{ message: string }> {
    // 일반 회원(isclient===true)이 접근한 경우
    if (user.isClient !== false) {
      throw new HttpException(
        { message: '기업 회원만 핫딜 정보 수정이 가능합니다.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 할인 가격이 기존 가격 이상인 경우
    if (updateItemDto.prevPrice >= updateItemDto.price) {
      throw new HttpException(
        { message: '할인이 적용된 가격을 입력해주세요.' },
        HttpStatus.BAD_REQUEST,
      );
    }

    // 1. 수정할 이미지를 추가한 경우
    if (file) {
      // 1-1. 기존의 s3이미지 삭제
      const item = await this.itemsService.getOneItem(+itemId);
      const oldKey: any = item?.imgUrl?.split('com/')[1];
      if (oldKey !== 'default.png') {
        await this.awsService.deleteS3Object(oldKey);
      }
      // 1-2. 새로운 s3이미지 업데이트
      const s3 = await this.awsService.uploadFileToS3('items', file);
      const urlByS3Key = this.awsService.getAwsS3FileUrl(s3.key);
      // 1-3. item 업데이트(db수정)
      return this.itemsService.updateItem(
        +itemId,
        updateItemDto,
        urlByS3Key,
        user.userId,
      );
    } else {
      // 2. 수정 데이터에 이미지는 없는 경우
      const item: any = await this.itemsService.getOneItem(+itemId);
      return this.itemsService.updateItem(
        +itemId,
        updateItemDto,
        item.imgUrl,
        user.userId,
      );
    }
  }

  // 핫딜 삭제 -> deletedAt update 방식으로 진행
  @Delete(':itemId')
  @ApiOperation({
    summary: '핫딜 삭제',
    description: 'items 테이블, deletedTime 업데이트',
  })
  @ApiResponse({
    status: 200,
    description: 'Success',
    type: DeleteItemDtoResponse,
  })
  @UseGuards(JwtAuthGuard)
  async deleteItem(
    @Param('itemId') itemId: string,
    @User() user: Users,
  ): Promise<{ message: string }> {
    // 일반 회원(isclient===false)이 접근한 경우
    if (user.isClient !== true) {
      throw new HttpException(
        { message: '기업 회원만 핫딜 정보 등록이 가능합니다.' },
        HttpStatus.BAD_REQUEST,
      );
    }
    // ? s3에 올라가있는 image 삭제 -> 이미지 삭제해야하나요?
    const item = await this.itemsService.getOneItem(+itemId);
    const oldKey: any = item?.imgUrl?.split('com/')[1];
    if (oldKey !== 'default.png') {
      await this.awsService.deleteS3Object(oldKey);
    }

    return this.itemsService.deleteItem(+itemId, user.userId);
  }
}
